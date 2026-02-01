import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface AIContentSuggestion {
  title: string;
  description: string;
  hashtags: string[];
}

export const generateVideoContent = async (
  videoFile: File | null,
  userInput?: { title?: string; description?: string; hashtags?: string }
): Promise<AIContentSuggestion> => {
  if (!genAI) {
    return {
      title: userInput?.title || 'My Amazing Video',
      description: userInput?.description || 'Check out this video!',
      hashtags: userInput?.hashtags?.split(',').map(t => t.trim()) || ['viral', 'trending']
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a social media content expert. Generate engaging content for a video that will be posted to YouTube Shorts, Instagram Reels, TikTok, and Facebook Reels.

${userInput?.title ? `User provided title: ${userInput.title}` : ''}
${userInput?.description ? `User provided description: ${userInput.description}` : ''}
${userInput?.hashtags ? `User provided hashtags: ${userInput.hashtags}` : ''}

Generate:
1. A catchy, engaging title (max 60 characters, optimized for YouTube Shorts)
2. A compelling description (max 200 characters, engaging and includes call-to-action)
3. 5-8 relevant hashtags (trending, platform-optimized, no # symbol in response)

Return ONLY a JSON object in this exact format:
{
  "title": "Your generated title here",
  "description": "Your generated description here",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || userInput?.title || 'My Amazing Video',
        description: parsed.description || userInput?.description || 'Check out this video!',
        hashtags: parsed.hashtags || userInput?.hashtags?.split(',').map(t => t.trim()) || ['viral', 'trending']
      };
    }

    return {
      title: userInput?.title || 'My Amazing Video',
      description: userInput?.description || 'Check out this video!',
      hashtags: userInput?.hashtags?.split(',').map(t => t.trim()) || ['viral', 'trending']
    };
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      title: userInput?.title || 'My Amazing Video',
      description: userInput?.description || 'Check out this video!',
      hashtags: userInput?.hashtags?.split(',').map(t => t.trim()) || ['viral', 'trending']
    };
  }
};

export const generateThumbnailDescription = async (videoFile: File): Promise<string> => {
  if (!genAI) {
    return 'Engaging video thumbnail';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const prompt = 'Describe this video frame in 3-5 words for thumbnail generation. Be specific and engaging.';
    
    const imageData = await videoFile.arrayBuffer();
    const imagePart = {
      inlineData: {
        data: Buffer.from(imageData).toString('base64'),
        mimeType: videoFile.type
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Thumbnail description error:', error);
    return 'Engaging video thumbnail';
  }
};

