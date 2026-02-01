import React, { useEffect, useState, ReactNode } from 'react';

interface BlurTextProps {
  text?: string;
  children?: ReactNode;
  delay?: number;
  animateBy?: 'words' | 'letters' | 'chars';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  onAnimationComplete?: () => void;
  className?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  children,
  delay = 0,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = ''
}) => {
  const content = text || children;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 1000);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onAnimationComplete]);

  const getTransform = () => {
    switch (direction) {
      case 'top': return 'translateY(20px)';
      case 'bottom': return 'translateY(-20px)';
      case 'left': return 'translateX(20px)';
      case 'right': return 'translateX(-20px)';
      default: return 'translateY(20px)';
    }
  };

  if (typeof content === 'string') {
    if (animateBy === 'words') {
      const words = content.split(' ');
      const wordSpans = words.map((word, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? 'blur(0px)' : 'blur(10px)',
            transform: isVisible ? 'translateY(0) translateX(0)' : getTransform(),
            transition: `opacity 0.6s ease-out ${index * 0.1}s, filter 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
          }}
        >
          {word}{index < words.length - 1 ? ' ' : ''}
        </span>
      ));
      
      if (className) {
        return <span className={className} style={{ display: 'inline-block' }}>{wordSpans}</span>;
      }
      return <span style={{ display: 'inline-block' }}>{wordSpans}</span>;
    } else {
      const chars = content.split('');
      const charSpans = chars.map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? 'blur(0px)' : 'blur(10px)',
            transform: isVisible ? 'translateY(0) translateX(0)' : getTransform(),
            transition: `opacity 0.4s ease-out ${index * 0.03}s, filter 0.4s ease-out ${index * 0.03}s, transform 0.4s ease-out ${index * 0.03}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
      
      if (className) {
        return <span className={className} style={{ display: 'inline-block' }}>{charSpans}</span>;
      }
      return <span style={{ display: 'inline-block' }}>{charSpans}</span>;
    }
  }

  return (
    <span
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(10px)',
        transform: isVisible ? 'translateY(0) translateX(0)' : getTransform(),
        transition: `opacity 0.8s ease-out ${delay}ms, filter 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
      }}
    >
      {content}
    </span>
  );
};

export default BlurText;

