
import { Platform, PublishStatus, VideoRecord, PlatformStatus, PlatformTokens } from '../../types';
import { uploadToYouTube } from './youtubeUpload';

interface PublishVideoOptions {
  record: Omit<VideoRecord, 'id' | 'timestamp' | 'platformStatuses'>;
  platforms: Platform[];
  videoFile: File | Blob;
  userTokens?: PlatformTokens;
  userId?: string;
  onProgress: (platformStatuses: PlatformStatus[]) => void;
}

export const publishVideo = async (options: PublishVideoOptions): Promise<VideoRecord> => {
  const { record, platforms, videoFile, userTokens, userId, onProgress } = options;
  const id = Math.random().toString(36).substring(7);
  const timestamp = Date.now();
  
  let currentStatuses: PlatformStatus[] = platforms.map(p => ({
    platform: p,
    status: PublishStatus.Uploading
  }));
  
  onProgress([...currentStatuses]);

  const platformVideoIds: { [key in Platform]?: string } = {};

  const publishPromises = platforms.map(async (platform) => {
    if (platform === Platform.YouTube && userTokens?.youtube) {
      try {
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('userId', options.userId || '');
        formData.append('title', record.title);
        formData.append('description', record.description);
        formData.append('hashtags', JSON.stringify(record.hashtags));

        // @ts-ignore
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        console.log('📤 Uploading to YouTube:', { userId: options.userId, title: record.title });
        
        const response = await fetch(`${API_URL}/upload/youtube`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: response.statusText }));
          console.error('❌ YouTube upload failed:', errorData);
          throw new Error(errorData.error || errorData.details || 'Upload failed');
        }

        const result = await response.json();
        console.log('✅ YouTube upload result:', result);

        if (result.videoId) {
          platformVideoIds[platform] = result.videoId;
        }

        return result.status || {
          platform: Platform.YouTube,
          status: result.status?.status || PublishStatus.Success,
          errorMessage: result.status?.errorMessage
        };
      } catch (error: any) {
        return {
          platform,
          status: PublishStatus.Failed,
          errorMessage: error.message || 'YouTube upload failed'
        };
      }
    } else {
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    const success = Math.random() > 0.1;
    
      return {
      platform,
      status: success ? PublishStatus.Success : PublishStatus.Failed,
        errorMessage: success ? undefined : "Platform connection required"
    };
    }
  });

  const finalPlatformResults = await Promise.all(publishPromises);
  onProgress(finalPlatformResults);

  return {
    ...record,
    id,
    timestamp,
    platformStatuses: finalPlatformResults,
    platformVideoIds
  };
};
