"""Pydantic schemas for Form model."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.question import QuestionResponse


class FormBase(BaseModel):
    """Base schema for form data."""

    title: str = Field(..., min_length=1)
    description: Optional[str] = None


class FormCreate(FormBase):
    """Schema for creating a new form."""

    pass


class FormUpdate(BaseModel):
    """Schema for updating a form. All fields optional."""

    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class FormResponse(FormBase):
    """Schema for form response (single form)."""

    id: int
    status: str
    share_slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FormDetailResponse(FormResponse):
    """Schema for detailed form response including questions and response count."""

    questions: list[QuestionResponse] = []
    response_count: int = 0
