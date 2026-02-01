import React, { useState, useEffect } from 'react';
import { Clapperboard, Image, Type, GalleryHorizontal, Play, Sparkles, Send, Layers, User, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectType, Platform } from '../types';
import { PLATFORM_CONFIGS } from '../constants';
import TargetCursor from './TargetCursor';
import loadingAnimation from '../loading.json';

interface ProjectTypeSelectorProps {
  onSelect: (type: ProjectType, name: string) => void;
  onBack: () => void;
}

const ProjectAnimation: React.FC<{ type: ProjectType }> = ({ type }) => {
  switch (type) {
    case ProjectType.Video:
      return (
        <div className="relative w-40 h-64 flex items-center justify-center">
          <div className="absolute inset-0 border-[6px] border-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-purple-500/20 to-black flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white fill-current ml-1" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 w-0 group-hover:w-full transition-all duration-[3000ms] ease-linear" />
              </div>
            </div>
          </div>
        </div>
      );
    case ProjectType.Post:
      return (
        <div className="relative w-40 h-64 flex items-center justify-center">
          <div className="absolute inset-0 border-[6px] border-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden bg-white">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-100 rounded-full" />
            <div className="mt-8 px-4 space-y-4">
              <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-500">
                <Image size={40} className="text-gray-200 group-hover:text-blue-500 transition-colors duration-500" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-2/3 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors" />
                <div className="h-2 w-full bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      );
    case ProjectType.Text:
      return (
        <div className="relative w-48 h-64 flex flex-col items-center justify-center">
          <div className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-sm group-hover:shadow-xl group-hover:border-amber-500/20 transition-all duration-500 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                <User size={20} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 w-24 bg-gray-100 rounded-full group-hover:bg-amber-500/10 transition-colors" />
                <div className="h-2 w-16 bg-gray-50 rounded-full" />
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-amber-500/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-amber-500/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 delay-75" />
              </div>
              <div className="h-2 w-[85%] bg-gray-100 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-amber-500/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 delay-150" />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <div className="flex gap-4">
                <div className="w-4 h-4 rounded bg-gray-50 group-hover:bg-amber-500/10 transition-colors" />
                <div className="w-4 h-4 rounded bg-gray-50 group-hover:bg-amber-500/10 transition-colors" />
                <div className="w-4 h-4 rounded bg-gray-50 group-hover:bg-amber-500/10 transition-colors" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>
      );
    case ProjectType.Carousel:
      return (
        <div className="relative w-56 h-48 flex flex-col items-center justify-center">
          <div className="relative w-full h-32 flex items-center justify-center gap-4 overflow-hidden">
            <div className="w-24 h-32 bg-white border-2 border-gray-100 rounded-2xl shadow-lg flex-shrink-0 group-hover:-translate-x-full transition-transform duration-1000 ease-in-out flex items-center justify-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <span className="text-emerald-500 font-black">1</span>
              </div>
            </div>
            <div className="w-24 h-32 bg-white border-2 border-emerald-500/20 rounded-2xl shadow-xl flex-shrink-0 group-hover:-translate-x-full transition-transform duration-1000 ease-in-out flex items-center justify-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <span className="text-emerald-500 font-black">2</span>
              </div>
            </div>
            <div className="w-24 h-32 bg-white border-2 border-gray-100 rounded-2xl shadow-lg flex-shrink-0 group-hover:-translate-x-full transition-transform duration-1000 ease-in-out flex items-center justify-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <span className="text-emerald-500 font-black">3</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 mt-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-emerald-300 transition-colors delay-150" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-emerald-200 transition-colors delay-300" />
          </div>
        </div>
      );
    default:
      return null;
  }
};

const PROJECT_TYPES = [
  { id: ProjectType.Text, title: 'Text', platforms: [Platform.X, Platform.LinkedIn, Platform.Reddit] },
  { id: ProjectType.Post, title: 'Image', platforms: [Platform.Instagram, Platform.Facebook, Platform.X, Platform.LinkedIn, Platform.Pinterest] },
  { id: ProjectType.Video, title: 'Video (Reels)', platforms: [Platform.TikTok, Platform.Instagram, Platform.YouTube, Platform.Facebook] },
  { id: ProjectType.Carousel, title: 'Carousel', platforms: [Platform.Instagram, Platform.LinkedIn, Platform.TikTok] }
];

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ onSelect, onBack }) => {
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [projectName, setProjectName] = useState('');
  const [progress, setProgress] = useState(0);

  const handleTypeSelect = (type: ProjectType) => {
    setSelectedType(type);
    setProjectName(`${type}_01`);
    setProgress(0);
    
    const duration = 15000;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const linearProgress = Math.min(elapsed / duration, 1);
      
      let easedProgress;
      if (linearProgress < 0.2) {
        easedProgress = linearProgress * 2;
      } else if (linearProgress < 0.5) {
        easedProgress = 0.4 + (linearProgress - 0.2) * 0.5;
      } else if (linearProgress < 0.8) {
        easedProgress = 0.55 + (linearProgress - 0.5) * 1.16;
      } else {
        easedProgress = 0.9 + (linearProgress - 0.8) * 0.5;
      }
      
      const newProgress = Math.min(easedProgress * 100, 100);
      setProgress(newProgress);
      
      if (linearProgress >= 1) {
        clearInterval(timer);
      }
    }, 50);
  };

  useEffect(() => {
    if (progress >= 100 && selectedType) {
      onSelect(selectedType, projectName || `${selectedType}_01`);
    }
  }, [progress, selectedType, projectName, onSelect]);

  return (
    <div className="w-full min-h-screen bg-[#fffcf0] relative overflow-hidden">
      {/* Logo / Back Button */}
      <div className="absolute top-8 left-10 z-50">
        <div 
          onClick={selectedType ? () => setSelectedType(null) : onBack}
          className="w-12 h-12 bg-[#f8d902] rounded-2xl flex items-center justify-center text-black font-semibold text-2xl shadow-lg border-b-4 border-black/10 cursor-pointer active:scale-95 transition-all"
        >
          C
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedType ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="w-full py-10 px-10"
          >
            <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />
            
            <div className="text-center mb-16">
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">New Post</h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Select your content format to begin</p>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap gap-[10px] w-full">
              {PROJECT_TYPES.map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTypeSelect(type.id)}
                  className="cursor-target group relative bg-white rounded-[3rem] p-10 border-2 border-gray-100 hover:border-gray-200 focus:outline-none transition-all duration-500 shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 text-center flex flex-col items-center min-h-[600px] justify-between w-full lg:w-[calc(25%-7.5px)]"
                >
                  <h3 className="text-2xl font-black text-gray-900 mt-4 tracking-tight uppercase group-hover:scale-105 transition-transform">{type.title}</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <ProjectAnimation type={type.id} />
                  </div>
                  <div className="w-full pt-6 border-t border-gray-50 mb-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Supported Platforms</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {type.platforms.map((platform) => {
                        const platformColors: Record<string, string> = {
                          [Platform.TikTok]: 'text-black', [Platform.Instagram]: 'text-[#E4405F]',
                          [Platform.YouTube]: 'text-[#FF0000]', [Platform.Facebook]: 'text-[#1877F2]',
                          [Platform.X]: 'text-black', [Platform.LinkedIn]: 'text-[#0077B5]',
                          [Platform.Pinterest]: 'text-[#BD081C]', [Platform.Reddit]: 'text-[#FF4500]',
                        };
                        return (
                          <div key={platform} className={`w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl ${platformColors[platform] || 'text-gray-400'} group-hover:bg-white group-hover:shadow-md transition-all duration-500`} title={platform}>
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">{(PLATFORM_CONFIGS as any)[platform].icon}</svg>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="w-full min-h-screen flex flex-col items-center justify-center p-10"
          >
            <div className="max-w-md w-full space-y-12 text-center">
              <div className="relative">
                <div className="w-96 h-96 mx-auto flex items-center justify-center">
                  <Lottie animationData={loadingAnimation} loop={true} className="w-full h-full scale-150" />
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Initializing your environment</h2>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-[#4a9082] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="space-y-6 pt-4">
                <div className="relative group">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-left pl-2">Meanwhile, name your post</p>
                  <input autoFocus type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter project name..." className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-lg font-bold text-gray-900 focus:border-[#4a9082] focus:outline-none transition-all shadow-sm group-hover:shadow-md" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectTypeSelector;
