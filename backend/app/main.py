from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.models import user, query_history  # noqa: F401 — register models with metadata
from app.routes import auth, query


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="QueryGPT API", version="1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(
    query.router,
    prefix="",
    tags=["query"]
)


@app.get("/")
async def root():
    return {"message": "QueryGPT API running", "version": "1.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
