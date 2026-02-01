# Google OAuth Setup - Step by Step

## ⚠️ IMPORTANT: Redirect URI Must Match EXACTLY

The redirect URI in your code MUST match EXACTLY what's in Google Cloud Console.

## Current Redirect URI in Code:
```
http://localhost:3000/api/auth/google/callback
```

## Steps to Fix redirect_uri_mismatch Error:

### 1. Go to Google Cloud Console
- URL: https://console.cloud.google.com/apis/credentials
- Select your project

### 2. Edit OAuth 2.0 Client ID
- Click on your OAuth 2.0 Client ID
- Scroll to "Authorized redirect URIs"

### 3. Add/Update Redirect URI
**MUST ADD EXACTLY THIS:**
```
http://localhost:3000/api/auth/google/callback
```

**IMPORTANT:**
- ✅ Must be `http://` (not https)
- ✅ Must be `localhost` (not 127.0.0.1)
- ✅ Must be port `3000` (not 3001)
- ✅ Must be exact path: `/api/auth/google/callback`
- ✅ No trailing slash
- ✅ Case sensitive

### 4. Also Add YouTube Redirect URI:
```
http://localhost:3000/api/auth/youtube/callback
```

### 5. Save and Wait
- Click "SAVE"
- Wait 1-2 minutes for changes to propagate
- Try again

## Check Your .env File

Make sure your `.env` file has:
```env
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/auth/youtube/callback
```

Or remove these lines to use the default (port 3000).

## Debug: Check What URI is Being Used

1. Start your server: `npm run dev:server`
2. Look at the console output when you click "Sign in with Google"
3. You should see: `🔗 Google OAuth Redirect URI: http://localhost:3000/api/auth/google/callback`
4. If it shows a different URI, check your `.env` file

## Common Mistakes:
- ❌ Using port 3001 instead of 3000
- ❌ Using https instead of http
- ❌ Using 127.0.0.1 instead of localhost
- ❌ Adding trailing slash
- ❌ Wrong path (missing `/api/auth/`)

## After Fixing:
1. Restart your server
2. Try "Sign in with Google" again
3. Should work! ✅

