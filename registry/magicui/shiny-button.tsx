import React, { ReactNode } from 'react';

interface ShinyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({ 
  children, 
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-14 py-6 rounded-[2rem] font-extrabold text-2xl overflow-hidden group transition-all hover:scale-105 ${className}`}
      style={{
        background: '#4a9082',
        border: 'none',
        color: 'white',
        boxShadow: '0 4px 14px 0 rgba(74, 144, 130, 0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#3d7a6e';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(74, 144, 130, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#4a9082';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(74, 144, 130, 0.3)';
      }}
    >
      <span className="relative z-10 flex items-center gap-4">
        {children}
      </span>
      <span
        className="absolute inset-0 opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          animation: 'shimmer 2.5s infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
    </button>
  );
};

