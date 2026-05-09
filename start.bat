@echo off
REM Start both backend and frontend services on Windows

echo Starting Weddingbellodisha Studio Management System...

REM Start backend in a new window
REM pip install -r requirements.txt
start cmd /k "cd backend && python init_db.py && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Start frontend in a new window
start cmd /k "cd frontend && npm install && npm start"

echo.
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
