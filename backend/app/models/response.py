"""Response model - represents a single form submission by a respondent."""

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    submitted_at = Column(DateTime, default=func.now())

    # Relationships
    form = relationship("Form", back_populates="responses")
    answers = relationship(
        "Answer",
        back_populates="response",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Response(id={self.id}, form_id={self.form_id})>"
