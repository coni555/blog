'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';

// 导出颜色主题类型以供其他组件使用
export type ColorTheme = 'cosmic' | 'ocean' | 'sunset' | 'forest';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleThemeChange = (newTheme: ColorTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const themeData = {
    cosmic: {
      name: '星空',
      icon: '✨',
      colors: 'from-indigo-800 via-purple-700 to-indigo-900'
    },
    ocean: {
      name: '海洋',
      icon: '🌊',
      colors: 'from-blue-800 via-cyan-700 to-blue-900'
    },
    sunset: {
      name: '日落',
      icon: '🌅',
      colors: 'from-orange-800 via-pink-700 to-purple-900'
    },
    forest: {
      name: '森林',
      icon: '🌲',
      colors: 'from-emerald-800 via-green-700 to-teal-900'
    }
  };

  // 在客户端挂载前不显示任何东西，避免水合错误
  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all"
        aria-label="切换主题"
      >
        <span>{themeData[theme].icon}</span>
        <span className="text-sm">{themeData[theme].name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-black/50 backdrop-blur-xl rounded-lg shadow-lg z-50 border border-white/10 w-48">
          {(Object.keys(themeData) as ColorTheme[]).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => handleThemeChange(themeKey)}
              className={`w-full text-left flex items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors ${
                theme === themeKey ? 'bg-white/5' : ''
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${themeData[themeKey].colors}`} />
              <span>{themeData[themeKey].name}</span>
              <span>{themeData[themeKey].icon}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle; 