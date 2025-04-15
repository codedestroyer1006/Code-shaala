from flask import Flask, request, jsonify
from flask_cors import CORS
from compilers.cpp_runner import run_cpp
from compilers.java_runner import run_java
from compilers.js_runner import run_js
from compilers.python_runner import run_python

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    language = data.get("language")
    code = data.get("code")
    
    if not language or not code:
        return jsonify({"error": "Missing language or code"}), 400
    
    # Select the correct compiler based on language
    if language == "cpp":
        result = run_cpp(code)
    elif language == "java":
        result = run_java(code)
    elif language == "javascript":
        result = run_js(code)
    elif language == "python":
        result = run_python(code)
    else:
        return jsonify({"error": "Unsupported language"}), 400
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)