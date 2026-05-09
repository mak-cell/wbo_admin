# Development Setup Guide

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Git

## Backend Development Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Initialize Database

```bash
python init_db.py
```

This will create the SQLite database and populate it with sample data.

### 4. Run Development Server

```bash
python -m uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`

### 5. Access API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Frontend Development Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create Environment File

```bash
cp .env.example .env
```

### 3. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

### Backend Structure

```
backend/
├── app/
│   ├── core/
│   │   └── config.py          # Configuration
│   ├── models/
│   │   ├── base.py            # SQLAlchemy base
│   │   ├── models.py          # Database models
│   │   └── enums.py           # Enumerations
│   ├── schemas/
│   │   └── schemas.py         # Pydantic schemas
│   ├── routes/
│   │   ├── projects.py        # Project routes
│   │   ├── worker.py          # Worker routes
│   │   ├── payments.py        # Payment routes
│   │   └── users.py           # User routes
│   ├── db/
│   │   └── database.py        # Database setup
│   └── main.py                # FastAPI app
├── init_db.py                 # Database initialization
├── run.py                     # Development server launcher
└── requirements.txt           # Python dependencies
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx         # Main layout
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── Button.tsx         # Button components
│   │   └── Card.tsx           # Card components
│   ├── pages/
│   │   ├── Dashboard.tsx      # Dashboard page
│   │   ├── Projects.tsx       # Projects list
│   │   ├── IntakeForm.tsx     # Project intake form
│   │   ├── Tasks.tsx          # Worker tasks
│   │   └── Payments.tsx       # Payment tracking
│   ├── services/
│   │   └── apiService.ts      # API communication
│   ├── styles/
│   │   └── designTokens.ts    # Design system tokens
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.tsx                # Main App component
│   └── index.tsx              # Entry point
├── public/
│   └── index.html             # HTML template
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

## Common Development Tasks

### Add a New API Endpoint

1. Create a route file in `backend/app/routes/`
2. Define the route handler function
3. Include the router in `app/main.py`

Example:

```python
# backend/app/routes/new_feature.py
from fastapi import APIRouter

router = APIRouter(prefix="/feature", tags=["feature"])

@router.get("/")
def get_feature():
    return {"message": "Feature endpoint"}
```

Then include in `app/main.py`:

```python
from app.routes import new_feature
app.include_router(new_feature.router)
```

### Add a New Page

1. Create a new component in `frontend/src/pages/`
2. Add TypeScript interfaces for data types
3. Use the `Layout` component for consistent styling
4. Add route in `App.tsx`

Example:

```typescript
// frontend/src/pages/NewPage.tsx
import React from "react";
import { Layout } from "../components/Layout";

const NewPage: React.FC = () => {
  return (
    <Layout>
      <h1>New Page</h1>
      {/* Page content */}
    </Layout>
  );
};

export default NewPage;
```

Then add to `App.tsx`:

```typescript
<Route path="/new-page" element={<NewPage />} />
```

### Update Design System

All design tokens are in `frontend/src/styles/designTokens.ts`:

```typescript
export const colors = {
  primary: "#000000",
  secondary: "#775a19",
  // ... more colors
};

export const typography = {
  // ... typography settings
};
```

## Database Operations

### View Database Schema

The database schema is defined in `backend/app/models/models.py`

### Add a New Model

1. Create the model class in `backend/app/models/models.py`
2. Create corresponding Pydantic schema in `backend/app/schemas/schemas.py`
3. Create routes in `backend/app/routes/`
4. Run `init_db.py` to create new tables

### Migrate to PostgreSQL

Update `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://user:password@localhost/wedding_studio
```

Install PostgreSQL driver:

```bash
pip install psycopg2-binary
```

## Testing

### Backend Testing

```bash
# Install pytest
pip install pytest

# Run tests
pytest
```

### Frontend Testing

```bash
# Run tests
npm test
```

## Deployment

### Using Docker

```bash
docker-compose up
```

### Manual Deployment

1. **Backend**: Deploy to server, run with Gunicorn/uWSGI
2. **Frontend**: Build and deploy to static hosting or CDN

```bash
# Backend
pip install gunicorn
gunicorn app.main:app

# Frontend
cd frontend
npm run build
# Deploy `build/` folder to hosting
```

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 8000
lsof -i :8000
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 8001
```

### Database Errors

```bash
# Reset database
rm backend/wedding_studio.db
python backend/init_db.py
```

### Frontend Not Connecting to API

1. Check `REACT_APP_API_URL` in `.env`
2. Ensure backend is running
3. Check CORS settings in `app/main.py`
4. Open browser console for error details

## Performance Optimization

- Add database indexing for frequently queried fields
- Implement caching with Redis
- Optimize React components with `React.memo`
- Use database connection pooling
- Add pagination to list endpoints

## Security Checklist

- [ ] Add JWT authentication
- [ ] Implement role-based access control (RBAC)
- [ ] Add input validation and sanitization
- [ ] Use HTTPS in production
- [ ] Set secure CORS policies
- [ ] Implement rate limiting
- [ ] Add API key management
- [ ] Secure sensitive data in environment variables
