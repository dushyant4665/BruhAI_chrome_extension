export async function processWithGemini(text, prompt) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${prompt}:\n\n${text}`
          }]
        }]
      })
    });
  
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }