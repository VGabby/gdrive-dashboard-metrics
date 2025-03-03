
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  formatter = (val) => val.toString(),
  className
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (value === displayValue) return;
    
    let startTime: number;
    let animationFrameId: number;
    const startValue = displayValue;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const nextValue = Math.floor(startValue + progress * (value - startValue));
      
      setDisplayValue(nextValue);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration, displayValue]);
  
  return (
    <span className={cn("transition-colors duration-300", className)}>
      {formatter(displayValue)}
    </span>
  );
}

export default AnimatedCounter;
