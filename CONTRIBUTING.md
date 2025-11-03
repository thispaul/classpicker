# Contributing to ClassPicker

Thanks for your interest in contributing to ClassPicker! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Browser version and OS

### Suggesting Features

Feature requests are welcome! Please open an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any examples or mockups if applicable

### Submitting Code Changes

1. **Fork the repository** and create a new branch for your feature or fix
2. **Make your changes** following the code style of the project
3. **Test your changes** thoroughly:
   - Load the extension in Chrome
   - Test on actual ClassPass pages
   - Check browser console for errors
4. **Submit a pull request** with:
   - A clear description of what you changed and why
   - References to any related issues
   - Screenshots/recordings if the change is visual

## Development Setup

1. Clone the repository
2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `classpicker` folder
3. Make changes to the code
4. Reload the extension in Chrome after each change
5. Test on classpass.com

## Code Guidelines

- Keep code simple and readable
- Add comments for complex logic
- Use meaningful variable and function names
- Test changes on actual ClassPass pages before submitting

## Project Structure

- `manifest.json` - Extension configuration
- `sidepanel.html/css/js` - Filter UI
- `content.js` - Main filtering logic that runs on ClassPass pages
- `background.js` - Background service worker

## Questions?

If you have questions about contributing, feel free to open an issue asking for clarification.

## Code of Conduct

Be respectful and constructive in all interactions. We're all here to make this extension better for everyone.

---

Thank you for contributing! 🎉
