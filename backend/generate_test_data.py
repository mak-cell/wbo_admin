"""
Test data generator for development
"""

from datetime import date, timedelta
from app.db.database import SessionLocal
from app.models.models import User, Project, Event, Deliverable, Payment, TaskAssignment
from app.models.enums import RoleEnum, ProjectStatusEnum

def generate_test_data():
    """Generate comprehensive test data"""
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(TaskAssignment).delete()
        db.query(Payment).delete()
        db.query(Deliverable).delete()
        db.query(Event).delete()
        db.query(Project).delete()
        db.query(User).delete()
        db.commit()
        
        # Create users
        users = [
            User(name="Raj Kumar", contact="9876543210", role=RoleEnum.ADMIN),
            User(name="Priya Singh", contact="9876543211", role=RoleEnum.SHOOTER),
            User(name="Amit Patel", contact="9876543212", role=RoleEnum.EDITOR),
            User(name="Neha Verma", contact="9876543213", role=RoleEnum.SHOOTER),
            User(name="Vikram Singh", contact="9876543214", role=RoleEnum.EDITOR),
        ]
        db.add_all(users)
        db.flush()
        
        # Create projects
        projects = [
            Project(
                client_name="Sharma Wedding",
                event_title="Sharma Prewedding + Wedding",
                location="Delhi",
                contact_number="9999999999",
                total_budget=500000,
                status=ProjectStatusEnum.IN_PROGRESS,
            ),
            Project(
                client_name="Patel Engagement",
                event_title="Patel Engagement Ceremony",
                location="Mumbai",
                contact_number="9999999998",
                total_budget=300000,
                status=ProjectStatusEnum.PENDING,
            ),
            Project(
                client_name="Gupta Mehendi",
                event_title="Gupta Mehendi & Sangeet",
                location="Bangalore",
                contact_number="9999999997",
                total_budget=400000,
                status=ProjectStatusEnum.REVIEW,
            ),
            Project(
                client_name="Verma Reception",
                event_title="Verma Grand Reception",
                location="Hyderabad",
                contact_number="9999999996",
                total_budget=600000,
                status=ProjectStatusEnum.DELIVERED,
            ),
        ]
        db.add_all(projects)
        db.flush()
        
        # Create events
        events = [
            Event(project_id=1, event_type="Pre-wedding", event_date=date.today() - timedelta(days=10)),
            Event(project_id=1, event_type="Wedding", event_date=date.today() + timedelta(days=5)),
            Event(project_id=2, event_type="Engagement", event_date=date.today() + timedelta(days=15)),
            Event(project_id=3, event_type="Mehendi", event_date=date.today() + timedelta(days=25)),
            Event(project_id=4, event_type="Reception", event_date=date.today() - timedelta(days=5)),
        ]
        db.add_all(events)
        db.flush()
        
        # Create deliverables
        deliverables = [
            Deliverable(
                project_id=1,
                category="Photos",
                details={"edited_count": 500, "album_pages": 30, "prints": 100}
            ),
            Deliverable(
                project_id=1,
                category="Videos",
                details={"edited_count": 5, "duration_hours": 2, "resolution": "4K"}
            ),
            Deliverable(
                project_id=2,
                category="Reels",
                details={"edited_count": 10, "duration_sec": 300}
            ),
            Deliverable(
                project_id=3,
                category="Photos",
                details={"edited_count": 300, "album_pages": 20}
            ),
            Deliverable(
                project_id=4,
                category="Photos",
                details={"edited_count": 400, "album_pages": 25, "prints": 80}
            ),
        ]
        db.add_all(deliverables)
        db.flush()
        
        # Create payments
        payments = [
            Payment(project_id=1, milestone="Advance (15%)", amount=75000, is_paid=True),
            Payment(project_id=1, milestone="On Event (50%)", amount=250000, is_paid=False),
            Payment(project_id=1, milestone="Final (35%)", amount=175000, is_paid=False),
            Payment(project_id=2, milestone="Advance (20%)", amount=60000, is_paid=True),
            Payment(project_id=2, milestone="Final (80%)", amount=240000, is_paid=False),
            Payment(project_id=3, milestone="Full Payment", amount=400000, is_paid=False),
            Payment(project_id=4, milestone="Full Payment", amount=600000, is_paid=True),
        ]
        db.add_all(payments)
        db.flush()
        
        # Create task assignments
        tasks = [
            TaskAssignment(
                worker_id=2,
                project_id=1,
                task_description="Shoot pre-wedding events",
                status=ProjectStatusEnum.COMPLETED,
            ),
            TaskAssignment(
                worker_id=3,
                project_id=1,
                task_description="Edit wedding photos",
                status=ProjectStatusEnum.IN_PROGRESS,
            ),
            TaskAssignment(
                worker_id=2,
                project_id=2,
                task_description="Shoot engagement ceremony",
                status=ProjectStatusEnum.PENDING,
            ),
            TaskAssignment(
                worker_id=4,
                project_id=3,
                task_description="Shoot mehendi event",
                status=ProjectStatusEnum.IN_PROGRESS,
            ),
            TaskAssignment(
                worker_id=5,
                project_id=3,
                task_description="Edit mehendi videos",
                status=ProjectStatusEnum.PENDING,
            ),
        ]
        db.add_all(tasks)
        
        db.commit()
        print("✓ Test data generated successfully!")
        
    except Exception as e:
        print(f"✗ Error generating test data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    generate_test_data()
