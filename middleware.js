import { NextResponse } from 'next/server';

export function middleware(request) {
  // 获取当前请求的URL
  const url = request.nextUrl.clone();
  
  // 仓库名称（与next.config.js中的repoName保持一致）
  const repoName = 'blog';
  
  // 检查是否已经包含正确的基路径
  if (!url.pathname.startsWith(`/${repoName}`) && 
      process.env.DEPLOY_TARGET === 'github') {
    // 重写URL以包含仓库名作为基路径
    url.pathname = `/${repoName}${url.pathname}`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    // 排除静态资源和API路由
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 