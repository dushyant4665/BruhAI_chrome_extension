let tooltip;

document.addEventListener("selectionchange", () => {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
        const range = window.getSelection().getRangeAt(0).getBoundingClientRect();
        showTooltip(range.left + window.scrollX, range.top + window.scrollY, selection);
    } else {
        removeTooltip();
    }
});

function showTooltip(x, y, text) {
    removeTooltip(); // Purana tooltip remove karo

    tooltip = document.createElement("div");
    tooltip.innerText = "💡 AI Explain";
    tooltip.style.position = "absolute";
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y + 20}px`;
    tooltip.style.background = "#222";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "6px 10px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.fontSize = "12px";
    tooltip.style.cursor = "pointer";
    tooltip.style.zIndex = "9999";
    tooltip.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.3)";
    tooltip.style.transition = "opacity 0.2s ease-in-out";
    
    tooltip.addEventListener("click", () => {
        sendToAI(text);
        removeTooltip();  // Tooltip remove after click
    });

    document.body.appendChild(tooltip);
}

function removeTooltip() {
    if (tooltip) {
        tooltip.remove();
        tooltip = null;
    }
}

function sendToAI(text) {
    fetch("http://localhost:8000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    })
    .then(response => response.json())
    .then(data => showPopup(data.explanation))
    .catch(error => console.error("Error:", error));
}

function showPopup(responseText) {
    const popup = document.createElement("div");
    popup.innerText = responseText;
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.background = "#333";
    popup.style.color = "#fff";
    popup.style.padding = "15px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    popup.style.maxWidth = "300px";
    popup.style.zIndex = "10000";

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
}
