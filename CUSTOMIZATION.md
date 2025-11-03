# Customization Guide

## Adding More Filter Options

### Modifying Max Cost Options

To add or change credit cost options, edit `sidepanel.html`:

```html
<select id="maxCost" class="filter-select">
  <option value="">No limit</option>
  <option value="5">5 credits</option>
  <!-- Add more options here -->
  <option value="35">35 credits</option>
</select>
```

### Modifying Duration Options

To add or change duration options, edit `sidepanel.html`:

```html
<select id="duration" class="filter-select">
  <option value="">Any duration</option>
  <option value="30">30 min</option>
  <!-- Add more options here -->
  <option value="45">45 min</option>
</select>
```

## Customizing the Look

### Colors

The extension uses a purple gradient theme. To change colors, edit `sidepanel.css`:

```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your preferred colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Fonts

To change the font, modify the font-family in `sidepanel.css`:

```css
body {
  font-family: 'Your Preferred Font', sans-serif;
}
```

## Advanced: Adding New Filters

### Step 1: Add UI Element

In `sidepanel.html`, add a new filter group:

```html
<div class="filter-group">
  <label for="newFilter">New Filter Label</label>
  <select id="newFilter" class="filter-select">
    <option value="">Any</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
  </select>
</div>
```

### Step 2: Update JavaScript Logic

In `sidepanel.js`, add the new filter to the filters object:

```javascript
const filters = {
  maxCost: maxCostSelect.value ? parseInt(maxCostSelect.value) : null,
  duration: durationSelect.value ? parseInt(durationSelect.value) : null,
  newFilter: newFilterSelect.value || null  // Add this line
};
```

### Step 3: Update Content Script

In `content.js`, add logic to check the new filter:

```javascript
// Check new filter
if (currentFilters.newFilter) {
  const filterValue = extractNewFilter(element);
  if (filterValue !== currentFilters.newFilter) {
    matches = false;
  }
}
```

And add an extraction function:

```javascript
function extractNewFilter(element) {
  // Add logic to extract the filter value from the element
  const text = element.textContent;
  // ... your extraction logic
  return extractedValue;
}
```

## Debugging Tips

### Console Logging

The extension logs messages to the console. To view them:

1. **For ClassPass page logs**:
   - Right-click → Inspect → Console tab
   - Look for "ClassPicker" messages
   - This helps debug if classes aren't being detected

2. **For side panel logs**:
   - Right-click the extension icon
   - Click "Inspect"
   - Go to Console tab

### Testing Filter Logic

You can test the filtering logic by adding console logs in `content.js`:

```javascript
function matchesFilters(element) {
  console.log('Checking element:', element);
  console.log('Current filters:', currentFilters);
  console.log('Extracted credits:', extractCredits(element));
  console.log('Extracted duration:', extractDuration(element));
  // ... rest of function
}
```

## ClassPass Selector Updates

If ClassPass changes their website structure and filters stop working, you may need to update the selectors in `content.js`:

```javascript
const selectors = [
  '[class*="class-card"]',
  '[class*="ClassCard"]',
  // Add new selectors that match ClassPass's new HTML structure
  '[class*="new-class-element"]',
];
```

To find new selectors:
1. Open ClassPass.com
2. Right-click a class → Inspect
3. Find the parent element that contains the entire class card
4. Look for unique class names or data attributes
5. Add them to the selectors array

## Performance Tuning

### Debounce Timing

If the filter reapplication is too slow or too fast, adjust the debounce timer in `content.js`:

```javascript
observer.timer = setTimeout(() => {
  applyFilters();
}, 500);  // Change this value (in milliseconds)
```

### Notification Duration

To change how long notifications stay visible, edit in `content.js`:

```javascript
setTimeout(() => {
  notification.style.opacity = '0';
  notification.style.transform = 'translateX(400px)';
  setTimeout(() => notification.remove(), 300);
}, 3000);  // Change this value (in milliseconds)
```

## Need More Help?

Check the browser console for error messages - they'll help identify what's not working!

---

For more information, see the main [README](README.md).
