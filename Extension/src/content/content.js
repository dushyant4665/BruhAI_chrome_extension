// Listen for selection changes
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    chrome.runtime.sendMessage({
      action: 'textSelected',
      text: selection
    });
  }
});

// Handle context menu clicks
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processText') {
    // Process selected text through your backend
    fetch(import.meta.env.VITE_API_URL + '/api/v1/process', {
      method: 'POST',
      body: JSON.stringify({
        text: request.text,
        prompt: request.actionType
      })
    })
    .then(response => response.json())
    .then(data => {
      chrome.runtime.sendMessage({
        action: 'showResult',
        result: data.text
      });
    });
  }
});