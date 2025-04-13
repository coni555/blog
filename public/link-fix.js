// 在文档加载前注入的链接修复程序
(function() {
  // 在GitHub Pages环境中运行
  if (!window.location.hostname.includes('github.io')) return;
  
  console.log('✨全面增强链接修复脚本已激活✨');
  
  // 路径前缀
  const blogPrefix = '/blog';
  
  // 已知工作的分类（硬编码）
  const workingCategories = ['thinking', 'writing', 'reading', 'question', 'english'];
  
  // 特殊路径策略
  const FORCE_HOME = 'FORCE_HOME'; // 强制回到首页
  const pathStrategies = {
    '/article/': {
      // 捕获所有不是数字的文章ID
      pattern: /\/article\/([^0-9/]+)/,
      action: FORCE_HOME
    },
    '/category/': {
      pattern: new RegExp(`/category/((?!${workingCategories.join('|')})[^/]+)`),
      action: FORCE_HOME
    }
  };
  
  // 如果当前URL不包含/blog前缀但应该包含
  if (!window.location.pathname.startsWith(blogPrefix)) {
    window.location.href = blogPrefix + window.location.pathname;
    return; // 停止执行，等待重定向
  }
  
  // 修复相对路径URL，在href属性上直接进行修改
  function ensureBlogPrefix(url) {
    if (!url) return url;
    if (url.startsWith('http') || url.startsWith('#')) return url;
    
    // 确保所有相对路径都以/开头
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    
    // 添加blog前缀如果缺少
    if (!url.startsWith(blogPrefix)) {
      return blogPrefix + url;
    }
    
    return url;
  }
  
  // 覆盖window.open方法
  if (window.open !== undefined) {
    const originalWindowOpen = window.open;
    window.open = function(url, target, features) {
      if (url && typeof url === 'string' && !url.startsWith('http')) {
        // 检查是否为特殊分类页面
        if (url.includes('/category/') && !url.includes(blogPrefix)) {
          const parts = url.split('/category/');
          if (parts.length > 1) {
            const slug = parts[1].split('/')[0];
            if (!workingCategories.includes(slug)) {
              console.warn('拦截了非工作分类导航:', slug);
              url = blogPrefix + '/';
            } else {
              url = ensureBlogPrefix(url);
            }
          }
        } 
        // 检查是否为文章页面
        else if (url.includes('/article/')) {
          const parts = url.split('/article/');
          if (parts.length > 1) {
            const articleId = parts[1].split('/')[0];
            // 简单验证文章ID (应该是数字)
            if (articleId && !isNaN(Number(articleId))) {
              url = ensureBlogPrefix(url);
            } else {
              console.warn('拦截了无效文章ID:', articleId);
              url = blogPrefix + '/';
            }
          }
        } else {
          url = ensureBlogPrefix(url);
        }
      }
      return originalWindowOpen.call(window, url, target, features);
    };
  }
  
  // 修复页面上所有的链接
  function processAllLinks() {
    try {
      console.log('重新处理页面上的所有链接');
      
      // 1. 修复所有普通链接
      const allLinks = document.querySelectorAll('a[href]');
      console.log(`找到 ${allLinks.length} 个链接`);
      
      allLinks.forEach(link => {
        const originalHref = link.getAttribute('href');
        if (!originalHref || originalHref.startsWith('http') || originalHref.startsWith('#')) return;
        
        // 为文章链接添加点击处理器
        if (originalHref.includes('/article/')) {
          // 移除现有的所有点击处理器
          link.removeEventListener('click', handleArticleLinkClick, true);
          link.addEventListener('click', handleArticleLinkClick, true);
        }
        // 为分类链接添加点击处理器
        else if (originalHref.includes('/category/')) {
          // 移除现有的所有点击处理器
          link.removeEventListener('click', handleCategoryLinkClick, true);
          link.addEventListener('click', handleCategoryLinkClick, true);
        }
        
        // 无论如何修复href属性
        const fixedHref = ensureBlogPrefix(originalHref);
        if (fixedHref !== originalHref) {
          link.setAttribute('href', fixedHref);
          console.log('修复链接:', originalHref, '->', fixedHref);
        }
      });
      
      // 2. 修复卡片点击
      const cards = document.querySelectorAll('.article-card, [class*="Card"], [data-article-id]');
      cards.forEach(card => {
        card.removeEventListener('click', handleCardClick, true);
        card.addEventListener('click', handleCardClick, true);
      });
      
      // 3. 特别处理最新文章区域和相关推荐区域
      const specialSections = document.querySelectorAll('.latest-articles, .related-articles, .related-recommendations');
      specialSections.forEach(section => {
        const links = section.querySelectorAll('a');
        links.forEach(link => {
          link.removeEventListener('click', handleSpecialSectionLinkClick, true);
          link.addEventListener('click', handleSpecialSectionLinkClick, true);
        });
      });
    } catch (err) {
      console.error('处理链接时出错:', err);
    }
  }
  
  // 处理文章链接点击事件
  function handleArticleLinkClick(e) {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      const href = this.getAttribute('href');
      if (!href) return;
      
      // 提取文章ID
      const parts = href.split('/article/');
      if (parts.length < 2) {
        window.location.href = ensureBlogPrefix(href);
        return;
      }
      
      const articleId = parts[1].split('/')[0];
      if (!articleId || isNaN(Number(articleId))) {
        console.warn('无效的文章ID:', articleId);
        window.location.href = blogPrefix + '/';
        return;
      }
      
      // 构建正确的URL
      const targetUrl = blogPrefix + '/article/' + articleId;
      console.log('文章链接点击:', href, '->', targetUrl);
      window.location.href = targetUrl;
    } catch (err) {
      console.error('处理文章链接点击错误:', err);
      // 降级到默认行为
      return true;
    }
  }
  
  // 处理分类链接点击事件
  function handleCategoryLinkClick(e) {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      const href = this.getAttribute('href');
      if (!href) return;
      
      // 提取分类slug
      const parts = href.split('/category/');
      if (parts.length < 2) {
        window.location.href = ensureBlogPrefix(href);
        return;
      }
      
      const slug = parts[1].split('/')[0];
      if (!workingCategories.includes(slug)) {
        console.warn('非标准分类:', slug);
        window.location.href = blogPrefix + '/';
        return;
      }
      
      // 构建正确的URL
      const targetUrl = blogPrefix + '/category/' + slug;
      console.log('分类链接点击:', href, '->', targetUrl);
      window.location.href = targetUrl;
    } catch (err) {
      console.error('处理分类链接点击错误:', err);
      // 降级到默认行为
      return true;
    }
  }
  
  // 处理卡片点击事件
  function handleCardClick(e) {
    try {
      // 如果点击的是卡片内部的链接，让链接处理函数处理
      if (e.target.tagName === 'A' || 
          (e.target.parentElement && e.target.parentElement.tagName === 'A') ||
          (e.target.closest && e.target.closest('a'))) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      // 尝试从多个地方提取文章ID
      let articleId = null;
      
      // 方法1: 从data属性
      if (this.dataset && this.dataset.articleId) {
        articleId = this.dataset.articleId;
      }
      
      // 方法2: 从内部链接
      if (!articleId) {
        const link = this.querySelector('a[href*="/article/"]');
        if (link) {
          const href = link.getAttribute('href');
          const parts = href.split('/article/');
          if (parts.length > 1) {
            articleId = parts[1].split('/')[0];
          }
        }
      }
      
      // 方法3: 从父元素
      if (!articleId && this.parentElement) {
        const parentId = this.parentElement.dataset && this.parentElement.dataset.articleId;
        if (parentId) {
          articleId = parentId;
        }
      }
      
      if (articleId && !isNaN(Number(articleId))) {
        const targetUrl = blogPrefix + '/article/' + articleId;
        console.log('卡片点击 -> 文章:', articleId);
        window.location.href = targetUrl;
      } else {
        console.warn('无法从卡片提取文章ID');
      }
    } catch (err) {
      console.error('处理卡片点击错误:', err);
    }
  }
  
  // 特殊区域链接点击处理（最新文章和相关推荐）
  function handleSpecialSectionLinkClick(e) {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      const href = this.getAttribute('href');
      if (!href) return;
      
      // 如果是文章链接
      if (href.includes('/article/')) {
        const parts = href.split('/article/');
        if (parts.length > 1) {
          const articleId = parts[1].split('/')[0];
          
          // 校验articleId是否为数字
          if (articleId && !isNaN(Number(articleId))) {
            const targetUrl = blogPrefix + '/article/' + articleId;
            console.log('特殊区域文章链接点击:', href, '->', targetUrl);
            window.location.href = targetUrl;
            return;
          }
        }
      }
      
      // 其他类型的链接
      const targetUrl = ensureBlogPrefix(href);
      console.log('特殊区域其他链接点击:', href, '->', targetUrl);
      window.location.href = targetUrl;
    } catch (err) {
      console.error('处理特殊区域链接点击错误:', err);
      // 降级到默认行为
      return true;
    }
  }
  
  // MutationObserver监视DOM变化
  const observer = new MutationObserver(function(mutations) {
    let needsProcessing = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        // 检查是否添加了新的链接或卡片
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue; // 只处理元素节点
          
          // 直接是链接或卡片
          if (node.tagName === 'A' || 
              (node.classList && 
               (node.classList.contains('article-card') || 
                node.classList.contains('Card')))) {
            needsProcessing = true;
            break;
          }
          
          // 包含链接或卡片的容器
          if (node.querySelector && 
              (node.querySelector('a[href], .article-card, [class*="Card"], [data-article-id]') ||
               node.querySelector('.latest-articles, .related-articles, .related-recommendations'))) {
            needsProcessing = true;
            break;
          }
        }
      }
      else if (mutation.type === 'attributes' && 
               mutation.attributeName === 'href' && 
               mutation.target.tagName === 'A') {
        needsProcessing = true;
        break;
      }
    }
    
    if (needsProcessing) {
      // 给DOM一点时间完成更新
      setTimeout(processAllLinks, 50);
    }
  });
  
  // 配置观察器
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });
  
  // 立即处理页面上的链接
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(processAllLinks, 100);
      // 再次处理以确保捕获到所有动态内容
      setTimeout(processAllLinks, 1000);
      setTimeout(processAllLinks, 2000);
    });
  } else {
    processAllLinks();
    // 再次处理以确保捕获到所有动态内容
    setTimeout(processAllLinks, 1000);
    setTimeout(processAllLinks, 2000);
  }
})(); 