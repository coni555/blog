/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';
const repoName = 'blog'; // 替换为您的GitHub仓库名

const nextConfig = {
  // 基本配置
  reactStrictMode: true,
  
  // GitHub Pages特定配置
  ...(isGitHubPages ? {
    output: 'export',
    images: { 
      unoptimized: true,
    },
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
    trailingSlash: true,
  } : {})
};

module.exports = nextConfig;