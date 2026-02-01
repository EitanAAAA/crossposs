import { google } from 'googleapis';

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
// Redirect URI should point to the SERVER endpoint (port 3000), not frontend
const PORT = process.env.PORT || 3000;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || `http://localhost:${PORT}/api/auth/youtube/callback`;

export const getYouTubeAuthUrl = (userId: string): string => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
  ];

  const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
    prompt: 'consent'
  });
};

export const getYouTubeTokens = async (code: string): Promise<{
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number;
}> => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);
  
  return {
    accessToken: tokens.access_token || '',
    refreshToken: tokens.refresh_token || null,
    expiresAt: tokens.expiry_date || Date.now() + 3600000
  };
};

export const refreshYouTubeToken = async (refreshToken: string): Promise<{
  accessToken: string;
  expiresAt: number;
}> => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();
  
  return {
    accessToken: credentials.access_token || '',
    expiresAt: credentials.expiry_date || Date.now() + 3600000
  };
};

export const getYouTubeClient = (accessToken: string) => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oauth2Client.setCredentials({ access_token: accessToken });
  return google.youtube({ version: 'v3', auth: oauth2Client });
};

