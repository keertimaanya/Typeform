"""Questions API router - create, update, delete, and reorder questions."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import question as question_crud
from app.crud import form as form_crud
from app.schemas.question import QuestionCreate, QuestionUpdate, QuestionResponse, QuestionReorder

router = APIRouter()


@router.post("/forms/{form_id}/questions", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(form_id: int, question: QuestionCreate, db: Session = Depends(get_db)):
    """Add a new question to a form.

    Position is auto-assigned to the end. The form_id in the URL takes precedence.
    """
    # Verify form exists
    form = form_crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail=f"Form with id {form_id} not found")

    # Override form_id from URL path
    question.form_id = form_id
    return question_crud.create_question(db, question)


@router.put("/questions/{question_id}", response_model=QuestionResponse)
def update_question(question_id: int, question: QuestionUpdate, db: Session = Depends(get_db)):
    """Update a question's title, type, settings, etc.

    Only provided fields are updated. Returns 404 if question not found.
    """
    result = question_crud.update_question(db, question_id, question)
    if not result:
        raise HTTPException(status_code=404, detail=f"Question with id {question_id} not found")
    return result


@router.delete("/questions/{question_id}", status_code=status.HTTP_200_OK)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    """Delete a question and reorder remaining questions.

    Remaining questions' positions are shifted down to fill the gap.
    """
    success = question_crud.delete_question(db, question_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Question with id {question_id} not found")
    return {"message": "Question deleted successfully"}


@router.put("/forms/{form_id}/questions/reorder", response_model=list[QuestionResponse])
def reorder_questions(form_id: int, reorder: QuestionReorder, db: Session = Depends(get_db)):
    """Reorder questions within a form.

    Accepts a list of {question_id, position} pairs and updates all positions.
    """
    form = form_crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail=f"Form with id {form_id} not found")

    items = [{"question_id": item.question_id, "position": item.position} for item in reorder.items]
    return question_crud.reorder_questions(db, form_id, items)
