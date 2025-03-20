// src/popup/popup.js
class PopupManager {
    constructor() {
      this.history = [];
      this.init();
    }
  
    init() {
      chrome.storage.local.get(['history'], (result) => {
        this.history = result.history || [];
        this.renderHistory();
      });
  
      chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'NEW_RESPONSE') {
          this.history.unshift(message.data);
          this.renderHistory();
        }
      });
    }
  
    renderHistory() {
      const historyEl = document.querySelector('.history');
      historyEl.innerHTML = this.history
        .map(item => `
          <div class="result">
            <strong>${item.action}:</strong>
            <p>${item.text}</p>
          </div>
        `)
        .join('');
    }
  }
  
  new PopupManager();