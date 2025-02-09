import subprocess
import os
import time
from dotenv import load_dotenv  # Load environment variables

# Load environment variables from .env file
dotenv_path = os.path.join("Backend", ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    print("✅ Loaded environment variables from .env")

# Paths to your project components
FRONTEND_DIR = "./Frontend"
BACKEND_DIR = "./Backend"
INDEX_SCRIPT = "./Backend/index.py"

# Start the processes
def start_all():
    try:
        # Start the Frontend (Next.js)
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"], cwd=FRONTEND_DIR, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        print("🚀 Frontend started at http://localhost:3000")

        # Start the Backend (FastAPI - Combined)
        backend_process = subprocess.Popen(
            ["uvicorn", "mainapi:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
            cwd=BACKEND_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print("🛡️ Backend (City & Safety Data) API started at http://localhost:8000")

        # Start the Flask `index.py`
        flask_process = subprocess.Popen(
            ["python", INDEX_SCRIPT],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print("🤖 Chatbot Flask API started at http://localhost:5000")

        # Wait for processes to finish
        frontend_process.wait()
        backend_process.wait()
        flask_process.wait()

    except KeyboardInterrupt:
        print("🛑 Shutting down all services...")

        # Kill all processes when interrupted
        frontend_process.terminate()
        backend_process.terminate()
        flask_process.terminate()

# Run the processes
if __name__ == "__main__":
    start_all()
