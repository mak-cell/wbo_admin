#!/bin/bash
# Start both backend and frontend services

echo "Starting Weddingbellodisha Studio Management System..."

# Start backend
cd backend
pip install -r requirements.txt
python init_db.py
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

# Start frontend
cd ../frontend
npm install
npm start

wait
