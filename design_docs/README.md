# Weddingbellodisha Studio Management System

A comprehensive wedding studio management dashboard system built with modern technologies.

## Project Structure

```
weddingbellodisha_dashboard/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── core/         # Configuration
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── routes/       # API routes
│   │   ├── db/           # Database setup
│   │   └── main.py       # FastAPI app
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Environment template
│
└── frontend/              # React TypeScript frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── pages/         # Page components
    │   ├── services/      # API service
    │   ├── styles/        # Design tokens & themes
    │   ├── types/         # TypeScript types
    │   ├── App.tsx        # Main App component
    │   └── index.tsx      # Entry point
    ├── public/            # Static assets
    ├── package.json       # Node dependencies
    ├── tsconfig.json      # TypeScript config
    └── .env.example       # Environment template
```

## Features

### Backend (FastAPI)
- **Project Management**: Create and manage wedding projects
- **Task Assignment**: Assign tasks to team members (shooters, editors)
- **Payment Tracking**: Monitor project payments and milestones
- **Dashboard Analytics**: View revenue, active projects, and metrics
- **RESTful API**: All endpoints following REST conventions
- **Database**: SQLAlchemy ORM with support for multiple databases

### Frontend (React + TypeScript)
- **Dashboard**: Real-time analytics and project overview
- **Project Management**: List and manage all projects
- **Intake Form**: Streamlined project creation workflow
- **Design System**: Premium, minimalist UI following luxury brand guidelines
  - Color palette: Deep Charcoal (#000000) + Champagne Gold (#775a19)
  - Typography: Playfair Display (headlines) + Manrope (body)
  - Spacing: 8px grid system with generous whitespace

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

### Projects
- `POST /projects/` - Create a new project
- `GET /projects/` - List all projects
- `GET /projects/{id}` - Get project details
- `GET /projects/dashboard/summary` - Get dashboard statistics

### Worker Tasks
- `POST /worker/tasks` - Create task assignment
- `GET /worker/tasks/{worker_id}` - Get worker's tasks
- `PATCH /worker/tasks/{task_id}` - Update task status

### Payments
- `POST /payments/` - Create payment record
- `GET /payments/{payment_id}` - Get payment details
- `PATCH /payments/{payment_id}` - Update payment status

### Users
- `POST /users/` - Create user
- `GET /users/` - List all users
- `GET /users/{user_id}` - Get user details

## Database Models

The system includes the following database models:

- **User**: Team members (Admins, Shooters, Editors)
- **Project**: Wedding projects with client information
- **Event**: Events within a project (Engagement, Mehendi, Wedding, etc.)
- **Deliverable**: Project deliverables (Photos, Videos, Reels)
- **Payment**: Payment tracking and milestones
- **TaskAssignment**: Worker task assignments

## Design System

The UI follows the "Curated Gallery" design philosophy with:
- Minimalist, high-contrast aesthetic
- Premium color palette with gold accents
- Generous whitespace and breathing room
- Editorial, magazine-inspired layout
- Sophisticated typography hierarchy
- Smooth, premium interactions

## Development Notes

- Backend uses SQLite for development (easily switchable to PostgreSQL)
- Frontend uses styled-components for styling
- TypeScript ensures type safety throughout
- CORS enabled for frontend-backend communication

## Future Enhancements

- [ ] Authentication & Authorization
- [ ] Media gallery integration
- [ ] Advanced analytics & reporting
- [ ] Mobile app (Flutter)
- [ ] Real-time notifications
- [ ] Video processing pipeline
- [ ] Client portal
- [ ] Invoice generation

## License

Proprietary - Weddingbellodisha Studio
