chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'ai-assistant',
    title: 'BruhAi: %s',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ai-assistant') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'processSelection',
      text: info.selectionText
    });
  }
});