// Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(initializeExtension);
chrome.runtime.onMessage.addListener(handleMessages);

// Initialize default settings and context menu
function initializeExtension() {
  // Set default configuration
  chrome.storage.local.set({
    settings: {
      aiModel: 'gemini',
      theme: 'dark',
      apiEndpoint: 'https://your-api.com/v1/process'
    }
  });

  // Create context menu
  chrome.contextMenus.create({
    id: 'aiAssistant',
    title: 'AI Assistant: %s', 
    contexts: ['selection']
  });
}

// Handle messages from popup/content scripts
function handleMessages(request, sender, sendResponse) {
  switch(request.action) {
    case 'processText':
      handleTextProcessing(request, sender, sendResponse);
      break;
    case 'logAnalytics':
      handleAnalytics(request);
      break;
    case 'getSettings':
      chrome.storage.local.get('settings', sendResponse);
      return true; // Async response
  }
}

async function handleTextProcessing({ text, prompt, model }, sender) {
  try {
    // Get API key from secure storage
    const { settings } = await chrome.storage.local.get('settings');
    const apiKey = await chrome.storage.session.get('apiKey');
    
    // Process with AI
    const response = await fetch(settings.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ text, prompt, model })
    });

    if (!response.ok) throw new Error('API Error');
    return response.json();
  } catch (error) {
    console.error('Processing Error:', error);
    throw error;
  }
}