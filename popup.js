
document.addEventListener('DOMContentLoaded', function() {
  const inputTextarea = document.getElementById('input');
  const explainButton = document.getElementById('explain-btn');
  const resultDiv = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');

  explainButton.addEventListener('click', function() {
    const inputText = inputTextarea.value.trim();
    if (inputText) {
      loadingDiv.classList.remove('hidden');
      resultDiv.textContent = '';
      
      chrome.runtime.sendMessage({action: 'explain', text: inputText}, function(response) {
        loadingDiv.classList.add('hidden');
        if (response && response.explanation) {
          resultDiv.textContent = response.explanation;
        } else {
          resultDiv.textContent = 'Error: Unable to get explanation.';
        }
      });
    } else {
      resultDiv.textContent = 'Please enter some text or code to explain.';
    }
  });
});
