export const Storage = {
    async get(key) {
      return new Promise(resolve => {
        chrome.storage.local.get([key], result => resolve(result[key]));
      });
    },
  
    async set(key, value) {
      return new Promise(resolve => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    },
  
    async cacheResponse(prompt, response) {
      const history = await this.get('history') || [];
      history.unshift({ prompt, response, date: new Date() });
      await this.set('history', history.slice(0, 50)); // Keep last 50 items
    },
  
    async getHistory() {
      return this.get('history') || [];
    },
  
    async clearHistory() {
      await this.set('history', []);
    }
  };