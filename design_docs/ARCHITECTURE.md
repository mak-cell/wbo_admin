# Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)               │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────────┐  │
│  │Dashboard │ Projects │  Tasks   │ Payments │ Intake Form  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────────┘  │
│                          ↑                                       │
│                    API Service Layer                            │
│                    (HTTP/REST)                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Backend (FastAPI + SQLAlchemy)                     │
│  ┌──────────┬──────────┬──────────┬──────────────────────────┐ │
│  │ Projects │  Worker  │ Payments │ Users & Authentication   │ │
│  │ Routes   │  Routes  │ Routes   │ Routes                   │ │
│  └──────────┴──────────┴──────────┴──────────────────────────┘ │
│                          ↑                                       │
│                    Business Logic                               │
│                    Pydantic Schemas                             │
│                    Request Validation                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         Database Layer (SQLAlchemy ORM + SQLite)                │
│  ┌──────┬────────┬──────┬──────────┬───────┬────────────────┐ │
│  │Users │Projects│Events│Deliverables│Payments│TaskAssignments│
│  └──────┴────────┴──────┴──────────┴───────┴────────────────┘ │
│                                                                  │
│                    SQLite Database                              │
│                    (wedding_studio.db)                          │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend
- **Framework**: FastAPI (modern, fast web framework)
- **Database**: SQLAlchemy ORM with SQLite (dev) / PostgreSQL (prod)
- **Validation**: Pydantic (data validation)
- **Server**: Uvicorn (ASGI server)
- **Language**: Python 3.8+

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Styling**: Styled Components
- **Routing**: React Router v6
- **HTTP Client**: Fetch API

## Database Schema

### Users
```
users
├── id (PK)
├── name (String)
├── contact (String, Unique)
└── role (Enum: Admin, Shooter, Editor)
```

### Projects
```
projects
├── id (PK)
├── client_name (String)
├── location (String)
├── contact_number (String)
├── total_budget (Float)
└── status (Enum: Pending, In Progress, Review, Delivered)
```

### Events
```
events
├── id (PK)
├── project_id (FK → projects)
├── event_type (String)
└── event_date (Date)
```

### Deliverables
```
deliverables
├── id (PK)
├── project_id (FK → projects)
├── category (String: Photos, Videos, Reels)
└── details (JSON)
```

### Payments
```
payments
├── id (PK)
├── project_id (FK → projects)
├── milestone (String)
├── amount (Float)
└── is_paid (Boolean)
```

### Task Assignments
```
task_assignments
├── id (PK)
├── worker_id (FK → users)
├── project_id (FK → projects)
├── task_description (String)
└── status (Enum: Pending, In Progress, Review, Delivered)
```

## API Architecture

### REST Endpoints Structure

```
/projects              # Project Management
├── GET /               # List projects
├── POST /              # Create project
└── GET /{id}          # Get project details

/worker/tasks          # Worker Tasks
├── GET /{worker_id}   # Get worker tasks
├── POST /             # Create task
└── PATCH /{id}        # Update task

/payments              # Payment Management
├── GET /{id}          # Get payment
├── POST /             # Create payment
└── PATCH /{id}        # Update payment

/users                 # User Management
├── GET /              # List users
├── POST /             # Create user
└── GET /{id}          # Get user

/dashboard/summary     # Analytics
└── GET               # Get dashboard stats
```

## Design System Architecture

### Color Tokens
- **Primary**: #000000 (Deep Charcoal)
- **Secondary**: #775a19 (Champagne Gold)
- **Surface**: #fbf9f8 (Soft Bone)
- **Error**: #ba1a1a (Red)

### Typography
- **Display**: Playfair Display (serif)
- **Body**: Manrope (sans-serif)
- **Hierarchy**: 5 scales (Display LG → Label SM)

### Spacing
- **Base Unit**: 8px
- **Scale**: 8, 16, 24, 32, 48, 64px
- **Container Max**: 1440px

## Component Hierarchy

```
App
├── Layout
│   ├── Sidebar
│   │   └── NavLinks
│   └── MainContent
│       ├── Dashboard
│       │   └── StatsGrid
│       │       └── StatCard
│       ├── Projects
│       │   └── ProjectGrid
│       │       └── ProjectCard
│       ├── IntakeForm
│       │   └── FormFields
│       ├── Tasks
│       │   └── TaskList
│       │       └── TaskCard
│       └── Payments
│           └── PaymentTable
│               └── PaymentRow
```

## Data Flow

### Creating a Project
```
1. User fills IntakeForm
2. Form data validated by Pydantic schema
3. API POST /projects/ endpoint receives data
4. Project created in database
5. Response sent to frontend
6. UI updates with new project
```

### Getting Dashboard Data
```
1. Dashboard component mounts
2. API GET /projects/dashboard/summary called
3. Backend queries database
4. Calculates metrics (revenue, projects, etc.)
5. Returns JSON response
6. Frontend renders StatsCards with data
```

### Updating Task Status
```
1. User selects new status
2. API PATCH /worker/tasks/{id} called
3. Backend validates and updates database
4. Response sent to frontend
5. Local state updated
6. UI reflects new status
```

## Error Handling

### Backend
- Validation errors: 400 Bad Request
- Not found errors: 404 Not Found
- Server errors: 500 Internal Server Error
- All errors include detail message

### Frontend
- API errors caught in try-catch
- User-friendly error messages displayed
- Loading states during async operations

## Authentication & Security (Future)

Current implementation has no authentication. Production should include:

1. **JWT Token-based auth**
   - Login endpoint
   - Token refresh mechanism
   - Token stored in secure cookie

2. **Role-based Access Control (RBAC)**
   - Admin: Full access
   - Shooter: View assigned tasks, submit deliverables
   - Editor: View assigned tasks, submit edits

3. **Authorization Middleware**
   - Check token validity
   - Verify user permissions
   - Restrict endpoint access

## Performance Considerations

### Backend
- Database indexing on frequently queried fields
- Query optimization with eager loading
- Connection pooling for database
- Rate limiting on endpoints
- Caching for static data

### Frontend
- React.memo for preventing re-renders
- Lazy loading for routes
- Image optimization
- Code splitting

## Scalability Architecture

### Current (Development)
- Single SQLite database
- Single backend instance
- Frontend served by development server

### Production Ready
- PostgreSQL database with replication
- Multiple backend instances behind load balancer
- Frontend deployed to CDN
- Redis cache layer
- Message queue for async tasks (Celery)

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│              CDN / Static Hosting                     │
│              (Frontend React Build)                  │
└────────────────┬─────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────┐
│           Load Balancer / Proxy                       │
│           (Nginx / CloudFlare)                       │
└────────────────┬─────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────┐
│         Application Server Cluster                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ Uvicorn     │ │ Uvicorn     │ │ Uvicorn     │   │
│  │ Instance 1  │ │ Instance 2  │ │ Instance 3  │   │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘   │
└─────────┼──────────────┼──────────────┼────────────┘
          │              │              │
┌─────────▼──────────────▼──────────────▼────────────┐
│          Database Connection Pool                   │
│          (PostgreSQL / Database Server)            │
└──────────────────────────────────────────────────────┘
```

## Development Workflow

```
1. Feature Development
   ├── Create branch: git checkout -b feature/name
   ├── Make changes in backend/ or frontend/
   └── Test locally

2. Testing
   ├── Backend: pytest
   └── Frontend: npm test

3. Code Review
   ├── Create pull request
   └── Get approval

4. Deployment
   ├── Merge to main
   ├── Run tests in CI/CD
   ├── Deploy backend
   └── Deploy frontend
```

## Monitoring & Logging

### Backend Monitoring
- API endpoint response times
- Database query performance
- Error rates and stack traces
- Request/response logging

### Frontend Monitoring
- JavaScript errors
- Performance metrics
- User interactions
- API call success/failure

## Future Enhancements

1. **Authentication & Authorization**
2. **Real-time Notifications** (WebSocket)
3. **File Upload & Media Management**
4. **Advanced Analytics & Reports**
5. **Mobile App** (Flutter/React Native)
6. **Email Integration**
7. **SMS Notifications**
8. **Video Processing Pipeline**
9. **Client Portal**
10. **Invoice & Billing System**
