import React from 'react';
import { Play, Pause, Upload, Monitor, Smartphone, Sparkles, Heart, MessageCircle, Share2, Music2, User, MoreVertical, Plus } from 'lucide-react';
import { Iphone } from '../registry/magicui/iphone';
import { Platform } from '../types';

interface VideoPreviewAreaProps {
  selectedEffect: string | null;
  currentTime: number;
  duration: number;
  toggleFullscreen: () => void;
  togglePlay: () => void;
  isPlaying: boolean;
  videoUrl: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  onVideoLoaded: () => void;
  onTimeUpdate: () => void;
  aspectRatio: string;
  getAspectRatioClass: (ratio: string) => string;
  audioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;
  activePlatformPreview?: Platform | null;
}

const TikTokOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-20 px-4 text-white">
    <div className="flex justify-between items-end">
      <div className="flex-1 pr-12">
        <h3 className="font-bold text-sm mb-2">@creator_name</h3>
        <p className="text-xs mb-3 line-clamp-2">This is an amazing viral video! #viral #trending #crosspost</p>
        <div className="flex items-center gap-2">
          <Music2 className="w-3.5 h-3.5 animate-spin-slow" />
          <span className="text-[10px] truncate">Original Sound - creator_name</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 pb-4">
        <div className="relative">
          <div className="w-11 h-11 rounded-full border border-white overflow-hidden bg-gray-800">
            <User className="w-full h-full p-2" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#ff0050] rounded-full p-0.5">
            <Plus className="w-3 h-3" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="w-8 h-8 fill-current" />
          <span className="text-[10px] font-bold mt-1">1.2M</span>
        </div>
        <div className="flex flex-col items-center">
          <MessageCircle className="w-8 h-8 fill-current" />
          <span className="text-[10px] font-bold mt-1">4.5K</span>
        </div>
        <div className="flex flex-col items-center">
          <Share2 className="w-8 h-8 fill-current" />
          <span className="text-[10px] font-bold mt-1">12K</span>
        </div>
        <div className="w-8 h-8 rounded-full border-4 border-gray-400/30 animate-spin-slow overflow-hidden">
          <div className="w-full h-full bg-gradient-to-tr from-gray-700 to-gray-900"></div>
        </div>
      </div>
    </div>
  </div>
);

const InstagramOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-12 px-4 text-white">
    <div className="flex justify-between items-end mb-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-white/50 overflow-hidden bg-gray-800">
            <User className="w-full h-full p-1.5" />
          </div>
          <span className="font-bold text-xs">creator_name</span>
          <button className="px-2 py-0.5 border border-white rounded-md text-[10px] font-bold uppercase tracking-wider">Follow</button>
        </div>
        <p className="text-xs line-clamp-1">Amazing content coming soon... #reels</p>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-2 py-0.5 w-fit">
          <Music2 className="w-3 h-3" />
          <span className="text-[9px]">creator_name • Original audio</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Heart className="w-6 h-6" />
        <MessageCircle className="w-6 h-6" />
        <Share2 className="w-6 h-6" />
        <MoreVertical className="w-6 h-6" />
        <div className="w-6 h-6 rounded-md border-2 border-white overflow-hidden">
          <div className="w-full h-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  </div>
);

const YouTubeOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-16 px-4 text-white">
    <div className="flex justify-between items-end">
      <div className="flex-1 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gray-800 border border-white/20 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">@channel_name</span>
          <button className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold">Subscribe</button>
        </div>
        <p className="text-xs mb-2">Check this out! #shorts #viral</p>
      </div>
      <div className="flex flex-col items-center gap-6 pb-2">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <span className="text-[10px] mt-1">Like</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] mt-1">782</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-[10px] mt-1">Share</span>
        </div>
      </div>
    </div>
  </div>
);

const VideoPreviewArea: React.FC<VideoPreviewAreaProps> = ({
  selectedEffect,
  currentTime,
  duration,
  toggleFullscreen,
  togglePlay,
  isPlaying,
  videoUrl,
  videoRef,
  onVideoLoaded,
  onTimeUpdate,
  aspectRatio,
  getAspectRatioClass,
  audioMuted,
  setAudioMuted,
  activePlatformPreview
}) => {
  return (
    <div className="flex-1 bg-[#fcfdfe] relative flex items-center justify-center overflow-hidden py-0">
      {/* Background decoration for Liquid Glass feel */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#4a9082]/5 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Preview Container */}
      <div className={`relative h-full w-full flex items-center justify-center transition-all duration-1000 ease-out group`}>
        {aspectRatio === '9:16' ? (
          <div className="h-full w-full flex items-center justify-center animate-in zoom-in-95 duration-700">
            <Iphone className="shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] h-full w-auto max-w-[560px] aspect-[9/15.2]">
            {videoUrl ? (
              <div className={`w-full h-full bg-black relative transition-all duration-500 ${
                selectedEffect === 'sepia' ? 'sepia-[0.5]' : 
                selectedEffect === 'bw' ? 'grayscale' : 
                selectedEffect === 'bright' ? 'brightness-125' : 
                selectedEffect === 'cool' ? 'hue-rotate-[30deg] saturate-150' : 
                selectedEffect === 'warm' ? 'hue-rotate-[-30deg] saturate-150' : 
                selectedEffect === 'vivid' ? 'saturate-200' : ''
              }`}>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onLoadedMetadata={onVideoLoaded}
                  onTimeUpdate={onTimeUpdate}
                  muted={audioMuted}
                  className="w-full h-full object-cover"
                />
                
                {/* Platform Overlays */}
                {activePlatformPreview === Platform.TikTok && <TikTokOverlay />}
                {activePlatformPreview === Platform.Instagram && <InstagramOverlay />}
                {activePlatformPreview === Platform.YouTube && <YouTubeOverlay />}
                {activePlatformPreview === Platform.Facebook && <InstagramOverlay />} {/* FB Reels is similar to IG */}

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all duration-700 cursor-pointer z-10" onClick={togglePlay}>
                  <button 
                    className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-white border border-white/30 hover:bg-white/30 hover:scale-110 transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)] opacity-0 group-hover:opacity-100 ring-1 ring-white/20"
                    style={{
                      backdropFilter: 'blur(30px)',
                      WebkitBackdropFilter: 'blur(30px)',
                    }}
                  >
                    {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
                  </button>
                </div>
                {/* AI Optimization Status */}
                <div className="absolute bottom-10 left-6 right-6 flex items-center gap-3 px-4 py-2 bg-black/30 backdrop-blur-2xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 z-20">
                  <Sparkles className="w-3.5 h-3.5 text-[#4a9082]" />
                  <span className="text-[9px] font-semibold text-white uppercase tracking-[0.2em]">Neural Engine Live</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/60">
                <div className="w-24 h-24 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-inner relative overflow-hidden group/import cursor-pointer" onClick={() => (document.querySelector('input[type="file"]') as any)?.click()}>
                  <Upload className="w-10 h-10 text-gray-300 group-hover/import:text-[#4a9082] group-hover/import:scale-110 transition-all duration-700" />
                </div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center px-6">Tap to Import High-Fidelity Asset</span>
              </div>
            )}
          </Iphone>
        </div>
      ) : (
          <div className={`relative w-full max-w-5xl ${getAspectRatioClass(aspectRatio as any)} bg-white rounded-[3rem] overflow-hidden border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-1000 ease-out group ${
            selectedEffect === 'sepia' ? 'sepia-[0.5]' : 
            selectedEffect === 'bw' ? 'grayscale' : 
            selectedEffect === 'bright' ? 'brightness-125' : 
            selectedEffect === 'cool' ? 'hue-rotate-[30deg] saturate-150' : 
            selectedEffect === 'warm' ? 'hue-rotate-[-30deg] saturate-150' : 
            selectedEffect === 'vivid' ? 'saturate-200' : ''
          }`} style={{
            backdropFilter: 'blur(60px)',
            WebkitBackdropFilter: 'blur(60px)',
          }}>
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onLoadedMetadata={onVideoLoaded}
                  onTimeUpdate={onTimeUpdate}
                  muted={audioMuted}
                  className="w-full h-full object-contain bg-black shadow-inner"
                />
                
                {/* Platform Overlays (scaled for landscape/square if needed, but primarily for portrait) */}
                {activePlatformPreview === Platform.TikTok && <div className="scale-75 origin-bottom"><TikTokOverlay /></div>}
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all duration-700 cursor-pointer z-10" onClick={togglePlay}>
                  <button 
                    className="w-28 h-24 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-white border border-white/30 hover:bg-white/30 hover:scale-110 transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)] opacity-0 group-hover:opacity-100 ring-1 ring-white/20"
                    style={{
                      backdropFilter: 'blur(30px)',
                      WebkitBackdropFilter: 'blur(30px)',
                    }}
                  >
                    {isPlaying ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2" />}
                  </button>
                </div>
                
                {/* AI Optimization Status */}
                <div className="absolute bottom-10 left-10 flex items-center gap-3 px-5 py-2.5 bg-black/30 backdrop-blur-2xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 z-20">
                  <Sparkles className="w-4 h-4 text-[#4a9082]" />
                  <span className="text-[10px] font-semibold text-white uppercase tracking-[0.2em]">Neural Processing Live</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60">
                <div className="w-40 h-40 rounded-[3.5rem] bg-white border border-gray-100 flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] shadow-inner relative overflow-hidden group/import cursor-pointer" onClick={() => (document.querySelector('input[type="file"]') as any)?.click()}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4a9082]/10 to-transparent opacity-0 group-hover/import:opacity-100 transition-opacity duration-700"></div>
                  <Upload className="w-16 h-16 text-gray-300 group-hover/import:text-[#4a9082] group-hover/import:scale-110 transition-all duration-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 tracking-tight mb-3">Begin Production</h3>
                <p className="text-sm font-bold text-gray-400 mb-10 max-w-sm text-center leading-relaxed uppercase tracking-widest">High-fidelity sequence editing for global reach.</p>
                
                <div className="flex items-center gap-4 px-8 py-4 bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-gray-200/50 hover:scale-105 transition-all">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4a9082] animate-ping"></div>
                  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-[0.3em]">Master Engine Ready</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreviewArea;
