'use client';

import React, { useState, useRef } from 'react';

interface SimpleCardProps {
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  hoverScale?: number;
  intensity?: number;
  hasGlow?: boolean;
  onClick?: (() => void) | undefined;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  children,
  className = '',
  gradientFrom = 'rgba(76, 29, 149, 0.1)',
  gradientTo = 'rgba(124, 58, 237, 0.1)',
  hoverScale = 1.02,
  intensity = 15,
  hasGlow = true,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardStyle: React.CSSProperties = {
    background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
    transform: isHovered ? `scale(${hoverScale})` : 'scale(1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: isHovered && hasGlow 
      ? '0 0 30px rgba(139, 92, 246, 0.3)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cursor: onClick ? 'pointer' : 'default'
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative rounded-xl overflow-hidden backdrop-blur-sm
        border border-white/10 p-5
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={cardStyle}
    >
      {/* 卡片内容 */}
      <div className="relative z-10">{children}</div>
      
      {/* 卡片动态光效 */}
      {hasGlow && (
        <div
          className={`absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl transition-opacity duration-300 ${
            isHovered ? 'opacity-40' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export default SimpleCard;
