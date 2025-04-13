'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getLinkHref } from '../utils/urlHelper';

interface ArticleCardProps {
  id: string;
  title: string;
  date: string;
  category: string;
  summary?: string;
  url: string;
  index?: number;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  date,
  category,
  summary,
  url,
  index = 0,
  featured = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };
  
  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-lg border shadow-md transition-all duration-300 
      ${isHovered ? 'transform shadow-xl z-10' : 'shadow-black/20'}
      ${featured ? 'border-indigo-500/30' : 'border-white/10'}
      ${featured ? 'scale-105' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered 
          ? `translateZ(20px) ${featured ? 'scale(1.05)' : 'scale(1.05)'}` 
          : `translateZ(0) ${featured ? 'scale(1.02)' : 'scale(1)'}`,
        background: isHovered 
          ? 'linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(99,102,241,0.1) 100%)' 
          : 'linear-gradient(120deg, rgba(255,255,255,0.05) 0%, rgba(99,102,241,0.05) 100%)',
        backdropFilter: 'blur(8px)',
        animationDelay: `${index * 0.1}s`,
        padding: featured ? '1.5rem' : '1.25rem',
      }}
    >
      {/* 动态边框效果 */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99,102,241,0.15), transparent 40%)`,
        }}
      />
      
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left transition-transform duration-500 ease-out ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}></div>
      
      <div className="mb-3 flex justify-between items-center">
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300 backdrop-blur-sm">
          {category.trim()}
        </span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      
      <h3 
        className={`text-lg font-semibold mb-3 text-white transition-all duration-300 ${isHovered ? 'transform translate-x-1 text-indigo-200' : ''}`}
        style={{
          textShadow: isHovered ? '0 0 15px rgba(99,102,241,0.5)' : 'none'
        }}
      >
        {title}
      </h3>
      
      {summary && (
        <p className={`text-gray-300 text-sm mb-4 line-clamp-2 transition-all duration-300 ${isHovered ? 'text-gray-200' : ''}`}>
          {summary}
        </p>
      )}
      
      <div className="flex justify-between items-center">
        <Link 
          href={getLinkHref(`/article/${id}`)}
          className={`text-indigo-300 text-sm hover:text-indigo-200 transition-all duration-300 
            flex items-center gap-1 group
            ${isHovered ? 'text-indigo-200 pl-1' : ''}`}
        >
          阅读全文
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        
        {url && (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 text-sm hover:text-gray-300 transition-colors"
          >
            原文链接
          </a>
        )}
      </div>
      
      {/* 内发光效果 */}
      <div 
        className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none`}
        style={{
          boxShadow: 'inset 0 0 15px rgba(99,102,241,0.3)',
          opacity: isHovered ? 0.6 : 0,
        }}
      />
      
      {/* 聚光特效 */}
      {isMounted && (
        <div 
          className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </div>
  );
};

export default ArticleCard; 