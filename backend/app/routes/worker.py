"""Worker task routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import TaskAssignment, User
from app.schemas.schemas import TaskAssignmentResponse, TaskAssignmentCreate, TaskAssignmentUpdate

router = APIRouter(prefix="/worker", tags=["worker"])


@router.get("/tasks/{worker_id}", response_model=list[TaskAssignmentResponse])
def get_worker_tasks(worker_id: int, db: Session = Depends(get_db)):
    """Fetch upcoming assignments for shooters/editors."""
    # Verify worker exists
    worker = db.query(User).filter(User.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    tasks = db.query(TaskAssignment).filter(
        TaskAssignment.worker_id == worker_id
    ).all()
    return tasks


@router.post("/tasks", response_model=TaskAssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_task_assignment(task: TaskAssignmentCreate, db: Session = Depends(get_db)):
    """Create a new task assignment."""
    db_task = TaskAssignment(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/tasks/project/{project_id}", response_model=list[TaskAssignmentResponse])
def get_project_assignments(project_id: int, db: Session = Depends(get_db)):
    """Get all task assignments for a project (used in ProjectDetail)."""
    tasks = db.query(TaskAssignment).filter(
        TaskAssignment.project_id == project_id
    ).all()
    return tasks


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_assignment(task_id: int, db: Session = Depends(get_db)):
    """Remove a worker assignment."""
    db_task = db.query(TaskAssignment).filter(TaskAssignment.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()


@router.patch("/tasks/{task_id}", response_model=TaskAssignmentResponse)
def update_task_status(task_id: int, task_update: TaskAssignmentUpdate, db: Session = Depends(get_db)):
    """Update task status."""
    db_task = db.query(TaskAssignment).filter(TaskAssignment.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.status = task_update.status
    db.commit()
    db.refresh(db_task)
    return db_task
