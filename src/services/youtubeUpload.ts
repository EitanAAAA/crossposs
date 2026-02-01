import { getYouTubeClient, refreshYouTubeToken } from './youtubeAuth';
import { PlatformStatus, PublishStatus, Platform } from '../../types';
import { google } from 'googleapis';
import { Readable } from 'stream';

interface YouTubeUploadOptions {
  videoFile: File | Blob | Buffer;
  title: string;
  description: string;
  hashtags: string[];
  accessToken: string;
  refreshToken?: string | null;
  mimeType?: string;
  onProgress?: (progress: number) => void;
}

export const uploadToYouTube = async (options: YouTubeUploadOptions): Promise<{
  videoId: string;
  status: PlatformStatus;
}> => {
  const { videoFile, title, description, hashtags, accessToken, refreshToken, mimeType, onProgress } = options;

  let token = accessToken;
  let client = getYouTubeClient(token);

  // Prepare video data outside try block so it's available for retry
  let videoBuffer: Buffer;
  let finalMimeType: string;
  
  try {
    // Handle different input types: Buffer (from server), Blob, or File
    if (Buffer.isBuffer(videoFile)) {
      videoBuffer = videoFile;
      finalMimeType = mimeType || 'video/mp4';
    } else if (videoFile instanceof Blob || videoFile instanceof File) {
      const arrayBuffer = await videoFile.arrayBuffer();
      videoBuffer = Buffer.from(arrayBuffer);
      finalMimeType = mimeType || (videoFile instanceof File ? videoFile.type : null) || (videoFile instanceof Blob ? videoFile.type : null) || 'video/mp4';
    } else {
      throw new Error('Unsupported video file type');
    }

    console.log('📹 Preparing YouTube upload:', { title, descriptionLength: description.length, hashtagsCount: hashtags.length, fileSize: videoBuffer.length });

    const hashtagsString = hashtags.map(tag => `#${tag.trim().replace(/^#/, '')}`).join(' ');
    const fullDescription = `${description}\n\n${hashtagsString}`;

    const videoMetadata = {
      snippet: {
        title: title.substring(0, 100),
        description: fullDescription.substring(0, 5000),
        tags: hashtags.slice(0, 10),
        categoryId: '22',
        defaultLanguage: 'en',
        defaultAudioLanguage: 'en'
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false
      }
    };

    onProgress?.(10);

    // Convert Buffer to Readable stream (required by YouTube API)
    const videoStream = Readable.from(videoBuffer);

    console.log('📤 Uploading video to YouTube:', { size: videoBuffer.length, mimeType: finalMimeType });
    onProgress?.(30);

    const response = await client.videos.insert({
      part: ['snippet', 'status'],
      requestBody: videoMetadata,
      media: {
        body: videoStream,
        mimeType: finalMimeType
      }
    });

    onProgress?.(100);

    if (response.data.id) {
      console.log('✅ YouTube upload successful:', { videoId: response.data.id });
      return {
        videoId: response.data.id,
        status: {
          platform: Platform.YouTube,
          status: PublishStatus.Success
        }
      };
    }

    throw new Error('No video ID returned from YouTube');
  } catch (error: any) {
    console.error('❌ YouTube upload error:', { 
      code: error.code, 
      message: error.message,
      response: error.response?.data 
    });
    
    if (error.code === 401 && refreshToken) {
      console.log('🔄 Attempting token refresh...');
      try {
        const refreshed = await refreshYouTubeToken(refreshToken);
        token = refreshed.accessToken;
        client = getYouTubeClient(token);

        // Reuse the same videoBuffer from the first attempt - create new stream
        const retryStream = Readable.from(videoBuffer);
        const retryResponse = await client.videos.insert({
          part: ['snippet', 'status'],
          requestBody: {
            snippet: {
              title: title.substring(0, 100),
              description: `${description}\n\n${hashtags.map(tag => `#${tag.trim().replace(/^#/, '')}`).join(' ')}`.substring(0, 5000),
              tags: hashtags.slice(0, 10),
              categoryId: '22'
            },
            status: {
              privacyStatus: 'public',
              selfDeclaredMadeForKids: false
            }
          },
          media: {
            body: retryStream,
            mimeType: finalMimeType
          }
        });

        if (retryResponse.data.id) {
          return {
            videoId: retryResponse.data.id,
            status: {
              platform: Platform.YouTube,
              status: PublishStatus.Success
            }
          };
        }
      } catch (retryError: any) {
        return {
          videoId: '',
          status: {
            platform: Platform.YouTube,
            status: PublishStatus.Failed,
            errorMessage: retryError.message || 'Upload failed after token refresh'
          }
        };
      }
    }

    return {
      videoId: '',
      status: {
        platform: Platform.YouTube,
        status: PublishStatus.Failed,
        errorMessage: error.message || 'Upload failed'
      }
    };
  }
};

