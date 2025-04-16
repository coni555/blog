'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * 全局链接保护组件 - 劫持并修复所有链接点击
 */
export default function LinkGuard() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // 已处理分类（可以正常工作的）
    const WORKING_CATEGORIES = ['thinking', 'writing', 'reading', 'question', 'english', 'special', 'multimodal', 'science', 'self-improvement', 'exercise', 'ai-persona'];
    
    // 检测是否在GitHub Pages环境
    const isGitHubPages = window.location.hostname.includes('github.io');
    const blogPrefix = '/blog';
    
    // 调试日志
    console.log('LinkGuard 已激活，当前路径:', pathname);
    console.log('GitHub Pages 环境:', isGitHubPages);
    
    // 确保当前URL正确
    if (isGitHubPages && !pathname.startsWith(blogPrefix)) {
      window.location.href = `${blogPrefix}${pathname}`;
      return;
    }
    
    // 拦截所有链接点击
    const handleLinkClick = (e) => {
      // 确保目标是链接
      let target = e.target;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
        if (!target) return;
      }
      
      if (!target || !target.href) return;
      
      try {
        // 提取链接信息
        const url = new URL(target.href);
        
        // 只处理同源链接
        if (url.origin === window.location.origin) {
          // 提取路径信息
          let path = url.pathname;
          
          // 检查是否已经添加了/blog前缀
          if (isGitHubPages && !path.startsWith(blogPrefix)) {
            console.log('修复链接:', path, '->', `${blogPrefix}${path}`);
            
            // 阻止默认行为
            e.preventDefault();
            
            // 使用更可靠的导航方式
            const correctedPath = `${blogPrefix}${path}`;
            
            try {
              // 优先使用路由器导航
              router.push(correctedPath);
            } catch (err) {
              console.error('路由器导航失败:', err);
              // 回退到window.location
              window.location.href = correctedPath;
            }
          }
          
          // 文章链接修复 - 确保即使路径是正确的，但格式不符合预期的情况下也能正常工作
          if (path.includes('/article/')) {
            // 检查是否为有效文章ID
            const articleId = path.split('/article/')[1];
            if (articleId && (isNaN(articleId) || typeof articleId !== 'string')) {
              console.warn('可能存在无效文章ID:', articleId);
            }
          }
          
          // 分类链接修复 - 针对特定分类进行修复
          if (path.includes('/category/')) {
            const slug = path.split('/category/')[1];
            
            // 检查是否为有效分类名称
            if (slug && !WORKING_CATEGORIES.includes(slug)) {
              console.warn('非标准分类导航:', slug);
              e.preventDefault();
              
              // 使用更安全的导航到主页
              const homePage = isGitHubPages ? `${blogPrefix}/` : '/';
              try {
                router.push(homePage);
              } catch (err) {
                window.location.href = homePage;
              }
            }
          }
        }
      } catch (err) {
        console.error('链接处理错误:', err);
      }
    };
    
    // 添加事件监听器
    document.addEventListener('click', handleLinkClick, true);
    
    // 清理函数
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [router, pathname]);
  
  // 这个组件不渲染任何内容
  return null;
} 