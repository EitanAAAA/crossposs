import React, { useRef, useEffect, useState } from 'react';
import { PLATFORM_CONFIGS } from '../../constants/index';
import { Platform } from '../../types/index';

interface RightPhoneProps {
  scrollProgress: number;
  platform: Platform;
  platformColor: string;
  speedSectionRef?: React.RefObject<HTMLDivElement>;
  distributionSectionRef?: React.RefObject<HTMLDivElement>;
  uploadProgress?: number;
}

const RightPhone: React.FC<RightPhoneProps> = ({ scrollProgress, platform, platformColor, speedSectionRef, distributionSectionRef, uploadProgress = 0 }) => {
  const phoneRef = useRef<HTMLDivElement>(null);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    const updatePositions = () => {
      if (distributionSectionRef?.current) {
        const leftPhone = distributionSectionRef.current.querySelector('[data-left-phone]');
        const container = distributionSectionRef.current.querySelector('[data-phone-container]');
        if (leftPhone && container) {
          const leftRect = leftPhone.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const phoneWidth = 240;
          setInitialPosition({
            x: containerRect.right - phoneWidth - 20,
            y: leftRect.top
          });
        }
      }

      if (speedSectionRef?.current) {
        const rightColumn = speedSectionRef.current.querySelector('[data-right-column]');
        if (rightColumn) {
          const columnRect = rightColumn.getBoundingClientRect();
          const phoneWidth = 240;
          const phoneHeight = 427;
          setTargetPosition({
            x: columnRect.left + columnRect.width / 2 - phoneWidth / 2,
            y: columnRect.top + columnRect.height / 2 - phoneHeight / 2
          });
        }
      }
    };

    const rafUpdate = () => {
      updatePositions();
      requestAnimationFrame(rafUpdate);
    };

    updatePositions();
    const rafId = requestAnimationFrame(rafUpdate);
    window.addEventListener('resize', updatePositions);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePositions);
    };
  }, [speedSectionRef, distributionSectionRef]);

  const platforms = [
    { name: 'YouTube', color: '#FF0000', icon: '▶' },
    { name: 'TikTok', color: '#000000', icon: '♪' },
    { name: 'Instagram', color: '#E4405F', icon: '📷' },
    { name: 'Facebook', color: '#1877F2', icon: '👥' },
  ];

  let x = 0;
  let y = 0;
  let rotation = 8;
  let scale = 1;
  let showBack = false;
  let isLandscape = false;
  let opacity = 1;
  let showUploadBars = false;

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  const mergeX = centerX - 120;
  const mergeY = centerY - 213;

  if (scrollProgress < 0.25) {
    x = initialPosition.x;
    y = initialPosition.y;
    rotation = 8;
    scale = 1;
    showBack = false;
    isLandscape = false;
    showUploadBars = false;
  } else if (scrollProgress >= 0.25 && scrollProgress < 0.4) {
    const progress = (scrollProgress - 0.25) / 0.15;
    const eased = easeInOutCubic(progress);
    const startX = initialPosition.x;
    const startY = initialPosition.y;
    x = startX + (mergeX - startX) * eased;
    y = startY + (mergeY - startY) * eased;
    rotation = 8;
    scale = 1;
    showBack = false;
    isLandscape = false;
    showUploadBars = false;
  } else if (scrollProgress >= 0.4 && scrollProgress < 0.5) {
    const progress = (scrollProgress - 0.4) / 0.1;
    const eased = easeInOutCubic(progress);
    x = mergeX;
    y = mergeY;
    rotation = 8 + (eased * 82);
    scale = 1;
    showBack = eased > 0.5;
    isLandscape = eased > 0.5;
    showUploadBars = false;
  } else if (scrollProgress >= 0.5 && scrollProgress < 0.6) {
    const progress = (scrollProgress - 0.5) / 0.1;
    const eased = easeInOutCubic(progress);
    x = mergeX + (targetPosition.x - mergeX) * eased;
    y = mergeY + (targetPosition.y - mergeY) * eased;
    rotation = 90 - (eased * 82);
    scale = 1;
    showBack = eased < 0.5;
    isLandscape = eased < 0.5;
    showUploadBars = eased > 0.3;
  } else if (scrollProgress >= 0.6 && scrollProgress < 0.7) {
    x = targetPosition.x;
    y = targetPosition.y;
    rotation = 8;
    scale = 1;
    showBack = false;
    isLandscape = false;
    showUploadBars = true;
  } else if (scrollProgress >= 0.7 && scrollProgress < 0.85) {
    x = targetPosition.x;
    y = targetPosition.y;
    rotation = 8;
    scale = 1;
    showBack = false;
    isLandscape = false;
    showUploadBars = true;
  } else if (scrollProgress >= 0.85 && scrollProgress < 0.95) {
    const progress = (scrollProgress - 0.85) / 0.1;
    const eased = easeInOutCubic(progress);
    x = targetPosition.x + (centerX - 120 - targetPosition.x) * eased;
    y = targetPosition.y + (centerY - 213 - targetPosition.y) * eased;
    rotation = 8 + (eased * 82);
    scale = 1;
    showBack = eased > 0.5;
    isLandscape = eased > 0.5;
    showUploadBars = eased < 0.5;
  } else if (scrollProgress >= 0.95) {
    const progress = (scrollProgress - 0.95) / 0.05;
    const eased = easeInOutCubic(progress);
    x = centerX - 200;
    y = centerY - 13 + (eased * 300);
    rotation = 90;
    scale = 1 + (eased * 15);
    showBack = true;
    isLandscape = true;
    showUploadBars = false;
  } else {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    x = centerX - 200;
    y = centerY - 200;
    rotation = 90;
    scale = 16;
    showBack = true;
    isLandscape = true;
  }

  const phoneAspect = isLandscape ? 'aspect-[16/9]' : 'aspect-[9/16]';
  const phoneWidth = isLandscape ? 'w-[400px]' : 'w-[240px]';

  return (
    <div
      ref={phoneRef}
      className={`${phoneWidth} flex-shrink-0 fixed pointer-events-none`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        zIndex: scrollProgress >= 0.6 ? 997 : 20,
        opacity,
        transition: 'none'
      }}
    >
      <div className="relative bg-black rounded-[40px] p-2 shadow-2xl border-4 border-gray-900" style={{ transformStyle: 'preserve-3d' }}>
        <div 
          className={`w-full ${phoneAspect} bg-black rounded-[32px] overflow-hidden relative`}
          style={{
            transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }}
        >
          {!showBack ? (
            <div className={`absolute inset-0 bg-gradient-to-br ${platformColor}`}>
              <div className="absolute inset-0 flex flex-col overflow-hidden">
                <div className="flex-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-4 border-white/30">
                      <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                        {PLATFORM_CONFIGS[platform].icon}
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-none z-10">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <span className="text-[10px] text-white font-bold drop-shadow-lg">5.2K</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-white font-bold drop-shadow-lg">892</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-white font-bold drop-shadow-lg">234</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3 space-y-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-2.5 bg-white rounded w-28 mb-1.5 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-white/90 rounded w-full animate-pulse"></div>
                    <div className="h-2.5 bg-white/90 rounded w-4/5 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-4 h-4 rounded bg-white/30 animate-pulse"></div>
                    <div className="h-2 bg-white/70 rounded flex-1 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-4 overflow-y-auto">
              {showUploadBars ? (
                <div className="w-full max-w-xs space-y-3">
                  <div className="text-center mb-3">
                    <div className="text-[10px] text-green-400 font-bold mb-1">Uploading to all platforms</div>
                  </div>
                  {platforms.map((p, idx) => (
                    <div key={idx} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: p.color }}>
                            {p.icon}
                          </div>
                          <span className="text-white text-[10px] font-bold">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-[9px] text-green-400 font-bold">Up</span>
                        </div>
                      </div>
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#4a9082] to-[#f8d902] rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, uploadProgress + (idx * 15))}%`,
                            animation: 'pulse 1s ease-in-out infinite'
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-gray-400 font-medium">
                          {Math.min(100, Math.floor(uploadProgress + (idx * 15)))}%
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">
                          {Math.floor((100 - (uploadProgress + (idx * 15))) / 10)}s
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-400 font-medium">Total</span>
                      <span className="text-[9px] font-bold text-white">
                        {Math.floor((uploadProgress * platforms.length) / platforms.length)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4a9082] via-[#f8d902] to-[#4a9082] rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (uploadProgress * platforms.length) / platforms.length)}%`,
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s linear infinite'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black"></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightPhone;
