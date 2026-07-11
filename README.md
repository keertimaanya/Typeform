# Typeform Clone

A full-stack Typeform clone featuring a clean, responsive form builder, a dynamic respondent flow, and real-time form analytics. Built with modern web technologies and a focus on delivering a seamless user experience.

---

## ✨ Features Implemented

*   **Landing Page**: A beautiful, animated landing page that directs users straight to the dashboard (authentication flow is intentionally bypassed for immediate access).
*   **Workspace Dashboard**: 
    *   Create, view, and manage your forms.
    *   Toggle between **List** and **Grid** views for forms.
    *   Live search functionality with bolded text highlighting.
    *   Workspace management (rename, delete, leave).
*   **Form Builder**:
    *   **Add Form Elements**: Support for various input types including Short Text, Long Text, Email, Number, Multiple Choice, and Rating.
    *   **Live Preview**: Instantly preview your form in both Desktop and Mobile views.
    *   **Inline Editing**: Edit question titles and choices directly within the central workspace.
    *   **Form Settings**: Configure individual question properties (e.g., marking them as required).
*   **Form Respondent Flow**:
    *   Public, shareable URLs for each form (`/f/[slug]`).
    *   Smooth, step-by-step UI identical to the real Typeform experience.
    *   Keyboard shortcuts (press Enter to proceed, A/B/C for multiple choice).
*   **Results & Analytics**:
    *   View collected responses in a clean table format.
    *   See submission timestamps and individual answers.

---

## 🏗️ Tech Stack

This project is separated into a decoupled frontend and backend.

1.  **Frontend (`/frontend`)**: Next.js (App Router), React, Tailwind CSS, Framer Motion for animations, and Lucide for icons.
2.  **Backend (`/backend`)**: FastAPI (Python), SQLAlchemy (ORM), and SQLite (Database).

Because they are decoupled, **they must be deployed separately and linked via Environment Variables**.

---

## 💻 Local Development Setup

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

---

## 🗄️ Database Schema

The backend uses SQLite with SQLAlchemy. The core schema consists of four main tables:

1.  **`forms`**: Stores form metadata (title, status, share_slug, timestamps).
2.  **`questions`**: Stores question definitions, types, order, and JSON settings (e.g., multiple choice options).
3.  **`responses`**: Tracks when a user completes a form.
4.  **`answers`**: Stores individual answers linked to a specific response and question.

---

## 💡 Implementation Notes & Assumptions

*   **Authentication**: As per project requirements, authentication was removed to provide a frictionless experience. The app assumes a default workspace for the creator, and public forms require no login to fill out.
*   **UI Focus**: Heavy emphasis was placed on matching Typeform's distinct visual style, including typography, spacing, subtle border colors, and layout structure.
*   **Mocked Features**: Advanced enterprise features (Integrations, Brand Kit, File Uploads) were visually removed or mocked to maintain focus on core form-building and data-collection requirements.