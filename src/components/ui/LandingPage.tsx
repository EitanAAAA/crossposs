import React from 'react';
import { THEME } from '../../constants/theme';
import HeroSection from '../sections/HeroSection';
import TimeSavingSection from '../sections/TimeSavingSection';
// import VideoEditingSection from './VideoEditingSection'; // Removed due to missing module
import ComparisonSection from '../sections/ComparisonSection';
import Footer from './Footer';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -right-24 top-10 w-[460px] h-[460px] blur-3xl opacity-100"
          style={{
            background: `radial-gradient(circle at center, ${THEME.colors.accent}CC, transparent)`,
          }}
        />
        <div
          className="absolute -left-40 top-1/3 w-[520px] h-[520px] blur-3xl opacity-90"
          style={{
            background: `radial-gradient(circle at center, ${THEME.colors.primary}AA, transparent)`,
          }}
        />
      </div>
      <div ref={containerRef} className="min-h-[85vh] flex flex-col items-center justify-start pt-0 md:pt-4 px-0 relative z-10">
        <HeroSection onStart={onStart} />
        <div className="w-full flex justify-center">
          <TimeSavingSection onStart={onStart} />
        </div>
        <ComparisonSection onStart={onStart} />
        <div className="w-full max-w-7xl mt-16 mb-24 px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-black">
            Edit Once, Publish Everywhere
          </h2>
          <p className="text-lg md:text-xl text-[#636e72] font-medium mb-8 max-w-2xl mx-auto">
            The only video editor built for cross-platform creators. Edit with professional tools, then publish to TikTok, YouTube, Instagram, Facebook, X, and LinkedIn — all in one place.
          </p>
          <button
            className="summ-button px-10 py-5 rounded-2xl font-extrabold text-xl flex items-center gap-3 group hover:scale-[1.02] transition-all mx-auto"
            onClick={onStart}
          >
            Start Editing Now
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
