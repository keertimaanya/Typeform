"""Analytics service - delegates to response_service for now."""

from sqlalchemy.orm import Session

from app.services.response_service import get_summary


def get_form_analytics(db: Session, form_id: int):
    """Get analytics for a form. Currently wraps response summary."""
    return get_summary(db, form_id)
