// 搜索修复脚本 - 确保在GitHub Pages上能正确处理搜索
(function() {
  // 只在GitHub Pages环境中运行
  if (typeof window === 'undefined' || !window.location.hostname.includes('github.io')) {
    return;
  }
  
  console.log('🔍 搜索修复脚本激活');
  
  // 检查当前是否在搜索页
  const isSearchPage = window.location.pathname.includes('/search') || 
                      window.location.pathname.endsWith('/search');
  
  if (isSearchPage) {
    // 处理URL参数
    const processSearchParams = () => {
      // 从URL获取查询参数
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');
      
      if (query) {
        console.log('搜索查询:', query);
        
        // 在DOM加载完成后，确保搜索框有正确的值
        setTimeout(() => {
          const searchInputs = document.querySelectorAll('input[name="q"]');
          searchInputs.forEach(input => {
            input.value = query;
          });
          
          // 触发搜索结果页的初始化
          const searchEvent = new CustomEvent('search:query', { 
            detail: { query: query } 
          });
          document.dispatchEvent(searchEvent);
        }, 100);
      } else {
        console.log('没有搜索查询参数');
      }
    };
    
    // 初始处理
    processSearchParams();
    
    // 监听URL变化
    window.addEventListener('popstate', processSearchParams);
  }
  
  // 拦截所有搜索表单提交
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.tagName === 'FORM' && form.action && form.action.includes('/search')) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const query = formData.get('q');
      
      if (query) {
        // 修正搜索URL
        let searchUrl = '/blog/search?q=' + encodeURIComponent(query);
        console.log('重定向搜索到:', searchUrl);
        window.location.href = searchUrl;
      }
    }
  }, true);
})(); 