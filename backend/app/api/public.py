"""Public API router - respondent-facing endpoints (no auth required)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import form as form_crud
from app.schemas.form import FormDetailResponse
from app.schemas.response import ResponseSubmit, ResponseResponse
from app.services import response_service

router = APIRouter()


@router.get("/{slug}", response_model=FormDetailResponse)
def get_public_form(slug: str, db: Session = Depends(get_db)):
    """Get a published form by its share slug for respondents.

    Only returns published forms. Returns 404 if form not found or not published.
    """
    form = form_crud.get_form_by_slug(db, slug)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if form.status != "published":
        raise HTTPException(status_code=404, detail="Form is not available")

    form_dict = FormDetailResponse.model_validate(form)
    form_dict.response_count = len(form.responses)
    return form_dict


@router.post("/{slug}/submit", response_model=ResponseResponse, status_code=status.HTTP_201_CREATED)
def submit_response(slug: str, data: ResponseSubmit, db: Session = Depends(get_db)):
    """Submit a response to a published form.

    Validates that all required questions are answered.
    Returns 400 if form is not published or required questions are missing.
    """
    return response_service.submit_response(db, slug, data)
