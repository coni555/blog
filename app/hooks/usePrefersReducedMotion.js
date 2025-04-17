'use client';

import { useState, useEffect } from 'react';

/**
 * 检测用户是否偏好减少动画的钩子
 * 用于支持无障碍功能，当用户在系统设置中启用了减少动画选项时，
 * 网站将自动减少或禁用不必要的动画效果
 */
export function usePrefersReducedMotion() {
  // 创建媒体查询以检测prefers-reduced-motion设置
  const QUERY = '(prefers-reduced-motion: no-preference)';
  
  // 默认为true（减少动画）是最安全的选择
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  
  useEffect(() => {
    // 检查浏览器是否支持matchMedia
    const mediaQueryList = window.matchMedia(QUERY);
    
    // 如果用户没有设置减少动画偏好，则将状态设为false
    setPrefersReducedMotion(!mediaQueryList.matches);
    
    // 创建事件监听器以响应偏好变化
    const listener = (event) => {
      setPrefersReducedMotion(!event.matches);
    };
    
    // 添加事件监听器
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      // 旧版浏览器的兼容处理
      mediaQueryList.addListener(listener);
    }
    
    // 清理函数
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        // 旧版浏览器的兼容处理
        mediaQueryList.removeListener(listener);
      }
    };
  }, []);
  
  return prefersReducedMotion;
} 