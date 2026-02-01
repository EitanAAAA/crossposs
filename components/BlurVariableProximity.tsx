import React, { useEffect, useState, useRef } from 'react';
import VariableProximity from './VariableProximity';

interface BlurVariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.MutableRefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  delay?: number;
  animateBy?: 'words' | 'letters' | 'chars';
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const BlurVariableProximity: React.FC<BlurVariableProximityProps> = ({
  label,
  fromFontVariationSettings,
  toFontVariationSettings,
  containerRef,
  radius = 50,
  falloff = 'gaussian',
  delay = 0,
  animateBy = 'words',
  direction = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'top': return 'translateY(20px)';
      case 'bottom': return 'translateY(-20px)';
      case 'left': return 'translateX(20px)';
      case 'right': return 'translateX(-20px)';
      default: return 'translateY(20px)';
    }
  };

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={{
        display: 'inline-block',
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(10px)',
        transform: isVisible ? 'translateY(0) translateX(0)' : getTransform(),
        transition: `opacity 0.6s ease-out ${delay}ms, filter 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      <VariableProximity
        label={label}
        fromFontVariationSettings={fromFontVariationSettings}
        toFontVariationSettings={toFontVariationSettings}
        containerRef={containerRef}
        radius={radius}
        falloff={falloff}
        className="inline-block"
      />
    </span>
  );
};

export default BlurVariableProximity;

