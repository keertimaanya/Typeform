"""
Seed script — populates the database with sample data.

Run from the backend directory:
    python -m app.seed

Creates:
    - 2 published forms + 1 draft form
    - Mixed question types (text, email, rating, yes_no, multiple_choice)
    - ~15 responses with realistic answers
"""

from app.database import engine, Base, SessionLocal
from app.models.form import Form
from app.models.question import Question
from app.models.response import Response
from app.models.answer import Answer


def seed():
    """Drop all tables, recreate, and populate with sample data."""
    print("[*] Dropping all tables...")
    Base.metadata.drop_all(bind=engine)

    print("[*] Creating all tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # ──────────────────────────────────────────
        # FORM 1: Customer Satisfaction Survey
        # ──────────────────────────────────────────
        form1 = Form(
            title="Customer Satisfaction Survey",
            description="Help us improve by sharing your experience with our service.",
            status="published",
            share_slug="cust-sat-01",
        )
        db.add(form1)
        db.flush()

        q1_1 = Question(form_id=form1.id, title="What is your name?", type="text", required=True, position=1)
        q1_2 = Question(form_id=form1.id, title="Email address", type="email", required=True, position=2)
        q1_3 = Question(
            form_id=form1.id,
            title="How satisfied are you with our service?",
            type="rating",
            required=True,
            position=3,
            settings={"min": 1, "max": 5},
        )
        q1_4 = Question(form_id=form1.id, title="Would you recommend us to a friend?", type="yes_no", required=True, position=4)
        q1_5 = Question(form_id=form1.id, title="Any additional feedback?", type="text", required=False, position=5)
        db.add_all([q1_1, q1_2, q1_3, q1_4, q1_5])
        db.flush()

        # 8 responses for Form 1
        form1_responses = [
            {"name": "Alice Johnson", "email": "alice@example.com", "rating": "5", "recommend": "Yes", "feedback": "Excellent service! Very happy."},
            {"name": "Bob Smith", "email": "bob@example.com", "rating": "4", "recommend": "Yes", "feedback": "Good overall, minor delays."},
            {"name": "Carol White", "email": "carol@example.com", "rating": "3", "recommend": "No", "feedback": "Average experience."},
            {"name": "David Brown", "email": "david@example.com", "rating": "5", "recommend": "Yes", "feedback": "Outstanding!"},
            {"name": "Eva Martinez", "email": "eva@example.com", "rating": "2", "recommend": "No", "feedback": "Could be better."},
            {"name": "Frank Lee", "email": "frank@example.com", "rating": "4", "recommend": "Yes", "feedback": ""},
            {"name": "Grace Kim", "email": "grace@example.com", "rating": "5", "recommend": "Yes", "feedback": "Love the product!"},
            {"name": "Henry Chen", "email": "henry@example.com", "rating": "4", "recommend": "Yes", "feedback": "Solid experience."},
        ]

        for resp_data in form1_responses:
            r = Response(form_id=form1.id)
            db.add(r)
            db.flush()
            db.add_all([
                Answer(response_id=r.id, question_id=q1_1.id, value=resp_data["name"]),
                Answer(response_id=r.id, question_id=q1_2.id, value=resp_data["email"]),
                Answer(response_id=r.id, question_id=q1_3.id, value=resp_data["rating"]),
                Answer(response_id=r.id, question_id=q1_4.id, value=resp_data["recommend"]),
                Answer(response_id=r.id, question_id=q1_5.id, value=resp_data["feedback"]),
            ])

        # ──────────────────────────────────────────
        # FORM 2: Employee Engagement Survey
        # ──────────────────────────────────────────
        form2 = Form(
            title="Employee Engagement Survey",
            description="Annual survey to understand employee satisfaction and workplace culture.",
            status="published",
            share_slug="emp-eng-01",
        )
        db.add(form2)
        db.flush()

        q2_1 = Question(
            form_id=form2.id,
            title="Which department are you in?",
            type="multiple_choice",
            required=True,
            position=1,
            settings={"choices": ["Engineering", "Marketing", "Sales", "HR", "Finance"]},
        )
        q2_2 = Question(
            form_id=form2.id,
            title="How long have you worked here?",
            type="multiple_choice",
            required=True,
            position=2,
            settings={"choices": ["Less than 1 year", "1-3 years", "3-5 years", "5+ years"]},
        )
        q2_3 = Question(
            form_id=form2.id,
            title="Rate your work-life balance",
            type="rating",
            required=True,
            position=3,
            settings={"min": 1, "max": 5},
        )
        q2_4 = Question(form_id=form2.id, title="Suggestions for improvement", type="text", required=False, position=4)
        db.add_all([q2_1, q2_2, q2_3, q2_4])
        db.flush()

        # 7 responses for Form 2
        form2_responses = [
            {"dept": "Engineering", "tenure": "3-5 years", "balance": "4", "suggestion": "More remote work options."},
            {"dept": "Marketing", "tenure": "1-3 years", "balance": "3", "suggestion": "Better cross-team communication."},
            {"dept": "Engineering", "tenure": "5+ years", "balance": "5", "suggestion": ""},
            {"dept": "Sales", "tenure": "Less than 1 year", "balance": "2", "suggestion": "Onboarding could be smoother."},
            {"dept": "HR", "tenure": "1-3 years", "balance": "4", "suggestion": "More team events."},
            {"dept": "Finance", "tenure": "3-5 years", "balance": "3", "suggestion": "Flexible hours would help."},
            {"dept": "Engineering", "tenure": "1-3 years", "balance": "4", "suggestion": "Great culture overall!"},
        ]

        for resp_data in form2_responses:
            r = Response(form_id=form2.id)
            db.add(r)
            db.flush()
            db.add_all([
                Answer(response_id=r.id, question_id=q2_1.id, value=resp_data["dept"]),
                Answer(response_id=r.id, question_id=q2_2.id, value=resp_data["tenure"]),
                Answer(response_id=r.id, question_id=q2_3.id, value=resp_data["balance"]),
                Answer(response_id=r.id, question_id=q2_4.id, value=resp_data["suggestion"]),
            ])

        # ──────────────────────────────────────────
        # FORM 3: Product Feedback (DRAFT — no responses)
        # ──────────────────────────────────────────
        form3 = Form(
            title="Product Feedback Form",
            description="Share your thoughts on our latest product release.",
            status="draft",
            share_slug="prod-fb-01",
        )
        db.add(form3)
        db.flush()

        q3_1 = Question(form_id=form3.id, title="What product are you reviewing?", type="text", required=True, position=1)
        q3_2 = Question(
            form_id=form3.id,
            title="Rate the product",
            type="rating",
            required=True,
            position=2,
            settings={"min": 1, "max": 10},
        )
        q3_3 = Question(form_id=form3.id, title="Would you buy again?", type="yes_no", required=True, position=3)
        db.add_all([q3_1, q3_2, q3_3])

        db.commit()

        print("[OK] Seed complete!")
        print(f"   - Forms created: 3 (2 published, 1 draft)")
        print(f"   - Questions created: 12")
        print(f"   - Responses created: 15 (8 + 7)")
        print(f"   - Answers created: {8 * 5 + 7 * 4} (40 + 28 = 68)")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
