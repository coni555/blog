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
  
  // 检查是否在GitHub Pages环境
  const isGitHubPages = typeof window !== 'undefined' && 
    (window.location.hostname.includes('github.io') || 
     process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github');
  
  // 如果是GitHub Pages且路径不是已经以/blog开头
  if (isGitHubPages && !path.startsWith('/blog')) {
    return `/blog${path}`;
  }
  
  return path;
}

/**
 * Link组件的href属性包装器
 */
export function getLinkHref(path) {
  // 如果路径已经是一个完整的URL或者以#开头的锚点，直接返回
  if (path.startsWith('http') || path.startsWith('#')) {
    return path;
  }
  
  return getCorrectPath(path);
} 