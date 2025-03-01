chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelection') {
    sendResponse({ text: window.getSelection().toString().trim() });
  }
  return true;
});