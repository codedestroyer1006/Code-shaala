document.addEventListener("DOMContentLoaded", function () {
    const runButton = document.getElementById("runButton");
    const languageSelector = document.getElementById("language");
    const codeEditor = document.getElementById("codeEditor");
    const outputBox = document.getElementById("output");
    const inputBox = document.getElementById("input-box");

    // ✅ Deployed backend URL
    const BACKEND_URL = "https://code-shaala-backend-3.onrender.com";

    let inputQueue = [];

    if (!runButton || !languageSelector || !codeEditor || !outputBox || !inputBox) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    runButton.addEventListener("click", async function () {
        const language = languageSelector.value;
        const code = codeEditor.value;

        if (!language || !code) {
            outputBox.innerText = "❌ Error: Missing language or code.";
            return;
        }

        try {
            outputBox.innerText = "⏳ Running...";
            inputBox.style.display = "none";
            inputQueue = [];

            const response = await fetch(`${BACKEND_URL}/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, code }),
            });

            const result = await response.json();
            console.log("Server Response:", result);

            if (result.requires_input) {
                outputBox.innerText = result.output || "";
                inputBox.style.display = "block";
                inputBox.focus();
            } else {
                outputBox.innerText = result.output || result.error || "❌ Error: No output received.";
            }
        } catch (error) {
            outputBox.innerText = "❌ Failed to connect to the server.";
            console.error(error);
        }
    });

    inputBox.addEventListener("keypress", async function (e) {
        if (e.key === "Enter") {
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
                console.error(error);
            }
        }
    });
});
