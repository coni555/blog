'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  hoverScale?: number;
  intensity?: number;
  hasGlow?: boolean;
  onClick?: () => void;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  gradientFrom = 'rgba(76, 29, 149, 0.1)',
  gradientTo = 'rgba(124, 58, 237, 0.1)',
  hoverScale = 1.02,
  intensity = 15,
  hasGlow = true,
  onClick,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      
      // 计算鼠标在卡片上的相对位置 (从-0.5到0.5的值)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // 根据鼠标位置设置旋转角度
      setRotateX(-y * intensity); // 负号使倾斜方向跟随鼠标移动更自然
      setRotateY(x * intensity);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative rounded-xl overflow-hidden backdrop-blur-sm
        border border-white/10 p-5
        transform-gpu will-change-transform
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
      }}
      whileHover={{ scale: hoverScale }}
      animate={{
        rotateX,
        rotateY,
        boxShadow: isHovered && hasGlow 
          ? '0 0 30px rgba(139, 92, 246, 0.3)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
      transition={{
        rotateX: { type: 'spring', stiffness: 300, damping: 30 },
        rotateY: { type: 'spring', stiffness: 300, damping: 30 },
        scale: { type: 'spring', stiffness: 500, damping: 30 },
        boxShadow: { duration: 0.2 },
      }}
    >
      {/* 卡片内容 */}
      <div className="relative z-10">{children}</div>
      
      {/* 卡片动态光效 */}
      {hasGlow && (
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl opacity-0"
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default EnhancedCard; 