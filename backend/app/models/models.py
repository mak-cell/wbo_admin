"""SQLAlchemy database models."""
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum, JSON, Boolean
from sqlalchemy.orm import relationship
import uuid
from app.models.base import Base
from app.models.enums import RoleEnum, ProjectStatusEnum


class User(Base):
    """User model for shooters, editors, and admins."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact = Column(String, unique=True, index=True)
    role = Column(Enum(RoleEnum))
    
    # HRMS Fields (Optional)
    base_salary = Column(Float, nullable=True, default=0.0)
    joining_date = Column(Date, nullable=True)
    
    assignments = relationship("TaskAssignment", back_populates="worker")
    payouts = relationship("WorkerPayout", back_populates="worker")


class Project(Base):
    """Project model for wedding projects."""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, index=True)
    event_title = Column(String)  # e.g., "Both Side Prewedding"
    location = Column(String)
    contact_number = Column(String)
    instagram_reference = Column(String, nullable=True)
    total_budget = Column(Float)  # INR
    status = Column(Enum(ProjectStatusEnum), default=ProjectStatusEnum.PENDING)
    
    # Client Portal Access
    magic_link_token = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    events = relationship("Event", back_populates="project", cascade="all, delete-orphan")
    deliverables = relationship("Deliverable", back_populates="project", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="project", cascade="all, delete-orphan")
    task_assignments = relationship("TaskAssignment", back_populates="project", cascade="all, delete-orphan")
    worker_payouts = relationship("WorkerPayout", back_populates="project", cascade="all, delete-orphan")


class Event(Base):
    """Event model for different wedding events."""
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    event_type = Column(String)  # Prewedding, Engagement, Mehendi, etc.
    event_date = Column(Date)
    
    project = relationship("Project", back_populates="events")
    assignments = relationship("TaskAssignment", back_populates="event", cascade="all, delete-orphan")


class Deliverable(Base):
    """Deliverable model for project deliverables (acts as a trackable task)."""
    __tablename__ = "deliverables"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    category = Column(String)  # Photography, Videography, Pre-Wedding
    description = Column(String, nullable=True)  # e.g. "90 Edited Photos"
    details = Column(JSON, nullable=True)  # Structured data: {count: 90, type: "edited"}
    status = Column(Enum(ProjectStatusEnum), default=ProjectStatusEnum.PENDING)
    due_date = Column(Date, nullable=True)  # Deadline for calendar display
    
    project = relationship("Project", back_populates="deliverables")
    assignments = relationship("TaskAssignment", back_populates="deliverable", cascade="all, delete-orphan")


class Payment(Base):
    """Payment model for project payments (Income from Client)."""
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    milestone = Column(String)  # Advance (15%), 2nd Installment Prewed (20%), etc.
    amount = Column(Float)
    is_paid = Column(Boolean, default=False)
    
    project = relationship("Project", back_populates="payments")


class WorkerPayout(Base):
    """Worker Payout model for tracking salaries and per-shoot payouts (Expenses)."""
    __tablename__ = "worker_payouts"
    
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("users.id"), index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True, index=True)
    amount = Column(Float)
    description = Column(String) # e.g. "Monthly Salary for June", "Bonus for Project X"
    payout_date = Column(Date)
    is_paid = Column(Boolean, default=False)
    
    worker = relationship("User", back_populates="payouts")
    project = relationship("Project", back_populates="worker_payouts")


class TaskAssignment(Base):
    """Task assignment model — links a worker to a specific event or deliverable."""
    __tablename__ = "task_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("users.id"), index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True, index=True)
    deliverable_id = Column(Integer, ForeignKey("deliverables.id"), nullable=True, index=True)
    task_description = Column(String)
    status = Column(Enum(ProjectStatusEnum), default=ProjectStatusEnum.PENDING)
    
    worker = relationship("User", back_populates="assignments")
    project = relationship("Project", back_populates="task_assignments")
    event = relationship("Event", back_populates="assignments")
    deliverable = relationship("Deliverable", back_populates="assignments")
