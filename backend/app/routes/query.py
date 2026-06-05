from dotenv import load_dotenv 
import os 
load_dotenv() 

from fastapi import APIRouter, Depends, HTTPException 
from pydantic import BaseModel 
from sqlalchemy.ext.asyncio import AsyncSession 
from app.database import get_db 
from app.core.security import get_current_user 
from app.models.user import User 
from groq import Groq 
import sqlalchemy as sa 
from sqlalchemy import text 

router = APIRouter() 
groq_client = Groq( 
    api_key=os.getenv("GROQ_API_KEY") 
) 

# Schema of sample database (hardcoded for now) 
DB_SCHEMA = """ 
Tables in the database: 

1. customers 
   - id (integer, primary key) 
   - name (varchar) - company/customer name 
   - email (varchar) 
   - city (varchar) 
   - country (varchar) 
   - created_at (timestamp) 

2. products 
   - id (integer, primary key) 
   - name (varchar) - product name 
   - category (varchar) - Electronics/Furniture/ 
     Stationery/Accessories 
   - price (decimal) - price in INR 
   - stock (integer) - available stock 
   - created_at (timestamp) 

3. orders 
   - id (integer, primary key) 
   - customer_id (integer, FK to customers.id) 
   - product_id (integer, FK to products.id) 
   - quantity (integer) 
   - amount (decimal) - total order amount in INR 
   - status (varchar) - completed/pending/ 
     cancelled/shipped 
   - order_date (timestamp) 
 """ 

class QueryRequest(BaseModel): 
    question: str 

class QueryResponse(BaseModel): 
    question: str 
    sql: str 
    explanation: str 
    columns: list 
    rows: list 
    row_count: int 

@router.post("/query/ask", response_model=QueryResponse) 
async def ask_query( 
    request: QueryRequest, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user) 
): 
    if not request.question.strip(): 
        raise HTTPException(400, "Question cannot be empty") 

    # Step 1: Generate SQL using Groq AI 
    prompt = f""" 
You are a PostgreSQL expert. 
Given this database schema: 
{DB_SCHEMA} 

Generate a SQL query for this question: 
"{request.question}" 

Rules: 
- Return ONLY the SQL query, nothing else 
- No markdown, no backticks, no explanation 
- Only SELECT statements (no INSERT/UPDATE/DELETE) 
- Use proper PostgreSQL syntax 
- Limit results to 100 rows maximum 
- Use table aliases when joining 
""" 

    try: 
        chat_completion = groq_client.chat.completions.create( 
            messages=[ 
                { 
                    "role": "system", 
                    "content": "You are a PostgreSQL expert. Return only valid SQL SELECT queries. No markdown, no backticks, no explanations." 
                }, 
                { 
                    "role": "user", 
                    "content": prompt 
                } 
            ], 
            model=os.getenv("GROQ_MODEL", "llama3-70b-8192"), 
            temperature=0.1, 
            max_tokens=500, 
        ) 
        
        sql = chat_completion.choices[0].message.content.strip() 
        
        # Clean SQL - remove any markdown if AI added it 
        sql = sql.replace("```sql", "").replace("```", "").strip() 
        
    except Exception as e: 
        raise HTTPException(500, f"AI error: {str(e)}") 

    # Step 2: Validate SQL (only allow SELECT) 
    sql_upper = sql.upper().strip() 
    if not sql_upper.startswith("SELECT"): 
        raise HTTPException(400, 
            "Only SELECT queries are allowed") 
    
    # Block dangerous keywords 
    dangerous = ["DROP","DELETE","INSERT", 
                 "UPDATE","ALTER","CREATE", 
                 "TRUNCATE","EXEC"] 
    for word in dangerous: 
        if word in sql_upper: 
            raise HTTPException(400, 
                f"Query contains forbidden keyword: {word}") 

    # Step 3: Execute SQL on database 
    try: 
        result = await db.execute(text(sql)) 
        rows_raw = result.fetchall() 
        columns = list(result.keys()) 
        
        # Convert to list of lists 
        rows = [] 
        for row in rows_raw[:100]: 
            row_data = [] 
            for val in row: 
                if val is None: 
                    row_data.append(None) 
                else: 
                    row_data.append(str(val)) 
            rows.append(row_data) 
            
    except Exception as e: 
        try: 
            await db.execute( 
                text(""" 
                    INSERT INTO query_history 
                    (user_id, question, sql_generated, 
                     row_count, status) 
                    VALUES (:user_id, :question, 
                            :sql, :row_count, :status) 
                """), 
                { 
                    "user_id": current_user.id, 
                    "question": request.question, 
                    "sql": sql if 'sql' in locals() else "N/A", 
                    "row_count": 0, 
                    "status": "error" 
                } 
            ) 
            await db.commit() 
        except: 
            pass 
        raise HTTPException(500, 
            f"Database error: {str(e)}") 

    # Step 4: Generate explanation using Groq 
    try: 
        explain_completion = groq_client.chat.completions.create( 
            messages=[ 
                { 
                    "role": "user", 
                    "content": f"Explain this SQL query in one simple sentence that a non-technical person can understand. Question was: '{request.question}'. SQL: {sql}" 
                } 
            ], 
            model=os.getenv("GROQ_MODEL", "llama3-70b-8192"), 
            temperature=0.3, 
            max_tokens=100, 
        ) 
        explanation = explain_completion.choices[0].message.content.strip() 
    except: 
        explanation = f"Query executed successfully" 

    try: 
        await db.execute( 
            text(""" 
                INSERT INTO query_history 
                (user_id, question, sql_generated, 
                 row_count, status) 
                VALUES (:user_id, :question, 
                        :sql, :row_count, :status) 
            """), 
            { 
                "user_id": current_user.id, 
                "question": request.question, 
                "sql": sql, 
                "row_count": len(rows), 
                "status": "success" 
            } 
        ) 
        await db.commit() 
    except: 
        pass 

    return QueryResponse( 
        question=request.question, 
        sql=sql, 
        explanation=explanation, 
        columns=columns, 
        rows=rows, 
        row_count=len(rows) 
    ) 
