export const ErrorHandler = {
    track(error, context) {
      console.error(`[AI Assistant] ${context}:`, error);
      chrome.runtime.sendMessage({
        action: 'logAnalytics',
        event: 'error',
        data: {
          message: error.message,
          stack: error.stack,
          context
        }
      });
    },
  
    showUserError(message) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'AI Assistant Error',
        message
      });
    }
  };