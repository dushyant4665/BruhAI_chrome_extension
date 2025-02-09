const API_ENDPOINT = 'https://holy-mode-fa73.dushyantkhandelwal4665.workers.dev/';

document.getElementById('explain-btn').addEventListener('click', async () => {
  const input = document.getElementById('input').value.trim();
  const resultDiv = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');

  if (!input) return;
  console.log(input)

  loadingDiv.classList.remove('hidden');
  resultDiv.textContent = 'display';

  try {
  
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getSecureKey()}` 
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Explain this code in simple terms: \n\n${input}\n\n Keep response under 200 words.`
        }]
      })
    });

    console.log(response)
    const data = await response.json();
    resultDiv.textContent = data.choices[0].message.content;
  } catch (error) {
    resultDiv.textContent = `Error: ${error.message}`;
  } finally {
    loadingDiv.classList.add('hidden');
  }
});

async function getSecureKey() {
  const { apiKey } = await chrome.storage.local.get('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');
  return apiKey || prompt("Please enter your OpenAI API key:");
}