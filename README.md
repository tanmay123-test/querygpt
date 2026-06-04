# QueryGPT

AI-driven SQL workspace with React frontend and FastAPI auth backend.

## Project structure

```
querygpt/
├── frontend/   # React + Vite + Tailwind CSS
└── backend/    # FastAPI + PostgreSQL + JWT auth
```

## PostgreSQL setup (required for backend)

1. Create database `querygpt` in pgAdmin or psql.
2. Update `backend/.env` if your credentials differ from the defaults.

## Run the backend

```bash
cd querygpt/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs

## Run the frontend

```bash
cd querygpt/frontend
npm install
npm run dev
```

Open http://localhost:5173

## Auth flow

- Register/login call the backend and store JWT + user in `localStorage`.
- Protected requests send `Authorization: Bearer <token>` automatically.

Optional: set `VITE_API_URL` in `frontend/.env` if the API is not on `http://localhost:8000`.
