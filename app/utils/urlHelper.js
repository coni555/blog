'use client';

/**
 * 获取带有正确前缀的URL路径
 * 在GitHub Pages环境中会自动添加/blog前缀
 */
export function getCorrectPath(path) {
  // 确保路径以/开头
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // 强制为GitHub Pages环境
  const FORCE_GITHUB_PAGES = false; // 只在非GitHub Pages环境中自动判断
  
  // 更可靠的GitHub Pages检测
  const isGitHubPages = () => {
    if (typeof window === 'undefined') return false;
    
    // 检查是否确实在GitHub Pages上
    const isActuallyOnGitHub = window.location.hostname.includes('github.io') || 
                              window.location.hostname.includes('coni555');
    
    // 如果确实在GitHub Pages上，就返回true
    if (isActuallyOnGitHub) return true;
    
    // 否则看是否需要强制
    return FORCE_GITHUB_PAGES;
  };
  
  // 确保路径是合法的
  const ensureValidPath = (inputPath) => {
    // 检查是否是分类路径
    if (inputPath.includes('/category/')) {
      // 提取分类slug
      const parts = inputPath.split('/category/');
      if (parts.length > 1) {
        const slug = parts[1].split('/')[0];
        // 确保是有效的分类
        const validCategories = ['thinking', 'writing', 'reading', 'question', 'english', 
                                'special', 'multimodal', 'science', 'planning', 'ai-sop', 
                                'personalization', 'exercise', 'ai-happiness', 'ai-persona'];
        
        // 如果是有效分类，保持原路径，否则重定向到首页
        if (validCategories.includes(slug)) {
          return inputPath;
        }
      }
    }
    
    // 检查是否是文章路径
    if (inputPath.includes('/article/')) {
      const parts = inputPath.split('/article/');
      if (parts.length > 1) {
        const articleId = parts[1].split('/')[0];
        // 检查文章ID是否为数字
        if (!isNaN(Number(articleId))) {
          return inputPath;
        }
      }
    }
    
    // 特殊页面处理
    if (inputPath === '/about') {
      return inputPath;  // 确保关于页面正常工作
    }
    
    // 其他路径照常返回
    return inputPath;
  };
  
  // 先验证路径的有效性
  path = ensureValidPath(path);
  
  // 如果是GitHub Pages且路径不是已经以/blog开头
  if (isGitHubPages() && !path.startsWith('/blog')) {
    return `/blog${path}`;
  }
  
  return path;
}

/**
 * Link组件的href属性包装器
 */
export function getLinkHref(path) {
  // 如果路径是空值或undefined，返回主页
  if (!path) return '/';
  
  // 如果路径已经是一个完整的URL或者以#开头的锚点，直接返回
  if (path.startsWith('http') || path.startsWith('#')) {
    return path;
  }
  
  return getCorrectPath(path);
}

/**
 * 用于window.open()和其他导航的URL处理
 */
export function getNavigationUrl(path) {
  const url = getLinkHref(path);
  
  // 对于部分导航需要确保有完整的URL
  if (typeof window !== 'undefined' && !url.startsWith('http')) {
    // 检查是否需要添加域名
    if (window.location.hostname.includes('github.io')) {
      // 确保URL已经包含/blog前缀
      return url;
    }
  }
  
  return url;
} 