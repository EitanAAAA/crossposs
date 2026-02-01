import React from 'react';
import ScrollReveal from '../animations/ScrollReveal';
import GlareHover from '../animations/GlareHover';
import { Platform } from '../../types/index';
import { PLATFORM_CONFIGS } from '../../constants/index';

interface AIContentAdaptationSectionProps {
  onStart: () => void;
}

const AIContentAdaptationSection: React.FC<AIContentAdaptationSectionProps> = ({ onStart }) => {
  const platforms = [
    {
      platform: Platform.YouTube,
      title: 'SEO-Optimized Titles',
      description: 'Longer, keyword-rich titles that rank higher in search',
      example: 'How to Create Viral TikTok Videos: Complete Guide 2026',
      color: 'from-red-600 to-red-700'
    },
    {
      platform: Platform.TikTok,
      title: 'Catchy Short Titles',
      description: 'Short, punchy titles with emojis that grab attention',
      example: '🔥 Viral TikTok Hack You Need! 💯',
      color: 'from-black to-gray-900'
    },
    {
      platform: Platform.Instagram,
      title: 'Hashtag-Optimized',
      description: 'Titles designed for maximum hashtag reach',
      example: 'Best Video Editing Tips #Shorts #Creator',
      color: 'from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]'
    }
  ];

  const adaptations = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      title: 'Platform-Specific Titles',
      description: 'AI generates unique titles optimized for each platform\'s audience and algorithm'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Smart Descriptions',
      description: 'YouTube gets full descriptions, TikTok gets punchy captions, Instagram gets hashtag-first content'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      title: 'Hashtag Optimization',
      description: 'Auto-research trending hashtags per platform, remove banned ones, optimize for reach'
    }
  ];

  return (
    <div className="w-full max-w-7xl mb-24 px-2">
      <div className="text-center mb-12">
        <ScrollReveal delay={0}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6" style={{ color: '#1a1a1a' }}>
            <span className="bg-gradient-to-r from-[#4a9082] via-[#f8d902] to-[#4a9082] bg-clip-text text-transparent">AI Adapts</span> Your Content
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto" style={{ color: '#636e72' }}>
            One video, automatically optimized for every platform. No manual editing, no copy-pasting - AI handles it all.
          </p>
        </ScrollReveal>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[40px] border border-gray-200/50 shadow-2xl overflow-hidden relative mb-12">
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-[#4a9082]/30 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#f8d902]/30 to-transparent blur-3xl pointer-events-none"></div>
        
        <div className="p-8 md:p-12 relative z-10">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {platforms.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <div className="text-white text-2xl">
                    {PLATFORM_CONFIGS[item.platform].icon}
                  </div>
                </div>
                <h3 className="text-xl font-black text-black mb-2">{item.title}</h3>
                <p className="text-gray-600 font-medium text-sm mb-4">{item.description}</p>
                <div className="bg-gray-100 rounded-xl p-3 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-800 italic">"{item.example}"</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {adaptations.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-black mb-2">{item.title}</h3>
                  <p className="text-gray-600 font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <ScrollReveal delay={200}>
          <p className="text-lg mb-6" style={{ color: '#636e72' }}>
            <span className="font-bold" style={{ color: '#1a1a1a' }}>Stop copying and pasting.</span> Let AI create platform-perfect content automatically.
          </p>
          <GlareHover className="inline-block rounded-2xl">
            <button
              onClick={onStart}
              className="summ-button px-10 py-5 rounded-2xl font-extrabold text-xl flex items-center gap-3 group hover:scale-[1.02] transition-all mx-auto"
            >
              Try AI Adaptation Now
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

export default AIContentAdaptationSection;

