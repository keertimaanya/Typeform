# Typeform Clone

A full-stack Typeform clone for creating forms, collecting responses, and viewing analytics.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, dnd-kit |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic |
| Database | SQLite |

## Project Structure

```
Typeform/
├── frontend/          # Next.js 15 App (coming soon)
└── backend/           # FastAPI REST API
    ├── app/
    │   ├── main.py        # App entry point
    │   ├── config.py      # Environment settings
    │   ├── database.py    # SQLAlchemy setup
    │   ├── models/        # ORM models (Form, Question, Response, Answer)
    │   ├── schemas/       # Pydantic validation schemas
    │   ├── crud/          # Database operations
    │   ├── services/      # Business logic
    │   ├── api/           # REST API routes
    │   └── seed.py        # Sample data seeder
    ├── alembic/           # Database migrations
    ├── requirements.txt
    └── .env
```

## Backend Setup

### Prerequisites
- Python 3.11+

### Installation

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Seed the Database

```bash
cd backend
python -m app.seed
```

### Run the Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Forms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms` | List all forms |
| GET | `/api/forms/{id}` | Get form with questions |
| POST | `/api/forms` | Create a new form |
| PUT | `/api/forms/{id}` | Update a form |
| DELETE | `/api/forms/{id}` | Delete a form |
| POST | `/api/forms/{id}/duplicate` | Duplicate a form |
| POST | `/api/forms/{id}/publish` | Publish a form |
| POST | `/api/forms/{id}/unpublish` | Unpublish a form |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/forms/{id}/questions` | Add a question |
| PUT | `/api/questions/{id}` | Update a question |
| DELETE | `/api/questions/{id}` | Delete a question |
| PUT | `/api/forms/{id}/questions/reorder` | Reorder questions |

### Public (Respondent)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/{slug}` | Get form by share link |
| POST | `/api/public/{slug}/submit` | Submit a response |

### Responses & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms/{id}/responses` | List all responses |
| GET | `/api/responses/{id}` | Get single response |
| GET | `/api/forms/{id}/responses/summary` | Get analytics summary |