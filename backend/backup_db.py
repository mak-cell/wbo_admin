import os
import shutil
from datetime import datetime

def backup_database():
    """Manually backup the SQLite database."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, "test.db")
    backup_dir = os.path.join(base_dir, "backups")
    
    # Create backups directory if it doesn't exist
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return
        
    # Generate timestamped backup filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"backup_{timestamp}.db"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    try:
        shutil.copy2(db_path, backup_path)
        print(f"✅ Database successfully backed up to: {backup_path}")
    except Exception as e:
        print(f"❌ Failed to backup database: {str(e)}")

if __name__ == "__main__":
    backup_database()
