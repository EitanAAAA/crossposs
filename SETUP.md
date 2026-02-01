# CrossPost MVP - Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use SQLite for development)
- Google Cloud Console account (for YouTube API)
- Google AI Studio account (for Gemini API - optional, for AI features)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/crosspost?schema=public
# Google OAuth (can use same credentials for both YouTube and Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# Or use YouTube-specific names (they'll work the same)
YOUTUBE_CLIENT_ID=your_google_client_id
YOUTUBE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:3001/api/auth/youtube/callback
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3001
PORT=3000
```

### 3. Set Up Google OAuth (for YouTube & Google Sign-In)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Enable **Google+ API** (for user profile info)
5. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs (add BOTH):
     - `http://localhost:3000/api/auth/youtube/callback` (for YouTube uploads)
     - `http://localhost:3000/api/auth/google/callback` (for Google Sign-In)
   - Copy Client ID and Client Secret to `.env`

### 4. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Run the Application

**Terminal 1 - Backend Server:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Or run both together:
```bash
npm run dev:all
```

## Features Implemented

### ✅ YouTube Shorts Upload
- OAuth 2.0 authentication
- Real video upload to YouTube
- Automatic token refresh
- Video ID tracking

### ✅ AI Content Generation
- Auto-generate titles
- Auto-generate descriptions
- Auto-generate hashtags
- Uses Google Gemini API

### ✅ Platform Connection
- YouTube OAuth flow
- Secure token storage
- Connection status tracking

## How to Use

1. **Connect YouTube:**
   - Go to "Platforms" in sidebar
   - Click "Connect Platform" on YouTube Shorts
   - Authorize with Google account
   - Redirects back with connection confirmed

2. **Upload Video:**
   - Go to "Upload"
   - Select video file
   - Fill in details (or use AI Generate)
   - Select YouTube Shorts
   - Click "Publish to All Networks"
   - Video uploads to YouTube!

3. **View History:**
   - Check "History" to see uploaded videos
   - See status for each platform
   - View video IDs

## Next Steps

- Add Facebook/Instagram OAuth
- Add TikTok integration (when API available)
- Add analytics tracking
- Add video format optimization
- Add thumbnail generation

## Troubleshooting

**YouTube upload fails:**
- Check OAuth credentials in `.env`
- Verify redirect URI matches Google Console
- Check token expiration

**AI generation not working:**
- Verify GEMINI_API_KEY in `.env`
- Check API quota limits

**Database errors:**
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Run `npm run db:push` to sync schema

