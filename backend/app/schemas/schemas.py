"""Pydantic schemas for request/response validation."""
from datetime import date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.models.enums import RoleEnum, ProjectStatusEnum


class UserBase(BaseModel):
    """Base user schema."""
    name: str
    contact: str
    role: RoleEnum
    base_salary: float = 0.0
    joining_date: Optional[date] = None


class UserCreate(UserBase):
    """User creation schema."""
    pass


class UserResponse(UserBase):
    """User response schema."""
    id: int
    
    class Config:
        from_attributes = True


class EventBase(BaseModel):
    """Base event schema."""
    event_type: str
    event_date: date


class EventCreate(EventBase):
    """Event creation schema."""
    project_id: int


class EventResponse(EventBase):
    """Event response schema."""
    id: int
    project_id: int
    
    class Config:
        from_attributes = True


class DeliverableBase(BaseModel):
    """Base deliverable schema (task-like structure)."""
    category: str  # Photography, Videography, Pre-Wedding
    description: Optional[str] = None  # "90 Edited Photos"
    details: Optional[Dict[str, Any]] = None  # Structured data
    status: ProjectStatusEnum = ProjectStatusEnum.PENDING
    due_date: Optional[date] = None


class DeliverableCreate(DeliverableBase):
    """Deliverable creation schema."""
    project_id: int


class DeliverableResponse(DeliverableBase):
    """Deliverable response schema."""
    id: int
    project_id: int
    
    class Config:
        from_attributes = True


class PaymentBase(BaseModel):
    """Base payment schema."""
    milestone: str
    amount: float
    is_paid: bool = False


class PaymentCreate(PaymentBase):
    """Payment creation schema."""
    project_id: int


class PaymentUpdate(BaseModel):
    """Payment update schema."""
    id: Optional[int] = None
    milestone: Optional[str] = None
    amount: Optional[float] = None
    is_paid: Optional[bool] = None


class PaymentResponse(PaymentBase):
    """Payment response schema."""
    id: int
    project_id: int
    
    class Config:
        from_attributes = True


class WorkerPayoutBase(BaseModel):
    """Base worker payout schema."""
    amount: float
    description: str
    payout_date: date
    is_paid: bool = False


class WorkerPayoutCreate(WorkerPayoutBase):
    """Worker payout creation schema."""
    worker_id: int
    project_id: Optional[int] = None


class WorkerPayoutResponse(WorkerPayoutBase):
    """Worker payout response schema."""
    id: int
    worker_id: int
    project_id: Optional[int]
    
    class Config:
        from_attributes = True


class TaskAssignmentBase(BaseModel):
    """Base task assignment schema."""
    task_description: str
    status: ProjectStatusEnum = ProjectStatusEnum.PENDING


class TaskAssignmentCreate(TaskAssignmentBase):
    """Task assignment creation schema."""
    worker_id: int
    project_id: int
    event_id: Optional[int] = None
    deliverable_id: Optional[int] = None


class TaskAssignmentUpdate(BaseModel):
    """Task assignment update schema."""
    status: ProjectStatusEnum


class TaskAssignmentResponse(TaskAssignmentBase):
    """Task assignment response schema."""
    id: int
    worker_id: int
    project_id: int
    event_id: Optional[int] = None
    deliverable_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    """Base project schema."""
    client_name: str
    event_title: Optional[str] = None
    location: str
    contact_number: str
    instagram_reference: Optional[str] = None
    total_budget: float
    status: ProjectStatusEnum = ProjectStatusEnum.PENDING


class ProjectCreate(ProjectBase):
    """Project creation schema."""
    pass


class EventUpdate(BaseModel):
    """Event update schema."""
    id: Optional[int] = None
    event_type: Optional[str] = None
    event_date: Optional[date] = None


class DeliverableUpdate(BaseModel):
    """Deliverable update schema (task-like)."""
    id: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    status: Optional[ProjectStatusEnum] = None
    due_date: Optional[date] = None


class ProjectUpdate(BaseModel):
    """Project update schema with optional nested data."""
    client_name: Optional[str] = None
    event_title: Optional[str] = None
    location: Optional[str] = None
    contact_number: Optional[str] = None
    instagram_reference: Optional[str] = None
    total_budget: Optional[float] = None
    status: Optional[ProjectStatusEnum] = None
    events: Optional[List[EventUpdate]] = None
    deliverables: Optional[List[DeliverableUpdate]] = None
    payments: Optional[List[PaymentUpdate]] = None


class ProjectResponse(ProjectBase):
    """Project response schema with relationships."""
    id: int
    magic_link_token: str
    events: List[EventResponse] = []
    deliverables: List[DeliverableResponse] = []
    payments: List[PaymentResponse] = []
    
    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    """Dashboard summary schema."""
    total_projects: int
    active_projects: int
    total_revenue: float
    pending_payments: float
    completed_deliverables: int

class CalendarEventResponse(BaseModel):
    """Calendar item schema — covers both shoot events and deliverable deadlines."""
    event_id: int
    project_id: int
    title: str
    event_type: str
    date: date
    location: str
    client_name: str
    status: ProjectStatusEnum
    assigned_workers: List[str] = []
    source: str = "event"  # "event" or "deliverable"

    class Config:
        from_attributes = True
