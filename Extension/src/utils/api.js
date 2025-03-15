
const API_BASE = import.meta.env.VITE_API_URL || 'https://bookish-fortnight-6996pvpwqg4wcrjx.github.dev/';

export const AIProcessor = {
  async process(text, promptType, model = 'gemini') {
    try {
      const response = await fetch(`${API_BASE}/api/v1/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          prompt: this.getPrompt(promptType),
          model
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.formatResponse(data);

    } catch (error) {
      throw this.handleError(error);
    }
  },

  getPrompt(type) {
    const prompts = {
      summarize: "Summarize this concisely:",
      explain: "Explain this code step-by-step:",
      debug: "Find and fix bugs in this code:",
      optimize: "Optimize this code for performance:"
    };
    return prompts[type] || type;
  },

  formatResponse(response) {
    return {
      ...response,
      formattedText: this.formatMarkdown(response.text),
      timestamp: new Date().toISOString()
    };
  },

  formatMarkdown(text) {
    // Add your markdown formatting logic here
    return text
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  },

  handleError(error) {
    const errorMap = {
      'API Error': 'Service unavailable. Try again later.',
      'Quota Exceeded': 'Free tier limit reached',
      'Network Error': 'Check internet connection',
      'Failed to fetch': 'Could not connect to the AI server'
    };
    
    return new Error(errorMap[error.message] || 'Processing failed');
  }
};
