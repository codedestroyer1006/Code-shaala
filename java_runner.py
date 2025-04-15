import subprocess
import os
import re

def run_java(code):
    # Extract public class name
    match = re.search(r'public\s+class\s+(\w+)', code)
    if not match:
        return {"error": "No public class found in code."}
    
    class_name = match.group(1)
    filename = f"{class_name}.java"

    try:
        # Write Java code to file
        with open(filename, "w", encoding="utf-8") as f:
            f.write(code)

        # Compile Java file
        compile_process = subprocess.run(
            ["javac", filename], capture_output=True, text=True
        )
        if compile_process.returncode != 0:
            return {"error": "Compilation failed", "details": compile_process.stderr}

        # Run the class
        run_process = subprocess.run(
            ["java", "-cp", ".", class_name],
            capture_output=True,
            text=True,
            timeout=5
        )
        if run_process.returncode != 0:
            return {"error": "Runtime Error", "details": run_process.stderr}

        return {"output": run_process.stdout}

    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out"}

    finally:
        # Clean up files
        if os.path.exists(filename):
            os.remove(filename)
        class_file = f"{class_name}.class"
        if os.path.exists(class_file):
            os.remove(class_file)
