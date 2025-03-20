
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'PROCESS_TEXT') {
      fetch('http://localhost:6000/api/v1/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: request.text,
          prompt: request.action,
          model: 'gemini'
        })
      })
      .then(res => res.json())
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
      return true; // Keep message channel open for async response
    }
  });
