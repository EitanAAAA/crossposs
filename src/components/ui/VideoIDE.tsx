import React, { useEffect, useRef, useState } from 'react';

/**
 * Professional Video Editing IDE
 * Core component for high-performance browser-based editing.
 */
const VideoIDE: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [isPlaying, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    // Initialize Video Worker
    workerRef.current = new Worker(new URL('../services/videoWorker.ts', import.meta.url), { type: 'module' });
    
    if (canvasRef.current) {
      const offscreen = canvasRef.current.transferControlToOffscreen();
      workerRef.current.postMessage({ type: 'INIT_CANVAS', payload: { canvas: offscreen } }, [offscreen]);
    }

    return () => workerRef.current?.terminate();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white text-black overflow-hidden font-sans select-none">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-gray-200 flex items-center px-4 justify-between bg-gray-50/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Select Tool (V)">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" /></svg>
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Blade Tool (B)">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </button>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-4 text-[11px] font-bold tracking-tight text-gray-500">
            <span className="text-black bg-gray-200 px-2 py-0.5 rounded">1920 x 1080</span>
            <span>23.976 fps</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
            <span className="text-[13px] font-mono font-medium tabular-nums">00:00:14:12</span>
          </div>
          <button className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-all shadow-sm">
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Assets & Layers */}
        <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50/30">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Project Assets</span>
            <button className="text-gray-400 hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {/* Asset Items */}
            <div className="group relative aspect-video bg-gray-100 rounded-lg border border-gray-200 overflow-hidden cursor-grab active:cursor-grabbing">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/20 to-transparent">
                <p className="text-[9px] font-bold text-white truncate">A001_C002_0122.mp4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 bg-[#f0f0f0] relative flex items-center justify-center p-12 overflow-hidden">
            <div className="w-full h-full max-w-4xl bg-black shadow-2xl relative group">
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
              
              {/* Playback HUD */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-200 shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                <button className="text-gray-600 hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                </button>
                <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
                <button className="text-gray-600 hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6h2v12h-2zm-10.5 6l8.5 6V6z" /></svg>
                </button>
                <div className="h-6 w-px bg-gray-200"></div>
                <button className="text-gray-400 hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Area */}
          <div className="h-80 border-t border-gray-200 flex flex-col bg-white">
            {/* Timeline Controls */}
            <div className="h-10 border-b border-gray-100 flex items-center px-4 justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </button>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="5" 
                    step="0.1" 
                    value={zoomLevel} 
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-24 accent-black"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>V1</span>
                <span>V2</span>
                <span>A1</span>
              </div>
            </div>

            {/* Timeline Tracks */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#fafafa]">
              {/* Time Ruler */}
              <div className="h-6 border-b border-gray-100 flex items-end px-2 gap-20 text-[9px] font-mono text-gray-400">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i}>00:00:{i.toString().padStart(2, '0')}:00</span>
                ))}
              </div>

              {/* Tracks Container */}
              <div className="p-4 space-y-2 min-w-[2000px]">
                {/* Video Track 1 */}
                <div className="h-12 bg-white border border-gray-200 rounded-lg relative overflow-hidden group shadow-sm">
                  <div className="absolute left-40 top-0 bottom-0 w-96 bg-[#4a9082]/10 border-x-2 border-[#4a9082] flex flex-col justify-center px-3">
                    <span className="text-[10px] font-bold text-[#4a9082] truncate">A001_C002_0122.mp4</span>
                    <div className="h-1 w-full bg-[#4a9082]/20 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#4a9082] w-1/2"></div>
                    </div>
                  </div>
                </div>
                {/* Video Track 2 */}
                <div className="h-12 bg-white border border-gray-200 rounded-lg relative overflow-hidden shadow-sm"></div>
                {/* Audio Track 1 */}
                <div className="h-12 bg-gray-50 border border-gray-200 rounded-lg relative overflow-hidden shadow-sm">
                  <div className="absolute left-40 top-0 bottom-0 w-96 flex items-center px-3 gap-0.5">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <div key={i} className="w-1 bg-purple-200 rounded-full" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Playhead */}
              <div className="absolute top-0 bottom-0 left-64 w-px bg-red-500 z-20 shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                <div className="w-3 h-3 bg-red-500 rounded-full -ml-[5.5px] -mt-1 border border-white shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Inspector */}
        <div className="w-72 border-l border-gray-200 bg-gray-50/30 flex flex-col">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inspector</span>
          </div>
          <div className="p-4 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Transform</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400">Scale</span>
                  <input type="number" defaultValue="100" className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-black" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400">Opacity</span>
                  <input type="number" defaultValue="100" className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-black" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Color Correction</label>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Exposure</span>
                    <span>0.0</span>
                  </div>
                  <input type="range" className="w-full accent-black" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Contrast</span>
                    <span>1.0</span>
                  </div>
                  <input type="range" className="w-full accent-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoIDE;

