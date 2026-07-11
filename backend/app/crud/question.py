"""CRUD operations for Question model."""

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.question import Question
from app.schemas.question import QuestionCreate, QuestionUpdate


def get_questions_by_form(db: Session, form_id: int) -> list[Question]:
    """Get all questions for a form, ordered by position."""
    return (
        db.query(Question)
        .filter(Question.form_id == form_id)
        .order_by(Question.position)
        .all()
    )


def create_question(db: Session, question: QuestionCreate) -> Question:
    """Create a new question. Auto-sets position to max+1 for that form."""
    max_pos = (
        db.query(func.max(Question.position))
        .filter(Question.form_id == question.form_id)
        .scalar()
    )
    next_position = (max_pos or 0) + 1

    db_question = Question(
        form_id=question.form_id,
        title=question.title,
        description=question.description,
        type=question.type,
        required=question.required,
        position=next_position,
        settings=question.settings,
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def update_question(db: Session, question_id: int, question: QuestionUpdate) -> Question | None:
    """Update only the provided fields of a question."""
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        return None

    update_data = question.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_question, key, value)

    db.commit()
    db.refresh(db_question)
    return db_question


def delete_question(db: Session, question_id: int) -> bool:
    """Delete a question and reorder remaining questions."""
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        return False

    form_id = db_question.form_id
    deleted_position = db_question.position

    db.delete(db_question)

    # Reorder: shift down all questions after the deleted one
    remaining = (
        db.query(Question)
        .filter(Question.form_id == form_id, Question.position > deleted_position)
        .order_by(Question.position)
        .all()
    )
    for q in remaining:
        q.position -= 1

    db.commit()
    return True


def reorder_questions(db: Session, form_id: int, items: list[dict]) -> list[Question]:
    """Reorder questions by updating their positions."""
    for item in items:
        db_question = (
            db.query(Question)
            .filter(Question.id == item["question_id"], Question.form_id == form_id)
            .first()
        )
        if db_question:
            db_question.position = item["position"]

    db.commit()
    return get_questions_by_form(db, form_id)
