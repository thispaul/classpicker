// Content script that runs on ClassPass pages
console.log('ClassPicker extension loaded');

// Store current filter settings
let currentFilters = {
  maxCost: null,
  minDuration: null
};

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);

  if (message.type === 'APPLY_FILTERS') {
    currentFilters = message.filters;
    const result = applyFilters();
    sendResponse({ 
      success: true, 
      message: 'Filters applied',
      shown: result.shown,
      hidden: result.hidden
    });
  } else if (message.type === 'CLEAR_FILTERS') {
    currentFilters = { maxCost: null, minDuration: null };
    clearFilters();
    sendResponse({ success: true, message: 'Filters cleared' });
  }

  return true; // Keep the message channel open for async response
});

// Function to extract credit cost from a class element
function extractCredits(element) {
  // Try to find credit information in the element
  const text = element.textContent || element.innerText;
  
  // Look for patterns like "10 credits", "10cr", etc.
  const creditMatch = text.match(/(\d+)\s*(credit|credits|cr)/i);
  if (creditMatch) {
    return parseInt(creditMatch[1]);
  }
  
  // Alternative: look for data attributes or specific class elements
  const creditElement = element.querySelector('[class*="credit"]');
  if (creditElement) {
    const creditText = creditElement.textContent;
    const numberMatch = creditText.match(/(\d+)/);
    if (numberMatch) {
      return parseInt(numberMatch[1]);
    }
  }
  
  return null;
}

// Function to extract duration from a class element
function extractDuration(element) {
  const text = element.textContent || element.innerText;
  
  // Look for patterns like "60 min", "60min", "1h", etc.
  const minMatch = text.match(/(\d+)\s*(min|mins|minute|minutes)/i);
  if (minMatch) {
    return parseInt(minMatch[1]);
  }
  
  // Look for hour patterns
  const hourMatch = text.match(/(\d+)\s*h/i);
  if (hourMatch) {
    return parseInt(hourMatch[1]) * 60;
  }
  
  // Alternative: look for specific duration elements
  const durationElement = element.querySelector('[class*="duration"]');
  if (durationElement) {
    const durationText = durationElement.textContent;
    const numberMatch = durationText.match(/(\d+)/);
    if (numberMatch) {
      return parseInt(numberMatch[1]);
    }
  }
  
  return null;
}

// Function to check if an element matches the current filters
function matchesFilters(element) {
  // If no filters are set, show everything
  if (!currentFilters.maxCost && !currentFilters.minDuration) {
    return true;
  }
  
  let matches = true;
  
  // Check max cost filter
  if (currentFilters.maxCost) {
    const credits = extractCredits(element);
    if (credits !== null && credits > currentFilters.maxCost) {
      matches = false;
    }
  }
  
  // Check minimum duration filter
  if (currentFilters.minDuration) {
    const duration = extractDuration(element);
    if (duration !== null && duration < currentFilters.minDuration) {
      matches = false;
    }
  }
  
  return matches;
}

// Function to find class elements on the page
function findClassElements() {
  // ClassPass may use different selectors depending on the page structure
  // These are common patterns to look for
  const selectors = [
    'li[class*="reservable"]',  // ClassPass uses li elements with "reservable" in the class
    'li[class*="class"]',
    'div[class*="class-card"]',
    'div[class*="ClassCard"]',
    'div[class*="class-item"]',
    '[data-testid*="class"]',
    'article',
    '[role="article"]',
    'li'  // Fallback to all li elements if nothing else matches
  ];
  
  let elements = [];
  for (const selector of selectors) {
    const found = document.querySelectorAll(selector);
    if (found.length > 0) {
      // Filter to only include elements that contain credit information
      elements = Array.from(found).filter(el => {
        const text = el.textContent || '';
        return text.match(/\d+\s*credit/i);
      });
      
      if (elements.length > 0) {
        console.log(`Found ${elements.length} class elements using selector: ${selector}`);
        break;
      }
    }
  }
  
  if (elements.length === 0) {
    console.warn('No class elements found. Trying broader search...');
    // Fallback: find all elements containing credit text
    const allElements = document.querySelectorAll('*');
    elements = Array.from(allElements).filter(el => {
      const text = el.textContent || '';
      return text.match(/\d+\s*credit/i) && text.match(/\d+\s*min/i);
    });
    console.log(`Fallback found ${elements.length} elements`);
  }
  
  return elements;
}

// Apply filters to the page
function applyFilters() {
  console.log('=== APPLYING FILTERS ===');
  console.log('Current filters:', currentFilters);
  
  const classElements = findClassElements();
  console.log('Total class elements found:', classElements.length);
  
  if (classElements.length === 0) {
    console.warn('No class elements found! Cannot apply filters.');
    return { shown: 0, hidden: 0 };
  }
  
  let hiddenCount = 0;
  let shownCount = 0;
  
  classElements.forEach((element, index) => {
    // Check if ClassPass's native filters have hidden this element
    const computedStyle = window.getComputedStyle(element);
    const currentDisplay = computedStyle.display;
    const wasHiddenByUs = element.hasAttribute('data-cp-filter-hidden');
    
    // If element is hidden and NOT by us, ClassPass hid it - don't touch it
    if (currentDisplay === 'none' && !wasHiddenByUs) {
      console.log(`Element ${index}: Hidden by ClassPass, skipping`);
      return; // Skip this element entirely
    }
    
    // Only apply our filters to elements ClassPass is showing (or that we previously hid)
    const matches = matchesFilters(element);
    
    // Log first few elements for debugging
    if (index < 3) {
      const credits = extractCredits(element);
      const duration = extractDuration(element);
      console.log(`Element ${index}: credits=${credits}, duration=${duration}, matches=${matches}, display=${currentDisplay}, hiddenByUs=${wasHiddenByUs}`);
    }
    
    if (matches) {
      // Show the element (remove our filter if it was applied)
      if (wasHiddenByUs) {
        element.removeAttribute('data-cp-filter-hidden');
        element.style.removeProperty('display');
      }
      shownCount++;
    } else {
      // Hide with our filter marker
      if (!wasHiddenByUs) {
        element.setAttribute('data-cp-filter-hidden', 'true');
        element.style.display = 'none';
      }
      hiddenCount++;
    }
  });
  
  console.log(`Filtered results: ${shownCount} shown, ${hiddenCount} hidden`);
  
  // Hide pagination controls when filters are active to avoid blank pages
  managePagination();
  
  return { shown: shownCount, hidden: hiddenCount };
}

// Hide/show pagination based on whether filters are active
function managePagination() {
  const hasActiveFilters = currentFilters.maxCost || currentFilters.minDuration;
  
  // Find pagination controls - ClassPass uses various patterns
  const paginationSelectors = [
    '[class*="pagination"]',
    '[class*="Pagination"]',
    'nav[aria-label*="pagination"]',
    'nav[aria-label*="Pagination"]',
    'button[aria-label*="next"]',
    'button[aria-label*="previous"]'
  ];
  
  paginationSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (hasActiveFilters) {
        // Hide pagination when our filters are active
        el.setAttribute('data-cp-filter-pagination-hidden', 'true');
        el.style.display = 'none';
      } else {
        // Show pagination when no filters
        if (el.hasAttribute('data-cp-filter-pagination-hidden')) {
          el.removeAttribute('data-cp-filter-pagination-hidden');
          el.style.removeProperty('display');
        }
      }
    });
  });
}

// Clear all filters
function clearFilters() {
  console.log('Clearing filters');
  
  const classElements = findClassElements();
  
  classElements.forEach(element => {
    // Only remove OUR filters, don't touch ClassPass's native filtering
    if (element.hasAttribute('data-cp-filter-hidden')) {
      element.removeAttribute('data-cp-filter-hidden');
      element.style.removeProperty('display');
    }
  });
  
  // Restore pagination
  managePagination();
}

// Observe DOM changes to reapply filters when new content loads
// But ignore our own changes to avoid loops
let isApplyingFilters = false;

const observer = new MutationObserver((mutations) => {
  // Ignore mutations while we're applying filters
  if (isApplyingFilters) {
    return;
  }
  
  // Only reapply if filters are active
  if (currentFilters.maxCost || currentFilters.minDuration) {
    // Check if the mutations are significant (new classes loaded)
    const hasNewContent = mutations.some(mutation => {
      return mutation.addedNodes.length > 0 && 
             Array.from(mutation.addedNodes).some(node => 
               node.nodeType === 1 && // Element node
               (node.tagName === 'LI' || node.querySelector('li'))
             );
    });
    
    if (hasNewContent) {
      console.log('New content detected, reapplying filters');
      // Debounce to avoid excessive filtering
      clearTimeout(observer.timer);
      observer.timer = setTimeout(() => {
        isApplyingFilters = true;
        applyFilters();
        setTimeout(() => { isApplyingFilters = false; }, 100);
      }, 500);
    }
  }
});

// Start observing the document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('ClassPicker extension ready');

// Test element detection on page load
setTimeout(() => {
  const testElements = findClassElements();
  console.log(`[ClassPicker] Found ${testElements.length} class elements on page`);
  if (testElements.length > 0) {
    console.log('[ClassPicker] Sample element:', testElements[0].textContent.substring(0, 100));
  } else {
    console.warn('[ClassPicker] ⚠️ No class elements detected. The page may still be loading or selectors need adjustment.');
  }
}, 2000);
