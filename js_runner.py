import subprocess

def run_js(code):
    filename = "script.js"

    try:
        # Write JavaScript code to file
        with open(filename, "w") as f:
            f.write(code)

        # Run JavaScript using Node.js
        run_process = subprocess.run(
            ["node", filename], capture_output=True, text=True, timeout=5
        )

        # Check for errors
        if run_process.returncode != 0:
            return {"error": "Runtime Error", "details": run_process.stderr}

        return {"output": run_process.stdout}

    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out"}

    finally:
        # Clean up
        import os
        if os.path.exists(filename):
            os.remove(filename)
