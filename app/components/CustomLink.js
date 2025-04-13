'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CustomLink({ href, ...props }) {
  const pathname = usePathname();
  const isGitHubPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github';
  const repoName = 'blog'; // 确保与next.config.js中保持一致
  
  // 如果是部署在GitHub Pages上且不是以/blog开头的内部链接
  if (isGitHubPages && href.startsWith('/') && !href.startsWith(`/${repoName}/`)) {
    // 添加/blog前缀
    href = `/${repoName}${href}`;
  }
  
  return <Link href={href} {...props} />;
} 