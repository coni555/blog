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
  
  // 更可靠的GitHub Pages检测
  const isGitHubPages = () => {
    if (typeof window === 'undefined') return false;
    
    // 优先使用环境变量
    if (process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github') return true;
    
    // 其次检查hostname
    return window.location.hostname.includes('github.io') || 
           window.location.hostname.includes('coni555');
  };
  
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