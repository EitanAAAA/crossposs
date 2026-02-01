import React, { useEffect, useState, useRef } from 'react';

interface FloatingElement {
  id: number;
  type: 'heart' | 'like' | 'save' | 'comment';
  x: number;
  delay: number;
  duration: number;
  xOffset: number;
  yWave: number;
  wingSpeed: number;
  createdAt: number;
  trailSizes: number[];
  trailOpacities: number[];
}

interface CursorTrailHeart {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
  scale: number;
}

interface CursorPosition {
  x: number;
  y: number;
}

interface IconPosition extends CursorPosition {
  rotation: number;
}

const InstagramBackgroundAnimations: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [cursorTrail, setCursorTrail] = useState<CursorTrailHeart[]>([]);
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isMobile, setIsMobile] = useState(false);
  const elementIdCounter = useRef(0);
  const lastCursorPosRef = useRef<CursorPosition | null>(null);
  const cursorTrailIdCounter = useRef(0);
  const cursorTrailIntervalRef = useRef<number>();

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      return isMobileDevice;
    };

    const mobile = checkMobile();
    setIsMobile(mobile);
    window.addEventListener('resize', checkMobile);

    const types: ('heart' | 'like' | 'save' | 'comment')[] = ['heart', 'like', 'save', 'comment'];
    const baseDuration = 20;
    const spacing = 6;
    
    const generateElement = (type: 'heart' | 'like' | 'save' | 'comment', x: number, delay: number): FloatingElement => {
      const trailSizes: number[] = [];
      const trailOpacities: number[] = [];
      for (let i = 0; i < 6; i++) {
        trailSizes.push(2.5 + (i * 0.2));
        trailOpacities.push(0.35 - (i * 0.05));
      }

      return {
        id: elementIdCounter.current++,
        type: type,
        x: x,
        delay: delay,
        duration: baseDuration,
        xOffset: 0,
        yWave: 30,
        wingSpeed: 0.18,
        createdAt: Date.now(),
        trailSizes,
        trailOpacities
      };
    };
    
    const generateWithSpacing = () => {
      setElements(prev => {
        const now = Date.now();
        const maxAge = baseDuration + 5;
        const activeElements = prev.filter(el => {
          const elapsed = (now - el.createdAt) / 1000;
          return elapsed < maxAge;
        });
        
        if (activeElements.length >= 3) {
          return activeElements;
        }
        
        const screenWidth = window.innerWidth;
        const minDistance = 100;
        const minX = 50;
        const maxX = screenWidth - 50;
        
        let newX = Math.random() * (maxX - minX) + minX;
        let attempts = 0;
        
        while (attempts < 100) {
          const tooClose = activeElements.some(el => {
            const elX = (el.x / 100) * screenWidth;
            return Math.abs(newX - elX) < minDistance;
          });
          if (!tooClose) break;
          newX = Math.random() * (maxX - minX) + minX;
          attempts++;
        }
        
        const newXPercent = (newX / screenWidth) * 100;
        const randomType = types[Math.floor(Math.random() * types.length)];
        const element = generateElement(randomType, newXPercent, 0);
        
        return [...activeElements, element];
      });
    };

    generateWithSpacing();
    setTimeout(() => generateWithSpacing(), spacing * 1000);
    setTimeout(() => generateWithSpacing(), spacing * 2000);
    setTimeout(() => generateWithSpacing(), spacing * 3000);
    
    const cleanupInterval = setInterval(() => {
      setElements(prev => {
        const now = Date.now();
        const maxAge = baseDuration + 5;
        return prev.filter(el => {
          const elapsed = (now - el.createdAt) / 1000;
          return elapsed < maxAge;
        });
      });
    }, 2000);
    
    const generateInterval = setInterval(() => {
      generateWithSpacing();
    }, spacing * 1000);

    if (!mobile) {
      let lastHeartTime = 0;
      
      const handleMouseMove = (e: MouseEvent) => {
        const newPos = { x: e.clientX, y: e.clientY };
        const now = Date.now();
        
        if (now - lastHeartTime > 60) {
          setCursorTrail(prev => {
            const newHeart: CursorTrailHeart = {
              id: cursorTrailIdCounter.current++,
              x: newPos.x,
              y: newPos.y,
              createdAt: now,
              opacity: 1,
              offsetX: (Math.random() - 0.5) * 30,
              offsetY: 0,
              scale: 0.5
            };
            
            return [...prev, newHeart].slice(-20);
          });
          
          lastHeartTime = now;
        }
        
        setCursorPos(newPos);
      };

      window.addEventListener('mousemove', handleMouseMove);

      const animateTrail = () => {
        setCursorTrail(prev => {
          const now = Date.now();
          return prev
            .map(heart => {
              const elapsed = (now - heart.createdAt) / 1000;
              const progress = Math.min(elapsed / 1.5, 1);
              
              return {
                ...heart,
                offsetY: -progress * 60,
                opacity: 1 - progress,
                scale: 0.5
              };
            })
            .filter(heart => {
              const elapsed = (now - heart.createdAt) / 1000;
              return elapsed < 1.5;
            });
        });
        
        cursorTrailIntervalRef.current = requestAnimationFrame(animateTrail);
      };

      cursorTrailIntervalRef.current = requestAnimationFrame(animateTrail);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (cursorTrailIntervalRef.current) {
          cancelAnimationFrame(cursorTrailIntervalRef.current);
        }
      };
    }

    return () => {
      clearInterval(cleanupInterval);
      clearInterval(generateInterval);
      window.removeEventListener('resize', checkMobile);
      if (cursorTrailIntervalRef.current) {
        cancelAnimationFrame(cursorTrailIntervalRef.current);
      }
    };
  }, []);

  const renderTrailingElements = (element: FloatingElement) => {
    const trailing = [];
    for (let i = 1; i <= 6; i++) {
      const spreadX = (i - 3.5) * 8;
      const spreadY = (i - 3.5) * 4;
      const trailDelay = element.delay + (i * 0.25);
      const size = element.trailSizes[i - 1] || 3;
      const opacity = (element.trailOpacities[i - 1] || 0.3) * 0.7;
      
      const trailStyle: React.CSSProperties & { [key: string]: string | number } = {
        left: `${element.x}%`,
        bottom: '-500px',
        animationDelay: `${trailDelay}s`,
        '--duration': `${element.duration}s`,
        '--x-offset': `${element.xOffset + spreadX}px`,
        '--y-wave': `${element.yWave + spreadY}px`,
        '--trail-index': i,
        '--spread-x': `${spreadX}px`,
        '--spread-y': `${spreadY}px`
      };

      trailing.push(
        <div key={`trail-${element.id}-${i}`} className={`trailing-${element.type}`} style={trailStyle}>
          {renderTrailIcon(element.type, size, opacity, element.id + i)}
        </div>
      );
    }
    return trailing;
  };

  const renderTrailIcon = (type: 'heart' | 'like' | 'save' | 'comment', size: number, opacity: number, uniqueId?: number) => {
    const sizePx = size * 3;
    const gradientId = uniqueId ? `heartGradient-${uniqueId}` : 'heartGradient';
    
    switch (type) {
      case 'heart':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" opacity={opacity * 0.8} style={{ width: `${sizePx}px`, height: `${sizePx}px` }}>
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff9ec4" />
                <stop offset="50%" stopColor="#ffb3d1" />
                <stop offset="100%" stopColor="#ffd93d" />
              </linearGradient>
            </defs>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={`url(#${gradientId})`}/>
          </svg>
        );
      case 'like':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" opacity={opacity * 0.6} style={{ width: `${sizePx}px`, height: `${sizePx}px` }}>
            <path d="M13.12 2.06L7.58 7.6c-.37.37-.58.88-.58 1.41V19c0 1.1.9 2 2 2h9c.8 0 1.52-.48 1.84-1.21l3.26-7.61C23.94 12.2 23.97 11.6 23.7 11.1c-.27-.5-.75-.85-1.3-.95l-4.4-.9c-.3-.06-.6-.2-.85-.4l-3.03-2.53c-.5-.42-1.17-.58-1.8-.42zM2 19h4V9H2v10z" fill="#1877f2"/>
          </svg>
        );
      case 'save':
        return (
          <svg className="w-5 h-5" fill="#f8d902" viewBox="0 0 24 24" opacity={opacity * 0.8} style={{ width: `${sizePx}px`, height: `${sizePx}px` }}>
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
          </svg>
        );
      case 'comment':
        return (
          <svg className="w-5 h-5" fill="#7bc4b8" viewBox="0 0 24 24" opacity={opacity * 0.8} style={{ width: `${sizePx}px`, height: `${sizePx}px` }}>
            <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const renderMainIcon = (type: 'heart' | 'like' | 'save' | 'comment', elementId?: number) => {
    const mainGradientId = elementId ? `mainHeartGradient-${elementId}` : 'mainHeartGradient';
    
    switch (type) {
      case 'heart':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" opacity="0.7">
            <defs>
              <linearGradient id={mainGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff9ec4" />
                <stop offset="50%" stopColor="#ffb3d1" />
                <stop offset="100%" stopColor="#ffd93d" />
              </linearGradient>
            </defs>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={`url(#${mainGradientId})`}/>
          </svg>
        );
      case 'like':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" opacity="0.7">
            <path d="M13.12 2.06L7.58 7.6c-.37.37-.58.88-.58 1.41V19c0 1.1.9 2 2 2h9c.8 0 1.52-.48 1.84-1.21l3.26-7.61C23.94 12.2 23.97 11.6 23.7 11.1c-.27-.5-.75-.85-1.3-.95l-4.4-.9c-.3-.06-.6-.2-.85-.4l-3.03-2.53c-.5-.42-1.17-.58-1.8-.42zM2 19h4V9H2v10z" fill="#1877f2" stroke="#1877f2" strokeWidth="0.5"/>
          </svg>
        );
      case 'save':
        return (
          <svg className="w-6 h-6" fill="#f8d902" viewBox="0 0 24 24" opacity="0.7">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
          </svg>
        );
      case 'comment':
        return (
          <svg className="w-6 h-6" fill="#7bc4b8" viewBox="0 0 24 24" opacity="0.7">
            <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getWingColor = (type: 'heart' | 'like' | 'save' | 'comment') => {
    switch (type) {
      case 'heart':
        return { main: '#ffb3d1', light: '#ffcce0', opacity: '0.5' };
      case 'like':
        return { main: '#8bb3f2', light: '#a8c7f5', opacity: '0.5' };
      case 'save':
        return { main: '#ffe44d', light: '#ffe866', opacity: '0.5' };
      case 'comment':
        return { main: '#9dd4c8', light: '#b8e0d6', opacity: '0.5' };
      default:
        return { main: '#ffb3d1', light: '#ffcce0', opacity: '0.5' };
    }
  };

  const renderElement = (element: FloatingElement) => {
    const wingColors = getWingColor(element.type);
    
    const style: React.CSSProperties & { [key: string]: string | number } = {
      left: `${element.x}%`,
      bottom: '-500px',
      animationDelay: `${element.delay}s`,
      '--duration': `${element.duration}s`,
      '--x-offset': `${element.xOffset}px`,
      '--y-wave': `${element.yWave}px`,
      '--wing-speed': `${element.wingSpeed}s`
    };

    return (
      <React.Fragment key={element.id}>
        <div className={`instagram-icon-with-wings instagram-${element.type}`} style={style}>
          <div className="icon-wings-container">
            <svg className="wing wing-left" viewBox="0 0 100 60" fill="none">
              <path d="M50 30 Q20 10 0 30 Q20 50 50 30" fill={wingColors.main} opacity={wingColors.opacity}/>
              <path d="M50 30 Q35 20 20 30 Q35 40 50 30" fill={wingColors.light} opacity={wingColors.opacity}/>
            </svg>
            <div className="icon-main">
              {renderMainIcon(element.type, element.id)}
            </div>
            <svg className="wing wing-right" viewBox="0 0 100 60" fill="none">
              <path d="M50 30 Q80 10 100 30 Q80 50 50 30" fill={wingColors.main} opacity={wingColors.opacity}/>
              <path d="M50 30 Q65 20 80 30 Q65 40 50 30" fill={wingColors.light} opacity={wingColors.opacity}/>
            </svg>
          </div>
        </div>
        {renderTrailingElements(element)}
      </React.Fragment>
    );
  };

  const renderCursorTrailHeart = (heart: CursorTrailHeart) => {
    return (
      <div
        key={heart.id}
        className="cursor-trail-heart"
        style={{
          position: 'fixed',
          left: `${heart.x + heart.offsetX}px`,
          top: `${heart.y + heart.offsetY}px`,
          transform: 'translate(-50%, -50%)',
          opacity: heart.opacity,
          pointerEvents: 'none',
          willChange: 'transform, opacity'
        }}
      >
        <svg className="w-4 h-4" fill="#ff6b9d" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    );
  };

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {elements.map((element) => renderElement(element))}
        {!isMobile && cursorTrail.map((heart) => renderCursorTrailHeart(heart))}
      </div>
    );
};

export default InstagramBackgroundAnimations;

