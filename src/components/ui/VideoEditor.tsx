import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward, 
  Plus, Grid, Settings, Film, Mic, Music, Type, Radio, User, FileText,
  Upload, Download, Maximize2, Minimize2, RotateCcw, RotateCw, Crop, Scissors,
  Volume2, VolumeX, Zap, Sparkles, Menu, X, Trash2, Layers, Wand2, Sliders,
  Share2, Save, MousePointer2, LayoutPanelLeft, Edit3, Layout, GripVertical, Search, Smartphone,
  Sun, Moon, ChevronDown, Volume1, Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPreviewArea from './VideoPreviewArea';
import VideoTimeline from './VideoTimeline';
import { Platform, ProjectType } from '../../types/index';
import { PLATFORM_CONFIGS } from '../../constants/index';

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio';
  clips: Clip[];
  isVisible: boolean;
  isLocked: boolean;
}

interface Clip {
  id: string;
  name: string;
  start: number;
  duration: number;
  sourceFile?: File;
  sourceUrl?: string;
  thumbnail?: string;
}

type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
type ActivePanel = 'media' | 'effects' | 'audio' | 'ai' | 'text' | 'templates' | 'export';

interface VideoEditorProps {
  projectType: ProjectType;
  projectName?: string;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ projectType, projectName = 'Untitled' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(10);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<ActivePanel>('media');
  const [inspectorWidth, setInspectorWidth] = useState(324);
  const [isDraggingInspector, setIsDraggingInspector] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);
  const [templatesWidth, setTemplatesWidth] = useState(486);
  const [isDraggingTemplates, setIsDraggingTemplates] = useState(false);
  const [activePlatformPreview, setActivePlatformPreview] = useState<Platform | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeOS, setActiveOS] = useState<'ios' | 'android'>('ios');
  const [timelineHeight, setTimelineHeight] = useState(136);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(25);

  const platformIcons: Record<string, string> = {
    [Platform.TikTok]: 'https://cdn.simpleicons.org/tiktok/000000',
    [Platform.Instagram]: 'https://static.cdnlogo.com/logos/i/32/instagram-icon.svg',
    [Platform.YouTube]: 'https://cdn.simpleicons.org/youtube/FF0000',
    [Platform.Facebook]: 'https://cdn.simpleicons.org/facebook/1877F2',
  };
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tracks, setTracks] = useState<Track[]>([
    { 
      id: 'v1', 
      name: 'Media 1', 
      type: 'video', 
      clips: [], 
      isVisible: true, 
      isLocked: false 
    },
    { 
      id: 'a1', 
      name: 'Media 2', 
      type: 'audio', 
      clips: [], 
      isVisible: true, 
      isLocked: false 
    },
    { 
      id: 't1', 
      name: 'Media 3', 
      type: 'video',
      clips: [], 
      isVisible: true, 
      isLocked: false 
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(false);
      setCurrentTime(0);
      setSuggestion(null);

      // Automatically add to timeline as a mock clip for now to show functionality
      const newClip: Clip = {
        id: `clip-${Date.now()}`,
        name: file.name,
        start: 0,
        duration: 30, // Default 30s for mock, will update when loaded
        sourceFile: file,
        sourceUrl: url,
      };

      setTracks(prev => prev.map(track => 
        track.id === 'v1' ? { ...track, clips: [...track.clips, newClip] } : track
      ));
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight, duration: videoDuration } = videoRef.current;
      setDuration(videoDuration);
      
      if (videoWidth > videoHeight && aspectRatio !== '9:16') {
        setSuggestion("AI detected landscape video. Optimal social reach requires 9:16 vertical format.");
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const interval = setInterval(() => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
          if (videoRef.current.ended) {
            setIsPlaying(false);
          }
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds % 60);
    const m = Math.floor(seconds / 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const aspectRatioOptions: AspectRatio[] = ['9:16', '16:9', '1:1', '4:5'];
  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case '9:16': return 'aspect-[9/16]';
      case '16:9': return 'aspect-video';
      case '1:1': return 'aspect-square';
      case '4:5': return 'aspect-[4/5]';
    }
  };

  const sidebarItems = [
    { id: 'media', icon: Film, label: 'Media Library' },
    { id: 'effects', icon: Wand2, label: 'Visual Effects' },
    { id: 'audio', icon: Music, label: 'Audio & Music' },
    { id: 'text', icon: Type, label: 'Typography' },
    { id: 'ai', icon: Sparkles, label: 'AI Superphone' },
    { id: 'templates', icon: Layout, label: 'Templates' },
    { id: 'export', icon: Share2, label: 'Export & Share' },
  ];

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingTemplates) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth < 100) {
        setIsTemplatesOpen(false);
        setIsDraggingTemplates(false);
      } else {
        setTemplatesWidth(Math.max(100, Math.min(800, newWidth)));
      }
    }
    if (isDraggingInspector) {
      const newWidth = e.clientX - 80;
      if (newWidth < 100) {
        setIsSidebarOpen(false);
        setIsDraggingInspector(false);
      } else {
        setInspectorWidth(Math.max(100, Math.min(500, newWidth)));
      }
    }
    if (isDraggingTimeline) {
      const newHeight = window.innerHeight - e.clientY;
      // Increased max height to 600px for better flexibility
      setTimelineHeight(Math.max(100, Math.min(600, newHeight)));
    }
  }, [isDraggingTemplates, isDraggingInspector, isDraggingTimeline]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingTemplates(false);
    setIsDraggingInspector(false);
    setIsDraggingTimeline(false);
  }, []);

  useEffect(() => {
    if (isDraggingTemplates || isDraggingInspector || isDraggingTimeline) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingTemplates, isDraggingInspector, isDraggingTimeline, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full w-full bg-[#fcfdfe] text-gray-900 font-sans select-none overflow-hidden"
    >
      {/* Top Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="h-16 bg-white/90 backdrop-blur-3xl border-b border-gray-200/40 flex items-center justify-between flex-shrink-0 z-50 shadow-sm relative"
      >
        {/* Left: Logo & Project Name */}
        <div className="flex items-center h-full">
          <div className="w-20 flex items-center justify-center border-r border-gray-200/40 h-full">
            <button
              type="button"
              onClick={() => (window.location.href = '/dashboard')}
              className="w-11 h-11 bg-[#f8d902] rounded-2xl flex items-center justify-center text-black font-semibold text-2xl shadow-lg shadow-yellow-200/50 hover:scale-105 transition-all duration-500 border-b-4 border-black/10 cursor-pointer active:scale-95"
              aria-label="Back to Dashboard"
            >
              C
            </button>
          </div>

          <div className="flex items-center gap-2 px-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200/50 group/title cursor-pointer hover:bg-gray-100 transition-all">
              <Film className="w-3.5 h-3.5 text-[#4a9082]" />
              <span className="text-[11px] font-bold text-gray-900 tracking-tight uppercase tracking-[0.1em]" title={projectName}>{projectName}</span>
              <Edit3 className="w-3 h-3 text-gray-300 group-hover/title:text-gray-900 transition-colors" />
            </div>
          </div>
        </div>

        {/* Center: Playback & Controls */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 p-1 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl shadow-gray-200/5">
          {/* Speed Control */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 shadow-sm group/speed">
            <span className="text-[10px] font-bold text-gray-400">0.5x</span>
            <div className="flex items-center w-16 h-3 relative cursor-pointer">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speed}
                onChange={e => setSpeed(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                aria-label="Playback speed"
              />
              <div className="flex-1 h-1 bg-gray-200/50 rounded-full relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white shadow-sm ring-2 ring-blue-500/10 transition-all duration-200"
                  style={{
                    left: `${((speed - 0.5) / 1.5) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                ></div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-900">{speed.toFixed(1)}x</span>
          </div>
          {/* Play/Pause */}
          <div className="flex items-center p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
            <button
              onClick={togglePlay}
              className="w-11 h-11 bg-gray-900 text-white flex items-center justify-center rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/10"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>
          {/* Volume & Aspect Ratio */}
          <div className="flex items-center gap-3">
            {/* Volume */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 shadow-sm group/vol">
              <button
                onClick={() => setVolume(volume === 0 ? 25 : 0)}
                aria-label={volume === 0 ? "Unmute Volume" : "Mute Volume"}
              >
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-gray-400" />}
              </button>
              <div className="flex items-center w-16 h-3 relative cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={volume}
                  onChange={e => setVolume(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  aria-label="Volume"
                />
                <div className="flex-1 h-1 bg-gray-200/50 rounded-full relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white shadow-sm transition-all duration-200"
                    style={{ left: `${volume}%`, transform: 'translate(-50%, -50%)' }}
                  ></div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-gray-900 w-6 text-right">{volume}%</span>
            </div>

            {/* Aspect Ratio */}
            <button
              onClick={() => setAspectRatio(aspectRatio === '9:16' ? '16:9' : '9:16')}
              className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md text-gray-700 rounded-xl shadow-sm border border-white/40 hover:bg-white/60 transition-all cursor-pointer active:scale-95 group"
              aria-label="Switch Aspect Ratio"
              type="button"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{aspectRatio}</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-gray-400" />
            </button>
          </div>
        </div>

        {/* Right: Actions and Publish */}
        <div className="flex items-center h-full gap-4 pr-4">
          {/* Actions: Theme, Save, Fullscreen */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 text-gray-500 hover:text-gray-900 transition-all hover:scale-110 active:scale-95"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
              type="button"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className="p-1.5 text-gray-500 hover:text-gray-900 transition-all hover:scale-110 active:scale-95"
              title="Save Project"
              aria-label="Save Project"
              type="button"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-gray-500 hover:text-gray-900 transition-all hover:scale-110 active:scale-95"
              title="Toggle Fullscreen"
              aria-label="Toggle Fullscreen"
              type="button"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
          {/* Publish */}
          <div className="flex items-center justify-center border-l border-gray-100 pl-4">
            <button
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#f8d902] text-black border-b-4 border-black/10 rounded-xl shadow-lg shadow-yellow-200/40 hover:scale-105 active:scale-95 transition-all text-[10px] font-bold uppercase tracking-widest flex-shrink-0"
              type="button"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Dock */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="w-16 bg-gray-50/30 backdrop-blur-xl border-r border-gray-200/40 flex flex-col items-center py-6 gap-5 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.01)] overflow-y-auto scrollbar-hide"
        >
          {sidebarItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
              onClick={() => {
                if (item.id === 'templates') {
                  if (isTemplatesOpen) {
                    setIsTemplatesOpen(false);
                  } else {
                    setTemplatesWidth(486);
                    setIsTemplatesOpen(true);
                  }
                  return;
                }
                if (activePanel === item.id && isSidebarOpen) {
                  setIsSidebarOpen(false);
                } else {
                  setInspectorWidth(324);
                  setActivePanel(item.id as ActivePanel);
                  setIsSidebarOpen(true);
                }
              }}
              type="button"
              aria-label={item.label}
              className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-500 relative group flex-shrink-0 ${
                activePanel === item.id && isSidebarOpen
                  ? 'bg-white/80 backdrop-blur-2xl border border-white text-[#4a9082] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(74,144,130,0.15)] scale-110 z-10'
                  : 'bg-white/20 hover:bg-white/60 backdrop-blur-lg border border-white/40 text-gray-400 hover:text-gray-900 hover:scale-110 shadow-sm'
              }`}
            >
              <item.icon
                className={`w-[22px] h-[22px] transition-transform duration-500 ${
                  activePanel === item.id && isSidebarOpen ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
              <div className="absolute left-full ml-5 px-3 py-2 bg-gray-900/95 backdrop-blur-xl text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-50 shadow-2xl border border-white/10">
                {item.label}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Left Inspector Panel */}
        <div className="absolute left-20 top-0 bottom-0 z-30 pointer-events-none flex">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ x: -inspectorWidth, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -inspectorWidth, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/70 backdrop-blur-3xl border-r border-gray-200/40 relative flex overflow-hidden pointer-events-auto h-full"
                style={{
                  width: `${inspectorWidth}px`
                }}
              >
                <div className="flex-1 p-8 flex flex-col h-full min-w-[200px]">
                  <div className="flex items-center justify-between mb-8 h-12">
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                      Inspector {activePanel}
                    </h3>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all hover:rotate-90"
                      aria-label="Close inspector"
                      type="button"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 pb-20">
                    {/* Panel Content */}
                    {activePanel === 'media' && (
                      <div className="space-y-8 pb-12">
                        <div
                          className="p-8 border-2 border-dashed border-gray-200 rounded-[2.5rem] hover:border-[#4a9082]/40 hover:bg-teal-50/20 transition-all cursor-pointer group text-center"
                          onClick={() => fileInputRef.current?.click()}
                          tabIndex={0}
                          role="button"
                          aria-label="Import Assets"
                        >
                          <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gray-200/50 group-hover:scale-110 transition-all duration-500">
                            <Plus className="w-8 h-8 text-[#4a9082]" />
                          </div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors">
                            Import Assets
                          </span>
                        </div>
                        {videoFile && (
                          <div className="p-4 bg-white rounded-3xl border border-gray-100 flex items-center gap-4 group shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500">
                            <div className="w-16 h-16 bg-black rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner">
                              <video src={videoUrl || ''} className="w-full h-full object-cover opacity-70" />
                              <Play className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-semibold text-gray-800 truncate mb-1">{videoFile.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-semibold text-gray-400 uppercase tracking-tighter">{(videoFile.size / (1024 * 1024)).toFixed(1)}MB</span>
                              </div>
                            </div>
                            <button className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" type="button" aria-label="Remove video">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {activePanel === 'effects' && (
                      <div className="grid grid-cols-2 gap-4">
                        {['Sepia', 'B&W', 'Bright', 'Cool', 'Warm', 'Vivid'].map(fx => (
                          <button
                            key={fx}
                            onClick={() => setSelectedEffect(fx.toLowerCase())}
                            className={`p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-4 ${
                              selectedEffect === fx.toLowerCase()
                                ? 'bg-teal-50/50 border-[#4a9082] text-gray-900 shadow-xl shadow-teal-200/10 scale-105'
                                : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200 hover:shadow-lg'
                            }`}
                            type="button"
                          >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br shadow-inner ${
                              fx === 'Vivid' ? 'from-orange-400 to-red-500 shadow-orange-200' :
                              fx === 'Cool' ? 'from-blue-400 to-cyan-500 shadow-blue-200' :
                              'from-gray-100 to-gray-200 shadow-gray-100'
                            }`}></div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{fx}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {activePanel === 'audio' && (
                      <div className="space-y-8">
                        <div className="p-6 bg-gradient-to-br from-teal-50/50 to-white rounded-[2.5rem] border border-gray-100 shadow-inner">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md">
                              <Music className="w-5 h-5 text-[#4a9082]" />
                            </div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Soundtrack</span>
                          </div>
                          <div className="space-y-3">
                            {['Cinematic_Vibe.mp3', 'Urban_Chill.wav', 'LoFi_Morning.mp3'].map(track => (
                              <div key={track} className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                                <span className="text-[11px] font-semibold text-gray-700 truncate">{track}</span>
                                <button className="w-8 h-8 bg-[#4a9082] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100" type="button"><Plus className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {activePanel === 'ai' && (
                      <div className="space-y-6">
                        <div className="relative p-8 bg-white border border-gray-100 rounded-[3rem] text-gray-900 shadow-xl overflow-hidden group">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-[#4a9082]/10 rounded-full blur-[60px] -mr-24 -mt-24 transition-all duration-1000 group-hover:scale-150"></div>
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                <Sparkles className="w-6 h-6 text-[#4a9082] animate-pulse" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4a9082]">Social AI</span>
                                <span className="text-lg font-bold tracking-tight">Superphone</span>
                              </div>
                            </div>
                            <p className="text-xs font-medium leading-relaxed text-gray-500 mb-8 text-center">Neural engine optimized for viral portrait reach.</p>
                            <button className="w-full py-4 bg-[#4a9082] text-white text-[10px] font-bold rounded-2xl hover:bg-teal-400 transition-all shadow-xl shadow-teal-100 uppercase tracking-[0.2em] border-b-4 border-black/10" type="button">
                              Portrait Scan
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {activePanel === 'text' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          {['Headline', 'Captions', 'Subtitle', 'Minimal'].map(style => (
                            <button key={style} className="p-6 bg-white border border-gray-100 rounded-3xl flex items-center justify-between group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500" type="button">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#4a9082]/10 group-hover:text-[#4a9082] transition-colors">
                                  <Type className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-800">{style}</span>
                              </div>
                              <Plus className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Inspector Resize Handle */}
                <div
                  onMouseDown={() => setIsDraggingInspector(true)}
                  className="w-1.5 h-full cursor-col-resize hover:bg-[#4a9082]/20 active:bg-[#4a9082]/40 transition-colors flex items-center justify-center group"
                  role="separator"
                  tabIndex={-1}
                  aria-orientation="vertical"
                  aria-label="Resize inspector panel"
                >
                  <div className="w-1 h-12 bg-gray-200 rounded-full group-hover:bg-[#4a9082] transition-colors"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Editor Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col overflow-hidden bg-[#fcfdfe] relative group min-w-0"
        >
          {/* AI Notification */}
          {suggestion && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-10 duration-1000">
              <div className="bg-white/90 backdrop-blur-3xl border border-[#f8d902]/30 shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-6 flex items-center gap-8 max-w-2xl scale-in-95 group/sugg ring-8 ring-yellow-50/50">
                <div className="w-16 h-16 bg-[#f8d902] rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl relative overflow-hidden group-hover/sugg:scale-110 transition-transform duration-700">
                  <Sparkles className="w-8 h-8 text-black relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="px-2 py-0.5 bg-[#4a9082]/10 text-[#4a9082] text-[9px] font-bold rounded-lg uppercase tracking-widest">AI Engine</span>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Optimization</h4>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug tracking-tight">{suggestion}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAspectRatio('9:16');
                      setSuggestion(null);
                    }}
                    className="px-6 py-3 bg-[#4a9082] text-white text-[10px] font-bold rounded-2xl hover:bg-[#3d756a] transition-all shadow-xl shadow-teal-100 uppercase tracking-widest border-b-4 border-black/10 active:scale-95"
                    type="button"
                  >
                    Portrait Fix
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Video Area and Platform Preview */}
          <div className="flex-1 flex items-center justify-center relative p-0">
            <div className="relative flex items-center h-full scale-[1.35] -ml-40">
              {/* Platform Selector */}
              <div className="flex flex-col items-center py-4 px-3 bg-white/50 backdrop-blur-md border border-gray-100/50 rounded-2xl gap-4 z-30 overflow-y-auto overflow-x-hidden scrollbar-hide pointer-events-auto mr-2 shadow-sm h-[75%]">
                <button
                  onClick={() => setActivePlatformPreview(null)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${!activePlatformPreview ? 'bg-red-500 text-white shadow-lg scale-110' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                  title="None"
                  aria-label="Clear Platform Selection"
                  type="button"
                >
                  <Ban className="w-5 h-5" />
                </button>
                <div className="w-full h-px bg-gray-100 my-1"></div>
                {(() => {
                  const supportedPlatforms = {
                    [ProjectType.Video]: [Platform.TikTok, Platform.Instagram, Platform.YouTube, Platform.Facebook],
                    [ProjectType.Post]: [Platform.Instagram, Platform.Facebook, Platform.X, Platform.LinkedIn, Platform.Pinterest],
                    [ProjectType.Text]: [Platform.X, Platform.LinkedIn, Platform.Reddit],
                    [ProjectType.Carousel]: [Platform.Instagram, Platform.LinkedIn, Platform.TikTok]
                  }[projectType];

                  return supportedPlatforms.map(platform => {
                    const platformColors: Record<string, string> = {
                      [Platform.TikTok]: '#000000',
                      [Platform.Instagram]: '#E4405F',
                      [Platform.YouTube]: '#FF0000',
                      [Platform.Facebook]: '#1877F2',
                      [Platform.X]: '#000000',
                      [Platform.LinkedIn]: '#0077B5',
                      [Platform.Pinterest]: '#BD081C',
                      [Platform.Reddit]: '#FF4500',
                    };
                    const color = platformColors[platform];

                    return (
                      <button
                        key={platform}
                        onClick={() => setActivePlatformPreview(platform)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${
                          activePlatformPreview === platform
                            ? 'shadow-lg scale-110'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: activePlatformPreview === platform ? color : undefined,
                          color: activePlatformPreview === platform ? '#ffffff' : color
                        }}
                        aria-label={`${platform} Preview`}
                        type="button"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          {(PLATFORM_CONFIGS as any)[platform].icon}
                        </svg>
                        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                          {platform}
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>
              {/* Video Preview */}
              <div className="h-full flex items-center justify-center -ml-2">
                <VideoPreviewArea
                  selectedEffect={selectedEffect}
                  currentTime={currentTime}
                  duration={duration}
                  toggleFullscreen={toggleFullscreen}
                  togglePlay={togglePlay}
                  isPlaying={isPlaying}
                  videoUrl={videoUrl}
                  videoRef={videoRef}
                  onVideoLoaded={handleVideoLoaded}
                  onTimeUpdate={handleTimeUpdate}
                  aspectRatio={aspectRatio}
                  getAspectRatioClass={getAspectRatioClass}
                  audioMuted={audioMuted}
                  setAudioMuted={setAudioMuted}
                  activePlatformPreview={activePlatformPreview}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Discovery Templates Panel */}
        <div className="absolute right-0 top-0 bottom-0 z-20 pointer-events-none">
          <AnimatePresence>
            {isTemplatesOpen && (
              <motion.div
                initial={{ x: 486, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 486, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/80 backdrop-blur-3xl border-l border-gray-200/40 relative flex overflow-hidden pointer-events-auto h-full"
                style={{
                  width: `${templatesWidth}px`,
                  maxWidth: '35vw'
                }}
              >
                {/* Templates Resize Handle */}
                <div
                  onMouseDown={() => setIsDraggingTemplates(true)}
                  className="w-1.5 h-full cursor-col-resize hover:bg-[#4a9082]/20 active:bg-[#4a9082]/40 transition-colors flex items-center justify-center group z-50"
                  role="separator"
                  tabIndex={-1}
                  aria-orientation="vertical"
                  aria-label="Resize discovery panel"
                >
                  <div className="w-1 h-8 bg-gray-200 rounded-full group-hover:bg-[#4a9082] transition-colors"></div>
                </div>

                <div className="flex-1 p-6 pb-0 flex flex-col h-full min-w-[200px]">
                  <div className="flex items-center justify-between mb-8 h-12 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                        Discovery Templates
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsTemplatesOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all hover:rotate-90"
                      aria-label="Close templates"
                      type="button"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Search Bar */}
                  <div className="relative mb-6 group flex-shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#4a9082] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search premium templates..."
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4a9082]/10 focus:bg-white transition-all placeholder:text-gray-400"
                      aria-label="Search Templates"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-hide pr-4 -mr-4">
                    <div className="grid grid-cols-2 gap-4 pb-4">
                      {[
                        { id: 1, name: 'Minimalist Social', thumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop' },
                        { id: 2, name: 'Dynamic Vlog', thumb: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=400&h=600&fit=crop' },
                        { id: 3, name: 'Cinematic Travel', thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop' },
                        { id: 4, name: 'Tech Review', thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop' },
                        { id: 6, name: 'Cooking Masterclass', thumb: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=600&fit=crop' },
                        { id: 7, name: 'Fitness Motivation', thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop' },
                        { id: 8, name: 'Gaming Highlights', thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop' },
                        { id: 9, name: 'Product Showcase', thumb: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=600&fit=crop' },
                        { id: 10, name: 'Nature Escape', thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop' },
                      ].map(tmpl => (
                        <div key={tmpl.id} className="group cursor-pointer">
                          <div className="aspect-[16/11] rounded-2xl overflow-hidden bg-gray-100 relative mb-2 shadow-sm group-hover:shadow-xl group-hover:translate-y-[-4px] transition-all duration-500">
                            <img src={tmpl.thumb} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={tmpl.name} />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button className="px-6 py-3 bg-[#f8d902] text-black text-[10px] font-bold rounded-2xl shadow-xl uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" type="button">
                                Use Template
                              </button>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-900 tracking-tight">{tmpl.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Timeline */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <VideoTimeline
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          formatTime={formatTime}
          zoom={zoom}
          setZoom={setZoom}
          tracks={tracks}
          setCurrentTime={handleSeek}
          onAddAsset={() => fileInputRef.current?.click()}
          onResizeTimeline={() => setIsDraggingTimeline(true)}
          timelineHeight={timelineHeight}
        />
      </motion.div>
    </motion.div>
  );
}

export default VideoEditor;
