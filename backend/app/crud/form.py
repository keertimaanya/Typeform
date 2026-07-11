"""CRUD operations for Form model."""

from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.question import Question
from app.schemas.form import FormCreate, FormUpdate


def get_forms(db: Session, skip: int = 0, limit: int = 100) -> list[Form]:
    """Get all forms with pagination."""
    return db.query(Form).offset(skip).limit(limit).all()


def get_form(db: Session, form_id: int) -> Form | None:
    """Get a single form by ID."""
    return db.query(Form).filter(Form.id == form_id).first()


def get_form_by_slug(db: Session, slug: str) -> Form | None:
    """Get a form by its share slug."""
    return db.query(Form).filter(Form.share_slug == slug).first()


def create_form(db: Session, form: FormCreate) -> Form:
    """Create a new form with auto-generated share slug."""
    db_form = Form(
        title=form.title,
        description=form.description,
        share_slug=uuid4().hex[:8],
    )
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form


def update_form(db: Session, form_id: int, form: FormUpdate) -> Form | None:
    """Update only the provided fields of a form."""
    db_form = get_form(db, form_id)
    if not db_form:
        return None

    update_data = form.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_form, key, value)

    db.commit()
    db.refresh(db_form)
    return db_form


def delete_form(db: Session, form_id: int) -> bool:
    """Delete a form and all related data (cascades)."""
    db_form = get_form(db, form_id)
    if not db_form:
        return False
    db.delete(db_form)
    db.commit()
    return True


def duplicate_form(db: Session, form_id: int) -> Form | None:
    """Duplicate a form and all its questions with a new slug."""
    original = get_form(db, form_id)
    if not original:
        return None

    new_form = Form(
        title=f"{original.title} (Copy)",
        description=original.description,
        status="draft",
        share_slug=uuid4().hex[:8],
    )
    db.add(new_form)
    db.flush()  # Get new_form.id without committing

    # Duplicate all questions
    for q in original.questions:
        new_q = Question(
            form_id=new_form.id,
            title=q.title,
            description=q.description,
            type=q.type,
            required=q.required,
            position=q.position,
            settings=q.settings,
        )
        db.add(new_q)

    db.commit()
    db.refresh(new_form)
    return new_form
