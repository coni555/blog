import { Metadata } from 'next';
import './globals.css';
import HtmlHead from './components/HtmlHead';
import LinkGuard from './components/LinkGuard';
import Script from 'next/script';

export const metadata = {
  title: 'Coni的博客',
  description: '个人博客网站',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <HtmlHead />
        <Script 
          src="/link-fix.js" 
          strategy="beforeInteractive" 
          id="link-fix" 
        />
      </head>
      <body>
        <LinkGuard />
        {children}
      </body>
    </html>
  );
} 