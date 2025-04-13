'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ColorTheme } from '../components/ThemeToggle';

// 主题上下文
type ThemeContextType = {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cosmic',
  setTheme: () => {},
});

// 自定义钩子，使组件可以访问主题
export const useTheme = () => useContext(ThemeContext);

// 确保主题类型是合法的
const themeColors: Record<ColorTheme, {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
}> = {
  cosmic: {
    primary: 'rgb(99, 102, 241)',
    secondary: 'rgb(139, 92, 246)',
    accent: 'rgb(168, 85, 247)',
    background: 'rgb(15, 23, 42)',
    card: 'rgba(30, 41, 59, 0.8)',
  },
  ocean: {
    primary: 'rgb(59, 130, 246)',
    secondary: 'rgb(14, 165, 233)',
    accent: 'rgb(6, 182, 212)',
    background: 'rgb(15, 23, 42)',
    card: 'rgba(30, 58, 138, 0.8)',
  },
  sunset: {
    primary: 'rgb(249, 115, 22)',
    secondary: 'rgb(244, 63, 94)',
    accent: 'rgb(217, 70, 239)',
    background: 'rgb(15, 23, 42)',
    card: 'rgba(124, 45, 18, 0.8)',
  },
  forest: {
    primary: 'rgb(16, 185, 129)',
    secondary: 'rgb(5, 150, 105)',
    accent: 'rgb(20, 184, 166)',
    background: 'rgb(15, 23, 42)',
    card: 'rgba(6, 78, 59, 0.8)',
  },
};

// 主题提供者组件
const ClientThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ColorTheme>('cosmic');
  const [isMounted, setIsMounted] = useState(false);

  // 应用主题样式
  useEffect(() => {
    if (!isMounted) return;
    
    // 移除所有现有主题类
    document.body.classList.remove('theme-cosmic', 'theme-ocean', 'theme-sunset', 'theme-forest');
    
    // 添加当前主题类
    document.body.classList.add(`theme-${theme}`);
    
    // 设置CSS变量
    document.documentElement.style.setProperty('--theme-transition', 'all 0.5s ease');
    
    // 设置CSS变量
    Object.entries(themeColors[theme]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--theme-${key}`, value);
    });
    
  }, [theme, isMounted]);
  
  // 客户端挂载后初始化
  useEffect(() => {
    setIsMounted(true);
    
    // 添加全局CSS
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --theme-transition: all 0.5s ease;
      }
      
      body {
        transition: var(--theme-transition);
      }
      
      .theme-cosmic {
        --gradient-primary: linear-gradient(to right, #6366f1, #a855f7);
        --shadow-glow: 0 0 15px rgba(139, 92, 246, 0.5);
      }
      
      .theme-ocean {
        --gradient-primary: linear-gradient(to right, #3b82f6, #06b6d4);
        --shadow-glow: 0 0 15px rgba(14, 165, 233, 0.5);
      }
      
      .theme-sunset {
        --gradient-primary: linear-gradient(to right, #f97316, #d946ef);
        --shadow-glow: 0 0 15px rgba(244, 63, 94, 0.5);
      }
      
      .theme-forest {
        --gradient-primary: linear-gradient(to right, #10b981, #14b8a6);
        --shadow-glow: 0 0 15px rgba(5, 150, 105, 0.5);
      }
    `;
    document.head.appendChild(style);
    
    // 强制加载链接修复脚本
    try {
      console.log('🚀 主题提供者: 强制加载链接修复脚本');
      const timestamp = new Date().getTime(); // 添加时间戳防止缓存
      
      // 检查是否已经加载过脚本
      const existingScript = document.getElementById('global-link-fix-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      // 创建新脚本
      const script = document.createElement('script');
      script.id = 'global-link-fix-script';
      
      // 检测是否在GitHub Pages环境
      const isGitHubPages = window.location.hostname.includes('github.io');
      const scriptPath = isGitHubPages ? '/blog/link-fix.js' : '/link-fix.js';
      script.src = `${scriptPath}?v=${timestamp}`;
      script.async = true;
      document.body.appendChild(script);
      
      // 监听脚本加载完成事件
      script.onload = () => {
        console.log('✅ 链接修复脚本已加载');
      };
      
      script.onerror = (err) => {
        console.error('❌ 链接修复脚本加载失败:', err);
      };
    } catch (err) {
      console.error('加载链接修复脚本失败:', err);
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ClientThemeProvider; 