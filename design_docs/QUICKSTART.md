# Quick Start Guide

Get the Weddingbellodisha Studio Management System up and running in 5 minutes!

## Option 1: Quick Start (Windows)

1. **Download and extract the project**

2. **Run the startup script:**
   ```bash
   start.bat
   ```
   
   This will:
   - Install backend dependencies
   - Create and populate the database
   - Start the backend API on port 8000
   - Install frontend dependencies
   - Start the frontend on port 3000

3. **Access the application:**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8000/docs

## Option 2: Quick Start (macOS/Linux)

1. **Download and extract the project**

2. **Run the startup script:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8000/docs

## Option 3: Manual Setup (Detailed)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Generate test data (optional)
python generate_test_data.py

# Run server
python -m uvicorn app.main:app --reload
```

Backend will be available at: http://localhost:8000

### Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at: http://localhost:3000

## Option 4: Docker Setup

```bash
# Make sure Docker is installed
docker-compose up
```

This will start both backend and frontend in containers.

## First Steps

### 1. Explore the Dashboard
- Navigate to http://localhost:3000
- You'll see the dashboard with sample data

### 2. Create a New Project
- Click "New Project" in the sidebar
- Fill in client details
- Submit the form
- The project will appear in the Projects list

### 3. View API Documentation
- Visit http://localhost:8000/docs
- Try out different API endpoints using the Swagger UI

### 4. Explore Sample Data
- The system comes with pre-populated sample data
- Projects, users, tasks, and payments are already created

## Common Commands

### Backend

```bash
# Run with auto-reload
python -m uvicorn app.main:app --reload

# Run on specific port
python -m uvicorn app.main:app --port 8001

# Generate test data
python generate_test_data.py

# Reset database
rm wedding_studio.db && python init_db.py
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Features to Explore

### Dashboard
- View key metrics (total projects, active projects, revenue, etc.)
- Real-time statistics

### Projects
- View all wedding projects
- See project details, budget, location, and status
- Click on projects to view full details

### New Project (Intake Form)
- Create new wedding projects
- Fill in client name, location, contact, and budget
- Projects are saved to the database

### Tasks
- View assigned tasks
- Update task status (Pending → In Progress → Review → Delivered)

### Payments
- Track project payments
- View payment milestones
- Mark payments as paid/pending

## System Requirements

- Python 3.8+ (for backend)
- Node.js 14+ (for frontend)
- 100MB disk space
- 4GB RAM (minimum)

## Ports Used

- **8000**: Backend API
- **3000**: Frontend Application
- **5432**: PostgreSQL (if using PostgreSQL instead of SQLite)

## Design System

The application features a premium, minimalist design:

- **Colors**: Deep Charcoal (#000000) + Champagne Gold (#775a19)
- **Typography**: Playfair Display (headings) + Manrope (body)
- **Spacing**: 8px grid system
- **Philosophy**: "The Curated Gallery" - treating every element as art

## Troubleshooting

### Port 8000 or 3000 already in use

**For Backend:**
```bash
# Kill process on port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Run on different port
python -m uvicorn app.main:app --port 8001
```

**For Frontend:**
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Update environment if needed
PORT=3001 npm start
```

### Database Issues

```bash
# Reset database
cd backend
rm wedding_studio.db
python init_db.py
python generate_test_data.py
```

### Frontend not connecting to API

1. Make sure backend is running: http://localhost:8000/health
2. Check `.env` file in frontend folder
3. Clear browser cache and restart frontend

## Next Steps

1. **Read [DEVELOPMENT.md](DEVELOPMENT.md)** for detailed development guide
2. **Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md)** for API reference
3. **Explore [weddingbellodisha_studio/DESIGN.md](weddingbellodisha_studio/DESIGN.md)** for design system details
4. **Check [README.md](README.md)** for complete project documentation

## Support

For issues, questions, or suggestions:
1. Check the troubleshooting section
2. Review the documentation files
3. Check API logs at http://localhost:8000/docs

## Project Structure

```
weddingbellodisha_dashboard/
├── backend/              # FastAPI backend
├── frontend/             # React TypeScript frontend
├── README.md             # Main documentation
├── DEVELOPMENT.md        # Development guide
├── API_DOCUMENTATION.md  # API reference
├── QUICKSTART.md         # This file
└── docker-compose.yml    # Docker configuration
```

Happy coding! 🎉
