import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Scissors, Trash2, Layers, Music, Play, Pause, SkipBack, SkipForward, Crop, Wand2, MoveHorizontal, Volume2, Lock, Eye, VolumeX, LockKeyhole, EyeOff, Type, Film, Undo2, Redo2, Maximize2, Search, Minus, PlusCircle } from 'lucide-react';

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

interface VideoTimelineProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  togglePlay: () => void;
  formatTime: (seconds: number) => string;
  zoom: number;
  setZoom: (zoom: number) => void;
  tracks: Track[];
  setCurrentTime: (time: number) => void;
  onAddAsset?: () => void;
  onResizeTimeline?: (e: React.MouseEvent) => void;
  timelineHeight: number;
}

const VideoTimeline: React.FC<VideoTimelineProps> = ({
  currentTime,
  duration,
  isPlaying,
  togglePlay,
  formatTime,
  zoom,
  setZoom,
  tracks,
  setCurrentTime,
  onAddAsset,
  onResizeTimeline,
  timelineHeight
}) => {
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * (duration || 60);
    setCurrentTime(Math.max(0, Math.min(newTime, duration || 60)));
  };

  const timelineTools = [
    { id: 'cut', icon: Scissors, label: 'Cut' },
    { id: 'edit', icon: MoveHorizontal, label: 'Trim/Edit' },
  ];

  return (
    <div 
      className="bg-white/40 backdrop-blur-3xl border-t border-gray-200/40 flex flex-col flex-shrink-0 z-40 relative overflow-hidden text-gray-500"
      style={{ height: `${timelineHeight}px` }}
    >
      {/* Top Resize Handle (Horizontal) - Professional Drag Handle with larger hit area */}
      <div 
        onMouseDown={(e) => {
          e.preventDefault();
          onResizeTimeline?.(e as any);
        }}
        className="h-4 w-full cursor-row-resize hover:bg-[#4a9082]/10 active:bg-[#4a9082]/20 flex items-center justify-center group z-50 absolute top-0 left-0 right-0"
      >
        <div className="h-1 w-20 bg-gray-300/50 rounded-full group-hover:bg-[#4a9082] group-hover:w-32 transition-all duration-500 shadow-sm"></div>
      </div>

      <div className="flex-1 flex overflow-hidden pt-1.5">
        {/* Vertical Timeline Toolbar (Light Sidebar) */}
        <div className="w-14 bg-gray-50/20 backdrop-blur-xl border-r border-gray-200/30 flex flex-col items-center py-6 gap-6 z-20 shadow-sm h-full">
          {timelineTools.map((tool) => (
            <button 
              key={tool.id} 
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 relative group bg-white/20 hover:bg-white/60 backdrop-blur-lg border border-white/40 text-gray-400 hover:text-gray-900 shadow-sm hover:scale-110"
            >
              <tool.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10">
                {tool.label}
              </div>
            </button>
          ))}
        </div>

        {/* Professional Editor Control Panel */}
        <div className="w-40 bg-white/60 border-r border-gray-200/30 flex flex-col p-4 gap-4 z-20 shadow-sm h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-gray-900 transition-colors"><Undo2 className="w-4 h-4" /></button>
              <button className="text-gray-400 hover:text-gray-900 transition-colors"><Redo2 className="w-4 h-4" /></button>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-gray-900 border border-gray-100">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button 
            onClick={onAddAsset}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl text-[9px] font-bold text-gray-400 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all uppercase tracking-widest active:scale-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New file
          </button>
        </div>

        {/* Tracks Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Time Ruler (Above tracks) */}
          <div className="h-[34px] relative border-b border-gray-200/30 bg-white/60 flex items-center justify-between px-4 z-20">
            <div className="flex-1 relative h-full overflow-hidden" onClick={handleTimelineClick}>
              <div 
                className="min-w-full relative h-full cursor-ew-resize transition-all duration-500 ease-out" 
                style={{ width: `${Math.max(100, (duration || 60) * (zoom / 10))}%` }}
              >
                {Array.from({ length: Math.ceil((duration || 60) / 5) + 1 }).map((_, i) => {
                  const time = i * 5;
                  const position = (duration || 60) > 0 ? (time / (duration || 60)) * 100 : 0;
                  return (
                    <div key={i} className="absolute top-0 bottom-0 flex flex-col items-center" style={{ left: `${position}%` }}>
                      <div className="h-2 w-px bg-gray-300 mt-2"></div>
                      <span className="text-[9px] text-gray-400 font-medium mt-1">00.{time.toString().padStart(2, '0')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Global Actions moved to the right of the ruler */}
            <div className="flex items-center gap-3 border-l border-gray-200/50 pl-5 bg-white/30 backdrop-blur-md h-full">
              <button 
                onClick={onAddAsset}
                className="p-2 bg-[#4a9082] text-white rounded-xl hover:bg-[#3d756a] transition-all shadow-[0_8px_20px_rgba(74,144,130,0.2)] active:scale-95 group relative border border-white/20"
              >
                <Plus className="w-4 h-4" />
                <div className="absolute bottom-full mb-3 right-0 px-3 py-1.5 bg-gray-900/95 backdrop-blur-xl text-white text-[9px] font-bold uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10">Add Asset</div>
              </button>
              <button 
                className="p-2 bg-white/60 text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm active:scale-95 group relative border border-white/40"
              >
                <Trash2 className="w-4 h-4" />
                <div className="absolute bottom-full mb-3 right-0 px-3 py-1.5 bg-gray-900/95 backdrop-blur-xl text-white text-[9px] font-bold uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10">Delete Selected</div>
              </button>
            </div>
          </div>

          {/* Tracks Content */}
          <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide bg-gray-50/30 relative custom-scrollbar" onClick={handleTimelineClick}>
            <div 
              className="min-w-full relative pb-12 transition-all duration-500 ease-out" 
              style={{ width: `${Math.max(100, (duration || 60) * (zoom / 10))}%` }}
            >
              {tracks.filter(track => track.clips.length > 0).map((track) => (
                <div key={track.id} className="h-[54px] relative flex items-center group/track border-b border-gray-100/50">
                  {/* Track Label/Controls Left Panel */}
                  <div className="sticky left-0 w-48 h-full bg-white/90 backdrop-blur-xl border-r border-gray-100 z-10 flex items-center justify-between px-4 group/header hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="text-[12px] font-semibold text-gray-600 truncate">
                        {track.name} {track.id === 'v1' ? '(Photo)' : track.type === 'audio' ? '(Voices)' : '(Text)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <button className="p-1 hover:text-gray-900 transition-colors">{track.type === 'audio' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-30" />}</button>
                      <button className="p-1 hover:text-gray-900 transition-colors"><LockKeyhole className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-gray-900 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-red-500 transition-colors" title="Delete Track"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Clips Area */}
                  <div className="flex-1 h-full relative mx-4">
                    <div className="h-full flex items-center overflow-hidden gap-1">
                      {track.clips.length === 0 ? (
                        <div className="h-12 w-full rounded-xl border border-dashed border-gray-200 flex items-center justify-center opacity-30">
                          <Plus className="w-4 h-4" />
                        </div>
                      ) : (
                        track.clips.map((clip) => (
                          <div key={clip.id} className={`h-[37px] min-w-[60px] rounded-xl overflow-hidden relative group cursor-pointer border border-white shadow-lg flex items-center px-3 gap-2 ${
                            track.type === 'audio' ? 'bg-purple-100 border-purple-200 shadow-purple-100/50' : 
                            track.id === 't1' ? 'bg-orange-100 border-orange-200 shadow-orange-100/50' :
                            'bg-gray-100 border-gray-200'
                          }`} style={{ width: `${(clip.duration / (duration || 60)) * 100}%` }}>
                            {clip.thumbnail && <img src={clip.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" alt="" />}
                            
                            {track.type === 'audio' ? (
                              <>
                                <div className="w-6 h-6 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Music className="w-3.5 h-3.5 text-purple-600" />
                                </div>
                                <span className="text-[10px] font-bold text-purple-700 truncate relative z-10">{clip.name}</span>
                                <div className="flex-1 h-6 flex items-center gap-[1px] opacity-60 ml-2">
                                  {Array.from({length: 15}).map((_, idx) => (
                                    <div key={idx} className="flex-1 bg-purple-400 rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                                  ))}
                                </div>
                              </>
                            ) : track.id === 't1' ? (
                              <>
                                <div className="w-6 h-6 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Type className="w-3.5 h-3.5 text-orange-600" />
                                </div>
                                <span className="text-[10px] font-bold text-orange-700 truncate relative z-10">{clip.name}</span>
                                <span className="text-[9px] text-orange-600/60 truncate italic ml-1 font-medium">Text preview...</span>
                              </>
                            ) : (
                              <>
                                <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Film className="w-3.5 h-3.5 text-gray-600" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-700 truncate relative z-10 uppercase tracking-widest">{clip.name}</span>
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}

               {/* Playhead Marker - Liquid Glass Tab */}
               {(duration || 60) > 0 && (
                 <div
                   className="absolute top-0 bottom-0 w-[2px] bg-[#4a9082] z-30 pointer-events-none transition-all duration-75"
                   style={{ left: `${(currentTime / (duration || 60)) * 100}%` }}
                 >
                   <div className="absolute top-0 -left-[12px] w-6 h-4 bg-[#4a9082] rounded-t-lg shadow-2xl flex items-center justify-center border border-white/20">
                     <div className="w-px h-2 bg-white/40 rounded-full"></div>
                   </div>
                   <div className="absolute top-4 bottom-0 -left-[0.5px] w-[1px] bg-gradient-to-b from-[#4a9082] to-transparent opacity-50"></div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTimeline;
