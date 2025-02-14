export const AIProcessor = {
    async process(text, promptType, model) {
      try {
        const response = await chrome.runtime.sendMessage({
          action: 'processText',
          text,
          prompt: this.getPrompt(promptType),
          model
        });
  
        return this.formatResponse(response);
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
      return prompts[type] || type; // Allow custom prompts
    },
  
    formatResponse(response) {
      return {
        ...response,
        formattedText: MarkdownHelper.format(response.text),
        timestamp: new Date().toISOString()
      };
    },
  
    handleError(error) {
      const errors = {
        'API Error': 'Service unavailable. Try again later.',
        'Quota Exceeded': 'Free tier limit reached',
        'Network Error': 'Check internet connection'
      };
      return new Error(errors[error.message] || 'Processing failed');
    }
  };