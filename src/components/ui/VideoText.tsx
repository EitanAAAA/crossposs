import React, { useEffect, useState, ReactNode, useRef } from 'react';

interface VideoTextProps {
  text?: string;
  children?: ReactNode;
  delay?: number;
  className?: string;
}

const VideoText: React.FC<VideoTextProps> = ({
  text,
  children,
  delay = 0,
  className = ''
}) => {
  const content = text || children;
  const [frame, setFrame] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const totalFrames = 20;
    const frameInterval = 50;

    intervalRef.current = setInterval(() => {
      setFrame(prev => {
        if (prev >= totalFrames) {
          setIsComplete(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return totalFrames;
        }
        return prev + 1;
      });
    }, frameInterval);

    const glitchInterval = setInterval(() => {
      if (!isComplete) {
        setGlitchOffset(Math.random() * 4 - 2);
        setTimeout(() => setGlitchOffset(0), 50);
      }
    }, 200 + Math.random() * 300);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(glitchInterval);
    };
  }, [isVisible, isComplete]);

  if (typeof content === 'string') {
    const words = content.split(' ');
    const totalFrames = 20;
    const progress = Math.min(1, frame / totalFrames);
    const wordsToShow = Math.floor(progress * words.length);

    return (
      <span className={className} style={{ display: 'inline-block', position: 'relative' }}>
        {words.map((word, index) => {
          const wordStartFrame = index * 2.5;
          const wordProgress = Math.max(0, Math.min(1, (frame - wordStartFrame) / 5));
          const isWordVisible = index < wordsToShow || (index === wordsToShow && wordProgress > 0);
          
          const pixelation = isWordVisible && !isComplete ? Math.max(0, 1 - wordProgress * 2) : 0;
          const opacity = isWordVisible ? Math.min(1, wordProgress * 1.3) : 0;
          const scale = 0.7 + wordProgress * 0.3;
          const translateY = (1 - wordProgress) * 25;
          const translateX = !isComplete && isWordVisible ? glitchOffset * (1 - wordProgress) : 0;
          
          const rgbOffset = !isComplete && wordProgress < 0.7 ? (1 - wordProgress) * 3 : 0;
          const glitchIntensity = !isComplete && wordProgress > 0.3 && wordProgress < 0.8 ? (1 - Math.abs(wordProgress - 0.55) * 2) : 0;

          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                opacity: opacity,
                filter: pixelation > 0 
                  ? `blur(${pixelation * 8}px) contrast(${1 + pixelation * 2}) brightness(${1 + pixelation * 0.5}) saturate(${1 + pixelation})` 
                  : 'blur(0px) contrast(1) brightness(1) saturate(1)',
                transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale}) rotateZ(${glitchIntensity * 2}deg)`,
                transition: isComplete 
                  ? 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  : 'none',
                position: 'relative',
                willChange: isComplete ? 'auto' : 'transform, opacity, filter',
                textShadow: !isComplete && glitchIntensity > 0 
                  ? `${rgbOffset}px 0 0 rgba(255,0,0,${glitchIntensity * 0.5}), ${-rgbOffset}px 0 0 rgba(0,255,255,${glitchIntensity * 0.5})`
                  : 'none',
              }}
            >
              {word}
              {index < words.length - 1 && '\u00A0'}
              {!isComplete && isWordVisible && wordProgress < 0.9 && (
                <>
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255,255,255,0.6) ${(frame % 5) * 20}%, 
                        transparent 100%
                      )`,
                      pointerEvents: 'none',
                      animation: 'video-scan 0.12s linear infinite',
                      mixBlendMode: 'screen',
                    }}
                  />
                  {wordProgress < 0.6 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: `${Math.sin(frame * 0.5 + index) * 2}px`,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.8), transparent)',
                        pointerEvents: 'none',
                        animation: 'data-stream 0.3s linear infinite',
                        animationDelay: `${index * 0.1}s`,
                      }}
                    />
                  )}
                </>
              )}
            </span>
          );
        })}
        <style>{`
          @keyframes video-scan {
            0% { transform: translateX(-100%) skewX(-15deg) scaleY(1.2); opacity: 0.8; }
            50% { opacity: 1; }
            100% { transform: translateX(200%) skewX(-15deg) scaleY(1.2); opacity: 0.8; }
          }
          @keyframes data-stream {
            0% { transform: translateX(-100%) scaleX(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%) scaleX(1); opacity: 0; }
          }
        `}</style>
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity 0.8s ease-out ${delay}ms`,
      }}
    >
      {content}
    </span>
  );
};

export default VideoText;

