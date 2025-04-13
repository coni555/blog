'use client';

import Script from 'next/script';

export default function HtmlHead() {
  return (
    <>
      {/* 仅在生产环境加载 GitHub 环境变量脚本 */}
      {process.env.NODE_ENV === 'production' && (
        <Script id="github-env" strategy="beforeInteractive">
          {`
            // 强制GitHub Pages环境设置
            window.NEXT_PUBLIC_DEPLOY_TARGET = 'github';
            window.NEXT_PUBLIC_REPO_NAME = 'blog';
            
            // 检查链接修复程序
            (function() {
              if (window.location.hostname.includes('github.io')) {
                // 如果URL不包含/blog前缀，添加它
                if (!window.location.pathname.startsWith('/blog')) {
                  window.location.href = '/blog' + window.location.pathname;
                }
                
                // 修复所有链接
                document.addEventListener('click', function(e) {
                  // 找到最近的A标签
                  let target = e.target;
                  while (target && target.tagName !== 'A') {
                    target = target.parentNode;
                    if (!target) return;
                  }
                  
                  // 处理链接
                  if (target && target.href) {
                    const url = new URL(target.href);
                    // 只处理同域名的链接
                    if (url.hostname === window.location.hostname) {
                      // 添加/blog前缀
                      if (!url.pathname.startsWith('/blog')) {
                        e.preventDefault();
                        window.location.href = '/blog' + url.pathname;
                      }
                    }
                  }
                }, true);
              }
            })();
          `}
        </Script>
      )}
    </>
  );
} 