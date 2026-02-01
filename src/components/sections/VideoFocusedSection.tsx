import React, { useRef, useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import GlareHover from './GlareHover';

interface VideoFocusedSectionProps {
  onStart: () => void;
}

const VideoFocusedSection: React.FC<VideoFocusedSectionProps> = ({ onStart }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'crop' | 'audio' | 'effects' | 'quality'>('crop');

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

  const editorFeatures = [
    {
      id: 'crop' as const,
      title: 'Smart Cropping & Aspect Ratios',
      description: 'Automatically adapts your video to 9:16 (TikTok, Instagram Reels), 1:1 (Instagram Posts), and 16:9 (YouTube) formats. No manual cropping needed.',
      preview: (
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border-2 border-gray-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-2 w-full h-full p-4">
              <div className="bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">9:16</span>
              </div>
              <div className="bg-gradient-to-br from-[#f8d902] to-[#e5c800] rounded-lg flex items-center justify-center">
                <span className="text-black text-xs font-bold">1:1</span>
              </div>
              <div className="bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">16:9</span>
              </div>
            </div>
          </div>
        </div>
      ),
      controls: ['Auto-detect', '9:16 Vertical', '1:1 Square', '16:9 Horizontal']
    },
    {
      id: 'audio' as const,
      title: 'Audio Enhancement & Sync',
      description: 'Perfect audio balance, background music sync, and crystal-clear sound quality. No need for external audio editing tools.',
      preview: (
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#4a9082] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4a9082] rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Volume: 75%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f8d902] flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#f8d902] rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Music: 45%</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="flex-1 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="w-1 bg-[#4a9082] rounded-full" style={{ height: `${20 + Math.random() * 30}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      controls: ['Volume Control', 'Music Sync', 'Noise Reduction', 'Auto Balance']
    },
    {
      id: 'effects' as const,
      title: 'Professional Effects & Filters',
      description: 'Built-in filters, transitions, and effects. No need to use TikTok filters - we handle everything in one place.',
      preview: (
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 p-4">
          <div className="grid grid-cols-4 gap-2">
            {['Vibrant', 'Cinematic', 'Warm', 'Cool', 'B&W', 'Retro', 'Soft', 'Sharp'].map((filter, idx) => (
              <div key={idx} className="h-16 rounded-lg flex items-center justify-center text-xs font-bold transition-all bg-gray-400 text-gray-800 hover:bg-gray-300">
                {filter}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 h-8 bg-gray-800 rounded flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#f8d902] rounded-full"></div>
                <div className="w-2 h-2 bg-[#4a9082] rounded-full"></div>
                <div className="w-2 h-2 bg-[#f8d902] rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400 ml-2">Transitions</span>
            </div>
          </div>
        </div>
      ),
      controls: ['8+ Filters', 'Smooth Transitions', 'Color Grading', 'No TikTok Needed']
    },
    {
      id: 'quality' as const,
      title: 'Optimized Quality & Performance',
      description: 'Lightning-fast processing with maximum quality output. Preview in real-time and export in the perfect format for each platform.',
      preview: (
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Quality</span>
              <span className="text-xs font-bold text-white">4K Ready</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#4a9082] to-[#f8d902] rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex-1">
                <div className="h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-[#4a9082] rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-300">Processing...</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="h-10 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-[10px] text-gray-400">MP4</span>
              </div>
              <div className="h-10 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-[10px] text-gray-400">MP3</span>
              </div>
              <div className="h-10 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-[10px] text-gray-400">WAV</span>
              </div>
            </div>
          </div>
        </div>
      ),
      controls: ['4K Support', 'Real-time Preview', 'Fast Export', 'Multi-Format']
    }
  ];

  const activeFeature = editorFeatures.find(f => f.id === activeTab) || editorFeatures[0];

  return (
    <div ref={sectionRef} className="w-full max-w-7xl mt-16 mb-24 px-2 transition-all duration-500">
      <div className="text-center mb-12">
        <ScrollReveal delay={0}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6" style={{ color: '#1a1a1a' }}>
            Built-In Video Editor
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto" style={{ color: '#636e72' }}>
            Everything you need to edit, enhance, and optimize your videos. No TikTok filters, no external tools - just upload and we handle the rest.
          </p>
        </ScrollReveal>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[40px] border border-gray-200/50 shadow-2xl overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-[#4a9082]/30 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#f8d902]/30 to-transparent blur-3xl pointer-events-none"></div>
        <div className="p-6 md:p-8 relative z-10">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
            {editorFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  activeTab === feature.id
                    ? 'bg-[#4a9082] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {feature.title.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tight" style={{ color: '#1a1a1a' }}>
                {activeFeature.title}
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: '#636e72' }}>
                {activeFeature.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {activeFeature.controls.map((control, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold"
                    style={{ color: '#1a1a1a' }}
                  >
                    {control}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {activeFeature.preview}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white font-bold">
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <ScrollReveal delay={200}>
          <p className="text-lg mb-6" style={{ color: '#636e72' }}>
            <span className="font-bold" style={{ color: '#1a1a1a' }}>No external editing needed.</span> Upload your video and we'll optimize it for every platform automatically.
          </p>
          <GlareHover className="inline-block rounded-2xl">
            <button
              onClick={onStart}
              className="summ-button px-10 py-5 rounded-2xl font-extrabold text-xl flex items-center gap-3 group hover:scale-[1.02] transition-all mx-auto"
            >
              Start Editing Now
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </GlareHover>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default VideoFocusedSection;
