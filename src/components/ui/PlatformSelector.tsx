
import React from 'react';
import { Platform } from '../../types';
import { PLATFORM_CONFIGS } from '../../constants';

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
  availablePlatforms?: Platform[]; // Only show these platforms
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange, availablePlatforms }) => {
  const togglePlatform = (p: Platform) => {
    if (selected.includes(p)) {
      onChange(selected.filter((item) => item !== p));
    } else {
      onChange([...selected, p]);
    }
  };

  // Use availablePlatforms if provided, otherwise show all platforms
  const platformsToShow = availablePlatforms && availablePlatforms.length > 0 
    ? availablePlatforms 
    : (Object.keys(PLATFORM_CONFIGS) as Platform[]);

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#2d5a52] mb-6 px-1">
        {availablePlatforms && availablePlatforms.length > 0 
          ? `Distribute to (${availablePlatforms.length} connected)` 
          : 'Distribute to'}
      </h3>
      {platformsToShow.length === 0 ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-yellow-800 mb-2">No platforms connected</p>
          <p className="text-xs text-yellow-600">Connect at least one platform in Settings to start uploading</p>
        </div>
      ) : (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {platformsToShow.map((p) => {
          const isSelected = selected.includes(p);
          return (
            <button
              key={p}
              onClick={() => togglePlatform(p)}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 ${
                isSelected 
                  ? 'border-[#4a9082] bg-[#f0f8f6] text-[#2d5a52] shadow-md scale-105' 
                  : 'border-yellow-50 bg-[#fffdf5] text-gray-300 hover:border-yellow-100 hover:text-gray-400'
              }`}
            >
              <div className="relative">
                <svg className={`w-8 h-8 transition-colors ${isSelected ? 'text-[#4a9082]' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
                  {PLATFORM_CONFIGS[p].icon}
                </svg>
                {isSelected && (
                   <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4a9082] rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                   </div>
                )}
              </div>
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest block">{p?.split(' ')[0] || p || 'Unknown'}</span>
              </div>
            </button>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default PlatformSelector;
