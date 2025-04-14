'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SimpleCardProps {
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  hoverScale?: number;
  intensity?: number;
  hasGlow?: boolean;
  onClick?: (() => void) | undefined;
  borderColor?: string;
  categoryColor?: string;
  categoryName?: string;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  children,
  className = '',
  gradientFrom = 'rgba(76, 29, 149, 0.1)',
  gradientTo = 'rgba(124, 58, 237, 0.1)',
  hoverScale = 1.05,
  intensity = 15,
  hasGlow = true,
  onClick,
  borderColor = 'rgba(139, 92, 246, 0.3)',
  categoryColor,
  categoryName
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
    transform: isHovered ? `translateY(-8px) scale(${hoverScale})` : 'translateY(0) scale(1)',
    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s ease',
    boxShadow: isHovered && hasGlow 
      ? `0 20px 30px rgba(0, 0, 0, 0.2), 0 0 20px ${borderColor}` 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cursor: onClick ? 'pointer' : 'default',
    borderColor: isHovered ? borderColor : 'rgba(255, 255, 255, 0.1)'
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative rounded-xl overflow-hidden backdrop-blur-sm
        border-2 p-5 transition-colors duration-300
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={cardStyle}
    >
      {categoryName && (
        <div 
          className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg z-20 font-medium text-xs"
          style={{
            backgroundColor: categoryColor || borderColor,
            color: 'white',
            opacity: isHovered ? 1 : 0.8,
            transition: 'opacity 0.3s ease'
          }}
        >
          {categoryName}
        </div>
      )}

      <div className="relative z-10">{children}</div>
      
      {hasGlow && isMounted && (
        <div
          className={`absolute inset-0 -z-10 bg-gradient-to-br rounded-xl transition-all duration-500`}
          style={{
            backgroundImage: `linear-gradient(135deg, ${borderColor}20, ${borderColor}30)`,
            opacity: isHovered ? 0.9 : 0.2,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: `blur(${isHovered ? '8px' : '4px'})`
          }}
        />
      )}

      {isMounted && (
        <div 
          className="absolute inset-0 -z-5 rounded-xl pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow: `inset 0 0 0 2px ${borderColor}`,
            opacity: isHovered ? 0.8 : 0.1
          }}
        />
      )}
    </div>
  );
};

export default SimpleCard;
