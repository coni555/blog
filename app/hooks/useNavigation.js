'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { getNavigationUrl, getLinkHref } from '../utils/urlHelper';

/**
 * 自定义导航钩子，确保所有路由导航在GitHub Pages上正确工作
 */
export default function useNavigation() {
  const router = useRouter();
  
  // 处理导航到文章详情页
  const navigateToArticle = useCallback((articleId, recordView = null) => {
    if (recordView) {
      recordView(articleId);
    }
    
    const url = getNavigationUrl(`/article/${articleId}`);
    
    // 使用较温和的导航方式，避免刷新整个页面
    try {
      router.push(url);
    } catch (e) {
      // 如果router.push失败，回退到window.open
      window.open(url, '_self');
    }
  }, [router]);
  
  // 处理导航到分类页
  const navigateToCategory = useCallback((categorySlug) => {
    const url = getNavigationUrl(`/category/${categorySlug}`);
    
    try {
      router.push(url);
    } catch (e) {
      window.open(url, '_self');
    }
  }, [router]);
  
  // 处理导航到任意页面
  const navigateTo = useCallback((path) => {
    const url = getNavigationUrl(path);
    
    try {
      router.push(url);
    } catch (e) {
      window.open(url, '_self');
    }
  }, [router]);
  
  return {
    navigateToArticle,
    navigateToCategory,
    navigateTo,
    getLinkHref
  };
} 