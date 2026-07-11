"""Form model - the core entity that holds a collection of questions."""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, default="Untitled Form")
    description = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="draft")  # "draft" or "published"
    share_slug = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    questions = relationship(
        "Question",
        back_populates="form",
        cascade="all, delete-orphan",
        order_by="Question.position",
    )
    responses = relationship(
        "Response",
        back_populates="form",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Form(id={self.id}, title='{self.title}', status='{self.status}')>"
