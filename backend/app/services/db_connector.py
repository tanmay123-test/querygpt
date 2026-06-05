async def test_postgresql(host, port, database_name, username, password):
    try:
        import asyncpg
        conn = await asyncpg.connect(
            host=host,
            port=port,
            database=database_name,
            user=username,
            password=password,
            timeout=10
        )
        # Get all table names
        tables = await conn.fetch("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        table_names = [t['table_name'] for t in tables]
        await conn.close()
        return {
            "success": True,
            "message": f"Connected! Found {len(table_names)} tables",
            "tables": table_names,
            "table_count": len(table_names)
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "tables": [],
            "table_count": 0
        }

async def test_sqlite(database_name):
    try:
        import aiosqlite
        import os
        
        # database_name is the file path
        if not os.path.exists(database_name):
            return {
                "success": False,
                "message": f"File not found: {database_name}",
                "tables": [],
                "table_count": 0
            }
        
        async with aiosqlite.connect(database_name) as db:
            cursor = await db.execute("""
                SELECT name FROM sqlite_master
                WHERE type='table'
                ORDER BY name
            """)
            tables = await cursor.fetchall()
            table_names = [t[0] for t in tables]
        
        return {
            "success": True,
            "message": f"Connected! Found {len(table_names)} tables",
            "tables": table_names,
            "table_count": len(table_names)
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "tables": [],
            "table_count": 0
        }

async def test_mongodb(host, port, database_name, username, password):
    try:
        import motor.motor_asyncio
        
        if username and password:
            uri = f"mongodb://{username}:{password}@{host}:{port}/{database_name}"
        else:
            uri = f"mongodb://{host}:{port}"
        
        client = motor.motor_asyncio.AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=5000
        )
        db = client[database_name]
        
        # Test connection
        await client.server_info()
        
        # Get collections (like tables)
        collections = await db.list_collection_names()
        
        client.close()
        return {
            "success": True,
            "message": f"Connected! Found {len(collections)} collections",
            "tables": collections,
            "table_count": len(collections)
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
            "tables": [],
            "table_count": 0
        }

async def test_connection(db_type, host, port, database_name, username, password):
    if db_type == "postgresql":
        return await test_postgresql(host, port, database_name, username, password)
    elif db_type == "sqlite":
        return await test_sqlite(database_name)
    elif db_type == "mongodb":
        return await test_mongodb(host, port, database_name, username, password)
    else:
        return {
            "success": False,
            "message": f"Unsupported database type: {db_type}",
            "tables": [],
            "table_count": 0
        }
