"""Responses API router - view responses and analytics."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.response import ResponseResponse, ResponseSummary
from app.services import response_service

router = APIRouter()


@router.get("/forms/{form_id}/responses", response_model=list[ResponseResponse])
def list_responses(
    form_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all responses for a form with pagination.

    Returns responses with all their answers included.
    """
    return response_service.get_responses(db, form_id, skip=skip, limit=limit)


@router.get("/responses/{response_id}", response_model=ResponseResponse)
def get_response(response_id: int, db: Session = Depends(get_db)):
    """Get a single response with all its answers.

    Returns 404 if response not found.
    """
    return response_service.get_response_detail(db, response_id)


@router.get("/forms/{form_id}/responses/summary", response_model=ResponseSummary)
def get_response_summary(form_id: int, db: Session = Depends(get_db)):
    """Get aggregated summary statistics for a form's responses.

    For multiple_choice/yes_no: counts per option.
    For rating: average + distribution.
    For text/email: recent values.
    """
    return response_service.get_summary(db, form_id)
