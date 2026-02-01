import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PLATFORM_CONFIGS } from '../../constants/index';
import { Platform } from '../../types/index';
import { TextReveal } from '../../registry/magicui/text-reveal';

interface TimeSavingSectionProps {
  onStart: () => void;
}

interface PhoneFrameProps {
  size: number;
  children: React.ReactNode;
  opacity?: any;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ size, children, opacity = 1 }) => {
  return (
    <motion.div className="relative" style={{ width: `${size}px`, opacity }}>
      <div className="absolute -right-0.5 top-16 w-[2px] h-10 rounded-full bg-gray-500/70" />
      <div className="absolute -right-0.5 top-32 w-[2px] h-7 rounded-full bg-gray-500/70" />
      <div className="absolute -left-0.5 top-24 w-[2px] h-8 rounded-full bg-gray-500/50" />
      <div className="relative bg-black rounded-[42px] p-[6px] shadow-2xl border border-gray-900/90">
        <div className="absolute left-1/2 -translate-x-1/2 top-0.5 w-20 h-4 rounded-full bg-black/95 flex items-center justify-center gap-1">
          <div className="w-9 h-1.5 rounded-full bg-gray-700/90" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        </div>
        <div className="w-full mt-2">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

const VideoEditingPreview: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <div className="text-[10px] text-gray-400 font-mono">project-alpha.mp4</div>
        <div className="w-4 h-4 rounded bg-gray-700/50" />
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-16 border-r border-gray-700 bg-gray-800/30 p-2 space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-gray-700/50 rounded" />)}
        </div>
        <div className="flex-1 bg-black relative flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-inner" />
        </div>
        <div className="w-20 border-l border-gray-700 bg-gray-800/30 p-2 space-y-2">
          <div className="h-1 bg-gray-600 rounded-full w-full" />
          <div className="h-1 bg-gray-600 rounded-full w-3/4" />
        </div>
      </div>
      <div className="h-16 border-t border-gray-700 bg-gray-900/80 p-2">
        <div className="h-full bg-gray-800/50 rounded border border-gray-700 relative overflow-hidden">
          <div className="absolute inset-y-0 left-4 right-12 bg-[#4a9082]/40 rounded border-x border-[#4a9082]" />
          <div className="absolute inset-y-0 left-1/3 w-[1px] bg-red-500" />
        </div>
      </div>
    </div>
  );
};

const TimeSavingSection: React.FC<TimeSavingSectionProps> = ({ onStart }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 35,
    restDelta: 0.001
  });

  const platformColors: Record<Platform, string> = {
    [Platform.TikTok]: 'from-gray-800 to-black',
    [Platform.Instagram]: 'from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    [Platform.YouTube]: 'from-red-600 to-red-700',
    [Platform.Facebook]: 'from-[#1877f2] to-[#0d5fcc]',
    [Platform.X]: 'from-black to-gray-900',
    [Platform.LinkedIn]: 'from-[#0077b5] to-[#005885]',
    [Platform.Pinterest]: 'from-[#e60023] to-[#b3001b]',
    [Platform.Reddit]: 'from-[#ff4500] to-[#cc3700]'
  };

  const platforms = [
    Platform.Reddit, Platform.Facebook, Platform.YouTube,
    Platform.TikTok,
    Platform.Instagram, Platform.X, Platform.LinkedIn
  ];

  const slotConfigs = [
    { x: -525, y: 0, size: 142, opacity: 0.6, zIndex: 10 },
    { x: -368, y: 0, size: 163, opacity: 0.75, zIndex: 15 },
    { x: -194, y: 0, size: 184, opacity: 0.9, zIndex: 20 },
    { x: 0, y: 0, size: 210, opacity: 1, zIndex: 30 },
    { x: 194, y: 0, size: 184, opacity: 0.9, zIndex: 20 },
    { x: 368, y: 0, size: 163, opacity: 0.75, zIndex: 15 },
    { x: 525, y: 0, size: 142, opacity: 0.6, zIndex: 10 }
  ];

  // Sequence for absolute seamless flow (350vh)
  // 0.0 - 0.35: Text reveal (smooth & gradual)
  // 0.35 - 0.45: Phones entrance (starts EXACTLY at 0.35)
  const phonesInitialOpacity = useTransform(smoothProgress, [0.35, 0.45], [0, 1]);
  const phonesInitialY = useTransform(smoothProgress, [0.35, 0.45], [60, 0]);
  const phonesInitialScale = useTransform(smoothProgress, [0.35, 0.45], [0.9, 1]);

  const mergeProgress = useTransform(smoothProgress, [0.45, 0.65], [0, 1]);
  const rotateProgress = useTransform(smoothProgress, [0.65, 0.75], [0, 1]);
  const crossfadeProgress = useTransform(smoothProgress, [0.75, 0.85], [0, 1]);

  const containerRotation = useTransform(rotateProgress, [0, 1], [0, 90]);
  const containerScale = useTransform(rotateProgress, [0, 1], [1, 3.8]); // Massive zoom for 80% screen
  const containerY = useTransform(rotateProgress, [0, 1], [0, -320]); // Adjusted for perfect center after increased margin
  const descriptionOpacity = useTransform(rotateProgress, [0, 0.3], [1, 0]); // Fade out text earlier
  const frameOpacity = useTransform(crossfadeProgress, [0, 0.5], [1, 0]);
  const previewOpacity = useTransform(crossfadeProgress, [0.3, 1], [0, 1]);
  
  // New white background transition
  const innerBgColor = useTransform(crossfadeProgress, [0, 0.6], ["#000000", "#ffffff"]);

  return (
    <div ref={sectionRef} className="w-full relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a9082]/5 via-transparent to-transparent rounded-[60px] blur-3xl -z-10" />
        
        <motion.div 
          className="w-full max-w-2xl px-8 mb-80 self-start lg:ml-[5%] absolute top-20"
          style={{ opacity: descriptionOpacity }}
        >
          <TextReveal className="text-3xl md:text-4xl lg:text-5xl font-normal text-black tracking-tight leading-tight text-left">
            <h2 className="m-0">
              <span className="block">edit once publish everywhere</span>
              <span className="block mt-1">with our distribution engine</span>
              <span className="block mt-1">powered by a smart editor</span>
            </h2>
          </TextReveal>
        </motion.div>

        <motion.div 
          className="relative w-full flex items-end justify-center"
          style={{ 
            rotate: containerRotation,
            scale: containerScale,
            opacity: phonesInitialOpacity,
            y: containerY,
            scaleX: phonesInitialScale,
            scaleY: phonesInitialScale,
            height: '300px'
          }}
        >
          {platforms.map((platform, index) => {
            const config = slotConfigs[index];
            const platformConfig = PLATFORM_CONFIGS[platform];
            
            const x = useTransform(mergeProgress, [0, 1], [config.x, 0]);
            const y = useTransform(mergeProgress, [0, 1], [config.y, 0]);
            const opacity = useTransform(mergeProgress, [0, 1], [config.opacity, index === 3 ? 1 : 0]);

            return (
              <motion.div
                key={platform}
                className="absolute"
                style={{
                  x,
                  y,
                  opacity,
                  zIndex: config.zIndex,
                }}
              >
                <PhoneFrame size={index === 3 ? 210 : config.size} opacity={index === 3 ? frameOpacity : opacity}>
                  <motion.div 
                    className="w-full aspect-[9/16] rounded-[32px] overflow-hidden relative"
                    style={{ backgroundColor: index === 3 ? innerBgColor : "#ffffff" }}
                  >
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${platformColors[platform]}`} 
                      style={{ opacity: index === 3 ? frameOpacity : 1 }}
                    />
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ opacity: index === 3 ? frameOpacity : 1 }}
                    >
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                          {platformConfig.icon}
                        </svg>
                      </div>
                    </motion.div>
                    
                    {index === 3 && (
                      <motion.div 
                        className="absolute inset-0 z-20"
                        style={{ opacity: previewOpacity, rotate: -90, scale: 1.1 }}
                      >
                        <VideoEditingPreview />
                      </motion.div>
                    )}
                  </motion.div>
                </PhoneFrame>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {/* Spacer to allow the final state to stay on screen */}
      <div className="h-[100vh]" />
    </div>
  );
};

export default TimeSavingSection;
