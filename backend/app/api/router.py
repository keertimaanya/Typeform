"""Main API router - aggregates all sub-routers."""

from fastapi import APIRouter

from app.api.forms import router as forms_router
from app.api.questions import router as questions_router
from app.api.public import router as public_router
from app.api.responses import router as responses_router

api_router = APIRouter()

api_router.include_router(forms_router, prefix="/forms", tags=["Forms"])
api_router.include_router(questions_router, tags=["Questions"])
api_router.include_router(public_router, prefix="/public", tags=["Public"])
api_router.include_router(responses_router, tags=["Responses"])
