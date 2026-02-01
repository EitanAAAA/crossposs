
export enum Platform {
  TikTok = 'TikTok',
  Instagram = 'Instagram Reels',
  YouTube = 'YouTube Shorts',
  Facebook = 'Facebook Reels',
  X = 'X',
  LinkedIn = 'LinkedIn',
  Pinterest = 'Pinterest',
  Reddit = 'Reddit'
}

export enum PublishStatus {
  Pending = 'Pending',
  Uploading = 'Uploading',
  Success = 'Success',
  Failed = 'Failed'
}

export interface PlatformTokens {
  youtube?: {
    accessToken: string;
    refreshToken: string | null;
    expiresAt: number;
    channelId?: string;
  };
  facebook?: {
    accessToken: string;
    expiresAt: number;
    pageId?: string;
  };
  instagram?: {
    accessToken: string;
    accountId: string;
    expiresAt: number;
  };
}

export enum ProjectType {
  Video = 'video',
  Post = 'post',
  Text = 'text',
  Carousel = 'carousel'
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  timestamp: number;
  thumbnail?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  connectedPlatforms: Platform[];
  platformTokens?: PlatformTokens;
}

export interface PlatformStatus {
  platform: Platform;
  status: PublishStatus;
  errorMessage?: string;
}

export interface VideoRecord {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  hashtags: string[];
  platformStatuses: PlatformStatus[];
  timestamp: number;
  platformVideoIds?: {
    [key in Platform]?: string;
  };
}

export interface UploadFormData {
  title: string;
  description: string;
  hashtags: string;
  selectedPlatforms: Platform[];
  file: File | null;
}
