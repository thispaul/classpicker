# ClassPicker Chrome Extension

ClassPicker Chrome Extension: A Chrome extension that adds advanced filter capabilities to help you filter ClassPass classes in real-time.

> **Note**: This is an unofficial, community-created extension. It is not affiliated with, endorsed by, or officially connected to ClassPass in any way.

## Features

- 🎯 Filter classes by maximum credit cost (0-100 credits)
- ⏱️ Filter classes by duration (30, 50, 60, 75, 90, 120 minutes)
- 🔄 Real-time filtering as you browse ClassPass.com
- 💾 Saves your filter preferences
- 🎨 Clean, modern side panel interface

## Installation

### Option 1: Load as Unpacked Extension (Development Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked"
4. Select the `classpass-filter` directory
5. The extension should now appear in your extensions list

### Option 2: Using the Side Panel

1. After installation, navigate to [classpass.com](https://classpass.com)
2. Click the extension icon in your Chrome toolbar
3. Chrome will open the side panel on the right side of your browser
4. Select your desired filters and click "Apply Filters"

## How to Use

1. **Navigate to ClassPass**: Go to https://classpass.com and browse classes
2. **Open the Side Panel**: Click the ClassPicker icon in your toolbar
3. **Set Your Filters**: 
   - Choose a maximum credit cost from the dropdown
   - Select your preferred class duration
4. **Apply**: Click "Apply Filters" to filter classes in real-time
5. **Clear**: Click "Clear Filters" to show all classes again

## Filter Options

### Max Cost (Credits)
- No limit (show all)
- 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100 credits

### Duration (Minutes)
- Any duration (show all)
- 30, 50, 60, 75, 90, 120 minutes

## How It Works

The extension uses:
- **Content Script**: Runs on ClassPass pages to identify and filter class listings
- **Side Panel**: Provides the filter interface on the right side of your browser
- **Message Passing**: Communicates filter changes between the panel and content script
- **DOM Observation**: Automatically reapplies filters when new classes load

Screenshot of ClassPicker Chrome extension:
<img width="1822" height="1090" alt="classpicker screenshot" src="https://github.com/user-attachments/assets/e882b607-383a-4799-a222-a67fa6510b6f" />


## Technical Details

- **Manifest Version**: 3
- **Permissions**: 
  - `activeTab` - To interact with the current ClassPass tab
  - `sidePanel` - To display the filter interface
- **Host Permissions**: `https://*.classpass.com/*`

## 📁 Project Structure

```
classpicker/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Main filtering logic (runs on ClassPass pages)
├── sidepanel.html        # Filter UI structure
├── sidepanel.css         # Filter UI styling
├── sidepanel.js          # Filter UI logic
├── icons/                # Extension icons
├── README.md             # Main documentation
├── INSTALLATION.md       # Installation guide
├── TESTING.md           # Testing guide
├── CUSTOMIZATION.md     # Customization guide
├── CONTRIBUTING.md      # Contribution guidelines
└── LICENSE              # MIT License
```

## Troubleshooting

**Filters not working?**
- Make sure you're on classpass.com
- Try refreshing the page
- Check that the extension is enabled in chrome://extensions/

**Side panel not showing?**
- Click the extension icon in the toolbar
- Make sure you've granted the necessary permissions

**Classes not hiding properly?**
- The extension looks for common ClassPass HTML patterns
- If the site structure changes, the selectors may need updating

## Future Enhancements

Potential features for future versions:
- Additional filters (class type, location, instructor)
- Save favorite filter presets
- Class notifications
- Schedule integration

## Contributing

Contributions are welcome! Whether you've found a bug, have a feature request, or want to improve the code, feel free to:
- Open an issue
- Submit a pull request
- Suggest improvements

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

MIT License - Feel free to modify and use as needed!

## Author

Built by [@thispaul](https://github.com/thispaul) | [paulloeb.net](https://paulloeb.net)

Made with ❤️ for ClassPass users

---

**Disclaimer**: This extension is not affiliated with, endorsed by, or officially connected to ClassPass in any way. It is an independent, community-created tool designed to enhance the ClassPass browsing experience.
