'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CategoryFeatureCardProps {
  category: string;
  articleCount: number;
  onClick?: () => void;
  isActive?: boolean;
  index: number;
}

const CategoryFeatureCard: React.FC<CategoryFeatureCardProps> = ({
  category,
  articleCount,
  onClick,
  isActive = false,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // 基于索引生成独特的渐变色
  const generateGradient = (idx: number) => {
    const hues = [
      [230, 240], // 蓝色系
      [260, 270], // 紫色系
      [180, 200], // 青色系
      [280, 290], // 紫红色系
      [210, 220], // 蓝紫色系
      [190, 200], // 青蓝色系
    ];
    
    const hueSet = hues[idx % hues.length];
    const primary = hueSet[0];
    const secondary = hueSet[1];
    
    return {
      background: `radial-gradient(circle at 10% 20%, hsla(${primary}, 85%, 50%, 0.15), hsla(${secondary}, 75%, 55%, 0.1))`,
      border: `hsla(${primary}, 80%, 60%, ${isHovered ? 0.5 : 0.2})`,
      glow: `hsla(${primary}, 90%, 65%, 0.6)`,
      dot: `hsla(${primary}, 90%, 70%, ${isActive ? 1 : 0.6})`
    };
  };
  
  const colors = generateGradient(index);
  
  return (
    <div
      className={`relative overflow-hidden rounded-xl border backdrop-blur-sm p-6 transition-all duration-300 cursor-pointer select-none`}
      style={{
        background: colors.background,
        borderColor: colors.border,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 15px 30px rgba(0,0,0,0.2), 0 0 15px ${colors.glow}` : '0 4px 6px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 背景装饰 */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-xl opacity-70"></div>
      <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-white/5 rounded-full blur-lg opacity-50"></div>
      
      <div className="relative z-10">
        {/* 分类标题区域 */}
        <div className="flex items-center mb-3">
          <span 
            className="w-2.5 h-2.5 rounded-full mr-2"
            style={{ backgroundColor: colors.dot }}
          ></span>
          <h3 className="text-xl font-semibold text-white">{category}</h3>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/10 text-indigo-200">
            {articleCount}篇
          </span>
        </div>
        
        {/* 提示文本 */}
        <p className="text-sm text-indigo-100/80 mb-3">点击查看该分类的所有文章</p>
        
        {/* 悬停时显示的按钮 */}
        <div 
          className={`mt-2 inline-flex items-center text-xs text-indigo-300 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <span>浏览全部</span>
          <svg className="w-3.5 h-3.5 ml-1 transition-transform duration-300" 
            style={{ transform: isHovered ? 'translateX(3px)' : 'translateX(0)' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CategoryFeatureCard; 