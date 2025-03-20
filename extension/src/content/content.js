
class SelectionManager {
    constructor() {
      this.selectedText = '';
      this.initListeners();
    }
  
    initListeners() {
      document.addEventListener('dblclick', this.handleDoubleClick.bind(this));
      document.addEventListener('selectionchange', this.handleSelection.bind(this));
    }
  
    handleSelection() {
      this.selectedText = window.getSelection().toString().trim();
    }
  
    handleDoubleClick() {
      if (this.selectedText) {
        this.showTooltip();
      }
    }
  
    showTooltip() {
      const tooltip = document.createElement('div');
      tooltip.id = 'ai-assistant-tooltip';
      tooltip.innerHTML = `
        <div class="tooltip">
          <div class="actions">
            <button data-action="explain">Explain</button>
            <button data-action="summarize">Summarize</button>
            <button data-action="optimize">Optimize</button>
          </div>
          <div class="result"></div>
        </div>
      `;
  
      const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
      tooltip.style.position = 'absolute';
      tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
      tooltip.style.left = `${rect.left + window.scrollX}px`;
  
      document.body.appendChild(tooltip);
      this.addTooltipListeners(tooltip);
    }
  
    addTooltipListeners(tooltip) {
      tooltip.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const action = e.target.dataset.action;
          const response = await chrome.runtime.sendMessage({
            type: 'PROCESS_TEXT',
            text: this.selectedText,
            action
          });
          
          tooltip.querySelector('.result').textContent = response.text;
        });
      });
  
      document.addEventListener('click', (e) => {
        if (!tooltip.contains(e.target)) {
          tooltip.remove();
        }
      }, { once: true });
    }
  }
  
  new SelectionManager();
