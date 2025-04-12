'use client';

import React, { useState, useRef, useEffect } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  intensity?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  intensity = 1 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
  const [isMounted, setIsMounted] = useState(false);
  const [randomOffset] = useState(Math.random() * 10);

  // 确保仅在客户端执行效果
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // 获取卡片的尺寸和位置
    const rect = cardRef.current.getBoundingClientRect();
    
    // 计算鼠标在卡片上的相对位置 (0 到 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // 计算旋转角度 (±15deg)
    const rotateX = (y - 0.5) * -25 * intensity; // 增强旋转角度
    const rotateY = (x - 0.5) * 25 * intensity;
    
    // 更新旋转状态
    setRotation({ x: rotateX, y: rotateY });
    
    // 更新鼠标位置 (相对于卡片中心的百分比)
    const posX = (x - 0.5) * 100;
    const posY = (y - 0.5) * 100;
    setPosition({ x: posX, y: posY });
    
    // 更新高光位置
    setGlarePosition({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // 重置旋转
    setRotation({ x: 0, y: 0 });
    // 重置位置
    setPosition({ x: 0, y: 0 });
    // 重置高光
    setGlarePosition({ x: -100, y: -100 });
  };

  // 确保服务器和客户端初始渲染一致
  const initialTransformStyle = {
    transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
    transformStyle: 'preserve-3d' as 'preserve-3d',
    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
  };

  // 客户端激活后的动态样式
  const clientSideTransformStyle = isMounted ? {
    transform: isHovering 
      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)` 
      : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
    transformStyle: 'preserve-3d' as 'preserve-3d',
    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    boxShadow: isHovering 
      ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.2) inset'
      : '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(255, 255, 255, 0.1) inset',
  } : initialTransformStyle;

  // 客户端事件处理器
  const eventHandlers = isMounted ? {
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: onClick,
  } : {};

  const edgeHighlightColor = isHovering 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.05)';

  return (
    <div 
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 backdrop-blur-md border border-white/10 ${className}`}
      style={{
        ...clientSideTransformStyle,
        background: `rgba(15, 23, 42, 0.5)`,
      }}
      {...eventHandlers}
    >
      {/* 外框发光效果 */}
      <div
        className="absolute inset-0 z-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: `0 0 15px 2px ${edgeHighlightColor}`,
          opacity: isHovering ? 1 : 0.5,
          transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
        }}
      />

      {/* 高光效果 - 仅在客户端显示 */}
      {isMounted && (
        <div 
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%)`,
            opacity: isHovering ? 0.7 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* 彩虹折射效果 - 仅在客户端显示 */}
      {isMounted && (
        <div 
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none rounded-xl"
          style={{
            background: `linear-gradient(${45 + position.x + randomOffset}deg, rgba(0, 210, 255, 0.15), rgba(58, 123, 213, 0.15), rgba(152, 68, 183, 0.15))`,
            opacity: isHovering ? 0.6 : 0.2,
            transition: 'opacity 0.3s ease, background 0.5s ease',
            filter: 'blur(2px)',
          }}
        />
      )}

      {/* 棱镜效果 - 边缘的多色光线 */}
      {isMounted && (
        <div 
          className="absolute -inset-[1px] z-0 rounded-xl overflow-hidden pointer-events-none"
          style={{
            opacity: isHovering ? 0.5 : 0,
            transition: 'opacity 0.3s ease',
            background: `linear-gradient(to right, transparent 30%, 
                        rgba(83, 238, 246, 0.1) 35%, 
                        rgba(73, 132, 255, 0.1) 40%, 
                        rgba(176, 93, 214, 0.1) 45%, 
                        rgba(227, 122, 255, 0.1) 50%, 
                        transparent 70%)`,
            mixBlendMode: 'screen',
            animation: isHovering ? 'prismShift 2s ease-in-out infinite alternate' : 'none',
          }}
        />
      )}

      {/* 内容容器 */}
      <div className="relative z-10 p-5">
        {children}
      </div>

      {/* 添加CSS动画 */}
      <style jsx global>{`
        @keyframes prismShift {
          0% {
            transform: translateX(-30%);
          }
          100% {
            transform: translateX(30%);
          }
        }
      `}</style>
    </div>
  );
};

export default GlassCard; 