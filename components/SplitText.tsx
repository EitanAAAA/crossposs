import React, { useEffect, useRef, useState, ReactNode } from 'react';
import GradientText from './GradientText';

interface SplitTextProps {
  text?: string;
  children?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: { opacity?: number; y?: number; x?: number; scale?: number };
  to?: { opacity?: number; y?: number; x?: number; scale?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
  gradientColors?: string[];
  animationSpeed?: number;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  children,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
  gradientColors,
  animationSpeed = 3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);

  const content = text || (typeof children === 'string' ? children : '');

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isVisible && onLetterAnimationComplete) {
      const totalElements = splitType === 'chars' 
        ? content.split('').filter(c => c !== ' ').length
        : splitType === 'words'
        ? content.split(' ').length
        : 1;

      const timeout = setTimeout(() => {
        if (animatedCount >= totalElements - 1) {
          onLetterAnimationComplete();
        }
      }, delay + duration * 1000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, animatedCount, delay, duration, onLetterAnimationComplete, splitType, content]);

  const getEaseFunction = (easeType: string) => {
    const easingMap: Record<string, string> = {
      'power3.out': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      'power2.out': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
      'power1.out': 'cubic-bezier(0.250, 0.000, 0.250, 1.000)',
      'ease-out': 'ease-out',
      'ease-in': 'ease-in',
      'ease-in-out': 'ease-in-out',
    };
    return easingMap[easeType] || 'ease-out';
  };

  const renderContent = () => {
    if (!content) return children;

    if (splitType === 'chars') {
      const chars = content.split('');
      return chars.map((char, index) => {
        const isSpace = char === ' ';
        const charIndex = chars.slice(0, index).filter(c => c !== ' ').length;
        
        const charStyle: React.CSSProperties = {
          display: 'inline-block',
          opacity: isVisible ? to.opacity : from.opacity,
          transform: isVisible
            ? `translateY(${to.y || 0}px) translateX(${to.x || 0}px) scale(${to.scale || 1})`
            : `translateY(${from.y || 40}px) translateX(${from.x || 0}px) scale(${from.scale || 1})`,
          transition: `opacity ${duration}s ${getEaseFunction(ease)}, transform ${duration}s ${getEaseFunction(ease)}`,
          transitionDelay: `${delay + charIndex * 0.03}ms`,
        };

        return (
          <span
            key={index}
            style={charStyle}
            onTransitionEnd={() => {
              if (isVisible) {
                setAnimatedCount(prev => prev + 1);
              }
            }}
          >
            {isSpace ? '\u00A0' : char}
          </span>
        );
      });
    } else if (splitType === 'words') {
      const words = content.split(' ');
      return words.map((word, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: isVisible ? to.opacity : from.opacity,
            transform: isVisible
              ? `translateY(${to.y || 0}px) translateX(${to.x || 0}px) scale(${to.scale || 1})`
              : `translateY(${from.y || 40}px) translateX(${from.x || 0}px) scale(${from.scale || 1})`,
            transition: `opacity ${duration}s ${getEaseFunction(ease)}, transform ${duration}s ${getEaseFunction(ease)}`,
            transitionDelay: `${delay + index * 0.1}ms`,
            marginRight: index < words.length - 1 ? '0.25em' : '0',
          }}
          onTransitionEnd={() => {
            if (isVisible) {
              setAnimatedCount(prev => prev + 1);
            }
          }}
        >
          {word}
        </span>
      ));
    }

    return content;
  };

  const hasGradient = gradientColors && gradientColors.length > 0;
  
  const renderedContent = renderContent();
  
  return (
    <div
      ref={containerRef}
      style={{ textAlign }}
    >
      {hasGradient ? (
        <GradientText
          colors={gradientColors!}
          animationSpeed={animationSpeed}
          showBorder={false}
          className={className}
        >
          {renderedContent}
        </GradientText>
      ) : (
        <span className={className}>
          {renderedContent}
        </span>
      )}
    </div>
  );
};

export default SplitText;

