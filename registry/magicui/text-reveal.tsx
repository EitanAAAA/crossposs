import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = '',
  delay = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      
      const elementTop = rect.top;
      
      // Absolute seamless reveal: endReveal MUST match phones start point in TimeSavingSection
      const startReveal = viewportHeight * 0.9;
      const endReveal = viewportHeight * 0.15;
      
      let progress = 0;
      
      if (elementTop < startReveal) {
        const distance = startReveal - elementTop;
        const totalDistance = startReveal - endReveal;
        progress = Math.min(Math.max(distance / totalDistance, 0), 1);
      }
      
      setRevealProgress(progress);
    };

    const timer = setTimeout(() => {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
    }, delay);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [delay]);

  const extractText = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && typeof node === 'object' && 'props' in node) {
      return extractText((node as any).props?.children);
    }
    return '';
  };

  const text = extractText(children);
  const chars = text.split('').filter(char => char.trim() !== '' || char === ' ');

  const renderContent = () => {
    if (text && typeof children === 'object' && children !== null && 'type' in children) {
      const element = children as React.ReactElement;
      let charIndex = 0;
      
      const renderText = (textContent: string) => {
        return textContent.split('').map((char) => {
          const currentIndex = charIndex++;
          const charProgress = (currentIndex + 1) / chars.length;
          const isVisible = revealProgress >= charProgress;
          
          return (
            <span
              key={currentIndex}
              style={{
                opacity: isVisible ? 1 : 0.15,
                transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                display: char === ' ' ? 'inline' : 'inline-block',
                color: 'inherit',
              }}
            >
              {char}
            </span>
          );
        });
      };
      
      return React.cloneElement(element, {
        ...element.props,
        children: renderText(text),
      });
    }
    
    if (typeof children === 'string') {
      return chars.map((char, index) => {
        const charProgress = (index + 1) / chars.length;
        const isVisible = revealProgress >= charProgress;
        
        return (
          <span
            key={index}
            style={{
              opacity: isVisible ? 1 : 0.15,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
              display: char === ' ' ? 'inline' : 'inline-block',
              color: 'inherit',
            }}
          >
            {char}
          </span>
        );
      });
    }
    
    return children;
  };

  return (
    <div ref={containerRef} className={className}>
      {renderContent()}
    </div>
  );
};
