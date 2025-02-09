import subprocess
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="./Backend/.env")

# Paths to your project components
FRONTEND_DIR = "./Frontend"
BACKEND_DIR = "./Backend"
INDEX_SCRIPT = "./Backend/index.py"

def start_all():
    try:
        # ✅ Install frontend dependencies first
        print("Installing frontend dependencies...")
        subprocess.Popen(["npm", "install"], cwd=FRONTEND_DIR).wait()

        # ✅ Start the Frontend (Next.js)
        frontend_process = subprocess.Popen(["npm", "run", "dev"], cwd=FRONTEND_DIR)
        print("Frontend started at http://localhost:3000")

        # ✅ Start the Backend (FastAPI - Unified)
        backend_process = subprocess.Popen(
            ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
            cwd=BACKEND_DIR,
            env=os.environ,
        )
        print("Backend started at http://localhost:8000")

        # ✅ Start the Flask `index.py`
        flask_process = subprocess.Popen(["python", INDEX_SCRIPT], env=os.environ)
        print("Flask app started at http://localhost:5000")

        # ✅ Wait for processes to finish
        frontend_process.wait()
        backend_process.wait()
        flask_process.wait()

    except KeyboardInterrupt:
        print("Shutting down all services...")

        # ✅ Kill all processes completely
        frontend_process.kill()
        backend_process.kill()
        flask_process.kill()

# Run the processes
if __name__ == "__main__":
    start_all()
