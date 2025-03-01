class CodeAssistant {
  constructor() {
    this.API_BASE = 'http://localhost:6000/api/v1';
    this.initElements();
    this.initEventListeners();
    this.loadHistory();
    this.getSelectedText();
  }

  initElements() {
    this.elements = {
      input: document.getElementById('input'),
      result: document.getElementById('result'),
      loading: document.getElementById('loading'),
      history: document.getElementById('history'),
      copyBtn: document.getElementById('copy'),
      clearHistoryBtn: document.getElementById('clear-history')
    };
  }

  initEventListeners() {
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', e => this.handleAction(e.target.dataset.action));
    });

    this.elements.copyBtn.addEventListener('click', () => this.copyResult());
    this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
  }

  async getSelectedText() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getSelection' });
    if (response?.text) {
      this.elements.input.value = response.text;
    }
  }

  async handleAction(action) {
    const text = this.elements.input.value.trim();
    if (!text) return this.showError('Please select or enter some text');

    this.toggleLoading(true);
    
    try {
      const result = await this.processText(text, action);
      this.showResult(result);
      this.saveToHistory(action, result);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.toggleLoading(false);
    }
  }

  async processText(text, action) {
    const response = await fetch(`${this.API_BASE}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        prompt: action,
        model: 'gemini'
      })
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  showResult(data) {
    this.elements.result.textContent = data.text;
  }

  copyResult() {
    navigator.clipboard.writeText(this.elements.result.textContent);
  }

  toggleLoading(show) {
    this.elements.loading.classList.toggle('hidden', !show);
  }

  saveToHistory(action, result) {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    history.unshift({
      action,
      preview: result.text.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('history', history.slice(0, 20));
    this.loadHistory();
  }

  loadHistory() {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    this.elements.history.innerHTML = history.map(item => `
      <div class="history-item">
        <span>${item.action}: ${item.preview}</span>
        <small>${new Date(item.timestamp).toLocaleTimeString()}</small>
      </div>
    `).join('');
  }

  clearHistory() {
    localStorage.removeItem('history');
    this.loadHistory();
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
  }
}

// Initialize the app
new CodeAssistant();