/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';
const repoName = 'blog'; // 替换为您的GitHub仓库名

// 确保环境变量在客户端可用
const env = {
  NEXT_PUBLIC_DEPLOY_TARGET: isGitHubPages ? 'github' : '',
  NEXT_PUBLIC_REPO_NAME: repoName
};

const nextConfig = {
  // 基本配置
  reactStrictMode: true,
  
  // 设置环境变量
  env,
  
  // GitHub Pages特定配置
  ...(isGitHubPages ? {
    output: 'export',
    images: { 
      unoptimized: true,
    },
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
    // 不要使用trailingSlash，它会导致路由问题
    trailingSlash: false,
  } : {})
};

module.exports = nextConfig;