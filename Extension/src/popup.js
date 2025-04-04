document.addEventListener("DOMContentLoaded", function () {
    console.log("Popup.js loaded ✅");

    const summarizeBtn = document.getElementById("summarizeBtn");
    const explainBtn = document.getElementById("explainBtn");
    const expandBtn = document.getElementById("expandBtn");
    const userInput = document.getElementById("userInput");
    const output = document.getElementById("output");

    if (!summarizeBtn || !explainBtn || !expandBtn || !userInput || !output) {
        console.error("❌ One or more elements missing!");
        return;
    }

    async function fetchAIResponse(action) {
        const text = userInput.value.trim();
        if (!text) {
            output.innerHTML = `<p class="error">⚠️ Please enter or select text!</p>`;
            return;
        }

        output.innerHTML = `<p class="loading">⏳ Generating response...</p>`;

        try {
            const response = await fetch("http://localhost:8000/api/mistral", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistral",  // ✅ Ensure model is included
                    prompt: `${action}: ${text}`,  // ✅ Match server expectation
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            if (data.response) {
                output.innerHTML = `<p class="result">${data.response}</p>`;
            } else {
                output.innerHTML = `<p class="error">❌ No response from AI.</p>`;
            }
        } catch (error) {
            console.error("API Error:", error);
            output.innerHTML = `<p class="error">⚠️ Server not responding!</p>`;
        }
    }

    summarizeBtn.addEventListener("click", () => fetchAIResponse("summarize"));
    explainBtn.addEventListener("click", () => fetchAIResponse("explain"));
    expandBtn.addEventListener("click", () => fetchAIResponse("expand"));
});
