document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    showFloatingButton(selectedText);
  } else {
    removeFloatingButton();
  }
});

let aiButton;

function showFloatingButton(text) {
  removeFloatingButton(); // Remove previous instance

  aiButton = document.createElement("button");
  aiButton.innerText = "🤖 AI";
  aiButton.style.position = "absolute";
  aiButton.style.background = "#007bff";
  aiButton.style.color = "#fff";
  aiButton.style.border = "none";
  aiButton.style.padding = "8px 12px";
  aiButton.style.borderRadius = "5px";
  aiButton.style.cursor = "pointer";
  aiButton.style.fontSize = "14px";
  aiButton.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.3)";

  const { x, y } = getSelectionCoords();
  aiButton.style.left = `${x}px`;
  aiButton.style.top = `${y + 20}px`;

  aiButton.addEventListener("click", () => sendToAI(text));

  document.body.appendChild(aiButton);
}

function removeFloatingButton() {
  if (aiButton) {
    aiButton.remove();
    aiButton = null;
  }
}

function getSelectionCoords() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return { x: 0, y: 0 };

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  return { x: rect.left + window.scrollX, y: rect.bottom + window.scrollY };
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
