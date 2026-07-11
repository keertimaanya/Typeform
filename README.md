# Typeform Clone

A full-stack Typeform clone featuring a clean, responsive form builder, a dynamic respondent flow, and real-time form analytics. Built with modern web technologies and a focus on delivering a seamless user experience.

**Live Demo**: [https://typeform-azure.vercel.app/](https://typeform-azure.vercel.app/)



## Tech Stack Used

This project is separated into a decoupled frontend and backend.

1.  **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion (for animations), and Lucide (for icons).
2.  **Backend**: FastAPI (Python), SQLAlchemy (ORM), Pydantic (validation), and SQLite (Database).



## Architecture Overview

The application follows a modern decoupled architecture:

*   **Client (Frontend)**: Handles all user interfaces, state management (React Hooks/Context), and routing. It communicates with the backend exclusively via RESTful API calls.
*   **Server (Backend)**: A stateless FastAPI application that exposes RESTful endpoints, handles data validation, and manages database transactions via SQLAlchemy.
*   **Database**: SQLite is used for persistent storage, making the application lightweight and easy to deploy.

Because they are decoupled, **they must be deployed separately and linked via Environment Variables**.



## Setup Instructions

If you want to run the project locally on your machine:

### 1. Start the Backend (API & Database)

```bash
cd backend
# Create and activate a virtual environment
python -m venv venv
# On Mac/Linux: source venv/bin/activate
# On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Seed the database with sample data
python seed.py 

# Start the server
uvicorn app.main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`*

### 2. Start the Frontend (Web App)

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Create a .env.local file pointing to your backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start the development server
npm run dev
```
*The Web App will be available at `http://localhost:3000`*



## Database Schema

The backend uses SQLite with SQLAlchemy. The core schema consists of four main tables:

1.  **`forms`**: Stores form metadata (`id`, `title`, `description`, `status`, `share_slug`, `created_at`, `updated_at`).
2.  **`questions`**: Stores question definitions (`id`, `form_id`, `title`, `description`, `type`, `required`, `position`, `settings` as JSON).
3.  **`responses`**: Tracks when a user completes a form (`id`, `form_id`, `submitted_at`).
4.  **`answers`**: Stores individual answers linked to a specific response and question (`id`, `response_id`, `question_id`, `value`).



## API Overview

The FastAPI backend exposes several REST endpoints to handle the core functionality. Detailed API documentation (Swagger UI) is automatically generated and available at `/docs` when the backend is running locally.

**Key Endpoints:**
*   **Forms**:
    *   `GET /api/forms` - Retrieve all forms for the dashboard.
    *   `POST /api/forms` - Create a new form.
    *   `GET /api/forms/{id}` - Get full details of a specific form (used by the builder).
    *   `PUT /api/forms/{id}` - Update form metadata or publish status.
    *   `GET /api/forms/slug/{slug}` - Fetch a form by its public share slug (used by respondents).
*   **Questions**:
    *   `POST /api/questions` - Add a new question to a form.
    *   `PUT /api/questions/{id}` - Update a question's content or settings.
    *   `PUT /api/questions/reorder` - Update the display order of questions.
    *   `DELETE /api/questions/{id}` - Remove a question.
*   **Responses**:
    *   `POST /api/responses` - Submit a completed form with all answers.
    *   `GET /api/responses/form/{form_id}/summary` - Fetch analytics and collected responses for the dashboard grid.



