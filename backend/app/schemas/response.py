"""Pydantic schemas for Response model."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AnswerSubmit(BaseModel):
    """Schema for submitting a single answer."""

    question_id: int
    value: str


class ResponseSubmit(BaseModel):
    """Schema for submitting a complete response with answers."""

    answers: list[AnswerSubmit]


class AnswerResponse(BaseModel):
    """Schema for answer in a response."""

    id: int
    question_id: int
    value: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ResponseResponse(BaseModel):
    """Schema for a complete response with answers."""

    id: int
    form_id: int
    submitted_at: datetime
    answers: list[AnswerResponse] = []

    model_config = ConfigDict(from_attributes=True)


class QuestionSummary(BaseModel):
    """Schema for question-level summary in response analytics."""

    question_id: int
    title: str
    type: str
    answer_count: int
    answers: dict


class ResponseSummary(BaseModel):
    """Schema for overall response summary/analytics."""

    total_responses: int
    questions: list[QuestionSummary]
