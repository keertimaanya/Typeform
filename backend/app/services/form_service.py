"""Business logic for Form operations."""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import form as form_crud
from app.schemas.form import FormCreate, FormUpdate


def list_forms(db: Session, skip: int = 0, limit: int = 100):
    """List all forms with response counts."""
    forms = form_crud.get_forms(db, skip=skip, limit=limit)
    return forms


def get_form_detail(db: Session, form_id: int):
    """Get form with questions and response count. Raises 404 if not found."""
    form = form_crud.get_form(db, form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id {form_id} not found",
        )
    return form


def create_form(db: Session, data: FormCreate):
    """Create a new form."""
    return form_crud.create_form(db, data)


def update_form(db: Session, form_id: int, data: FormUpdate):
    """Update a form. Raises 404 if not found."""
    form = form_crud.update_form(db, form_id, data)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id {form_id} not found",
        )
    return form


def delete_form(db: Session, form_id: int):
    """Delete a form. Raises 404 if not found."""
    success = form_crud.delete_form(db, form_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id {form_id} not found",
        )
    return True


def duplicate_form(db: Session, form_id: int):
    """Duplicate a form and its questions. Raises 404 if not found."""
    form = form_crud.duplicate_form(db, form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id {form_id} not found",
        )
    return form


def publish_form(db: Session, form_id: int):
    """Publish a form. Must have at least 1 question."""
    form = form_crud.get_form(db, form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id {form_id} not found",
        )
    if len(form.questions) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot publish a form with no questions",
        )
    form_update = FormUpdate(status="published")
    return form_crud.update_form(db, form_id, form_update)


def unpublish_form(db: Session, form_id: int):
    """Unpublish a form (set back to draft)."""
    form = form_crud.get_form(db, form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id {form_id} not found",
        )
    form_update = FormUpdate(status="draft")
    return form_crud.update_form(db, form_id, form_update)
