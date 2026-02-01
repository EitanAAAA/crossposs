import React from 'react';
import ScrollReveal from '../animations/ScrollReveal';
import GlareHover from '../animations/GlareHover';
import { Platform } from '../../types/index';
import { PLATFORM_CONFIGS } from '../../constants/index';

interface PlatformIntegrationsSectionProps {
  onStart: () => void;
}

const PlatformIntegrationsSection: React.FC<PlatformIntegrationsSectionProps> = ({ onStart }) => {
  const platforms = [
    { platform: Platform.YouTube, status: 'connected', label: 'YouTube Shorts' },
    { platform: Platform.TikTok, status: 'coming', label: 'TikTok' },
    { platform: Platform.Instagram, status: 'coming', label: 'Instagram Reels' },
    { platform: Platform.Facebook, status: 'coming', label: 'Facebook Reels' },
    { platform: Platform.X, status: 'coming', label: 'X (Twitter)' },
    { platform: Platform.LinkedIn, status: 'coming', label: 'LinkedIn' }
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'connected') {
      return (
        <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-lg text-xs font-bold text-green-600 border border-green-500/30">
          ✅ Connected
        </div>
      );
    }
    return (
      <div className="px-3 py-1 bg-gray-500/20 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-600 border border-gray-500/30">
        ⏳ Coming Soon
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mb-24 px-2">
      <div className="text-center mb-12">
        <ScrollReveal delay={0}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6" style={{ color: '#1a1a1a' }}>
            All Your <span className="bg-gradient-to-r from-[#4a9082] via-[#f8d902] to-[#4a9082] bg-clip-text text-transparent">Platforms</span> in One Place
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto" style={{ color: '#636e72' }}>
            Connect once, publish everywhere. We support all major video platforms and add new ones regularly.
          </p>
        </ScrollReveal>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[40px] border border-gray-200/50 shadow-2xl overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-[#4a9082]/30 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#f8d902]/30 to-transparent blur-3xl pointer-events-none"></div>
        
        <div className="p-8 md:p-12 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((item, idx) => {
              const config = PLATFORM_CONFIGS[item.platform];
              const platformColors: Record<Platform, string> = {
                [Platform.TikTok]: 'from-black to-gray-900',
                [Platform.Instagram]: 'from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
                [Platform.YouTube]: 'from-red-600 to-red-700',
                [Platform.Facebook]: 'from-[#1877f2] to-[#0d5fcc]',
                [Platform.X]: 'from-black to-gray-900',
                [Platform.LinkedIn]: 'from-[#0077b5] to-[#005885]',
                [Platform.Pinterest]: 'from-[#e60023] to-[#b3001b]',
                [Platform.Reddit]: 'from-[#ff4500] to-[#cc3700]'
              };
              const color = platformColors[item.platform];

              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                      {config.icon}
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  <h3 className="text-2xl font-black text-black mb-2">{item.label}</h3>
                  <p className="text-gray-600 font-medium text-sm">
                    {item.status === 'connected' 
                      ? 'Upload videos directly to your channel'
                      : 'Support coming soon - stay tuned!'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <ScrollReveal delay={200}>
          <p className="text-lg mb-6" style={{ color: '#636e72' }}>
            <span className="font-bold" style={{ color: '#1a1a1a' }}>One connection, infinite reach.</span> Connect your platforms and start publishing.
          </p>
          <GlareHover className="inline-block rounded-2xl">
            <button
              onClick={onStart}
              className="summ-button px-10 py-5 rounded-2xl font-extrabold text-xl flex items-center gap-3 group hover:scale-[1.02] transition-all mx-auto"
            >
              Connect Your Platforms
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

export default PlatformIntegrationsSection;

