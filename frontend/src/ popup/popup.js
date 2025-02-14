import { processText } from '../utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Button handlers
  const actions = {
    summarize: 'Summarize this content',
    explain: 'Explain this code in detail',
    debug: 'Find and fix bugs in this code',
    optimize: 'Optimize this code for better performance'
  };

  for (const [id, prompt] of Object.entries(actions)) {
    document.getElementById(id).addEventListener('click', async () => {
      const text = await getSelectedText();
      if (!text) return showError('No text selected!');
      
      toggleLoading(true);
      try {
        const model = document.getElementById('aiModel').value;
        const result = await processText(text, prompt, model);
        showResult(result);
      } catch (error) {
        showError(error.message);
      } finally {
        toggleLoading(false);
      }
    });
  }

  // Copy button
  document.getElementById('copy').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('result').innerText);
  });
});

async function getSelectedText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return chrome.tabs.sendMessage(tab.id, { action: 'getSelection' });
}

function showResult(text) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = marked.parse(text); // Using marked.js for markdown
}

function toggleLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<div class="text-red-400">${message}</div>`;
}