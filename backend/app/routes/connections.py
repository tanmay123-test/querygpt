from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select, delete
from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.connection import DBConnection
from app.schemas.connection import (
    ConnectionCreate, ConnectionResponse, TestConnectionResponse
)
from app.services.db_connector import test_connection
from pydantic import BaseModel
from typing import List

router = APIRouter()

class TestRequest(BaseModel):
    db_type: str
    host: str = "localhost"
    port: int = 5432
    database_name: str
    username: str = ""
    password: str = ""

@router.post("/test", response_model=TestConnectionResponse)
async def test_db_connection(
    request: TestRequest,
    current_user: User = Depends(get_current_user)
):
    result = await test_connection(
        request.db_type,
        request.host,
        request.port,
        request.database_name,
        request.username,
        request.password
    )
    return result

@router.post("", response_model=ConnectionResponse)
async def create_connection(
    request: ConnectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # First test the connection
    test_result = await test_connection(
        request.db_type,
        request.host,
        request.port,
        request.database_name,
        request.username,
        request.password
    )
    
    if not test_result["success"]:
        raise HTTPException(status_code=400, detail=f"Cannot save: connection test failed. {test_result['message']}")
    
    new_conn = DBConnection(
        user_id=current_user.id,
        name=request.name,
        db_type=request.db_type,
        host=request.host,
        port=request.port,
        database_name=request.database_name,
        username=request.username,
        password_encrypted=request.password, # For now, simple saving. In real app, encrypt this.
        is_active=True
    )
    
    db.add(new_conn)
    await db.commit()
    await db.refresh(new_conn)
    return new_conn

@router.get("", response_model=List[ConnectionResponse])
async def get_connections(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(DBConnection).where(DBConnection.user_id == current_user.id)
    )
    return result.scalars().all()

@router.delete("/{id}")
async def delete_connection(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(DBConnection).where(DBConnection.id == id, DBConnection.user_id == current_user.id)
    )
    conn = result.scalar_one_or_none()
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    await db.delete(conn)
    await db.commit()
    return {"message": "Connection deleted"}

@router.get("/{id}/schema")
async def get_connection_schema(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(DBConnection).where(DBConnection.id == id, DBConnection.user_id == current_user.id)
    )
    conn = result.scalar_one_or_none()
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    test_result = await test_connection(
        conn.db_type,
        conn.host,
        conn.port,
        conn.database_name,
        conn.username,
        conn.password_encrypted
    )
    
    if not test_result["success"]:
        raise HTTPException(status_code=400, detail="Could not connect to database to fetch schema")
    
    schema_tables = []
    
    for table_name in test_result["tables"]:
        columns = []
        if conn.db_type == "postgresql":
            # We would need another connection here to fetch columns, 
            # for now, let's keep it simple as per instructions or placeholder
            pass
        elif conn.db_type == "sqlite":
            pass
            
        schema_tables.append({
            "name": table_name,
            "columns": columns
        })
        
    return {"tables": schema_tables}
