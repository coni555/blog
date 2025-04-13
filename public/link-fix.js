// 在文档加载前注入的链接修复程序
(function() {
  // 在GitHub Pages环境中运行
  if (!window.location.hostname.includes('github.io')) return;
  
  console.log('链接修复脚本已激活');
  
  // 路径前缀
  const blogPrefix = '/blog';
  
  // 已知工作的分类（硬编码）
  const workingCategories = ['thinking', 'writing', 'reading', 'question', 'english'];
  
  // 如果当前URL不包含/blog前缀但应该包含
  if (!window.location.pathname.startsWith(blogPrefix)) {
    window.location.href = blogPrefix + window.location.pathname;
    return; // 停止执行，等待重定向
  }
  
  // 捕获所有链接点击
  document.addEventListener('click', function(e) {
    let target = e.target;
    
    // 向上查找到最近的A标签
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
      if (!target) return;
    }
    
    if (!target || !target.href) return;
    
    try {
      // 分析链接
      const url = new URL(target.href);
      
      // 只处理同源链接
      if (url.origin !== window.location.origin) return;
      
      // 提取路径
      let path = url.pathname;
      
      // 修复链接路径
      if (!path.startsWith(blogPrefix)) {
        e.preventDefault(); // 阻止默认行为
        
        // 添加前缀
        const fixedUrl = blogPrefix + path + url.search + url.hash;
        console.log('修复链接:', path, '->', fixedUrl);
        
        // 重定向
        window.location.href = fixedUrl;
        return;
      }
      
      // 特殊处理分类页面
      if (path.includes('/category/')) {
        const parts = path.split('/category/');
        if (parts.length > 1) {
          const categorySlug = parts[1].split('/')[0];
          
          // 如果不是已知工作的分类
          if (!workingCategories.includes(categorySlug)) {
            e.preventDefault();
            console.warn('非标准分类:', categorySlug, '重定向到主页');
            window.location.href = blogPrefix + '/';
            return;
          }
        }
      }
      
      // 特殊处理文章页面
      if (path.includes('/article/')) {
        const parts = path.split('/article/');
        if (parts.length > 1) {
          const articleId = parts[1].split('/')[0];
          
          // 尝试验证文章ID
          if (!articleId || articleId.trim() === '') {
            e.preventDefault();
            console.warn('无效文章ID，重定向到主页');
            window.location.href = blogPrefix + '/';
            return;
          }
        }
      }
    } catch (err) {
      console.error('链接处理错误:', err);
    }
  }, true);
  
  // 修复所有链接的href属性
  function fixAllLinks() {
    // 获取所有链接
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      try {
        // 如果链接不是外部链接
        if (!link.href.startsWith('http') || link.href.includes(window.location.hostname)) {
          const url = new URL(link.href);
          
          // 如果链接不包含blog前缀
          if (!url.pathname.startsWith(blogPrefix)) {
            // 更新href属性
            const originalPath = url.pathname;
            url.pathname = blogPrefix + url.pathname;
            link.href = url.toString();
            console.log('修复静态链接:', originalPath, '->', url.pathname);
          }
        }
      } catch (err) {
        console.error('静态链接修复错误:', link.href, err);
      }
    });
  }
  
  // 页面加载时修复所有链接
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllLinks);
  } else {
    fixAllLinks();
  }
  
  // 定期检查并修复新添加的链接
  setInterval(fixAllLinks, 2000);
})(); 