
// Handle text selection and context menu
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelection') {
      sendResponse({ text: window.getSelection().toString() });
    }
  });
  
  // Right-click context menu
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'aiAssistant',
      title: 'AI Assistant: %s',
      contexts: ['selection']
    });
  });
