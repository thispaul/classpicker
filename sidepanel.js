// Side panel JavaScript
console.log('Side panel loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready, initializing side panel');

  // Connect to background script to track side panel state
  const port = chrome.runtime.connect({ name: 'sidepanel' });

  // Get references to UI elements
  const maxCostSelect = document.getElementById('maxCost');
  const durationSelect = document.getElementById('minDuration');
  const clearButton = document.getElementById('clearFilters');
  const statusDiv = document.getElementById('status');
  const resultsCount = document.getElementById('resultsCount');

  // Populate max cost dropdown with values 1-100
  for (let i = 1; i <= 100; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i} credit${i === 1 ? '' : 's'}`;
    maxCostSelect.appendChild(option);
  }

  // Load saved filter settings from storage
  chrome.storage.local.get(['filters'], (result) => {
    if (result.filters) {
      if (result.filters.maxCost) {
        maxCostSelect.value = result.filters.maxCost;
      }
      if (result.filters.minDuration) {
        durationSelect.value = result.filters.minDuration;
      }
      // Only auto-apply if both filters were actually set (not just stored as null)
      if (result.filters.maxCost || result.filters.minDuration) {
        applyFilters();
      }
    }
  });

  // Function to show status message
  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.className = `status show ${type}`;
    
    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 3000);
  }

  // Function to update results count
  function updateResultsCount(shown, hidden) {
    if (shown === 0 && hidden === 0) {
      resultsCount.textContent = '';
    } else {
      resultsCount.textContent = `${shown} classes shown • ${hidden} hidden`;
    }
  }

  // Function to get the current active tab
  async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  // Function to apply filters
  async function applyFilters() {
    const filters = {
      maxCost: maxCostSelect.value ? parseInt(maxCostSelect.value) : null,
      minDuration: durationSelect.value ? parseInt(durationSelect.value) : null
    };
    
    console.log('Applying filters:', filters);
    
    // Save filters to storage
    chrome.storage.local.set({ filters });
    
    // Get the current tab
    const tab = await getCurrentTab();
    
    // Check if we're on a ClassPass page
    if (!tab.url || !tab.url.includes('classpass.com')) {
      showStatus('Please navigate to classpass.com to use filters', 'error');
      return;
    }
    
    // Send message to content script
    try {
      console.log('Sending message to tab:', tab.id, 'with filters:', filters);
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'APPLY_FILTERS',
        filters: filters
      });
      
      console.log('Received response:', response);
      if (response && response.success) {
        // Update results count instead of showing status
        if (response.shown !== undefined && response.hidden !== undefined) {
          updateResultsCount(response.shown, response.hidden);
        }
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      console.error('Error details:', error.message);
      showStatus('⚠️ Please refresh the ClassPass page first!', 'error');
    }
  }

  // Auto-apply filters when dropdown values change
  maxCostSelect.addEventListener('change', () => {
    applyFilters();
  });

  durationSelect.addEventListener('change', () => {
    applyFilters();
  });

  // Clear filters button handler
  clearButton.addEventListener('click', async () => {
    // Reset dropdowns
    maxCostSelect.value = '';
    durationSelect.value = '';
    
    // Clear storage
    chrome.storage.local.remove('filters');
    
    // Get the current tab
    const tab = await getCurrentTab();
    
    // Check if we're on a ClassPass page
    if (!tab.url || !tab.url.includes('classpass.com')) {
      showStatus('Please navigate to classpass.com', 'error');
      return;
    }
    
    // Send message to content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'CLEAR_FILTERS'
      });
      
      if (response && response.success) {
        updateResultsCount(0, 0);
        showStatus('Filters cleared!', 'success');
      }
    } catch (error) {
      console.error('Error clearing filters:', error);
      showStatus('Error clearing filters. Please refresh the page.', 'error');
    }
  });

  console.log('Side panel ready');
}); // End of DOMContentLoaded
