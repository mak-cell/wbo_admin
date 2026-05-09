"""
Run this script to start the development server
"""

import subprocess
import sys

if __name__ == "__main__":
    print("Starting Weddingbellodisha Studio Management System...")
    print("\nBackend API: http://localhost:8000")
    print("API Docs: http://localhost:8000/docs")
    print("\nFrontend: http://localhost:3000")
    
    # Run backend
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"
        ])
    except KeyboardInterrupt:
        print("\nServer stopped")
