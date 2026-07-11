"""Pydantic schemas for Question model."""

from typing import Optional

from pydantic import BaseModel, ConfigDict


class QuestionBase(BaseModel):
    """Base schema for question data."""

    title: str
    description: Optional[str] = None
    type: str
    required: bool = False
    settings: Optional[dict] = None


class QuestionCreate(QuestionBase):
    """Schema for creating a new question."""

    form_id: int


class QuestionUpdate(BaseModel):
    """Schema for updating a question. All fields optional."""

    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    required: Optional[bool] = None
    settings: Optional[dict] = None


class QuestionResponse(QuestionBase):
    """Schema for question response."""

    id: int
    form_id: int
    position: int

    model_config = ConfigDict(from_attributes=True)


class ReorderItem(BaseModel):
    """Schema for a single reorder item."""

    question_id: int
    position: int


class QuestionReorder(BaseModel):
    """Schema for reordering questions."""

    items: list[ReorderItem]
