'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  id: string;
  title: string;
  date: string;
  category: string;
  url: string;
  isRead?: boolean;
  onCardClick?: (id: string) => void;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  date,
  category,
  url,
  isRead = false,
  onCardClick,
  className = '',
}) => {
  // 处理点击事件
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all ${className} ${isRead ? 'opacity-80' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
    >
      {/* 已读标记 */}
      {isRead && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            已读
          </span>
        </div>
      )}
      
      <div className="p-5">
        <div className="flex flex-col h-full">
          <div>
            <Link href={`/article/${id}`} className="block">
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white line-clamp-2">{title}</h3>
            </Link>
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span>{date}</span>
              <Link href={`/category/${encodeURIComponent(category)}`} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                {category}
              </Link>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              onClick={(e) => e.stopPropagation()} // 防止触发卡片的onClick
            >
              阅读原文 →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard; 