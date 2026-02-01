import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface ShineEntranceProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  shineDelay?: number;
}

const ShineEntrance: React.FC<ShineEntranceProps> = ({
  children,
  delay = 0,
  duration = 1200,
  className = '',
  shineDelay
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shineActive, setShineActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      const shineDelayTime = shineDelay !== undefined ? shineDelay : duration * 0.3;
      setTimeout(() => {
        setShineActive(true);
      }, shineDelayTime);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, shineDelay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
      {shineActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6), transparent)',
            animation: `shine-sweep ${duration * 2}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            pointerEvents: 'none',
          }}
        />
      )}
      <style>
        {`
          @keyframes shine-sweep {
            0% {
              left: -100%;
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              left: 100%;
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ShineEntrance;

