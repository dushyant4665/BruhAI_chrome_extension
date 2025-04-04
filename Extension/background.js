chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background.js:", message);

    if (["summarize", "explain", "expand"].includes(message.action)) {
        fetch("http://localhost:8000/api/mistral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: message.action, text: message.text })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ success: true, response: data.response });
        })
        .catch(error => {
            console.error("Fetch error:", error);
            sendResponse({ success: false, message: "Server error" });
        });

        return true; // Keeps the message channel open for async response
    }
});
