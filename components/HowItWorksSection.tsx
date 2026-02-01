import React from 'react';
import ScrollReveal from './ScrollReveal';
import { AnimatedBeamDemo } from './AnimatedBeamDemo';

interface HowItWorksSectionProps {
  onStart: () => void;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-24 mt-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Description */}
        <div className="order-2 lg:order-1">
          <ScrollReveal delay={0} direction="right">
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-medium leading-relaxed" style={{ color: '#636e72' }}>
                <span className="font-bold text-black">Seamless Integration.</span> Our advanced AI connects your content to every major platform instantly. Just upload your video, and watch as it passes through our intelligent processing engine, getting optimized and distributed to all your channels simultaneously.
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                No more manual uploads, no more context switching. Let the automated beam of productivity handle your distribution workflow while you focus on creating.
              </p>
              <button
                onClick={onStart}
                className="mt-4 px-8 py-4 bg-black text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                Try It Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side - Animation */}
        <div className="order-1 lg:order-2">
          <ScrollReveal delay={200} direction="left">
            <AnimatedBeamDemo />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;

