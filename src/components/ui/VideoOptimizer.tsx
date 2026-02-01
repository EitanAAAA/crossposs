import React, { useState, useRef, useEffect } from 'react';
import { Platform } from '../../types/index';
import { 
  VideoOptimizationOptions, 
  getOptimalSettings, 
  calculateAspectRatio,
  getTargetDimensions,
  needsOptimization,
  getOptimizationSuggestions,
  PLATFORM_SPECS
} from '../services/videoOptimizer';

interface VideoOptimizerProps {
  videoFile: File | null;
  selectedPlatforms: Platform[];
  onOptimize: (optimizedFile: File, platform: Platform) => void;
}

const VideoOptimizer: React.FC<VideoOptimizerProps> = ({ videoFile, selectedPlatforms, onOptimize }) => {
  const [videoInfo, setVideoInfo] = useState<{
    width: number;
    height: number;
    duration: number;
    aspectRatio: string;
    fileSize: number;
  } | null>(null);
  
  const [optimizationSettings, setOptimizationSettings] = useState<Record<Platform, VideoOptimizationOptions>>({} as Record<Platform, VideoOptimizationOptions>);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoFile) {
      setVideoInfo(null);
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);

    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      const duration = video.duration;
      const aspectRatio = calculateAspectRatio(width, height);

      setVideoInfo({
        width,
        height,
        duration,
        aspectRatio,
        fileSize: videoFile.size
      });

      const initialSettings: Record<Platform, VideoOptimizationOptions> = {} as Record<Platform, VideoOptimizationOptions>;
      selectedPlatforms.forEach(platform => {
        initialSettings[platform] = getOptimalSettings(platform);
      });
      setOptimizationSettings(initialSettings);
    };

    return () => {
      URL.revokeObjectURL(video.src);
    };
  }, [videoFile, selectedPlatforms]);

  const handleOptimize = async (platform: Platform) => {
    if (!videoFile || !videoInfo || !canvasRef.current) return;

    const settings = optimizationSettings[platform];
    const targetDims = getTargetDimensions(settings.aspectRatio!);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.currentTime = 0;

    await new Promise((resolve) => {
      video.onloadeddata = () => {
        canvas.width = targetDims.width;
        canvas.height = targetDims.height;

        const sourceAspect = videoInfo.width / videoInfo.height;
        const targetAspect = targetDims.width / targetDims.height;

        let sx = 0, sy = 0, sw = videoInfo.width, sh = videoInfo.height;

        if (sourceAspect > targetAspect) {
          sw = videoInfo.height * targetAspect;
          sx = (videoInfo.width - sw) / 2;
        } else {
          sh = videoInfo.width / targetAspect;
          sy = (videoInfo.height - sh) / 2;
        }

        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, targetDims.width, targetDims.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], videoFile.name, { type: 'video/mp4' });
            onOptimize(optimizedFile, platform);
          }
          URL.revokeObjectURL(video.src);
          resolve(null);
        }, 'video/mp4', 0.9);
      };
    });
  };

  if (!videoFile || !videoInfo) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-500">Upload a video to optimize</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-black text-black mb-4">Video Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Dimensions</p>
            <p className="text-sm font-black text-black">{videoInfo.width} × {videoInfo.height}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Aspect Ratio</p>
            <p className="text-sm font-black text-black">{videoInfo.aspectRatio}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Duration</p>
            <p className="text-sm font-black text-black">{Math.round(videoInfo.duration)}s</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">File Size</p>
            <p className="text-sm font-black text-black">{(videoInfo.fileSize / (1024 * 1024)).toFixed(1)} MB</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedPlatforms.map((platform) => {
          const spec = PLATFORM_SPECS[platform];
          const settings = optimizationSettings[platform];
          const suggestions = getOptimizationSuggestions(
            platform,
            videoInfo.aspectRatio,
            videoInfo.duration,
            videoInfo.fileSize
          );
          const needsOpt = needsOptimization(
            videoInfo.aspectRatio,
            settings.aspectRatio!,
            videoInfo.duration,
            settings.maxDuration || spec.maxDuration,
            videoInfo.fileSize,
            settings.maxFileSize || spec.maxFileSize
          );

          return (
            <div key={platform} className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#4a9082] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-black text-black">{platform}</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Target: {settings.aspectRatio} • Max: {spec.maxDuration}s • {spec.dimensions.width}×{spec.dimensions.height}
                  </p>
                </div>
                {needsOpt && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                    Needs Optimization
                  </span>
                )}
              </div>

              {suggestions.length > 0 && (
                <div className="mb-4 space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <select
                  value={settings.aspectRatio}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    [platform]: { ...settings, aspectRatio: e.target.value as any }
                  })}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-sm focus:border-[#4a9082] focus:outline-none"
                >
                  <option value="9:16">9:16 (Vertical)</option>
                  <option value="16:9">16:9 (Horizontal)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Portrait)</option>
                </select>
                <button
                  onClick={() => handleOptimize(platform)}
                  className="px-6 py-2 bg-[#4a9082] text-white rounded-xl font-bold hover:bg-[#3d7a6e] transition-all"
                >
                  Optimize
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VideoOptimizer;

