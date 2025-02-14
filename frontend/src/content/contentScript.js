// Selection Manager
let lastSelection = '';
const selectionIndicator = createSelectionIndicator();

document.addEventListener('selectionchange', handleSelection);
chrome.runtime.onMessage.addListener(handleMessages);

function handleSelection() {
  const selection = window.getSelection().toString().trim();
  if (selection && selection !== lastSelection) {
    lastSelection = selection;
    showSelectionIndicator();
    chrome.runtime.sendMessage({
      action: 'logAnalytics',
      event: 'textSelected',
      data: { length: selection.length }
    });
  }
}

function createSelectionIndicator() {
  const indicator = document.createElement('div');
  Object.assign(indicator.style, {
    position: 'fixed',
    background: 'rgba(99, 102, 241, 0.2)',
    border: '2px solid #6366f1',
    borderRadius: '4px',
    pointerEvents: 'none',
    zIndex: '9999',
    transition: 'all 0.2s ease'
  });
  document.body.appendChild(indicator);
  return indicator;
}

function showSelectionIndicator() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const rect = selection.getRangeAt(0).getBoundingClientRect();
  Object.assign(selectionIndicator.style, {
    left: `${rect.left - 5}px`,
    top: `${rect.top - 5}px`,
    width: `${rect.width + 10}px`,
    height: `${rect.height + 10}px`,
    opacity: '1'
  });

  setTimeout(() => {
    selectionIndicator.style.opacity = '0';
  }, 1000);
}

function handleMessages(request, sender, sendResponse) {
  if (request.action === 'getSelection') {
    sendResponse({ text: lastSelection });
  }
}