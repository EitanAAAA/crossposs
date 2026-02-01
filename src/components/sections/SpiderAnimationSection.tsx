import React, { useRef, useEffect, useState } from 'react';
import { PLATFORM_CONFIGS } from '../../constants/index';
import { Platform } from '../../types/index';
import ScrollReveal from './ScrollReveal';
import GlareHover from './GlareHover';

interface SpiderAnimationSectionProps {
  onStart: () => void;
}

const SpiderAnimationSection: React.FC<SpiderAnimationSectionProps> = ({ onStart }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [linePaths, setLinePaths] = useState({
    path1: 'M 400,200 L 72,72',
    path2: 'M 400,200 L 728,72',
    path3: 'M 400,200 L 72,328',
    path4: 'M 400,200 L 728,328',
    path5: 'M 400,200 L 400,50',
    path6: 'M 400,200 L 400,350'
  });

  const platformPositions = [
    { x: 200, y: 80, platform: Platform.TikTok },
    { x: 80, y: 200, platform: Platform.Instagram },
    { x: 80, y: 320, platform: Platform.YouTube },
    { x: 720, y: 200, platform: Platform.X },
    { x: 720, y: 320, platform: Platform.Facebook },
    { x: 200, y: 440, platform: Platform.LinkedIn },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const centerX = 400;
      const centerY = 260;
      
      setLinePaths({
        path1: `M ${centerX},${centerY} L ${platformPositions[0].x},${platformPositions[0].y}`,
        path2: `M ${centerX},${centerY} L ${platformPositions[1].x},${platformPositions[1].y}`,
        path3: `M ${centerX},${centerY} L ${platformPositions[2].x},${platformPositions[2].y}`,
        path4: `M ${centerX},${centerY} L ${platformPositions[3].x},${platformPositions[3].y}`,
        path5: `M ${centerX},${centerY} L ${platformPositions[4].x},${platformPositions[4].y}`,
        path6: `M ${centerX},${centerY} L ${platformPositions[5].x},${platformPositions[5].y}`
      });
    }
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="w-full max-w-[90rem] mt-8 mb-16 bg-white/60 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-gray-200/50 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4a9082]/10 via-[#f8d902]/10 to-[#4a9082]/10"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#4a9082]/20 via-[#f8d902]/20 to-transparent blur-[120px] -mr-40 -mt-40"></div>
      
      <div className="flex flex-row gap-8 items-start relative z-10">
        <div className="flex-1 flex flex-col">
          {/* Left side content */}
          <div className="mb-8">
            <ScrollReveal delay={0}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tighter mb-4">
                Less Time, More Popularity
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-lg md:text-xl text-[#636e72] font-medium mb-6">
                Spend less time uploading, get more views and reach. Publish everywhere at once and grow your audience faster.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h3 className="text-2xl md:text-3xl font-black text-black tracking-tighter mb-2">
                One Upload, <span className="bg-gradient-to-r from-[#4a9082] via-[#f8d902] to-[#4a9082] bg-clip-text text-transparent">Every Platform</span>
              </h3>
              <p className="text-base md:text-lg text-[#636e72] font-medium">
                Upload once and watch your content spread across all platforms simultaneously. Save hours every week.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="feature-card feature-item flex flex-col items-center text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:bg-white/60 transition-all">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] flex items-center justify-center mb-4 feature-icon shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-extrabold text-gray-800 leading-tight">Video Focus</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Optimized for Videos</p>
            </div>
            
            <div className="feature-card feature-item flex flex-col items-center text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:bg-white/60 transition-all">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f8d902] to-[#e5c800] flex items-center justify-center mb-4 feature-icon shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm font-extrabold text-gray-800 leading-tight">Simultaneous</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Distribution</p>
            </div>
            
            <div className="feature-card feature-item flex flex-col items-center text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:bg-white/60 transition-all">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] flex items-center justify-center mb-4 feature-icon shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm font-extrabold text-gray-800 leading-tight">Real-Time</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Progress Track</p>
            </div>
            
            <div className="feature-card feature-item flex flex-col items-center text-center bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:bg-white/60 transition-all">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f8d902] to-[#e5c800] flex items-center justify-center mb-4 feature-icon shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-extrabold text-gray-800 leading-tight">Multi-Format</p>
              <p className="text-xs text-gray-500 font-medium mt-1">MP4, MP3, WAV</p>
            </div>
          </div>
        </div>

        {/* Right side - Spider animation and phones */}
        <div className="flex flex-col gap-6 items-center">
          <div ref={containerRef} className="relative flex-shrink-0 w-[480px] h-[600px] rounded-[32px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center border border-gray-200/50">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="spiderLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4a9082" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#4a9082" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4a9082" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="spiderPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4a9082" stopOpacity="0" />
                <stop offset="50%" stopColor="#4a9082" stopOpacity="1" />
                <stop offset="100%" stopColor="#4a9082" stopOpacity="0" />
              </linearGradient>
              <filter id="spiderGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {Object.values(linePaths).map((path, idx) => (
              <g key={idx}>
                <path d={path} className="spider-line" stroke="url(#spiderLineGradient)" strokeWidth="3" fill="none" filter="url(#spiderGlow)" opacity={isVisible ? 1 : 0} style={{ transition: 'opacity 0.5s', transitionDelay: `${idx * 0.1}s` }} />
                <path d={path} className="spider-pulse" stroke="url(#spiderPulse)" strokeWidth="5" fill="none" opacity={isVisible ? 0.6 : 0} style={{ transition: 'opacity 0.5s', transitionDelay: `${idx * 0.1}s` }} />
              </g>
            ))}
          </svg>

          {platformPositions.map((pos, idx) => (
            <div
              key={idx}
              className="absolute animate-float"
              style={{
                left: `${(pos.x / 800) * 100}%`,
                top: `${(pos.y / 600) * 100}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${idx * 0.2}s`,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s',
                transitionDelay: `${idx * 0.1}s`
              }}
            >
              <div className="w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border-2 border-white/50 flex items-center justify-center hover:scale-110 transition-transform">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" style={{ color: pos.platform === Platform.Instagram ? '#E4405F' : pos.platform === Platform.YouTube ? '#FF0000' : pos.platform === Platform.TikTok ? '#000000' : pos.platform === Platform.Facebook ? '#1877F2' : pos.platform === Platform.LinkedIn ? '#0077B5' : '#000000' }}>
                    {PLATFORM_CONFIGS[pos.platform].icon}
                  </svg>
                </div>
              </div>
            </div>
          ))}

          <div className="relative z-50">
            <div className="w-36 h-36 bg-white/80 backdrop-blur-md rounded-[32px] shadow-2xl flex items-center justify-center border-4 border-[#4a9082] group-hover:scale-110 transition-transform relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a9082]/20 via-[#f8d902]/20 to-[#4a9082]/20"></div>
              <div className="flex flex-col items-center relative z-10">
                <svg className="w-16 h-16 text-[#4a9082]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="mt-1.5 text-xs font-black text-[#4a9082] uppercase tracking-tighter">Upload</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Spinning Phones */}
        <div className="flex gap-4 items-center justify-center flex-shrink-0">
            {/* Instagram Phone */}
            <div className="relative animate-spin-slow" style={{ animationDuration: '8s' }}>
              <div className="relative bg-black rounded-[40px] p-2 shadow-2xl border-4 border-gray-900 w-[180px]">
                <div className="w-full aspect-[9/16] bg-white rounded-[32px] overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"></div>
                  <div className="absolute inset-0 flex flex-col">
                    <div className="bg-white px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 animate-pulse group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-gray-200 rounded w-20 animate-pulse"></div>
                          <div className="h-1.5 bg-gray-100 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TikTok Phone */}
            <div className="relative animate-spin-slow" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
              <div className="relative bg-black rounded-[40px] p-2 shadow-2xl border-4 border-gray-900 w-[180px]">
                <div className="w-full aspect-[9/16] bg-black rounded-[32px] overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-blue-900"></div>
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-white/20 animate-pulse group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20 hover:bg-white/20 transition-colors">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </div>
                        <span className="text-[10px] text-white font-bold drop-shadow-lg">5.2K</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20 hover:bg-white/20 transition-colors">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="text-[10px] text-white font-bold drop-shadow-lg">892</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20 hover:bg-white/20 transition-colors">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </div>
                        <span className="text-[10px] text-white font-bold drop-shadow-lg">234</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3 space-y-2">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiderAnimationSection;
