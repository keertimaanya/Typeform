"""CRUD operations for Answer model."""

from sqlalchemy.orm import Session

from app.models.answer import Answer


def get_answers_by_response(db: Session, response_id: int) -> list[Answer]:
    """Get all answers for a specific response."""
    return db.query(Answer).filter(Answer.response_id == response_id).all()


def get_answers_by_question(db: Session, question_id: int) -> list[Answer]:
    """Get all answers for a specific question (used for analytics)."""
    return db.query(Answer).filter(Answer.question_id == question_id).all()
