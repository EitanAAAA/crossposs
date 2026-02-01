import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  const dbPass = process.env.DB_PASS || '';
  process.env.DATABASE_URL = `postgresql://postgres:${dbPass}@localhost:5432/users?schema=public`;
}

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { databaseService } from './db';
import { User, VideoRecord } from '../../types';
import { getYouTubeAuthUrl, getYouTubeTokens } from '../services/youtubeAuth';
import { uploadToYouTube } from '../services/youtubeUpload';

const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await databaseService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    console.log('Creating user:', { email: req.body.email, name: req.body.name });
    const user = await databaseService.saveUser(req.body);
    console.log('User created successfully:', user.id);
    res.json(user);
  } catch (error: any) {
    console.error('Save user error:', error);
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'User already exists with this email.' });
    } else {
      res.status(500).json({ error: 'Failed to save user', details: error.message });
    }
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Check if it's an email (contains @) or ID
    if (userId.includes('@')) {
      const email = decodeURIComponent(userId);
      const user = await databaseService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } else {
      const user = await databaseService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user', details: error.message });
  }
});

app.get('/api/users/email/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    console.log('Finding user by email:', email);
    const user = await databaseService.findUserByEmail(email);
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User found:', user.id);
    res.json(user);
  } catch (error: any) {
    console.error('Find user error:', error);
    res.status(500).json({ error: 'Failed to find user', details: error.message });
  }
});

app.patch('/api/users/:userId', async (req, res) => {
  try {
    const user = await databaseService.updateUser(req.params.userId, req.body);
    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

app.get('/api/videos/:userId', async (req, res) => {
  try {
    const videos = await databaseService.getVideos(req.params.userId);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.post('/api/videos/:userId', async (req, res) => {
  try {
    const video = await databaseService.saveVideo(req.params.userId, req.body);
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save video' });
  }
});

app.get('/api/auth/youtube', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }
    const authUrl = getYouTubeAuthUrl(userId);
    res.json({ authUrl });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate auth URL', details: error.message });
  }
});

app.get('/api/auth/youtube/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}?view=manager&error=no_code`);
    }

    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());
    const tokens = await getYouTubeTokens(code);
    
    const users = await databaseService.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}?view=manager&error=user_not_found`);
    }

    await databaseService.updateUser(userId, {
      platformTokens: {
        ...user.platformTokens,
        youtube: tokens
      },
      connectedPlatforms: user.connectedPlatforms.includes('YouTube Shorts' as any)
        ? user.connectedPlatforms
        : [...user.connectedPlatforms, 'YouTube Shorts' as any]
    });

    // Redirect to manager page, preserving the view
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}?view=manager&success=youtube_connected`);
  } catch (error: any) {
    console.error('YouTube callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}?view=manager&error=${encodeURIComponent(error.message)}`);
  }
});

// Google OAuth for user authentication
app.get('/api/auth/google', async (req, res) => {
  try {
    console.log('📥 Received request for Google auth URL');
    const { getGoogleAuthUrl } = await import('../services/googleAuth');
    const authUrl = getGoogleAuthUrl();
    console.log('📤 Generated Auth URL:', authUrl);
    res.json({ authUrl });
  } catch (error: any) {
    console.error('❌ Failed to generate Google auth URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate Google auth URL', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}?view=auth-login&error=no_code`);
    }

    const { getGoogleUserInfo } = await import('../services/googleAuth');
    const userInfo = await getGoogleUserInfo(code);
    
    // Find or create user
    let user = await databaseService.findUserByEmail(userInfo.email);
    if (!user) {
      user = await databaseService.saveUser({
        email: userInfo.email,
        name: userInfo.name,
        connectedPlatforms: []
      });
    }

    // Redirect to home with user data
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}?view=home&google_auth=true&user_id=${user.id}`);
  } catch (error: any) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}?view=auth-login&error=${encodeURIComponent(error.message)}`);
  }
});

app.post('/api/ai/generate-content', async (req, res) => {
  try {
    const { generateVideoContent } = await import('../services/aiService');
    const { userInput } = req.body;
    const suggestion = await generateVideoContent(null, userInput);
    res.json(suggestion);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate content', details: error.message });
  }
});

app.post('/api/upload/youtube', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { userId, title, description, hashtags } = req.body;
    if (!userId) {
      console.error('❌ YouTube upload: User ID missing');
      return res.status(400).json({ error: 'User ID required' });
    }

    console.log('🔍 Looking up user:', userId);
    const user = await databaseService.getUserById(userId);
    if (!user) {
      console.error('❌ YouTube upload: User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.platformTokens?.youtube) {
      console.error('❌ YouTube upload: YouTube not connected for user:', userId);
      return res.status(400).json({ error: 'YouTube not connected. Please connect your YouTube account first.' });
    }
    
    if (!user.platformTokens.youtube.accessToken) {
      console.error('❌ YouTube upload: No access token for user:', userId);
      return res.status(400).json({ error: 'YouTube access token missing. Please reconnect your YouTube account.' });
    }

    const hashtagsArray = JSON.parse(hashtags || '[]');
    
    // Use Buffer directly - multer already gives us a Buffer
    const videoBuffer = Buffer.isBuffer(req.file.buffer) 
      ? req.file.buffer 
      : Buffer.from(req.file.buffer);

    console.log('📤 Starting YouTube upload:', { userId, title, fileSize: req.file.size });
    
    const result = await uploadToYouTube({
      videoFile: videoBuffer,
      title,
      description,
      hashtags: hashtagsArray,
      accessToken: user.platformTokens.youtube.accessToken,
      refreshToken: user.platformTokens.youtube.refreshToken || null,
      mimeType: req.file.mimetype || 'video/mp4',
      onProgress: (progress) => {
        console.log(`📊 Upload progress: ${progress}%`);
      }
    });

    console.log('📥 YouTube upload result:', { 
      videoId: result.videoId, 
      status: result.status.status,
      error: result.status.errorMessage 
    });

    // Return the result with videoId and status
    res.json({
      videoId: result.videoId || null,
      status: result.status
    });
  } catch (error: any) {
    console.error('YouTube upload error:', error);
    res.status(500).json({ error: 'Failed to upload to YouTube', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Backend Server Started`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}`);
  console.log('='.repeat(50));
  console.log('📝 Logs will appear below:\n');
});

process.on('SIGINT', async () => {
  await databaseService.disconnect();
  process.exit(0);
});

