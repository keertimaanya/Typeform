"""CRUD operations for Response model."""

from sqlalchemy.orm import Session

from app.models.response import Response
from app.models.answer import Answer


def create_response(db: Session, form_id: int, answers: list[dict]) -> Response:
    """Create a response with all its answers in a single transaction."""
    db_response = Response(form_id=form_id)
    db.add(db_response)
    db.flush()  # Get response ID

    for answer_data in answers:
        db_answer = Answer(
            response_id=db_response.id,
            question_id=answer_data["question_id"],
            value=answer_data["value"],
        )
        db.add(db_answer)

    db.commit()
    db.refresh(db_response)
    return db_response


def get_responses(db: Session, form_id: int, skip: int = 0, limit: int = 100) -> list[Response]:
    """Get all responses for a form with pagination."""
    return (
        db.query(Response)
        .filter(Response.form_id == form_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_response(db: Session, response_id: int) -> Response | None:
    """Get a single response by ID."""
    return db.query(Response).filter(Response.id == response_id).first()
