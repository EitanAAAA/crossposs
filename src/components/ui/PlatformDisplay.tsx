import React from 'react';
import { Platform } from '../../types/index';
import { PLATFORM_CONFIGS } from '../../constants/index';

interface PlatformDisplayProps {
  platforms: Platform[];
  connectedPlatforms: Platform[];
  onPlatformClick?: (platform: Platform) => void;
  variant?: 'grid' | 'list' | 'compact';
  showConnectButton?: boolean;
  onConnect?: (platform: Platform) => void;
  userId?: string;
}

const PlatformDisplay: React.FC<PlatformDisplayProps> = ({ 
  platforms, 
  connectedPlatforms, 
  onPlatformClick,
  variant = 'grid',
  showConnectButton = false,
  onConnect,
  userId
}) => {
  const platformColors = [
    { bg: 'bg-[#4a9082]', border: 'border-[#4a9082]', text: 'text-white' },
    { bg: 'bg-[#f8d902]', border: 'border-[#f8d902]', text: 'text-black' },
    { bg: 'bg-[#4a9082]', border: 'border-[#4a9082]', text: 'text-white' },
    { bg: 'bg-[#f8d902]', border: 'border-[#f8d902]', text: 'text-black' },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex gap-4">
        {Object.values(Platform).map((platform, idx) => {
          const isConnected = connectedPlatforms.includes(platform);
          const color = platformColors[idx % platformColors.length];
          return (
            <div
              key={platform}
              className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                isConnected
                  ? `${color.bg} ${color.border} shadow-xl hover:scale-110`
                  : 'bg-gray-50 border-gray-300 opacity-60'
              }`}
              onClick={() => onPlatformClick?.(platform)}
            >
              <svg className={`w-8 h-8 ${isConnected ? color.text : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
                {PLATFORM_CONFIGS[platform].icon}
              </svg>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, idx) => {
          const isConnected = connectedPlatforms.includes(platform);
          const color = platformColors[idx % platformColors.length];
          const config = PLATFORM_CONFIGS[platform];
          
          return (
            <div
              key={platform}
              className={`bg-white rounded-2xl p-6 border-2 transition-all group ${
                isConnected
                  ? `border-[#4a9082] shadow-lg hover:shadow-xl hover:scale-105`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPlatformClick?.(platform)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${
                  isConnected ? `${color.bg} ${color.border}` : 'bg-gray-50 border-gray-200'
                } group-hover:scale-110 transition-transform`}>
                  <svg className={`w-7 h-7 ${isConnected ? color.text : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
                    {config.icon}
                  </svg>
                </div>
                {isConnected ? (
                  <span className="px-3 py-1 bg-[#4a9082]/10 text-[#4a9082] rounded-full text-xs font-bold">
                    Connected
                  </span>
                ) : (
                  showConnectButton && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (platform === Platform.YouTube && userId) {
                          try {
                            // @ts-ignore
                            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                            const response = await fetch(`${API_URL}/auth/youtube?userId=${userId}`);
                            if (!response.ok) throw new Error('Failed to get auth URL');
                            const { authUrl } = await response.json();
                            window.location.href = authUrl;
                          } catch (error) {
                            console.error('Failed to initiate YouTube OAuth:', error);
                            onConnect?.(platform);
                          }
                        } else {
                          onConnect?.(platform);
                        }
                      }}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                    >
                      Connect
                    </button>
                  )
                )}
              </div>
              <h3 className="font-black text-lg text-black mb-1">{platform}</h3>
              <p className="text-xs text-gray-500 font-medium">
                Max {config.maxDuration}s • {config.maxChars} chars
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {platforms.map((platform, idx) => {
        const isConnected = connectedPlatforms.includes(platform);
        const color = platformColors[idx % platformColors.length];
        return (
          <div
            key={platform}
            className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
              isConnected
                ? `${color.bg} ${color.border} shadow-xl hover:scale-105`
                : 'bg-gray-50 border-gray-300 opacity-60 hover:opacity-80'
            }`}
            onClick={() => onPlatformClick?.(platform)}
          >
            <svg className={`w-10 h-10 ${isConnected ? color.text : 'text-gray-400'} mb-2`} viewBox="0 0 24 24" fill="currentColor">
              {PLATFORM_CONFIGS[platform].icon}
            </svg>
            <span className={`text-xs font-bold ${isConnected ? color.text : 'text-gray-500'}`}>
              {platform?.split(' ')[0] || platform || 'Unknown'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PlatformDisplay;

