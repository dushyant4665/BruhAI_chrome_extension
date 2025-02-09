
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'explain') {
    explainText(request.text)
      .then(explanation => sendResponse({explanation: explanation}))
      .catch(error => sendResponse({error: error.message}));
    return true;  // Will respond asynchronously
  }
});

async function explainText(text) {
  const apiKey = await chrome.storage.sync.get('openai_api_key');
  if (!apiKey.openai_api_key) {
    throw new Error('OpenAI API key not set. Please set it in the extension options.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.openai_api_key}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful assistant that explains code and text."},
        {"role": "user", "content": `Explain the following: ${text}`}
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
