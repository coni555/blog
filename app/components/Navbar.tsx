'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../providers/ThemeProvider';
import { getLinkHref } from '../utils/urlHelper';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // 处理客户端挂载
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 处理滚动效果
  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    // 初始化时检查一次滚动位置
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // 分类列表
  const categories = [
    { name: '提问', href: '/category/question' },
    { name: '写作', href: '/category/writing' },
    { name: '阅读', href: '/category/reading' },
    { name: '英语', href: '/category/english' },
    { name: '彩蛋文', href: '/category/special' },
    { name: '多模态创作', href: '/category/multimodal' },
    { name: '科普', href: '/category/science' },
    { name: '自我提升', href: '/category/self-improvement' },
    { name: '思维培养', href: '/category/thinking' },
    { name: '运动', href: '/category/exercise' },
    { name: 'AI人格模拟', href: '/category/ai-persona' },
  ];

  // 基础样式类名，确保服务器和客户端初始渲染一致
  const navClassName = "fixed w-full z-50 py-3 transition-all duration-300 bg-gray-900/50 backdrop-blur-sm";
  
  // 仅在客户端渲染后应用滚动样式
  const clientSideClassName = isClient && scrolled ? 'bg-gray-900/85 backdrop-blur-md shadow-md' : 'bg-gray-900/50 backdrop-blur-sm';

  return (
    <nav className={isClient ? `fixed w-full z-50 py-3 transition-all duration-300 ${clientSideClassName}` : navClassName}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl inline-block transition-transform group-hover:rotate-12">🌙</span>
          <span className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
            幻语 AI 创作馆
          </span>
        </Link>

        {/* 导航链接 */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href={getLinkHref("/")}
            className={`text-gray-100 hover:text-indigo-300 transition-colors ${pathname === '/' ? 'font-medium text-indigo-300' : ''}`}
          >
            首页
          </Link>

          {/* 分类下拉菜单 */}
          <div className="relative">
            <button
              className={`flex items-center text-gray-100 hover:text-indigo-300 transition-colors ${pathname.includes('/category') ? 'font-medium text-indigo-300' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              分类项
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 w-60 bg-gray-800/95 backdrop-blur-md rounded-md shadow-lg py-1 z-10 grid grid-cols-2 gap-1">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={getLinkHref(category.href)}
                    className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-700/80 hover:text-indigo-300"
                    onClick={(e) => {
                      // 先关闭下拉菜单
                      setIsDropdownOpen(false);
                      
                      // GitHub Pages环境下的特殊处理
                      if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
                        e.preventDefault();
                        
                        // 确保自我提升分类的导航正确
                        const targetPath = category.href;
                        const fullUrl = getLinkHref(targetPath);
                        
                        // 记录详细导航信息，便于调试
                        console.log(`导航到分类: ${category.name}`, {
                          原始路径: targetPath,
                          完整URL: fullUrl,
                          当前主机: window.location.hostname
                        });
                        
                        // 使用直接导航以确保正确路由
                        window.location.href = fullUrl;
                      }
                    }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <form 
              action={getLinkHref("/search")} 
              className="m-0 p-0"
              onSubmit={(e) => {
                // 在GitHub Pages环境中使用客户端导航
                if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const searchQuery = formData.get('q') as string;
                  if (searchQuery) {
                    const searchUrl = getLinkHref(`/search?q=${encodeURIComponent(searchQuery)}`);
                    console.log('搜索重定向到:', searchUrl);
                    window.location.href = searchUrl;
                  }
                }
              }}
            >
              <input
                type="text"
                name="q"
                placeholder="输入关键词快速找文章"
                className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 text-gray-300 hover:text-indigo-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* 关于我 */}
          <Link
            href={getLinkHref("/about")}
            className={`text-gray-100 hover:text-indigo-300 transition-colors ${pathname === '/about' ? 'font-medium text-indigo-300' : ''}`}
          >
            关于我
          </Link>

          {/* 主题切换器 */}
          <ThemeToggle />
        </div>

        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md shadow-lg">
          <div className="p-4 space-y-4">
            <Link 
              href={getLinkHref("/")} 
              className={`block py-2 text-gray-100 hover:text-indigo-300 transition-colors ${pathname === '/' ? 'font-medium text-indigo-300' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              首页
            </Link>
            
            <form 
              action={getLinkHref("/search")} 
              className="mb-0 flex"
              onSubmit={(e) => {
                // 在GitHub Pages环境中使用客户端导航
                if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const searchQuery = formData.get('q') as string;
                  if (searchQuery) {
                    const searchUrl = getLinkHref(`/search?q=${encodeURIComponent(searchQuery)}`);
                    console.log('搜索重定向到:', searchUrl);
                    window.location.href = searchUrl;
                    setIsMobileMenuOpen(false);
                  }
                }
              }}
            >
              <input
                type="text"
                name="q"
                placeholder="输入关键词快速找文章"
                className="w-full px-4 py-2 rounded-l-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-r-md px-4 hover:bg-indigo-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                搜索
              </button>
            </form>
            
            <div className="py-2">
              <div 
                className="flex justify-between items-center cursor-pointer text-gray-100 hover:text-indigo-300 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={`${pathname.includes('/category') ? 'font-medium text-indigo-300' : ''}`}>分类项</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {isDropdownOpen && (
                <div className="mt-2 ml-4 grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={getLinkHref(category.href)}
                      className="block py-1.5 text-sm text-gray-100 hover:text-indigo-300"
                      onClick={(e) => {
                        // 先关闭所有菜单
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                        
                        // GitHub Pages环境下的特殊处理
                        if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
                          e.preventDefault();
                          
                          // 确保自我提升分类的导航正确
                          const targetPath = category.href;
                          const fullUrl = getLinkHref(targetPath);
                          
                          // 记录详细导航信息，便于调试
                          console.log(`移动端导航到分类: ${category.name}`, {
                            原始路径: targetPath,
                            完整URL: fullUrl,
                            当前主机: window.location.hostname
                          });
                          
                          // 使用直接导航以确保正确路由
                          window.location.href = fullUrl;
                        }
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link 
              href={getLinkHref("/about")} 
              className={`block py-2 text-gray-100 hover:text-indigo-300 transition-colors ${pathname === '/about' ? 'font-medium text-indigo-300' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              关于我
            </Link>

            {/* 添加主题切换 */}
            <div className="py-2">
              <p className="text-gray-300 mb-2">选择主题</p>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 