"""Business logic for Response and public submission operations."""

from collections import Counter

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import form as form_crud
from app.crud import response as response_crud
from app.crud import answer as answer_crud
from app.crud import question as question_crud
from app.schemas.response import ResponseSubmit, QuestionSummary, ResponseSummary


def submit_response(db: Session, slug: str, data: ResponseSubmit):
    """Submit a response to a published form via its share slug."""
    form = form_crud.get_form_by_slug(db, slug)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found",
        )
    if form.status != "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This form is not currently accepting responses",
        )

    # Validate required questions are answered
    submitted_question_ids = {a.question_id for a in data.answers}
    for question in form.questions:
        if question.required and question.id not in submitted_question_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Required question '{question.title}' was not answered",
            )

    # Create response + answers
    answers_data = [
        {"question_id": a.question_id, "value": a.value}
        for a in data.answers
    ]
    return response_crud.create_response(db, form.id, answers_data)


def get_responses(db: Session, form_id: int, skip: int = 0, limit: int = 100):
    """Get all responses for a form."""
    # Verify form exists
    form = form_crud.get_form(db, form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id {form_id} not found",
        )
    return response_crud.get_responses(db, form_id, skip=skip, limit=limit)


def get_response_detail(db: Session, response_id: int):
    """Get a single response with answers. Raises 404 if not found."""
    response = response_crud.get_response(db, response_id)
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Response with id {response_id} not found",
        )
    return response


def get_summary(db: Session, form_id: int) -> ResponseSummary:
    """Get aggregated summary statistics for a form's responses."""
    form = form_crud.get_form(db, form_id)
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id {form_id} not found",
        )

    all_responses = response_crud.get_responses(db, form_id)
    total_responses = len(all_responses)

    question_summaries = []
    for question in form.questions:
        answers = answer_crud.get_answers_by_question(db, question.id)
        answer_values = [a.value for a in answers if a.value is not None]

        # Build aggregated data based on question type
        if question.type in ("multiple_choice", "dropdown", "yes_no"):
            aggregated = dict(Counter(answer_values))
        elif question.type == "rating":
            if answer_values:
                numeric = [float(v) for v in answer_values if v.replace(".", "").isdigit()]
                aggregated = {
                    "average": round(sum(numeric) / len(numeric), 2) if numeric else 0,
                    "distribution": dict(Counter(answer_values)),
                }
            else:
                aggregated = {"average": 0, "distribution": {}}
        else:
            # text, email, number, date — just list recent values
            aggregated = {"recent_values": answer_values[:10]}

        question_summaries.append(
            QuestionSummary(
                question_id=question.id,
                title=question.title,
                type=question.type,
                answer_count=len(answers),
                answers=aggregated,
            )
        )

    return ResponseSummary(
        total_responses=total_responses,
        questions=question_summaries,
    )
