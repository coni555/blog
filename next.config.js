/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/blog' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/blog/' : '',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_DEPLOY_TARGET: 'github',
    NEXT_PUBLIC_REPO_NAME: 'blog'
  }
};

module.exports = nextConfig;