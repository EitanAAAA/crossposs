import React, { useEffect, useState, useRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface TypingTextProps extends HTMLMotionProps<'div'> {
  text: string;
  delay?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  delay = 0,
  inView = false,
  inViewOnce = true,
  inViewMargin = '0px',
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && (!inViewOnce || !hasAnimated)) {
      const startTimer = setTimeout(() => {
        setIsTyping(true);
        setDisplayedText('');
        setHasAnimated(true);
      }, delay);

      return () => clearTimeout(startTimer);
    }
  }, [inView, inViewOnce, hasAnimated, delay]);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 10);

    return () => clearInterval(typingInterval);
  }, [isTyping, text]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!inView) {
              setIsTyping(true);
              setDisplayedText('');
            }
          }
        });
      },
      {
        rootMargin: inViewMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [inView, inViewMargin]);

  return (
    <motion.div
      ref={containerRef}
      {...props}
    >
      {displayedText}
      {isTyping && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: 'currentColor',
            marginLeft: '2px',
            animation: 'blink 1s infinite',
          }}
        />
      )}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </motion.div>
  );
};

export default TypingText;
