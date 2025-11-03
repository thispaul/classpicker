// Background service worker for ClassPicker
console.log('ClassPicker background script loaded');

// Configure side panel to be tab-specific (not global)
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => {
  console.error('Error setting panel behavior:', error);
});

// Enable/disable extension icon based on whether we're on ClassPass
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('classpass.com')) {
      // Enable the extension icon on ClassPass pages
      await chrome.sidePanel.setOptions({
        tabId,
        path: 'sidepanel.html',
        enabled: true
      });
      chrome.action.enable(tabId);
      chrome.action.setTitle({ tabId: tabId, title: 'ClassPicker - Click to open' });
    } else {
      // Disable on other pages
      await chrome.sidePanel.setOptions({
        tabId,
        enabled: false
      });
      chrome.action.disable(tabId);
      chrome.action.setTitle({ tabId: tabId, title: 'ClassPicker - Only works on classpass.com' });
    }
  }
});

// Also check when tabs are activated (switched to)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    if (tab.url.includes('classpass.com')) {
      await chrome.sidePanel.setOptions({
        tabId: activeInfo.tabId,
        path: 'sidepanel.html',
        enabled: true
      });
      chrome.action.enable(activeInfo.tabId);
      chrome.action.setTitle({ tabId: activeInfo.tabId, title: 'ClassPicker - Click to open' });
    } else {
      await chrome.sidePanel.setOptions({
        tabId: activeInfo.tabId,
        enabled: false
      });
      chrome.action.disable(activeInfo.tabId);
      chrome.action.setTitle({ tabId: activeInfo.tabId, title: 'ClassPicker - Only works on classpass.com' });
    }
  }
});

// Removed the onClicked handler since openPanelOnActionClick handles opening

// Listen for side panel being opened/closed via other means
chrome.runtime.onConnect.addListener((port) => {
  console.log('Side panel connected');
  sidePanelOpen = true;
  
  port.onDisconnect.addListener(() => {
    console.log('Side panel disconnected');
    sidePanelOpen = false;
  });
});
