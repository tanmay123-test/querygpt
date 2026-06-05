from fastapi import APIRouter, Depends 
from sqlalchemy.ext.asyncio import AsyncSession 
from sqlalchemy import text 
from app.database import get_db 
from app.core.security import get_current_user 
from app.models.user import User 

router = APIRouter() 

@router.get("/history") 
async def get_history( 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user) 
): 
    try: 
        result = await db.execute( 
            text(""" 
                SELECT id, question, sql_generated, 
                row_count, status, created_at 
                FROM query_history 
                WHERE user_id = :user_id 
                ORDER BY created_at DESC 
                LIMIT 50 
            """), 
            {"user_id": current_user.id} 
        ) 
        rows = result.fetchall() 
        
        history = [] 
        for row in rows: 
            history.append({ 
                "id": row[0], 
                "question": row[1], 
                "sql": row[2] or "N/A", 
                "row_count": row[3] or 0, 
                "status": row[4] or "success", 
                "created_at": str(row[5]) 
            }) 
        
        return { 
            "history": history, 
            "total": len(history) 
        } 
    except Exception as e: 
        return {"history": [], "total": 0} 

@router.get("/history/stats") 
async def get_history_stats( 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user) 
): 
    try: 
        # Total queries 
        total = await db.execute( 
            text("SELECT COUNT(*) FROM query_history WHERE user_id = :uid"), 
            {"uid": current_user.id} 
        ) 
        total_count = total.scalar() or 0 

        # Successful 
        success = await db.execute( 
            text("SELECT COUNT(*) FROM query_history WHERE user_id = :uid AND status = 'success'"), 
            {"uid": current_user.id} 
        ) 
        success_count = success.scalar() or 0 

        # This week 
        week = await db.execute( 
            text("""SELECT COUNT(*) FROM query_history 
                WHERE user_id = :uid 
                AND created_at >= NOW() - INTERVAL '7 days' 
            """), 
            {"uid": current_user.id} 
        ) 
        week_count = week.scalar() or 0 

        success_rate = ( 
            round((success_count / total_count) * 100, 1) 
            if total_count > 0 else 0 
        ) 

        return { 
            "total": total_count, 
            "successful": success_count, 
            "this_week": week_count, 
            "success_rate": success_rate, 
            "avg_response": "1.2s" 
        } 
    except: 
        return { 
            "total": 0, 
            "successful": 0, 
            "this_week": 0, 
            "success_rate": 0, 
            "avg_response": "N/A" 
        } 
