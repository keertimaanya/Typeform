"""Pydantic schemas for Answer model (minimal — most answer schemas live in response.py)."""

from typing import Optional

from pydantic import BaseModel, ConfigDict


class AnswerBase(BaseModel):
    """Base schema for answer data."""

    question_id: int
    value: Optional[str] = None


class AnswerCreate(AnswerBase):
    """Schema for creating an answer."""

    response_id: int


class AnswerResponse(BaseModel):
    """Schema for answer response."""

    id: int
    response_id: int
    question_id: int
    value: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
