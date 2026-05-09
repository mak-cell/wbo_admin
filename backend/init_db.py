"""
Database initialization and migration utilities
"""

from sqlalchemy import inspect
from app.models.base import Base
from app.models.models import User, Project, Event, Deliverable, Payment, TaskAssignment, WorkerPayout
from app.db.database import engine, SessionLocal
from app.models.enums import RoleEnum, ProjectStatusEnum


def init_db():
    """Initialize database by creating all tables."""
    # Drop all existing tables
    Base.metadata.drop_all(bind=engine)
    # Create all tables with new schema
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")


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
