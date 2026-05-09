"""
Configuration file structure for the project
"""

# PROJECT STRUCTURE OVERVIEW

## Root Level Files
- README.md                 # Main project documentation
- QUICKSTART.md            # Quick start guide  
- DEVELOPMENT.md           # Development setup guide
- ARCHITECTURE.md          # System architecture documentation
- API_DOCUMENTATION.md     # Detailed API reference
- docker-compose.yml       # Docker compose configuration
- .gitignore              # Git ignore rules
- start.sh                # Linux/Mac startup script
- start.bat               # Windows startup script

## Backend Directory (/backend)

### Application Code
- app/main.py             # FastAPI application entry point
- app/core/config.py      # Configuration settings
- app/core/__init__.py    # Core module init

### Database Models
- app/models/base.py      # SQLAlchemy base
- app/models/models.py    # All database models
- app/models/enums.py     # Enumerations
- app/models/__init__.py  # Models module init

### Schemas (Validation)
- app/schemas/schemas.py  # Pydantic schemas for all models
- app/schemas/__init__.py # Schemas module init

### API Routes
- app/routes/projects.py  # Project endpoints
- app/routes/worker.py    # Worker task endpoints
- app/routes/payments.py  # Payment endpoints
- app/routes/users.py     # User management endpoints
- app/routes/__init__.py  # Routes module init

### Database Configuration
- app/db/database.py      # Database connection and session
- app/db/__init__.py      # DB module init

### Setup & Utilities
- init_db.py              # Database initialization script
- generate_test_data.py   # Test data generator
- run.py                  # Development server launcher
- requirements.txt        # Python package dependencies
- Dockerfile              # Docker image configuration
- .env.example            # Environment variables template

## Frontend Directory (/frontend)

### Source Code
- src/index.tsx           # Application entry point
- src/App.tsx             # Main application component
- src/react-app-env.d.ts  # React app type definitions

### Components
- src/components/Layout.tsx    # Main layout wrapper
- src/components/Sidebar.tsx   # Navigation sidebar
- src/components/Button.tsx    # Reusable button components
- src/components/Card.tsx      # Reusable card components

### Pages
- src/pages/Dashboard.tsx      # Dashboard page
- src/pages/Projects.tsx       # Projects list page
- src/pages/IntakeForm.tsx     # Project intake form page
- src/pages/Tasks.tsx          # Worker tasks page
- src/pages/Payments.tsx       # Payment tracking page

### Services
- src/services/apiService.ts   # API communication layer

### Styles & Design System
- src/styles/designTokens.ts   # Color, typography, spacing tokens

### Type Definitions
- src/types/index.ts           # TypeScript interfaces and enums

### Configuration & Build
- package.json            # Node.js dependencies
- tsconfig.json          # TypeScript configuration
- .env.example           # Environment variables template
- Dockerfile             # Docker image configuration
- public/index.html      # HTML template

## Key Files Explained

### Backend

**app/main.py**
- Creates FastAPI application
- Configures CORS
- Includes all routers
- Sets up database
- Provides API documentation at /docs

**app/models/models.py**
- Defines 6 main models: User, Project, Event, Deliverable, Payment, TaskAssignment
- Establishes relationships between models
- Uses SQLAlchemy ORM

**app/routes/*.py**
- Each file contains REST endpoints for a specific resource
- Implements CRUD operations
- Handles business logic

**init_db.py**
- Creates database tables on first run
- Can populate with sample data
- Run: python init_db.py

**requirements.txt**
- Lists all Python package dependencies
- FastAPI, Uvicorn, SQLAlchemy, Pydantic, etc.
- Install with: pip install -r requirements.txt

### Frontend

**src/App.tsx**
- Configures routes for all pages
- Applies global styles
- Sets up Router provider

**src/components/Layout.tsx**
- Wraps all pages
- Includes Sidebar navigation
- Provides consistent layout

**src/styles/designTokens.ts**
- Centralized design system
- Colors, typography, spacing, shadows
- Used throughout the app for consistency

**src/services/apiService.ts**
- Handles all backend API calls
- Base URL configurable via .env
- Methods for GET, POST, PATCH requests

**src/types/index.ts**
- TypeScript interfaces for all data types
- Enumerations (Role, ProjectStatus)
- Ensures type safety across the application

## Environment Configuration

### Backend (.env)
```
DATABASE_URL=sqlite:///./wedding_studio.db
API_TITLE=Weddingbellodisha Studio Management API
API_VERSION=1.0.0
DEBUG=True
SECRET_KEY=your-secret-key-here
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## Build Outputs

### Backend
- Generated files: none (runs directly)
- Database file: wedding_studio.db

### Frontend
- Build directory: frontend/build/
- Contains: index.html, js, css, media files
- Ready for production deployment

## Installation & Setup

1. Copy project to your desired location
2. Backend: pip install -r backend/requirements.txt
3. Frontend: npm install in frontend directory
4. Backend: python backend/init_db.py
5. Backend: python -m uvicorn backend/app/main:app --reload
6. Frontend: npm start in frontend directory

## Documentation Files

**README.md**
- Project overview
- Features list
- Setup instructions
- API endpoints summary

**QUICKSTART.md**
- Get running in 5 minutes
- Multiple setup options
- Troubleshooting tips

**DEVELOPMENT.md**
- Detailed development setup
- Project structure explanation
- Common development tasks
- Performance optimization tips

**ARCHITECTURE.md**
- System architecture diagrams
- Database schema details
- API structure explanation
- Technology stack details
- Deployment architecture

**API_DOCUMENTATION.md**
- Detailed API endpoint documentation
- Request/response examples
- Example cURL commands
- HTTP status codes

## Workflow

1. **Development**: Make changes, test locally
2. **Testing**: Run backend tests, frontend tests
3. **Version Control**: Commit and push changes
4. **Deployment**: Build, test in CI/CD, deploy to production
5. **Monitoring**: Monitor application health and performance

## Customization Points

### Add New Database Model
1. Create model in app/models/models.py
2. Create schema in app/schemas/schemas.py
3. Create routes in app/routes/
4. Include router in app/main.py

### Add New Page
1. Create component in src/pages/
2. Add route in src/App.tsx
3. Add navigation link in src/components/Sidebar.tsx

### Modify Design
1. Update tokens in src/styles/designTokens.ts
2. Components automatically reflect changes
3. Or modify individual component styles

### Change Database
1. Update DATABASE_URL in .env
2. Install appropriate driver (psycopg2 for PostgreSQL)
3. Run init_db.py to create tables

## Important Notes

- Backend uses SQLite for development (easily switchable to PostgreSQL)
- Frontend uses Styled Components for CSS-in-JS
- All data models are designed for a wedding studio system
- Design system follows luxury/premium aesthetic
- TypeScript ensures type safety
- CORS enabled for frontend-backend communication
