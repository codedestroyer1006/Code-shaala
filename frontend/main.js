document.addEventListener("DOMContentLoaded", () => {
    const runButton = document.getElementById("runButton");
    const languageSelector = document.getElementById("language");
    const codeEditor = document.getElementById("codeEditor");
    const outputBox = document.getElementById("output");
    const inputBox = document.getElementById("input-box");

    // 🔗 Backend URL hosted on Render
    const BACKEND_URL = "https://code-shaala-backend.onrender.com";

    console.log("🌐 Frontend running at:", window.location.origin);
    console.log("🔗 Connected to backend at:", BACKEND_URL);

    let inputQueue = [];

    // Validate all required elements exist
    if (!runButton || !languageSelector || !codeEditor || !outputBox || !inputBox) {
        console.error("❌ One or more required elements are missing in the HTML.");
        return;
    }

    // 🔘 Run Code Button Click Handler
    runButton.addEventListener("click", async () => {
        const language = languageSelector.value;
        const code = codeEditor.value;

        if (!language || !code) {
            outputBox.innerText = "❌ Please select a language and enter your code.";
            return;
        }

        outputBox.innerText = "⏳ Running code...";
        inputBox.style.display = "none";
        inputQueue = [];

        try {
            const response = await fetch(`${BACKEND_URL}/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, code }),
            });

            const result = await response.json();
            console.log("✅ Backend response:", result);

            if (result.requires_input) {
                outputBox.innerText = result.output || "⏳ Waiting for input...";
                inputBox.style.display = "block";
                inputBox.focus();
            } else {
                outputBox.innerText = result.output || result.error || "❌ No output received.";
            }
        } catch (error) {
            outputBox.innerText = "❌ Unable to connect to the backend.";
            console.error("❌ Fetch error:", error);
        }
    });

    // ⌨️ Handle user input when backend requires it
    inputBox.addEventListener("keypress", async (e) => {
        if (e.key !== "Enter") return;

        const userInput = inputBox.value.trim();
        if (!userInput) return;

        inputQueue.push(userInput);
        outputBox.innerText += `\n> ${userInput}\n`;
        inputBox.value = "";

        try {
            const response = await fetch(`${BACKEND_URL}/execute_input`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: userInput }),
            });

            const result = await response.json();

            if (result.requires_input) {
                outputBox.innerText += result.output || "";
                inputBox.focus();
            } else {
                outputBox.innerText += result.output || result.error || "";
                inputBox.style.display = "none";
            }
        } catch (error) {
            outputBox.innerText += "\n❌ Error sending input to backend.";
            console.error("❌ Input error:", error);
        }
    });
});
