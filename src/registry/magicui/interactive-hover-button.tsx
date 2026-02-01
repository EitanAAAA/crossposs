import React, { ReactNode, useState, MouseEvent } from 'react';

interface InteractiveHoverButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const InteractiveHoverButton: React.FC<InteractiveHoverButtonProps> = ({
  children,
  onClick,
  className = ''
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center px-14 py-6 rounded-[2rem] font-extrabold text-2xl overflow-hidden group transition-all hover:scale-105 ${className}`}
      style={{
        background: isHovering
          ? `radial-gradient(circle 200px at ${mousePosition.x}% ${mousePosition.y}%, #3d7a6e, #4a9082)`
          : '#4a9082',
        border: 'none',
        color: 'white',
        boxShadow: isHovering 
          ? '0 6px 20px 0 rgba(74, 144, 130, 0.4)' 
          : '0 4px 14px 0 rgba(74, 144, 130, 0.3)',
        transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'background 0.15s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease-out',
      }}
    >
      <span className="relative z-10 flex items-center gap-4">
        {children}
      </span>
    </button>
  );
};

