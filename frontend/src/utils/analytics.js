export const Analytics = {
    track(event, data) {
      if (this.isTrackingEnabled()) {
        chrome.runtime.sendMessage({
          action: 'logAnalytics',
          event,
          data
        });
      }
    },
  
    async isTrackingEnabled() {
      const { settings } = await Storage.get('settings');
      return settings?.analyticsEnabled ?? true;
    }
  };