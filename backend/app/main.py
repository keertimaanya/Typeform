"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.api.router import api_router

# Import all models so SQLAlchemy registers them
import app.models  # noqa: F401

# Create all tables (dev convenience — Alembic handles migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="A Typeform clone API for creating forms, collecting responses, and viewing analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware — allows the Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routes under /api
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Root"])
def root():
    """Health check / root endpoint."""
    return {
        "message": "Typeform Clone API",
        "docs": "/docs",
        "version": "1.0.0",
    }
