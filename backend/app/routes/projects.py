"""Project routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Project, Event, Deliverable, Payment
from app.models.enums import ProjectStatusEnum
from app.schemas.schemas import ProjectCreate, ProjectUpdate, ProjectResponse, DashboardSummary, CalendarEventResponse

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project (Intake Form)."""
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Fetch project details."""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@router.get("/", response_model=list[ProjectResponse])
def list_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all projects."""
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project_update: ProjectUpdate, db: Session = Depends(get_db)):
    """Update project details including nested events, deliverables, and payments."""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    for field in [
        "client_name",
        "event_title",
        "location",
        "contact_number",
        "instagram_reference",
        "total_budget",
        "status",
    ]:
        value = getattr(project_update, field)
        if value is not None:
            setattr(db_project, field, value)

    if project_update.events is not None:
        existing_events = {event.id: event for event in db_project.events}
        incoming_event_ids = []
        for event_data in project_update.events:
            if event_data.id and event_data.id in existing_events:
                event = existing_events[event_data.id]
                event.event_type = event_data.event_type
                event.event_date = event_data.event_date
                incoming_event_ids.append(event.id)
            else:
                new_event = Event(**event_data.model_dump(exclude_unset=True))
                db_project.events.append(new_event)
        for event in list(db_project.events):
            if event.id and event.id not in incoming_event_ids:
                db.delete(event)

    if project_update.deliverables is not None:
        existing_deliverables = {d.id: d for d in db_project.deliverables}
        incoming_deliverable_ids = []
        for deliverable_data in project_update.deliverables:
            if deliverable_data.id and deliverable_data.id in existing_deliverables:
                deliverable = existing_deliverables[deliverable_data.id]
                deliverable.category = deliverable_data.category
                deliverable.details = deliverable_data.details
                incoming_deliverable_ids.append(deliverable.id)
            else:
                new_deliverable = Deliverable(**deliverable_data.model_dump(exclude_unset=True))
                db_project.deliverables.append(new_deliverable)
        for deliverable in list(db_project.deliverables):
            if deliverable.id and deliverable.id not in incoming_deliverable_ids:
                db.delete(deliverable)

    if project_update.payments is not None:
        existing_payments = {p.id: p for p in db_project.payments}
        incoming_payment_ids = []
        for payment_data in project_update.payments:
            if payment_data.id and payment_data.id in existing_payments:
                payment = existing_payments[payment_data.id]
                payment.milestone = payment_data.milestone
                payment.amount = payment_data.amount
                payment.is_paid = payment_data.is_paid
                incoming_payment_ids.append(payment.id)
            else:
                new_payment = Payment(**payment_data.model_dump(exclude_unset=True))
                db_project.payments.append(new_payment)
        for payment in list(db_project.payments):
            if payment.id and payment.id not in incoming_payment_ids:
                db.delete(payment)

    db.commit()
    db.refresh(db_project)
    return db_project


@router.get("/calendar/events", response_model=list[CalendarEventResponse])
def get_calendar_events(db: Session = Depends(get_db)):
    """Get all events formatted for the calendar view."""
    events = db.query(Event).join(Project).all()
    calendar_events = []
    
    for event in events:
        project = event.project
        # Get assigned workers for this project
        workers = []
        for task in project.task_assignments:
            if task.worker and task.worker.name not in workers:
                workers.append(task.worker.name)
                
        title = f"{project.client_name} - {event.event_type}"
        
        calendar_events.append(
            CalendarEventResponse(
                event_id=event.id,
                project_id=project.id,
                title=title,
                event_type=event.event_type,
                date=event.event_date,
                location=project.location,
                client_name=project.client_name,
                status=project.status,
                assigned_workers=workers
            )
        )
        
    return calendar_events


@router.get("/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary with admin stats."""
    total_projects = db.query(Project).count()
    active_projects = db.query(Project).filter(
        Project.status.in_([ProjectStatusEnum.IN_PROGRESS, ProjectStatusEnum.REVIEW])
    ).count()
    
    # Calculate total revenue and pending payments
    all_payments = db.query(Payment).all()
    total_revenue = sum(p.amount for p in all_payments if p.is_paid)
    pending_payments = sum(p.amount for p in all_payments if not p.is_paid)
    
    # Count completed deliverables
    completed_deliverables = db.query(Project).filter(
        Project.status == ProjectStatusEnum.DELIVERED
    ).count()
    
    return DashboardSummary(
        total_projects=total_projects,
        active_projects=active_projects,
        total_revenue=total_revenue,
        pending_payments=pending_payments,
        completed_deliverables=completed_deliverables,
    )
