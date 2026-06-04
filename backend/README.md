# QueryGPT Backend

FastAPI authentication API with PostgreSQL, JWT, and bcrypt.

## Prerequisites

1. Install [PostgreSQL](https://www.postgresql.org/download/).
2. Create a database named `querygpt`:

```sql
CREATE DATABASE querygpt;
```

3. Copy `.env` and adjust `DATABASE_URL` if your credentials differ:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/querygpt
```

## Setup

```bash
cd querygpt/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

## Auth endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register and receive JWT |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Current user (Bearer token) |

## Test with curl

```bash
curl -X POST http://localhost:8000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"full_name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"secret12\",\"confirm_password\":\"secret12\"}"

curl -X POST http://localhost:8000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@example.com\",\"password\":\"secret12\"}"

curl http://localhost:8000/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
