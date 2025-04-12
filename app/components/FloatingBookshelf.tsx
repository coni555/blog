'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  category: string;
  color?: string;
}

interface FloatingBookshelfProps {
  books: Book[];
  className?: string;
}

const FloatingBookshelf: React.FC<FloatingBookshelfProps> = ({ books, className = '' }) => {
  const router = useRouter();
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  // 为每本书生成随机颜色（如果没有提供）
  const getBookColor = (book: Book) => {
    if (book.color) return book.color;
    
    // 根据分类生成固定颜色
    const categoryColors: Record<string, string> = {
      '技术分享': 'bg-blue-600',
      '读书笔记': 'bg-emerald-600',
      '思考随笔': 'bg-purple-600',
      '工具推荐': 'bg-amber-600',
      '未分类': 'bg-gray-600',
    };
    
    return categoryColors[book.category] || 'bg-indigo-600';
  };

  // 为每本书生成随机浮动动画
  const getFloatAnimation = (index: number) => {
    const delays = ['0s', '0.5s', '1s', '1.5s', '2s', '2.5s', '3s'];
    const delay = delays[index % delays.length];
    return `float 6s ease-in-out ${delay} infinite`;
  };

  // 计算书本角度 - 创建弧形书架效果
  const getBookRotation = (index: number, total: number) => {
    const middleIndex = Math.floor(total / 2);
    const normalizedIndex = index - middleIndex;
    // 每本书旋转的角度 (中间0度，向两边逐渐增加)
    return normalizedIndex * 8;
  };

  const handleBookClick = (category: string) => {
    router.push(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <div className={`relative w-full py-16 mb-16 overflow-hidden ${className}`}>
      <div className="flex justify-center items-end">
        {books.map((book, index) => {
          const isHovered = hoveredBook === book.id;
          const bookColor = getBookColor(book);
          const rotation = getBookRotation(index, books.length);
          
          return (
            <div
              key={book.id}
              className="relative mx-2 transform-gpu cursor-pointer"
              style={{
                animation: getFloatAnimation(index),
                transform: `rotate(${rotation}deg) ${isHovered ? 'translateY(-20px) scale(1.1)' : ''}`,
                transition: 'transform 0.3s ease',
                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => setHoveredBook(book.id)}
              onMouseLeave={() => setHoveredBook(null)}
              onClick={() => handleBookClick(book.category)}
            >
              {/* 书脊 */}
              <div 
                className={`${bookColor} h-40 w-8 rounded-sm flex items-center justify-center overflow-hidden shadow-lg transform perspective-800`}
              >
                {/* 书名(垂直文字) */}
                <div className="writing-vertical text-xs text-white font-medium p-1 transform rotate-180">
                  {book.title}
                </div>
              </div>
              
              {/* 悬浮时显示的分类标签 */}
              {isHovered && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-1 bg-white text-gray-800 rounded-md text-sm whitespace-nowrap shadow-lg">
                  {book.category}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* 书架阴影 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-black/20 blur-xl rounded-full"></div>
      
      {/* 书架悬浮提示 */}
      <div className="text-center mt-10 text-sm text-indigo-200 opacity-70">
        点击书籍进入相应分类
      </div>
    </div>
  );
};

export default FloatingBookshelf; 