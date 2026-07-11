"""Answer model - stores a single answer to a question within a response."""

from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("responses.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    value = Column(Text, nullable=True)

    # Relationships
    response = relationship("Response", back_populates="answers")
    question = relationship("Question", back_populates="answers")

    def __repr__(self):
        return f"<Answer(id={self.id}, question_id={self.question_id})>"
