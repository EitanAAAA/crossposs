import React from 'react';

export const Iphone = ({ src, className, children }: { src?: string; className?: string; children?: React.ReactNode }) => {
  return (
    <div className={`relative border-gray-900 dark:border-gray-800 bg-gray-900 border-[6px] rounded-[2rem] shadow-2xl h-full ${className}`}>
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 left-1/2 -translate-x-1/2 absolute rounded-b-xl z-20"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[8px] top-[142px] rounded-e-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[8px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[8px] top-[178px] rounded-s-lg"></div>
      <div className="rounded-[1.5rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800 relative">
        {src ? (
          <img src={src} className="w-full h-full object-cover" alt="iPhone Content" />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

