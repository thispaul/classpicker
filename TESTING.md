# Testing Guide

## How to Test the Updated Extension

### 1. Reload the Extension

After making these changes, you need to reload the extension:

1. Open Chrome Extensions page (chrome://extensions/)
2. Find "ClassPicker"
3. Click "Inspect views: service worker"
4. Or toggle it off and back on

### 2. Test on ClassPass

1. Navigate to https://classpass.com
2. Search for classes in your area (e.g., "Yoga")
3. Open the extension side panel by clicking the extension icon
4. Open the browser console (F12 or Right-click → Inspect → Console tab)

### 3. Check Console Logs

You should see these messages in the console:
- ✅ "ClassPicker extension loaded"
- ✅ "ClassPicker extension ready"
- ✅ "[ClassPicker] Found X class elements on page"

### 4. Apply Filters

1. In the side panel, select a max cost (e.g., "10 credits")
2. Select a minimum duration (e.g., "60 min")
3. Click "Apply Filters"

**What to look for in console:**
- "Message received: {type: 'APPLY_FILTERS', filters: {maxCost: 10, minDuration: 60}}"
- "Applying filters: {maxCost: 10, minDuration: 60}"
- "Checking credits: X against max: 10"
- "Checking duration: Y against min: 60"
- "Filtered results: X shown, Y hidden"

### 5. Verify Filtering

After applying filters:
- Classes over 10 credits should be hidden
- Classes under 60 minutes should be hidden
- Only classes ≤10 credits AND ≥60 minutes should remain visible
- You should see a purple notification in the top-right corner

### 6. Test Clear Filters

1. Click "Clear Filters" button
2. All classes should reappear
3. Console should show: "Clearing filters"

## Troubleshooting

### If filters still don't work:

**Problem: No console logs appear**
- Make sure you're on classpass.com
- Try refreshing the page after loading the extension

**Problem: "Found 0 class elements"**
- The page structure might be different
- In the console, type: `document.querySelectorAll('li')` to see if li elements exist
- Look at the HTML structure and report back what you see

**Problem: Elements found but not filtering**
- Check if credits/duration are being extracted
- Look for console logs showing "Checking credits: null" (means extraction failed)

**Problem: Extension not sending messages**
- Check side panel console (right-click extension icon → Inspect)
- Look for errors about permissions or tabs

## Debug Commands

Run these in the browser console (on classpass.com) to debug:

```javascript
// Check what elements the extension finds
document.querySelectorAll('li[class*="reservable"]').length

// Check if credits are visible in the page
document.body.innerHTML.includes('credits')

// Manually test credit extraction on first class
const firstClass = document.querySelector('li');
console.log(firstClass.textContent);
```

## Expected Behavior

### Max Cost Filter (10 credits selected):
- ✅ Shows: 5 credit class, 10 credit class
- ❌ Hides: 11 credit class, 15 credit class, 20 credit class

### Minimum Duration Filter (60 min selected):
- ✅ Shows: 60 min class, 75 min class, 90 min class
- ❌ Hides: 30 min class, 50 min class, 55 min class

### Both Filters (10 credits + 60 min):
- ✅ Shows: Only classes that are ≤10 credits AND ≥60 minutes
- ❌ Hides: Everything else

## What Changed

1. **Max Cost**: Now shows all values 1-100 (instead of just 5, 10, 15, etc.)
2. **Duration**: Changed to "Minimum Duration" - shows classes >= selected value
3. **Element Detection**: Improved to find ClassPass's list items (li elements)
4. **Debugging**: Added console logs to help identify issues

---

If you're still having issues, please check the console and share:
1. The console output when you click "Apply Filters"
2. A sample of the HTML from a class listing (right-click a class → Inspect)

---

For more information, see the main [README](README.md).
