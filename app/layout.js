import { Metadata } from 'next';
import './globals.css';

export const metadata = {
  title: 'Coni的博客',
  description: '个人博客网站',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            // 检查当前URL是否缺少/blog前缀
            (function() {
              if (
                typeof window !== 'undefined' &&
                window.location.hostname.includes('github.io') &&
                !window.location.pathname.startsWith('/blog')
              ) {
                // 重定向到带有/blog前缀的URL
                window.location.href = '/blog' + window.location.pathname;
              }
            })();
          `
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 