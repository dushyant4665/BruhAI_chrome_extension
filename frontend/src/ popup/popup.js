document.addEventListener('DOMContentLoaded', () => {
  const actions = {
      summarize: "Summarize the selected content in bullet points:",
      explain: "Explain this code in simple terms:",
      debug: "Find and fix bugs in this code:",
      optimize: "Optimize this code for better performance:"
  };


  Object.entries(actions).forEach(([id, prompt]) => {
      document.getElementById(id).addEventListener('click', () => handleAction(prompt));
  });


  document.getElementById('customAction').addEventListener('click', () => {
      const customPrompt = document.getElementById('customPrompt').value;
      if (customPrompt) handleAction(customPrompt);
  });


  document.getElementById('copyResult').addEventListener('click', () => {
      navigator.clipboard.writeText(document.getElementById('result').innerText);
  });


  loadHistory();
});

async function handleAction(promptPrefix) {
  try {
      const selection = await getSelectedText();
      if (!selection) return showError('Please select some text first!');
      
      showLoading(true);
      const response = await processWithAI(selection, promptPrefix);
      
      showResult(response);
      addHistoryItem(promptPrefix, response);
  } catch (error) {
      showError(error.message);
  } finally {
      showLoading(false);
  }
}

async function getSelectedText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return chrome.tabs.sendMessage(tab.id, { action: 'getSelection' });
}

async function processWithAI(text, prompt) {

  const response = await fetch('YOUR_BACKEND_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, prompt })
  });
  
  if (!response.ok) throw new Error('AI processing failed');
  return response.json();
}

function showResult(content) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = marked.parse(content);
}

function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => errorDiv.style.display = 'none', 5000);
}

function addHistoryItem(prompt, response) {
  const historyItem = document.createElement('div');
  historyItem.className = 'flex items-center justify-between text-sm p-2 hover:bg-gray-700 rounded cursor-pointer';
  historyItem.innerHTML = `
      <div class="truncate flex-1">${prompt}</div>
      <button class="text-gray-400 hover:text-white px-2">
          <i class="fas fa-redo"></i>
      </button>
  `;
  historyItem.querySelector('button').addEventListener('click', () => {
      document.getElementById('result').innerHTML = marked.parse(response);
  });
  document.getElementById('historyList').prepend(historyItem);
}

function loadHistory() {
  chrome.storage.local.get(['history'], (result) => {
      if (result.history) {
          result.history.forEach(item => addHistoryItem(item.prompt, item.response));
      }
  });
}
