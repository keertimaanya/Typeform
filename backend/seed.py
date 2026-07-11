import asyncio
from sqlalchemy.orm import Session
from app.database import engine, Base
from app.models import Form, Question, Response, Answer
from datetime import datetime
import json

def seed_database():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    with Session(engine) as db:
        # Check if we already have forms
        existing = db.query(Form).count()
        if existing > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding database with sample forms and responses...")

        # Form 1: Customer Satisfaction Survey
        form1 = Form(
            title="Customer Satisfaction Survey",
            status="published",
            share_slug="customer-satisfaction-123"
        )
        db.add(form1)
        db.commit()
        db.refresh(form1)

        questions1 = [
            Question(
                form_id=form1.id,
                title="How would you rate your overall experience with our service?",
                type="rating",
                settings={"max": 5},
                order=0,
                required=True
            ),
            Question(
                form_id=form1.id,
                title="What was the primary reason for your score?",
                type="long_text",
                settings={},
                order=1,
                required=False
            ),
            Question(
                form_id=form1.id,
                title="How did you hear about us?",
                type="multiple_choice",
                settings={"choices": ["Social Media", "Friend/Colleague", "Search Engine", "Advertisement"]},
                order=2,
                required=True
            ),
            Question(
                form_id=form1.id,
                title="Would you recommend us to a friend?",
                type="yes_no",
                settings={},
                order=3,
                required=True
            ),
            Question(
                form_id=form1.id,
                title="Please provide your email if you'd like us to follow up.",
                type="email",
                settings={},
                order=4,
                required=False
            )
        ]
        db.add_all(questions1)
        db.commit()
        
        # Responses for Form 1
        for i in range(3):
            resp = Response(form_id=form1.id, submitted_at=datetime.utcnow())
            db.add(resp)
            db.commit()
            db.refresh(resp)
            
            db.add_all([
                Answer(response_id=resp.id, question_id=questions1[0].id, value="5" if i == 0 else ("4" if i == 1 else "3")),
                Answer(response_id=resp.id, question_id=questions1[1].id, value="Great service!" if i == 0 else "It was okay."),
                Answer(response_id=resp.id, question_id=questions1[2].id, value="Search Engine" if i == 0 else "Friend/Colleague"),
                Answer(response_id=resp.id, question_id=questions1[3].id, value="Yes"),
                Answer(response_id=resp.id, question_id=questions1[4].id, value=f"user{i}@example.com")
            ])
        db.commit()

        # Form 2: Tech Meetup Registration
        form2 = Form(
            title="Tech Meetup Registration",
            status="published",
            share_slug="tech-meetup-reg-xyz"
        )
        db.add(form2)
        db.commit()
        db.refresh(form2)

        questions2 = [
            Question(
                form_id=form2.id,
                title="What is your full name?",
                type="text",
                settings={},
                order=0,
                required=True
            ),
            Question(
                form_id=form2.id,
                title="Which session are you most excited about?",
                type="dropdown",
                settings={"choices": ["AI in 2026", "Next.js Performance", "FastAPI Scaling"]},
                order=1,
                required=True
            ),
            Question(
                form_id=form2.id,
                title="How many years of programming experience do you have?",
                type="number",
                settings={},
                order=2,
                required=False
            )
        ]
        db.add_all(questions2)
        db.commit()

        # Responses for Form 2
        resp2 = Response(form_id=form2.id, submitted_at=datetime.utcnow())
        db.add(resp2)
        db.commit()
        db.refresh(resp2)
        
        db.add_all([
            Answer(response_id=resp2.id, question_id=questions2[0].id, value="Jane Smith"),
            Answer(response_id=resp2.id, question_id=questions2[1].id, value="AI in 2026"),
            Answer(response_id=resp2.id, question_id=questions2[2].id, value="5")
        ])
        db.commit()

        print("Successfully seeded database with 2 published forms and 4 responses!")

if __name__ == "__main__":
    seed_database()
