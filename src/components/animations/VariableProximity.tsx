import { forwardRef, useMemo, useRef, useEffect, useCallback, MutableRefObject, CSSProperties, HTMLAttributes } from 'react';
import { motion } from 'motion/react';

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef: MutableRefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      if (!ev.touches || ev.touches.length === 0) {
        return;
      }
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

interface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  
  const propsRef = useRef({ fromFontVariationSettings, toFontVariationSettings, radius, falloff });
  useEffect(() => {
    propsRef.current = { fromFontVariationSettings, toFontVariationSettings, radius, falloff };
  }, [fromFontVariationSettings, toFontVariationSettings, radius, falloff]);

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map(s => s.trim())
          .map(s => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number, currentRadius: number, currentFalloff: string) => {
    const norm = Math.min(Math.max(1 - distance / currentRadius, 0), 1);
    switch (currentFalloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (currentRadius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  const updateFontSettings = useCallback(() => {
    if (!containerRef?.current) return;
    const { x, y } = mousePositionRef.current;
    const { fromFontVariationSettings: fromSettings, toFontVariationSettings: toSettings, radius: currentRadius, falloff: currentFalloff } = propsRef.current;
    
    const hasChanged = lastPositionRef.current.x !== x || lastPositionRef.current.y !== y;
    const isFirstUpdate = lastPositionRef.current.x === null || lastPositionRef.current.y === null;
    
    if (!hasChanged && !isFirstUpdate) {
      return;
    }
    
    lastPositionRef.current = { x, y };
    const containerRect = containerRef.current.getBoundingClientRect();

    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(',')
          .map(s => s.trim())
          .map(s => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettingsMap = parseSettings(fromSettings);
    const toSettingsMap = parseSettings(toSettings);
    const settingsArray = Array.from(fromSettingsMap.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettingsMap.get(axis) ?? fromValue
    }));

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(
        x,
        y,
        letterCenterX,
        letterCenterY
      );

      if (distance >= currentRadius) {
        letterRef.style.fontVariationSettings = fromSettings;
        interpolatedSettingsRef.current[index] = fromSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance, currentRadius, currentFalloff);
      const newSettings = settingsArray
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  }, [containerRef]);

  useAnimationFrame(updateFontSettings);

  useEffect(() => {
    const totalLetters = label.split('').filter(c => c !== ' ').length;
    for (let i = 0; i < totalLetters; i++) {
      if (!interpolatedSettingsRef.current[i]) {
        interpolatedSettingsRef.current[i] = fromFontVariationSettings;
      }
    }
    
    const initializeLetters = () => {
      letterRefs.current.forEach((letterRef) => {
        if (letterRef) {
          letterRef.style.fontVariationSettings = fromFontVariationSettings;
        }
      });
      
      if (containerRef?.current) {
        lastPositionRef.current = { x: null, y: null };
        requestAnimationFrame(() => updateFontSettings());
      }
    };
    
    const timeoutId = setTimeout(initializeLetters, 100);
    return () => clearTimeout(timeoutId);
  }, [fromFontVariationSettings, label, containerRef, updateFontSettings]);

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      onClick={onClick}
      style={{
        display: 'inline',
        fontFamily: '"Roboto Flex", sans-serif',
        ...style
      }}
      className={className}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map(letter => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={el => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex] || fromFontVariationSettings
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
