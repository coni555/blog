'use client';

import React, { useState, useEffect } from 'react';

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      // 计算滚动百分比
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / totalHeight) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    // 初始调用一次，确保初始状态正确
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div 
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${scrollProgress}%`,
          background: 'var(--gradient-primary, linear-gradient(to right, #6366f1, #a855f7))',
          boxShadow: scrollProgress > 5 ? 'var(--shadow-glow, 0 0 10px rgba(139, 92, 246, 0.5))' : 'none',
        }}
      />
    </div>
  );
};

export default ScrollProgressBar; 