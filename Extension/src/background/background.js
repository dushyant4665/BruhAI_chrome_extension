
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'processCode') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
    });
    return true;
  }
});
