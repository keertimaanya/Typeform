"""Forms API router - all form CRUD endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.form import FormCreate, FormUpdate, FormResponse, FormDetailResponse
from app.services import form_service

router = APIRouter()


@router.get("/", response_model=list[FormResponse])
def list_forms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all forms with pagination.

    Returns a list of forms with their basic info (no questions included).
    """
    return form_service.list_forms(db, skip=skip, limit=limit)


@router.get("/{form_id}", response_model=FormDetailResponse)
def get_form(form_id: int, db: Session = Depends(get_db)):
    """Get a single form with its questions and response count.

    Returns 404 if form not found.
    """
    form = form_service.get_form_detail(db, form_id)
    # Manually set response_count since it's a computed field
    form_dict = FormDetailResponse.model_validate(form)
    form_dict.response_count = len(form.responses)
    return form_dict


@router.post("/", response_model=FormResponse, status_code=status.HTTP_201_CREATED)
def create_form(form: FormCreate, db: Session = Depends(get_db)):
    """Create a new form.

    A unique share slug is auto-generated. Form starts in 'draft' status.
    """
    return form_service.create_form(db, form)


@router.put("/{form_id}", response_model=FormResponse)
def update_form(form_id: int, form: FormUpdate, db: Session = Depends(get_db)):
    """Update a form's title, description, or status.

    Only provided fields are updated. Returns 404 if form not found.
    """
    return form_service.update_form(db, form_id, form)


@router.delete("/{form_id}", status_code=status.HTTP_200_OK)
def delete_form(form_id: int, db: Session = Depends(get_db)):
    """Delete a form and all its questions, responses, and answers.

    Cascade delete removes all related data. Returns 404 if form not found.
    """
    form_service.delete_form(db, form_id)
    return {"message": "Form deleted successfully"}


@router.post("/{form_id}/duplicate", response_model=FormResponse, status_code=status.HTTP_201_CREATED)
def duplicate_form(form_id: int, db: Session = Depends(get_db)):
    """Duplicate a form and all its questions.

    Creates a copy with '(Copy)' appended to title, new share slug, draft status.
    """
    return form_service.duplicate_form(db, form_id)


@router.post("/{form_id}/publish", response_model=FormResponse)
def publish_form(form_id: int, db: Session = Depends(get_db)):
    """Publish a form so it can accept responses.

    Returns 400 if form has no questions.
    """
    return form_service.publish_form(db, form_id)


@router.post("/{form_id}/unpublish", response_model=FormResponse)
def unpublish_form(form_id: int, db: Session = Depends(get_db)):
    """Unpublish a form (set back to draft).

    Stops accepting new responses via the public link.
    """
    return form_service.unpublish_form(db, form_id)
