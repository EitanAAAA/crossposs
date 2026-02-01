import React, { useEffect, useRef, useState } from 'react';

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  manualMode = false,
  blurAmount = 5,
  borderColor = '#4a9082',
  animationDuration = 2,
  pauseBetweenAnimations = 1,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [framePosition, setFramePosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const words = sentence.split(' ');

  useEffect(() => {
    if (manualMode) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % words.length;
        return next;
      });
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    const updateFramePosition = () => {
      const focusedWord = wordRefs.current[currentIndex];
      if (focusedWord && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const wordRect = focusedWord.getBoundingClientRect();
        
        setFramePosition({
          top: wordRect.top - containerRect.top,
          left: wordRect.left - containerRect.left,
          width: wordRect.width,
          height: wordRect.height,
        });
      }
    };

    const timeoutId = setTimeout(() => {
      updateFramePosition();
    }, 50);

    const resizeObserver = new ResizeObserver(() => {
      updateFramePosition();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateFramePosition);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateFramePosition);
    };
  }, [currentIndex, words.length]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {words.map((word, index) => (
        <span
          key={index}
          ref={(el) => {
            wordRefs.current[index] = el;
            if (el && index === currentIndex) {
              setTimeout(() => {
                const containerRect = containerRef.current?.getBoundingClientRect();
                const wordRect = el.getBoundingClientRect();
                if (containerRect) {
                  setFramePosition({
                    top: wordRect.top - containerRect.top,
                    left: wordRect.left - containerRect.left,
                    width: wordRect.width,
                    height: wordRect.height,
                  });
                }
              }, 0);
            }
          }}
          style={{
            display: 'inline-block',
            filter: index === currentIndex ? 'blur(0px)' : `blur(${blurAmount}px)`,
            transition: `filter ${animationDuration}s ease`,
            marginRight: index < words.length - 1 ? '0.25em' : '0',
            position: 'relative',
          }}
        >
          {word}
        </span>
      ))}
      
      <div
        ref={frameRef}
        className="absolute pointer-events-none"
        style={{
          top: `${framePosition.top}px`,
          left: `${framePosition.left}px`,
          width: `${framePosition.width}px`,
          height: `${framePosition.height}px`,
          transition: `all ${animationDuration}s ease`,
        }}
      >
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor }} />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor }} />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor }} />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor }} />
      </div>
    </div>
  );
};

export default TrueFocus;

