import React, { useRef, useState, useEffect, MouseEvent, ReactNode, CSSProperties } from 'react';

interface GlareHoverProps {
  children: ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.15,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  playOnce = false,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [borderRadius, setBorderRadius] = useState<string>('0px');

  useEffect(() => {
    if (containerRef.current) {
      const firstChild = containerRef.current.firstElementChild as HTMLElement;
      if (firstChild) {
        const computedStyle = window.getComputedStyle(firstChild);
        const br = computedStyle.borderRadius || '0px';
        setBorderRadius(br);
      }
    }
  }, [children]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (playOnce && hasPlayed) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setGlarePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (playOnce && !hasPlayed) {
      setHasPlayed(true);
    }
  };

  const handleMouseLeave = () => {
    if (!playOnce) {
      setIsHovering(false);
    }
  };

  const angleRad = (glareAngle * Math.PI) / 180;
  const offsetX = Math.cos(angleRad) * 50;
  const offsetY = Math.sin(angleRad) * 50;

  const glareStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    background: `radial-gradient(circle ${glareSize}px at ${glarePosition.x + offsetX}% ${glarePosition.y + offsetY}%, ${glareColor} ${glareOpacity * 100}%, transparent 70%)`,
    opacity: isHovering ? 1 : 0,
    transition: `opacity ${transitionDuration}ms ease-out`,
    borderRadius: borderRadius,
    mixBlendMode: 'overlay',
    overflow: 'hidden',
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ borderRadius: borderRadius, overflow: 'hidden' }}
    >
      {children}
      <div style={glareStyle} />
    </div>
  );
};

export default GlareHover;
