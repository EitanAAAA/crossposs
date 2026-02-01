
import React from 'react';
import { Platform } from '../types';

interface PlatformPreviewProps {
  platform: Platform;
  title: string;
  description: string;
  hashtags: string;
  videoUrl: string | null;
}

const PlatformPreview: React.FC<PlatformPreviewProps> = ({ platform, title, description, hashtags, videoUrl }) => {
  const tags = hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ');

  return (
    <div className="bg-white rounded-[24px] border border-yellow-100/50 overflow-hidden flex flex-col h-full shadow-lg shadow-yellow-900/5">
      <div className="px-4 py-3 bg-[#fdfbf5] border-b border-yellow-50 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4a9082]">{platform}</span>
        <div className="w-2 h-2 rounded-full bg-[#c4e5be]"></div>
      </div>
      
      <div className="relative aspect-[9/16] bg-slate-50 flex-grow">
        {videoUrl ? (
          <video src={videoUrl} className="w-full h-full object-cover rounded-none" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 font-bold uppercase text-[10px]">Empty</div>
        )}
        
        {/* Mock Social Overlays */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1 text-white bg-gradient-to-t from-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-white/50 bg-white/20 backdrop-blur-sm" />
            <span className="text-[10px] font-bold">@creator_pro</span>
          </div>
          <p className="text-[10px] font-medium line-clamp-2 leading-tight opacity-90">{description || 'Caption goes here...'}</p>
          <p className="text-[9px] font-extrabold text-[#e8d85e] uppercase tracking-tighter">{tags}</p>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <p className="text-[11px] font-extrabold text-gray-800 uppercase truncate tracking-tight">{title || 'Untitled Post'}</p>
      </div>
    </div>
  );
};

export default PlatformPreview;
