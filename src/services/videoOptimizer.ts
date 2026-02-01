export interface VideoOptimizationOptions {
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  maxDuration?: number;
  maxFileSize?: number;
  quality?: 'high' | 'medium' | 'low';
  cropMode?: 'center' | 'smart' | 'face';
  platform?: string;
}

export interface PlatformVideoSpecs {
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  maxDuration: number;
  maxFileSize: number;
  recommendedQuality: 'high' | 'medium' | 'low';
  dimensions: { width: number; height: number };
}

export const PLATFORM_SPECS: Record<string, PlatformVideoSpecs> = {
  'TikTok': {
    aspectRatio: '9:16',
    maxDuration: 180,
    maxFileSize: 287 * 1024 * 1024,
    recommendedQuality: 'high',
    dimensions: { width: 1080, height: 1920 }
  },
  'Instagram Reels': {
    aspectRatio: '9:16',
    maxDuration: 90,
    maxFileSize: 100 * 1024 * 1024,
    recommendedQuality: 'high',
    dimensions: { width: 1080, height: 1920 }
  },
  'YouTube Shorts': {
    aspectRatio: '9:16',
    maxDuration: 60,
    maxFileSize: 256 * 1024 * 1024,
    recommendedQuality: 'high',
    dimensions: { width: 1080, height: 1920 }
  },
  'Facebook Reels': {
    aspectRatio: '9:16',
    maxDuration: 90,
    maxFileSize: 100 * 1024 * 1024,
    recommendedQuality: 'high',
    dimensions: { width: 1080, height: 1920 }
  },
  'X': {
    aspectRatio: '16:9',
    maxDuration: 140,
    maxFileSize: 512 * 1024 * 1024,
    recommendedQuality: 'medium',
    dimensions: { width: 1280, height: 720 }
  },
  'LinkedIn': {
    aspectRatio: '16:9',
    maxDuration: 600,
    maxFileSize: 200 * 1024 * 1024,
    recommendedQuality: 'high',
    dimensions: { width: 1920, height: 1080 }
  }
};

export const getOptimalSettings = (platform: string): VideoOptimizationOptions => {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) {
    return {
      aspectRatio: '9:16',
      maxDuration: 60,
      quality: 'high',
      cropMode: 'smart'
    };
  }

  return {
    aspectRatio: spec.aspectRatio,
    maxDuration: spec.maxDuration,
    maxFileSize: spec.maxFileSize,
    quality: spec.recommendedQuality,
    cropMode: 'smart',
    platform
  };
};

export const calculateAspectRatio = (width: number, height: number): string => {
  const ratio = width / height;
  
  if (Math.abs(ratio - 9/16) < 0.1) return '9:16';
  if (Math.abs(ratio - 16/9) < 0.1) return '16:9';
  if (Math.abs(ratio - 1) < 0.1) return '1:1';
  if (Math.abs(ratio - 4/5) < 0.1) return '4:5';
  
  return `${width}:${height}`;
};

export const getTargetDimensions = (aspectRatio: string, maxWidth: number = 1080): { width: number; height: number } => {
  const ratios: Record<string, number> = {
    '9:16': 9/16,
    '16:9': 16/9,
    '1:1': 1,
    '4:5': 4/5
  };

  const ratio = ratios[aspectRatio] || 9/16;
  const width = maxWidth;
  const height = Math.round(width / ratio);

  return { width, height };
};

export const estimateFileSize = (duration: number, width: number, height: number, quality: 'high' | 'medium' | 'low'): number => {
  const bitrates = {
    high: 8000,
    medium: 4000,
    low: 2000
  };

  const bitrate = bitrates[quality];
  const sizeInBits = (bitrate * 1000) * duration;
  return sizeInBits / 8;
};

export const needsOptimization = (
  currentAspectRatio: string,
  targetAspectRatio: string,
  currentDuration: number,
  targetMaxDuration: number,
  currentFileSize: number,
  targetMaxFileSize: number
): boolean => {
  return (
    currentAspectRatio !== targetAspectRatio ||
    currentDuration > targetMaxDuration ||
    currentFileSize > targetMaxFileSize
  );
};

export const getOptimizationSuggestions = (
  platform: string,
  currentAspectRatio: string,
  currentDuration: number,
  currentFileSize: number
): string[] => {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) return [];

  const suggestions: string[] = [];

  if (currentAspectRatio !== spec.aspectRatio) {
    suggestions.push(`Aspect ratio needs to be ${spec.aspectRatio} (currently ${currentAspectRatio})`);
  }

  if (currentDuration > spec.maxDuration) {
    suggestions.push(`Duration exceeds ${spec.maxDuration}s limit (currently ${Math.round(currentDuration)}s)`);
  }

  if (currentFileSize > spec.maxFileSize) {
    const sizeMB = (currentFileSize / (1024 * 1024)).toFixed(1);
    const maxMB = (spec.maxFileSize / (1024 * 1024)).toFixed(1);
    suggestions.push(`File size too large: ${sizeMB}MB (max: ${maxMB}MB)`);
  }

  return suggestions;
};

