
import React, { useRef } from 'react';
import { PLATFORM_CONFIGS } from '../../constants/index';
import BlurText from './BlurText';
import TrueFocus from './TrueFocus';
import GlareHover from './GlareHover';
import ShineEntrance from './ShineEntrance';
import BlurVariableProximity from './BlurVariableProximity';

interface HeroSectionProps {
  onStart: () => void;
}

const CameraTitle: React.FC = () => {
  return (
    <div
      className="inline-block px-10 py-8 relative"
      style={{
        animation: 'camera-scale-in 1500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transformOrigin: 'center',
        opacity: 0,
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white/80" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white/80" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-white/80" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white/80" />
        <div className="absolute inset-10 flex items-center justify-center">
          <div className="w-6 h-0.5 bg-white/70" />
          <div className="w-0.5 h-6 bg-white/70" />
        </div>
      </div>
      <div className="relative">
        <h1
          className="text-6xl md:text-[6.5rem] lg:text-[5rem] xl:text-[5.5rem] font-black tracking-tighter leading-[0.92] pb-2"
          style={{ transform: 'translateY(-8px)' }}
        >
          <BlurText
            text="Edit"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-black"
          />
          {' '}
          <span className="relative inline-block px-2 rounded overflow-hidden">
            <BlurText
              text="once,"
              delay={200}
              animateBy="words"
              direction="top"
              className="text-black relative z-10"
            />
            <div
              className="absolute inset-0 bg-[#f8d902]"
              style={{
                transform: 'translateX(-100%)',
                animation: 'yellow-sweep 2400ms cubic-bezier(0.4, 0, 0.2, 1) 1200ms forwards',
              }}
            />
          </span>
          <br style={{ marginTop: '8px', display: 'block' }} />
          <TrueFocus
            sentence="publish everywhere."
            manualMode={false}
            blurAmount={3}
            borderColor="#4a9082"
            animationDuration={2}
            pauseBetweenAnimations={1}
            className="text-6xl md:text-[6.5rem] lg:text-[5rem] xl:text-[5.5rem] font-black tracking-tighter"
          />
        </h1>
      </div>
      <style>
        {`
          @keyframes camera-scale-in {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            60% {
              transform: scale(1.03);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes yellow-sweep {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0%);
            }
          }
        `}
      </style>
    </div>
  );
};

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  const descriptionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-5xl w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div style={{ transform: 'translateY(-12px)' }}>
        <CameraTitle />
      </div>

      <div
        ref={descriptionRef}
        style={{ position: 'relative', minHeight: '80px', transform: 'translateY(-20px)' }}
      >
        <p
          className="text-xl md:text-2xl text-[#636e72] font-medium max-w-2xl mx-auto leading-relaxed"
          style={{ display: 'inline-block', width: '100%' }}
        >
          <BlurVariableProximity
            label="The video editor built for creators. Edit with professional tools, add effects, and optimize your content. Then publish everywhere automatically."
            fromFontVariationSettings="'wght' 800, 'opsz' 14"
            toFontVariationSettings="'wght' 850, 'opsz' 14"
            containerRef={descriptionRef}
            radius={100}
            falloff="linear"
            delay={300}
            animateBy="words"
            direction="top"
            className="inline-block"
          />
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 pt-4" style={{ transform: 'translateY(-11px)' }}>
        <ShineEntrance delay={600} duration={1200} shineDelay={800}>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.25}
            glareAngle={-30}
            glareSize={350}
            transitionDuration={1000}
            playOnce={false}
          >
            <button
              onClick={onStart}
              className="group relative px-8 py-5 rounded-3xl border-2 border-dashed border-[#4a9082] bg-gradient-to-br from-[#4a9082]/20 to-[#4a9082]/25 hover:border-[#3d7a6e] hover:bg-gradient-to-br hover:from-[#4a9082]/25 hover:to-[#4a9082]/30 transition-all duration-300 cursor-pointer flex items-center gap-3"
              style={{ borderWidth: '3px' }}
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform">
                <svg className="w-5 h-5 text-[#2d3436] group-hover:text-[#4a9082] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-extrabold text-lg text-[#2d3436] group-hover:text-[#4a9082] transition-colors">
                Start Editing Now
              </span>
            </button>
          </GlareHover>
        </ShineEntrance>

        <div className="flex flex-col items-center gap-6">
          <ShineEntrance delay={800} duration={1200}>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[
                  'https://i.pravatar.cc/150?img=1',
                  'https://i.pravatar.cc/150?img=12',
                  'https://i.pravatar.cc/150?img=33',
                  'https://i.pravatar.cc/150?img=45',
                  'https://i.pravatar.cc/150?img=68',
                ].map((avatarUrl, i) => (
                  <img
                    key={i}
                    src={avatarUrl}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                    style={{
                      zIndex: 5 - i,
                    }}
                  />
                ))}
              </div>
              <p className="text-[#636e72] text-sm font-semibold">
                Used by <span className="font-bold text-[#2d3436]">100,000+ influencers and companies</span>
              </p>
            </div>
          </ShineEntrance>

          <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {Object.entries(PLATFORM_CONFIGS).map(([key, config], index) => (
              <div
                key={key}
                className="flex flex-col items-center gap-2 group cursor-default"
                style={{
                  opacity: 0,
                  transform: 'scale(0)',
                  animation: `platform-scale-in 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                  animationDelay: `${1000 + index * 150}ms`,
                }}
              >
                <svg className="w-8 h-8 text-[#2d3436] group-hover:text-[#4a9082] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  {config.icon}
                </svg>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black">{key?.split(' ')[0] || key || 'Unknown'}</span>
              </div>
            ))}
          </div>
          <style>
            {`
              @keyframes platform-scale-in {
                0% {
                  opacity: 0;
                  transform: scale(0);
                }
                60% {
                  transform: scale(1.2);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
