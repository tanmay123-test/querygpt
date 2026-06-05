from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class ConnectionCreate(BaseModel):
    name: str
    db_type: str
    host: Optional[str] = "localhost"
    port: Optional[int] = 5432
    database_name: str
    username: Optional[str] = ""
    password: Optional[str] = ""

class ConnectionResponse(BaseModel):
    id: int
    name: str
    db_type: str
    host: Optional[str]
    port: Optional[int]
    database_name: str
    username: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TestConnectionResponse(BaseModel):
    success: bool
    message: str
    tables: List[str] = []
    table_count: int = 0
