import React, { ReactNode } from 'react';

interface GradientTextProps {
  colors: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
  children: ReactNode;
  hoverOnly?: boolean;
}

const GradientText: React.FC<GradientTextProps> = ({
  colors,
  animationSpeed = 3,
  showBorder = false,
  className = '',
  children,
  hoverOnly = false
}) => {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const uniqueClass = `gradient-text-${gradientId}`;
  
  return (
    <span className={`relative inline-block ${className} ${hoverOnly ? `group gradient-hover-${gradientId}` : ''}`}>
      <span
        className={uniqueClass}
        style={{
          background: `linear-gradient(90deg, ${colors.join(', ')})`,
          backgroundSize: `${colors.length * 100}% 100%`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          animation: hoverOnly ? 'none' : `gradient-shift-${gradientId} ${animationSpeed}s ease infinite`,
          border: showBorder ? '2px solid transparent' : 'none',
          borderImage: showBorder ? `linear-gradient(90deg, ${colors.join(', ')}) 1` : 'none',
          display: 'inline-block',
        }}
      >
        {children}
      </span>
      {hoverOnly && (
        <style>{`
          .gradient-hover-${gradientId}:hover .${uniqueClass} {
            animation: gradient-shift-${gradientId} ${animationSpeed}s ease infinite;
          }
          @keyframes gradient-shift-${gradientId} {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      )}
      {!hoverOnly && (
        <style>{`
          @keyframes gradient-shift-${gradientId} {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      )}
    </span>
  );
};

export default GradientText;

