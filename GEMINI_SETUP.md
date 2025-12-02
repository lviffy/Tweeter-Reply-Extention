# XReplyGPT - Gemini Integration Guide (Local Development)

This extension has been updated to use **Google Gemini API** instead of OpenAI and works **100% locally** - no deployment needed!

## 🚀 Quick Start (Local Development)

### 1. Get Your Gemini API Key (FREE!)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Note:** Gemini API has a generous free tier! No paid account required for basic usage.

### 2. Load the Extension Locally (No Deployment Needed)

1. Open Chrome/Brave and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `/home/luffy/Projects/XReplyGPT` directory
5. ✅ Extension is now loaded and ready!

### 3. Configure Your API Key

1. Click the XReplyGPT icon in your Chrome toolbar
2. Paste your Gemini API key
3. Click **Validate** (should turn green)
4. Select your preferred model:
   - **Gemini 2.0 Flash (Experimental)** - Latest model, best performance (recommended)
   - **Gemini 1.5 Flash** - Fast and efficient
   - **Gemini 1.5 Flash-8B** - Lightweight and quick
   - **Gemini 1.5 Pro** - Advanced reasoning
   - **Gemini Pro** - Standard model
5. Customize the AI prompt if desired

### 4. Use It on Twitter/X!

1. Go to [https://x.com](https://x.com)
2. Press **Ctrl+Shift+L** (or **Cmd+Shift+L** on Mac)
3. Wait for AI-generated replies to appear below tweets
4. Click on a generated reply to use it

## 📋 Available Models

- **gemini-2.0-flash-exp**: Latest experimental model with best performance (recommended)
- **gemini-1.5-flash**: Fast and efficient, stable release
- **gemini-1.5-flash-8b**: Lightweight model for quick responses
- **gemini-1.5-pro**: Advanced model with better reasoning
- **gemini-pro**: Standard model, good balance of speed and quality

## 🔧 Local Development Features

✅ **100% Offline**: No server deployment needed  
✅ **No External Dependencies**: All analytics removed  
✅ **Direct API Calls**: Straight to Google Gemini API  
✅ **Chrome Extension**: Runs locally in your browser  
✅ **Free Gemini Tier**: No cost for basic usage  

## 💡 Development Workflow

### Reload Extension After Changes
1. Make changes to any `.js` or `.html` file
2. Go to `chrome://extensions/`
3. Find XReplyGPT and click **"Reload"**
4. Changes are live immediately!

### Clear Storage (if needed)
If you want to reset settings:
1. Go to `chrome://extensions/`
2. Click **"Details"** on XReplyGPT
3. Click **"Clear storage"** to reset API key and settings

## 🎯 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+L` | Generate replies for visible tweets |
| `Ctrl+Shift+E` | Move to next generated reply |
| `Ctrl+Shift+S` | Move to previous generated reply |

**Customize shortcuts**: `chrome://extensions/shortcuts`

## 🧪 Testing Checklist

- [ ] Extension loads without errors
- [ ] API key validates (green border)
- [ ] Model dropdown shows all options
- [ ] Shortcut generates replies on x.com
- [ ] Clicking replies opens Twitter compose
- [ ] No console errors in browser dev tools

## 🔧 Troubleshooting

**Extension won't load?**
- Verify you're selecting the correct folder (`/home/luffy/Projects/XReplyGPT`)
- Check that `manifest.json` exists in the root
- Ensure Developer Mode is enabled

**API key validation fails?**
- Copy the **entire** API key (starts with `AIzaSy...`)
- Make sure you're using a valid Google account
- Try generating a new key at Google AI Studio

**No replies generating?**
- Open browser console (`F12` → Console tab)
- Check for error messages
- Verify you're on `https://x.com` or `https://twitter.com`
- Make sure API key is validated

**Shortcut not working?**
- Click anywhere on the Twitter page first (to focus it)
- Check shortcuts at `chrome://extensions/shortcuts`
- Try manually clicking the extension icon

## 📁 Project Structure (Local)

```
XReplyGPT/                    # Extension root
├── manifest.json            # Chrome extension config
├── src/
│   ├── index.html          # Popup UI
│   ├── popup.js            # Configuration logic
│   ├── content.js          # Main reply generation
│   ├── service-worker.js   # Background tasks
│   └── images/             # Icons and assets
├── GEMINI_SETUP.md         # This guide
└── README.md               # General info
```

## 🎓 Pro Tips for Development

1. **Hot Reload**: Any change to `.js` or `.html` files? Just click "Reload" in `chrome://extensions/`
2. **Debug Mode**: Use `F12` → Console to see logs and errors
3. **Test Different Models**: Try all Gemini models to see which works best
4. **Custom Prompts**: Modify the AI prompt for different reply styles
5. **Pin Extension**: Right-click toolbar icon → "Pin to toolbar" for easy access

## 🆘 Advanced Debugging

**Check Extension Status:**
```bash
# Verify files exist
ls -la /home/luffy/Projects/XReplyGPT/manifest.json
ls -la /home/luffy/Projects/XReplyGPT/src/

# Check for syntax errors
# (Extension won't load if there are JS syntax errors)
```

**Browser Console Debugging:**
1. Go to `x.com`
2. Press `F12` → Console tab
3. Press `Ctrl+Shift+L`
4. Look for:
   - ✅ "Using model: gemini-2.0-flash-exp"
   - ✅ Generated reply text
   - ❌ Any red error messages

## 🚀 Next Steps (After Local Testing)

Once you're happy with local development:

1. **Test thoroughly** on Twitter/X
2. **Customize** prompts and models to your liking
3. **Package for distribution** (if needed)
4. **Deploy** (optional - for sharing with others)

The extension works completely locally - no server, no domain, no deployment needed! Just your browser + Google Gemini API.

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Get API Key](https://makersuite.google.com/app/apikey)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)

Enjoy using XReplyGPT with Gemini! 🎉

---
**Local Development Ready - No Deployment Required!**

