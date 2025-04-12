'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ArticleCardProps {
  id: string;
  title: string;
  date: string;
  category: string;
  summary?: string;
  url: string;
  index?: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  date,
  category,
  summary,
  url,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/10 shadow-md p-5 transition-all duration-300 
      bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm 
      ${isHovered ? 'transform scale-105 shadow-xl shadow-indigo-500/20 z-10' : 'shadow-black/20'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left transition-transform duration-300 ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}></div>
      
      <div className="mb-2">
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300">
          {category.trim()}
        </span>
        <span className="text-xs text-gray-400 ml-2">{date}</span>
      </div>
      
      <h3 className={`text-lg font-semibold mb-2 text-white transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`}>{title}</h3>
      
      {summary && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{summary}</p>
      )}
      
      <div className="flex justify-between items-center">
        <Link href={`/article/${id}`} 
          className={`text-indigo-300 text-sm hover:text-indigo-200 transition-all duration-300 
          ${isHovered ? 'text-indigo-200 pl-1' : ''}`}>
          阅读全文
        </Link>
        
        <a href={url} target="_blank" rel="noopener noreferrer" 
          className="text-gray-400 text-sm hover:text-gray-300 transition-colors">
          原文链接
        </a>
      </div>
      
      {/* Inner shadow effect on hover */}
      <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none 
        shadow-[inset_0_0_15px_rgba(99,102,241,0.3)] opacity-0 ${isHovered ? 'opacity-100' : ''}`}></div>
    </div>
  );
};

export default ArticleCard; 