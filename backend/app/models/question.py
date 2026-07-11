"""Question model - belongs to a Form, stores question configuration."""

from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(50), nullable=False)  # text, email, number, multiple_choice, rating, yes_no, date
    required = Column(Boolean, default=False)
    position = Column(Integer, nullable=False, default=0)
    settings = Column(JSON, nullable=True)  # e.g. {"choices": [...], "min": 1, "max": 5}

    # Relationships
    form = relationship("Form", back_populates="questions")
    answers = relationship(
        "Answer",
        back_populates="question",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Question(id={self.id}, title='{self.title}', type='{self.type}')>"
