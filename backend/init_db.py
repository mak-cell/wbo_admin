"""
Database initialization and migration utilities
"""

from sqlalchemy import inspect, text
from app.models.base import Base
from app.models.models import User, Project, Event, Deliverable, Payment, TaskAssignment, WorkerPayout
from app.db.database import engine, SessionLocal
from app.models.enums import RoleEnum, ProjectStatusEnum


def init_db():
    """Initialize database by creating all tables (preserves existing data)."""
    # Create tables if they don't exist (safe for existing data)
    Base.metadata.create_all(bind=engine)
    print("Database tables verified/created successfully")
    
    # Run migrations for new columns on existing tables
    migrate_deliverables_table()
    migrate_task_assignments_table()


def migrate_deliverables_table():
    """Add new columns to deliverables table if missing (SQLite migration)."""
    inspector = inspect(engine)
    if "deliverables" not in inspector.get_table_names():
        return  # Table will be created fresh by create_all
    
    existing_columns = {col["name"] for col in inspector.get_columns("deliverables")}
    
    with engine.connect() as conn:
        if "description" not in existing_columns:
            conn.execute(text("ALTER TABLE deliverables ADD COLUMN description TEXT"))
            print("  + Added 'description' column to deliverables")
        if "status" not in existing_columns:
            conn.execute(text("ALTER TABLE deliverables ADD COLUMN status VARCHAR DEFAULT 'Pending'"))
            print("  + Added 'status' column to deliverables")
        if "due_date" not in existing_columns:
            conn.execute(text("ALTER TABLE deliverables ADD COLUMN due_date DATE"))
            print("  + Added 'due_date' column to deliverables")
        conn.commit()


def migrate_task_assignments_table():
    """Add event_id column to task_assignments if missing."""
    inspector = inspect(engine)
    if "task_assignments" not in inspector.get_table_names():
        return
    
    existing_columns = {col["name"] for col in inspector.get_columns("task_assignments")}
    
    with engine.connect() as conn:
        if "event_id" not in existing_columns:
            conn.execute(text("ALTER TABLE task_assignments ADD COLUMN event_id INTEGER REFERENCES events(id)"))
            print("  + Added 'event_id' column to task_assignments")
        if "deliverable_id" not in existing_columns:
            conn.execute(text("ALTER TABLE task_assignments ADD COLUMN deliverable_id INTEGER REFERENCES deliverables(id)"))
            print("  + Added 'deliverable_id' column to task_assignments")
        conn.commit()


def create_sample_data():
    """Create sample data for testing."""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        user_count = db.query(User).count()
        if user_count > 0:
            print("Sample data already exists")
            return
        
        # Create sample users
        user1 = User(
            name="Raj Kumar",
            contact="9876543210",
            role=RoleEnum.ADMIN
        )
        user2 = User(
            name="Priya Singh",
            contact="9876543211",
            role=RoleEnum.SHOOTER
        )
        user3 = User(
            name="Amit Patel",
            contact="9876543212",
            role=RoleEnum.EDITOR
        )
        
        db.add_all([user1, user2, user3])
        db.commit()
        
        # Create sample project
        project = Project(
            client_name="Sharma Wedding",
            event_title="Both Side Prewedding",
            location="Delhi",
            contact_number="9999999999",
            instagram_reference="sharma_weds",
            total_budget=500000,
            status=ProjectStatusEnum.IN_PROGRESS
        )
        
        db.add(project)
        db.commit()
        
        print("Sample data created successfully")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    create_sample_data()
