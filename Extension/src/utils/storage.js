export const storage = {
  set: (key, value) => {
      return new Promise((resolve) => {
          chrome.storage.local.set({ [key]: value }, () => resolve());
      });
  },

  get: (key) => {
      return new Promise((resolve) => {
          chrome.storage.local.get([key], (result) => resolve(result[key]));
      });
  },

  remove: (key) => {
      return new Promise((resolve) => {
          chrome.storage.local.remove([key], () => resolve());
      });
  }
};
