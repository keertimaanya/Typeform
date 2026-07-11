# Typeform Clone

A full-stack Typeform clone featuring a powerful drag-and-drop builder, a dynamic respondent flow, and real-time analytics. Built with Next.js (App Router), React, Tailwind CSS, Framer Motion, FastAPI, and SQLite.

---

## 🏗️ Architecture Overview

This project is separated into two decoupled applications to allow for independent scaling and modern deployment strategies:

1. **Frontend (`/frontend`)**: A Next.js application that serves the UI, forms, and builder. Uses React Query for state management and Tailwind CSS for styling.
2. **Backend (`/backend`)**: A FastAPI Python server that handles the database, business logic, and API endpoints. Uses SQLAlchemy for ORM.

Because they are decoupled, **they must be deployed separately and linked via Environment Variables**.

---

## 🗄️ Database Schema

The backend uses SQLite with SQLAlchemy. The core schema consists of four main tables:

1. **`forms`**
   - `id`: Integer (Primary Key)
   - `title`: String
   - `status`: String (e.g., 'draft', 'published')
   - `share_slug`: String (Unique, used for public URLs)
   - `created_at`, `updated_at`: DateTime

2. **`questions`**
   - `id`: Integer (Primary Key)
   - `form_id`: Integer (Foreign Key to `forms.id`)
   - `title`: String
   - `description`: String
   - `type`: String (e.g., 'text', 'multiple_choice', 'rating')
   - `settings`: JSON (Stores choices, rating max, etc.)
   - `order`: Integer (For drag-and-drop sorting)
   - `required`: Boolean

3. **`responses`**
   - `id`: Integer (Primary Key)
   - `form_id`: Integer (Foreign Key to `forms.id`)
   - `submitted_at`: DateTime

4. **`answers`**
   - `id`: Integer (Primary Key)
   - `response_id`: Integer (Foreign Key to `responses.id`)
   - `question_id`: Integer (Foreign Key to `questions.id`)
   - `value`: String (The user's submitted answer)

---

## 🌱 Sample Data (Database Seeding)

To make the app immediately usable and fulfill the assignment requirements, a seeding script is provided to pre-populate the database with published forms and fake responses.

Run the seed script from the `backend` directory:
```bash
cd backend
python seed.py
```
This will automatically generate a "Customer Satisfaction Survey" and a "Tech Meetup Registration" form, complete with various question types and submitted responses so you can test the analytics dashboard right away.

---

## 💡 Assumptions Made

- **Authentication**: As per the instructions, real creator authentication was simplified. The app assumes a default logged-in creator, and public forms require no login to fill out.
- **Mocked Features**: Advanced features like Payment, File Upload, Logic Jumps, and Integrations are intentionally mocked in the Builder's "Add Content" menu to match the Typeform UI feel without expanding the scope beyond the core requirements.
- **Deployment**: The database uses SQLite for simplicity, which works best locally or on persistent disk setups (like Railway Volumes).

---

## 💻 Local Development Setup

If you want to run the project locally on your machine:

**1. Start the Backend:**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py # Seed the sample data!
uvicorn app.main:app --reload --port 8000
```
*(The API will be available at `http://localhost:8000`)*

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*(The Web App will be available at `http://localhost:3000`)*

---

## 🚀 Deployment Guide (Production)

To deploy this project to the public internet, we will use **Vercel** for the Frontend and **Railway** for the Backend.

### Step 1: Deploy the Backend (Railway)
1. Create a free account at [Railway.app](https://railway.app/).
2. Create a **New Project** -> **Deploy from GitHub repo**.
3. Add a **Root Directory** setting if Railway doesn't automatically detect the `/backend` folder. Go to Settings -> Build -> Root Directory -> type `/backend`.
4. **Set up Persistent Storage (SQLite)**:
   - In Railway, go to the **Volumes** tab and click **Add Volume**.
   - Set the Mount Path to `/data`.
5. **Configure Environment Variables**:
   - `DATABASE_URL`: `sqlite:////data/typeform.db`
   - `CORS_ORIGINS`: `*` 
6. Click **Deploy**. Copy the public URL Railway gives you.

### Step 2: Deploy the Frontend (Vercel)
1. Create a free account at [Vercel.com](https://vercel.com/).
2. Click **Add New Project** and import this GitHub repository.
3. In the "Configure Project" step:
   - **Root Directory**: Click Edit and select `/frontend`.
4. **Configure Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Paste your Railway Backend URL with `/api` at the end (e.g., `https://backend-production.up.railway.app/api`).
5. Click **Deploy**.