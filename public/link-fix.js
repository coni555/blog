// 在文档加载前注入的链接修复程序
(function() {
  // 强制在所有环境中执行修复 - 移除GitHub Pages限制
  // if (!window.location.hostname.includes('github.io')) return;
  
  console.log('✨全面增强链接修复脚本已强制激活✨');
  
  // 路径前缀
  const blogPrefix = '/blog';
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  // 已知工作的分类（硬编码）
  const workingCategories = [
    'thinking', 'writing', 'reading', 'question', 'english', 
    'special', 'multimodal', 'science', 'planning', 'ai-sop', 
    'personalization', 'exercise', 'ai-happiness', 'ai-persona',
    'self-improvement'
  ];
  
  // 静态页面列表
  const staticPages = ['about'];
  
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
  
  // 如果在GitHub Pages上且当前URL不包含/blog前缀
  if (isGitHubPages && !window.location.pathname.startsWith(blogPrefix)) {
    console.log('强制重定向到带/blog前缀的URL');
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
    
    // 添加blog前缀如果缺少且在GitHub Pages上
    if (isGitHubPages && !url.startsWith(blogPrefix)) {
      return blogPrefix + url;
    }
    
    return url;
  }
  
  // 覆盖window.open方法
  if (window.open !== undefined) {
    const originalWindowOpen = window.open;
    window.open = function(url, target, features) {
      if (url && typeof url === 'string' && !url.startsWith('http')) {
        // 处理静态页面
        if (staticPages.some(page => url.includes(`/${page}`))) {
          url = ensureBlogPrefix(url);
        }
        // 检查是否为特殊分类页面
        else if (url.includes('/category/') && isGitHubPages && !url.includes(blogPrefix)) {
          const parts = url.split('/category/');
          if (parts.length > 1) {
            const slug = parts[1].split('/')[0];
            if (!workingCategories.includes(slug)) {
              console.warn('拦截了非工作分类导航:', slug);
              url = isGitHubPages ? blogPrefix + '/' : '/';
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
              url = isGitHubPages ? blogPrefix + '/' : '/';
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
        
        // 处理静态页面链接
        if (staticPages.some(page => originalHref.includes(`/${page}`))) {
          link.removeEventListener('click', handleStaticPageLinkClick, true);
          link.addEventListener('click', handleStaticPageLinkClick, true);
        }
        // 为文章链接添加点击处理器
        else if (originalHref.includes('/article/')) {
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
      
      // 3. 特别处理最新文章区域和相关推荐区域 - 增加更多选择器
      // 扩展选择器以覆盖更多可能的相关推荐区域
      const specialSectionSelectors = [
        '.latest-articles', 
        '.related-articles', 
        '.related-recommendations',
        '.相关推荐',
        '[class*="related"]',
        'div[class*="Related"]',
        // 新增更多选择器
        'div.max-w-3xl.mx-auto.mt-12',
        'h2:contains("相关推荐")',
        '.grid.grid-cols-1.md\\:grid-cols-3'
      ].join(', ');
      
      // 主动查找和处理相关推荐区域
      const specialSections = document.querySelectorAll(specialSectionSelectors);
      console.log(`找到 ${specialSections.length} 个特殊区域`);
      
      specialSections.forEach(section => {
        // 处理区域内的所有链接
        const links = section.querySelectorAll('a');
        console.log(`在特殊区域中找到 ${links.length} 个链接`);
        
        links.forEach(link => {
          // 移除现有的点击处理器并添加新的
          link.removeEventListener('click', handleSpecialSectionLinkClick, true);
          link.addEventListener('click', handleSpecialSectionLinkClick, true);
          
          // 同时修复href属性
          const originalHref = link.getAttribute('href');
          if (originalHref && !originalHref.startsWith('http') && !originalHref.startsWith('#')) {
            const fixedHref = ensureBlogPrefix(originalHref);
            link.setAttribute('href', fixedHref);
            console.log('修复特殊区域链接:', originalHref, '->', fixedHref);
          }
        });
      });
      
      // 4. 特殊处理：查找所有可能的相关推荐链接（更宽泛的搜索）
      // 这会找到可能未被上面检测到的相关推荐链接
      if (window.location.pathname.includes('/article/')) {
        console.log('文章页面：应用额外的相关推荐链接修复');
        
        // 查找文章页面底部的所有链接（大多是相关推荐）
        // 扩大查找范围，不仅限于特定类名
        const articlePage = document.querySelector('main') || document.body;
        const allArticleLinks = articlePage.querySelectorAll('a[href*="/article/"]');
        
        console.log(`文章页面: 找到 ${allArticleLinks.length} 个文章链接`);
        
        // 仅处理文章底部的链接（通常是文章底部三分之一的区域）
        const viewportHeight = window.innerHeight;
        const articleBottom = articlePage.getBoundingClientRect().bottom;
        
        allArticleLinks.forEach(link => {
          const linkRect = link.getBoundingClientRect();
          // 如果链接在页面下三分之一，很可能是相关推荐
          if (linkRect.top > (articleBottom - viewportHeight / 3)) {
            console.log('找到可能的相关推荐链接:', link.getAttribute('href'));
            
            // 移除现有点击处理器并添加新的
            link.removeEventListener('click', handleSpecialSectionLinkClick, true);
            link.addEventListener('click', handleSpecialSectionLinkClick, true);
            
            // 修复href属性
            const originalHref = link.getAttribute('href');
            if (originalHref && !originalHref.startsWith('http') && !originalHref.startsWith('#')) {
              const fixedHref = ensureBlogPrefix(originalHref);
              link.setAttribute('href', fixedHref);
              console.log('修复底部链接:', originalHref, '->', fixedHref);
            }
          }
        });
        
        // 5. 直接处理相关推荐区域 - 强化处理
        const relatedContainer = document.querySelector('.max-w-3xl.mx-auto.mt-12');
        if (relatedContainer) {
          console.log('找到相关推荐容器, 应用强制修复');
          const relatedLinks = relatedContainer.querySelectorAll('a');
          relatedLinks.forEach(link => {
            // 直接覆盖onclick事件
            link.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              const href = this.getAttribute('href');
              if (!href) return;
              
              // 对于文章链接特殊处理
              if (href.includes('/article/')) {
                const parts = href.split('/article/');
                if (parts.length > 1) {
                  const articleId = parts[1].split('/')[0];
                  if (articleId && !isNaN(Number(articleId))) {
                    const targetUrl = isGitHubPages ? blogPrefix + '/article/' + articleId : '/article/' + articleId;
                    console.log('强制处理相关文章链接:', href, '->', targetUrl);
                    window.location.href = targetUrl;
                    return;
                  }
                }
              }
              
              // 其他链接
              window.location.href = ensureBlogPrefix(href);
            };
          });
        }
      }
    } catch (err) {
      console.error('处理链接时出错:', err);
    }
  }
  
  // 处理静态页面链接点击事件
  function handleStaticPageLinkClick(e) {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      const href = this.getAttribute('href');
      if (!href) return;
      
      // 查找是哪个静态页面
      for (const page of staticPages) {
        if (href.includes(`/${page}`)) {
          const targetUrl = isGitHubPages ? `${blogPrefix}/${page}` : `/${page}`;
          console.log('静态页面链接点击:', href, '->', targetUrl);
          window.location.href = targetUrl;
          return;
        }
      }
      
      // 如果没有找到匹配的静态页面，使用默认处理
      window.location.href = ensureBlogPrefix(href);
    } catch (err) {
      console.error('处理静态页面链接点击错误:', err);
      // 降级到默认行为
      return true;
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
        window.location.href = isGitHubPages ? blogPrefix + '/' : '/';
        return;
      }
      
      // 构建正确的URL
      const targetUrl = isGitHubPages ? blogPrefix + '/article/' + articleId : '/article/' + articleId;
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
      if (isGitHubPages && !workingCategories.includes(slug)) {
        console.warn('非标准分类:', slug);
        window.location.href = blogPrefix + '/';
        return;
      }
      
      // 构建正确的URL
      const targetUrl = isGitHubPages ? blogPrefix + '/category/' + slug : '/category/' + slug;
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
        const targetUrl = isGitHubPages ? blogPrefix + '/article/' + articleId : '/article/' + articleId;
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
            const targetUrl = isGitHubPages ? blogPrefix + '/article/' + articleId : '/article/' + articleId;
            console.log('特殊区域文章链接点击:', href, '->', targetUrl);
            
            // 使用强制导航确保链接生效
            window.location.href = targetUrl;
            return;
          }
        }
      }
      
      // 其他类型的链接
      const targetUrl = ensureBlogPrefix(href);
      console.log('特殊区域其他链接点击:', href, '->', targetUrl);
      
      // 使用强制导航
      window.location.href = targetUrl;
    } catch (err) {
      console.error('处理特殊区域链接点击错误:', err);
      // 降级到默认行为
      return true;
    }
  }
  
  // 添加立即调用的修复函数
  function applyImmediateFixesToRelatedArticles() {
    console.log('立即应用相关文章修复');
    
    // 检查是否在文章页面
    if (window.location.pathname.includes('/article/')) {
      setTimeout(() => {
        // 1. 查找相关推荐区域
        const relatedSections = document.querySelectorAll('.max-w-3xl.mx-auto.mt-12, .related-recommendations, .related-articles');
        console.log(`立即修复: 找到 ${relatedSections.length} 个相关推荐区域`);
        
        relatedSections.forEach(section => {
          // 对区域内所有链接应用修复
          const links = section.querySelectorAll('a');
          console.log(`立即修复: 找到 ${links.length} 个相关链接`);
          
          links.forEach(link => {
            // 替换href属性
            const href = link.getAttribute('href');
            if (href && href.includes('/article/')) {
              const parts = href.split('/article/');
              if (parts.length > 1) {
                const articleId = parts[1].split('/')[0];
                if (articleId && !isNaN(Number(articleId))) {
                  // 更新href属性
                  const newHref = isGitHubPages ? blogPrefix + '/article/' + articleId : '/article/' + articleId;
                  link.setAttribute('href', newHref);
                  console.log('立即修复链接:', href, '->', newHref);
                  
                  // 强制添加点击处理
                  link.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('强制导航到:', newHref);
                    window.location.href = newHref;
                  };
                }
              }
            }
          });
        });
        
        // 2. 特殊处理：直接获取相关推荐区域的所有链接元素
        const articleElements = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-3 a');
        console.log(`直接查找方式: 找到 ${articleElements.length} 个相关文章链接`);
        
        articleElements.forEach(linkElement => {
          const href = linkElement.getAttribute('href');
          if (!href || !href.includes('/article/')) return;
          
          const parts = href.split('/article/');
          if (parts.length < 2) return;
          
          const articleId = parts[1].split('/')[0];
          if (!articleId || isNaN(Number(articleId))) return;
          
          // 修复href
          const correctHref = isGitHubPages ? `${blogPrefix}/article/${articleId}` : `/article/${articleId}`;
          linkElement.setAttribute('href', correctHref);
          
          // 使用非冒泡的强制点击处理器
          linkElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = correctHref;
          }, true);
          
          // 额外添加内联处理
          linkElement.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('相关推荐直接点击:', href, '->', correctHref);
            window.location.href = correctHref;
            return false;
          };
        });
      }, 500);
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
  
  // 立即应用相关文章修复
  applyImmediateFixesToRelatedArticles();
  
  // 立即处理页面上的链接
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(processAllLinks, 100);
      // 再次处理以确保捕获到所有动态内容
      setTimeout(processAllLinks, 1000);
      setTimeout(processAllLinks, 2000);
      
      // 额外检查文章页面
      if (window.location.pathname.includes('/article/')) {
        console.log('检测到文章页面，应用额外修复');
        setTimeout(applyImmediateFixesToRelatedArticles, 1000);
        setTimeout(applyImmediateFixesToRelatedArticles, 2000);
      }
    });
  } else {
    processAllLinks();
    // 再次处理以确保捕获到所有动态内容
    setTimeout(processAllLinks, 1000);
    setTimeout(processAllLinks, 2000);
    
    // 额外检查文章页面
    if (window.location.pathname.includes('/article/')) {
      setTimeout(applyImmediateFixesToRelatedArticles, 1000);
      setTimeout(applyImmediateFixesToRelatedArticles, 2000);
    }
  }
})(); 