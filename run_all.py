import subprocess
import os

# Paths to your project components
FRONTEND_DIR = "./Frontend"
BACKEND_DIR = "./Backend"
INDEX_SCRIPT = "./Backend/Functions/index.py"

# Start the processes
def start_all():
    try:
        # Start the Frontend (Next.js)
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"], cwd=FRONTEND_DIR, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        print("Frontend started at http://localhost:3000")

        # Start the Backend (FastAPI)
        backend_process = subprocess.Popen(
            ["uvicorn", "safetydata:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
            cwd=BACKEND_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print("Backend started at http://localhost:8000")

        # Start the Flask `index.py`
        flask_process = subprocess.Popen(
            ["python", INDEX_SCRIPT],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print("Flask app started at http://localhost:5000")

        # Wait for processes to finish
        frontend_process.wait()
        backend_process.wait()
        flask_process.wait()

    except KeyboardInterrupt:
        print("Shutting down all services...")

        # Kill all processes when interrupted
        frontend_process.terminate()
        backend_process.terminate()
        flask_process.terminate()

# Run the processes
if __name__ == "__main__":
    start_all()
