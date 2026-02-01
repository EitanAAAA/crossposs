import React, { ReactNode } from 'react';

interface RainbowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const RainbowButton: React.FC<RainbowButtonProps> = ({
  children,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-14 py-6 rounded-[2rem] font-extrabold text-2xl overflow-hidden group transition-all hover:scale-105 ${className}`}
      style={{
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        backgroundSize: '200% 100%',
        border: 'none',
        color: 'white',
        boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.3)',
        animation: 'rainbow-shift 3s ease infinite',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(102, 126, 234, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(102, 126, 234, 0.3)';
      }}
    >
      <span className="relative z-10 flex items-center gap-4">
        {children}
      </span>
      <style>{`
        @keyframes rainbow-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </button>
  );
};








