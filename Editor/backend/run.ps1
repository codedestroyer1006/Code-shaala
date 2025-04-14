# PowerShell script to run FastAPI server

# Install dependencies
pip install --no-cache-dir -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000

# to execute this run :
# Set-ExecutionPolicy Unrestricted -Scope Process -Force
# .\run.ps1

