'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
// 导入 JSON 数据
import articlesData from '..//data/articles.json';
// 导入组件
import StarBackground from './components/StarBackground';
import TypewriterEffect from './components/TypewriterEffect';
import GlassCard from './components/GlassCard';
import Carousel3D from './components/Carousel3D';
import SimpleCard from './components/SimpleCard';
import DataFlowBackground from './components/DataFlowBackground';
import { getLinkHref, getNavigationUrl } from './utils/urlHelper';

// 定义文章类型（与详情页一致）
type Article = {
  id: string;
  title: string;
  date: string; 
  author: string;
  category: string;
  url: string;
  summary?: string;
  content?: string;
};

// 定义主题类型
type ThemeType = '星空感' | '镜像';

// 类型断言
const typedArticlesData = articlesData as Article[];

// 按日期排序文章（从新到旧）
const sortedArticlesData = [...typedArticlesData].sort((a, b) => {
  // 提取年份和月份进行比较
  const aMatch = a.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  const bMatch = b.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  
  if (aMatch && bMatch) {
    // 首先比较年份
    const yearDiff = parseInt(bMatch[1]) - parseInt(aMatch[1]);
    if (yearDiff !== 0) return yearDiff;
    
    // 年份相同，比较月份
    const monthDiff = parseInt(bMatch[2]) - parseInt(aMatch[2]);
    if (monthDiff !== 0) return monthDiff;
    
    // 月份相同，比较日期
    return parseInt(bMatch[3]) - parseInt(aMatch[3]);
  }
  
  // 如果解析失败，保持原顺序
  return 0;
});

// 按分类分组文章的函数
const groupArticlesByCategory = (articles: Article[]) => {
  return articles.reduce((acc, article) => {
    const category = article.category || '未分类';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {} as Record<string, Article[]>);
};

// 获取分类的URL Slug
const getSlugFromCategoryName = (categoryName: string) => {
  const reverseMap: Record<string, string> = {
    '提问': 'question',
    '写作': 'writing',
    '阅读': 'reading',
    '英语': 'english',
    '彩蛋文': 'special',
    '多模态创作': 'multimodal',
    '科普': 'science',
    '高效计划': 'planning',
    'AI协作SOP': 'ai-sop',
    '个体思考': 'thinking',
    '个性化打造': 'personalization',
    '运动': 'exercise',
    'AI小确幸': 'ai-happiness',
    'AI人格模拟': 'ai-persona',
  };
  
  return reverseMap[categoryName] || encodeURIComponent(categoryName.toLowerCase());
};

// 生成渐变色函数
const generateGradient = (index: number, totalCategories: number) => {
  // 紫色-蓝色-青色范围内的渐变色
  const hue1 = 230 + (index * 40) % 80; // 230-310 (紫色到蓝紫色范围)
  const hue2 = (hue1 + 20) % 360;
  
  return {
    from: `rgba(${index % 2 === 0 ? '94, 114, 235' : '95, 109, 255'}, 0.2)`, 
    to: `rgba(${index % 2 === 0 ? '61, 192, 237' : '56, 189, 248'}, 0.1)`
  };
};

export default function Home() {
  const [theme, setTheme] = useState<ThemeType>('星空感');
  const [typingDone, setTypingDone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  
  // 分类内容的引用
  const categoryContentRef = useRef<HTMLDivElement>(null);
  // 最新文章的引用
  const latestArticlesRef = useRef<HTMLDivElement>(null);
  // 分类卡片的引用
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  const groupedArticles = useMemo(() => groupArticlesByCategory(sortedArticlesData), []);
  const categories = useMemo(() => Object.keys(groupedArticles), [groupedArticles]);
  
  // 随机选择文章，优先选择未读过的
  const getRandomArticle = useCallback(() => {
    // 检查localStorage中是否有阅读历史
    const readHistory = localStorage.getItem('readArticleHistory');
    const readArticleIds = readHistory ? JSON.parse(readHistory) : [];
    
    // 过滤出未读文章
    const unreadArticles = sortedArticlesData.filter(article => !readArticleIds.includes(article.id));
    
    // 如果有未读文章，从中随机选择，否则从所有文章中随机选择
    const articlesToChooseFrom = unreadArticles.length > 0 ? unreadArticles : sortedArticlesData;
    const randomIndex = Math.floor(Math.random() * articlesToChooseFrom.length);
    return articlesToChooseFrom[randomIndex];
  }, []);
  
  // 记录阅读历史
  const recordArticleView = useCallback((articleId: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      // 获取现有的阅读历史
      const readHistory = localStorage.getItem('readArticleHistory');
      let readArticleIds = readHistory ? JSON.parse(readHistory) : [];
      
      // 如果这篇文章没有被记录过，添加到历史中
      if (!readArticleIds.includes(articleId)) {
        // 添加到阅读历史的开头
        readArticleIds = [articleId, ...readArticleIds];
        
        // 限制历史记录数量，最多保存50条
        if (readArticleIds.length > 50) {
          readArticleIds = readArticleIds.slice(0, 50);
        }
        
        // 保存回localStorage
        localStorage.setItem('readArticleHistory', JSON.stringify(readArticleIds));
      }
    } catch (error) {
      console.error('Error updating read history:', error);
    }
  }, []);
  
  // 跳转到随机文章，并添加视觉效果
  const navigateToRandomArticle = useCallback(() => {
    setIsRandomizing(true);
    
    // 添加一点延迟以显示动画效果
    setTimeout(() => {
      const randomArticle = getRandomArticle();
      // 记录这篇文章将被阅读
      recordArticleView(randomArticle.id);
      window.open(getNavigationUrl(`/article/${randomArticle.id}`), '_self');
    }, 700);
  }, [getRandomArticle, recordArticleView]);
  
  // 确保客户端挂载后再执行动态效果
  useEffect(() => {
    setIsMounted(true);
    // 设置第一个分类为活跃分类
    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
    
    // 检查URL中是否有指定分类
    const hash = window.location.hash;
    if (hash) {
      const category = decodeURIComponent(hash.replace('#', ''));
      if (categories.includes(category)) {
        setActiveCategory(category);
        // 等DOM完全加载后再滚动
        setTimeout(() => {
          scrollToCategory();
        }, 500);
      }
    }
  }, [categories]);
  
  // 主题切换后，触发一些状态变化
  useEffect(() => {
    if (isMounted) {
      setTypingDone(false);
      
      // 保存主题设置到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
    }
  }, [theme, isMounted]);
  
  // 滚动到分类内容区域
  const scrollToCategory = () => {
    if (categoryContentRef.current) {
      const headerOffset = 120; // 导航栏高度 + 一些额外空间
      const elementPosition = categoryContentRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // 处理分类点击，更新URL和滚动
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    
    // 更新URL但不刷新页面
    window.history.pushState(null, '', `#${encodeURIComponent(category)}`);
    
    // 滚动到内容区域
    setTimeout(() => {
      scrollToCategory();
    }, 100);
  };
  
  // 处理导航点击
  const handleNavigation = (section: 'categories' | 'latest') => {
    const targetRef = section === 'categories' ? categoriesRef : latestArticlesRef;
    
    if (targetRef.current) {
      const headerOffset = 120;
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // 根据主题返回适合的背景组件
  const renderBackground = () => {
    if (theme === '镜像') {
      return (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-[#041434] to-[#000510] z-0" />
          <DataFlowBackground />
        </>
      );
    }
    return <StarBackground />;
  };
  
  // 根据主题返回适合的标题文本
  const getThemeText = () => {
    switch (theme) {
      case '星空感':
        return "小夜的灵感宇宙正在加载...";
      case '镜像':
        return "折射镜像幻境初始化...";
      default:
        return "欢迎来到小夜的创作空间";
    }
  };
  
  // 渲染单个文章卡片
  const renderArticleCard = (article: Article, index: number, isCarousel: boolean = false) => {
    const gradientColors = generateGradient(index, groupedArticles[article.category]?.length || 1);
    
    // 处理文章点击
    const handleArticleClick = () => {
      recordArticleView(article.id);
      window.open(getNavigationUrl(`/article/${article.id}`), '_self');
    };
    
    const articleContent = (
      <>
        <h3 className={`text-xl font-medium mb-2 text-white ${isCarousel ? 'line-clamp-2' : ''}`}>{article.title}</h3>
        {article.summary && (
          <p className={`text-indigo-100 mb-3 opacity-90 ${isCarousel ? 'line-clamp-2 text-sm' : 'line-clamp-2'}`}>
            {article.summary}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-indigo-200">{article.date}</span>
          {!isCarousel && (
            <Link 
              href={getLinkHref(`/article/${article.id}`)}
              onClick={() => recordArticleView(article.id)}
              className="text-blue-300 hover:text-blue-200 hover:underline transition-colors"
            >
              阅读全文 &rarr;
            </Link>
          )}
          {isCarousel && (
            <span 
              className="text-blue-300 hover:text-blue-200 hover:underline transition-colors cursor-pointer relative z-10 inline-flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                recordArticleView(article.id);
                window.open(getNavigationUrl(`/article/${article.id}`), '_self');
              }}
            >
              阅读全文 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </>
    );
    
    // 镜像主题下所有卡片都使用GlassCard
    if (theme === '镜像' && isMounted) {
      // 为轮播中的卡片应用更强的强度
      const cardIntensity = isCarousel ? 1.2 : 1;
      return (
        <GlassCard 
          key={article.id} 
          className={isCarousel ? "h-full w-full" : "mb-6"}
          intensity={cardIntensity}
          onClick={handleArticleClick}
        >
          {articleContent}
        </GlassCard>
      );
    }
    
    // 轮播中的卡片使用特定样式
    if (isCarousel) {
      return (
        <SimpleCard 
          key={article.id}
          gradientFrom={gradientColors.from}
          gradientTo={gradientColors.to}
          hoverScale={1.03}
          className="h-full w-full shadow-lg"
          onClick={handleArticleClick}
          hasGlow={false}
        >
          {articleContent}
        </SimpleCard>
      );
    }
    
    return (
      <SimpleCard 
        key={article.id}
        gradientFrom={gradientColors.from}
        gradientTo={gradientColors.to}
        className="mb-6"
        onClick={handleArticleClick}
      >
        {articleContent}
      </SimpleCard>
    );
  };
  
  // 渲染分类卡片
  const renderCategoryCards = () => {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-12">
        {categories.map((category, categoryIndex) => {
          const categoryGradient = generateGradient(categoryIndex, categories.length);
          
          if (theme === '镜像' && isMounted) {
            return (
              <GlassCard
                key={category}
                className="cursor-pointer"
                intensity={1.1}
                onClick={() => handleCategoryClick(category)}
              >
                <h2 className="text-2xl font-semibold mb-2 text-white flex items-center">
                  <span className={`w-2 h-2 rounded-full inline-block mr-2 ${activeCategory === category ? 'bg-cyan-400' : 'bg-cyan-300/50'}`}></span>
                  {category}
                  <span className="text-sm ml-2 text-indigo-200">({groupedArticles[category].length}篇)</span>
                </h2>
                <p className="text-sm text-indigo-100/80">
                  点击查看该分类的所有文章
                </p>
              </GlassCard>
            );
          }
          
          return (
            <SimpleCard
              key={category}
              gradientFrom={categoryGradient.from}
              gradientTo={categoryGradient.to}
              hoverScale={1.02}
              className="cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <h2 className="text-2xl font-semibold mb-2 text-white flex items-center">
                <span className={`w-2 h-2 rounded-full inline-block mr-2 ${activeCategory === category ? 'bg-indigo-400' : 'bg-indigo-300/50'}`}></span>
                {category}
                <span className="text-sm ml-2 text-indigo-200">({groupedArticles[category].length}篇)</span>
              </h2>
              <p className="text-sm text-indigo-100/80">
                点击查看该分类的所有文章
              </p>
            </SimpleCard>
          );
        })}
      </div>
    );
  };

  // 添加特殊导航修复
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 特殊修复函数 - 直接劫持DOM元素上的点击事件
    const applySpecialLinkFixes = () => {
      console.log('应用首页特殊链接修复');
      
      // 1. 修复最新文章区域
      const latestArticleLinks = document.querySelectorAll('.latest-articles a, [data-latest-article] a');
      latestArticleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // 阻止默认行为
          e.preventDefault();
          e.stopPropagation();
          
          // 获取原始href
          const href = link.getAttribute('href');
          if (!href) return;
          
          // 特殊处理文章链接
          if (href.includes('/article/')) {
            const parts = href.split('/article/');
            if (parts.length > 1) {
              const articleId = parts[1].split('/')[0];
              // 有效的文章ID应为数字
              if (articleId && !isNaN(Number(articleId))) {
                console.log(`首页文章点击: ${articleId}`);
                // 使用window.location以确保正确跳转
                window.location.href = getNavigationUrl(`/article/${articleId}`);
                return;
              }
            }
          }
          
          // 其他链接使用修复后的链接
          const fixedHref = getNavigationUrl(href);
          console.log(`首页链接修复: ${href} -> ${fixedHref}`);
          window.location.href = fixedHref;
        }, { capture: true });
      });
      
      // 2. 修复分类区域
      const categoryLinks = document.querySelectorAll('[id^="category-"] a, .category-section a');
      categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const href = link.getAttribute('href');
          if (!href) return;
          
          window.location.href = getNavigationUrl(href);
        }, { capture: true });
      });
      
      // 3. 修复所有文章卡片区域
      const articleCards = document.querySelectorAll('.article-card, [data-article-id]');
      articleCards.forEach(card => {
        card.addEventListener('click', (e) => {
          // 检查是否点击了卡片内部的链接
          const target = e.target as Node;
          if (target && ((target as HTMLElement).tagName === 'A' || (target as HTMLElement).closest?.('a'))) {
            // 链接点击会由上面的处理器处理
            return;
          }
          
          // 从卡片本身获取文章ID
          const articleId = (card as HTMLElement).getAttribute('data-article-id');
          if (articleId) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`文章卡片点击: ${articleId}`);
            window.location.href = getNavigationUrl(`/article/${articleId}`);
          }
        }, { capture: true });
      });
    };
    
    // 在DOM加载后应用修复
    setTimeout(applySpecialLinkFixes, 1000);
    setTimeout(applySpecialLinkFixes, 2000);
    
    // 监视DOM变化以应用修复
    const observer = new MutationObserver((mutations) => {
      let needsFix = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // 元素节点
              // 如果添加了新的文章卡片、链接或分类区域
              const element = node as HTMLElement;
              if (element.classList && 
                  (element.classList.contains('article-card') || 
                  element.classList.contains('latest-articles') || 
                  element.classList.contains('category-section'))) {
                needsFix = true;
                break;
              }
              
              // 或者添加的节点内部包含这些元素
              if (element.querySelector && 
                  (element.querySelector('.article-card, .latest-articles, .category-section, a[href]'))) {
                needsFix = true;
                break;
              }
            }
          }
        }
      }
      
      if (needsFix) {
        applySpecialLinkFixes();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {renderBackground()}
      <main className="min-h-screen p-8 max-w-5xl mx-auto relative z-10">
        {/* 主题选择器 */}
        {isMounted && (
          <div className="fixed top-20 right-4 z-30 flex flex-col space-y-2">
            {(['星空感', '镜像'] as ThemeType[]).map((t) => (
              <button
                key={t}
                className={`w-20 py-1 px-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  theme === t 
                    ? t === '镜像' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'bg-white/30 backdrop-blur-sm text-white hover:bg-white/40'
                }`}
                onClick={() => setTheme(t)}
              >
                {t === '镜像' ? '🪞 镜像' : '✨ 星空'}
              </button>
            ))}
          </div>
        )}

        {/* 快速导航 */}
        {isMounted && (
          <div className="fixed top-20 left-4 z-30 flex flex-col space-y-2">
            <button
              className="px-4 py-1 rounded-full text-xs font-medium bg-white/30 backdrop-blur-sm text-white hover:bg-white/40 transition-all duration-300"
              onClick={() => handleNavigation('categories')}
            >
              分类导航
            </button>
            <button
              className="px-4 py-1 rounded-full text-xs font-medium bg-white/30 backdrop-blur-sm text-white hover:bg-white/40 transition-all duration-300"
              onClick={() => handleNavigation('latest')}
            >
              最新文章
            </button>
            <button
              className={`px-4 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                theme === '镜像' 
                  ? 'bg-gradient-to-r from-cyan-500/40 to-blue-500/40' 
                  : 'bg-gradient-to-r from-purple-500/40 to-blue-500/40'
              } backdrop-blur-sm text-white hover:from-cyan-500/60 hover:to-blue-500/60`}
              onClick={navigateToRandomArticle}
              disabled={isRandomizing}
            >
              {isRandomizing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在传送...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  随机探索宇宙
                </>
              )}
            </button>
          </div>
        )}

        <header className="mb-10 pt-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white min-h-[3rem]">
            <TypewriterEffect 
              text={getThemeText()} 
              speed={80}
              loop={true}
              className={`text-transparent bg-clip-text ${
                theme === '镜像' 
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-300 to-teal-300' 
                  : 'bg-gradient-to-r from-purple-400 to-blue-500'
              }`}
              onComplete={() => isMounted && setTypingDone(true)}
            />
          </h1>
          <p className={`text-xl opacity-90 ${
            theme === '镜像' ? 'text-cyan-200' : 'text-indigo-200'
          }`}>
            {theme === '镜像' ? '探索数据流动中的思维碰撞与创意折射' : '探索思想，穿梭在科技与想象的星际间'}
          </p>
          
          {isMounted && (
            <button
              onClick={navigateToRandomArticle}
              disabled={isRandomizing}
              className={`mt-6 px-6 py-2 rounded-full text-white font-medium transition-all duration-500 ${isRandomizing ? 'scale-110' : 'hover:scale-105'} ${
                theme === '镜像'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg hover:shadow-indigo-500/25'
              } ${isRandomizing ? 'animate-pulse' : 'hover:animate-pulse'}`}
            >
              <span className="flex items-center">
                {isRandomizing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在传送...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    随机探索宇宙
                  </>
                )}
              </span>
            </button>
          )}
      </header>

        {/* 分类卡片区域 */}
        <div ref={categoriesRef} className={`transition-opacity duration-500 ${isMounted && typingDone ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-2xl font-semibold text-white mb-6">文章分类</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-16">
            {categories.map((category, categoryIndex) => {
              const categoryGradient = generateGradient(categoryIndex, categories.length);
              
              if (theme === '镜像' && isMounted) {
                return (
                  <GlassCard
                    key={category}
                    className="cursor-pointer"
                    intensity={1.1}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <h2 className="text-2xl font-semibold mb-2 text-white flex items-center">
                      <span className={`w-2 h-2 rounded-full inline-block mr-2 ${activeCategory === category ? 'bg-cyan-400' : 'bg-cyan-300/50'}`}></span>
                      {category}
                      <span className="text-sm ml-2 text-indigo-200">({groupedArticles[category].length}篇)</span>
                    </h2>
                    <p className="text-sm text-indigo-100/80">
                      点击查看该分类的所有文章
                    </p>
                  </GlassCard>
                );
              }
              
              return (
                <SimpleCard
                  key={category}
                  gradientFrom={categoryGradient.from}
                  gradientTo={categoryGradient.to}
                  hoverScale={1.02}
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <h2 className="text-2xl font-semibold mb-2 text-white flex items-center">
                    <span className={`w-2 h-2 rounded-full inline-block mr-2 ${activeCategory === category ? 'bg-indigo-400' : 'bg-indigo-300/50'}`}></span>
                    {category}
                    <span className="text-sm ml-2 text-indigo-200">({groupedArticles[category].length}篇)</span>
                  </h2>
                  <p className="text-sm text-indigo-100/80">
                    点击查看该分类的所有文章
                  </p>
                </SimpleCard>
              );
            })}
          </div>
          
          {/* 活跃分类的文章轮播 */}
          <div id="category-content" ref={categoryContentRef} className="scroll-mt-28">
            {activeCategory && groupedArticles[activeCategory] && groupedArticles[activeCategory].length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                  <h2 className="text-2xl font-semibold text-white">{activeCategory} · 精选文章</h2>
                  <Link 
                    href={getLinkHref(`/category/${getSlugFromCategoryName(activeCategory)}`)}
                    className="text-indigo-300 hover:text-indigo-200 transition-colors text-sm"
                  >
                    查看全部 &rarr;
                  </Link>
                </div>
                
                {groupedArticles[activeCategory].length > 2 ? (
                  <div className="relative w-full overflow-visible pt-8 pb-24 px-8">
                    <div className="max-w-4xl mx-auto">
                      <Carousel3D 
                        itemWidth={300}
                        radius={350}
                        autoRotate={false}
                        perspective={1000}
                        className="h-[340px] max-w-full"
                      >
                        {groupedArticles[activeCategory].map((article, index) => (
                          <div 
                            key={article.id} 
                            className="w-[300px] h-[280px]"
                            onClick={() => {
                              recordArticleView(article.id);
                              window.open(getNavigationUrl(`/article/${article.id}`), '_self');
                            }}
                          >
                            {renderArticleCard(article, index, true)}
                          </div>
                        ))}
                      </Carousel3D>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groupedArticles[activeCategory].map((article, index) => (
                      renderArticleCard(article, index)
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 最新文章列表 */}
          <div ref={latestArticlesRef} className="mb-12 scroll-mt-28">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
              <h2 className="text-2xl font-semibold text-white">最新文章</h2>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={navigateToRandomArticle}
                  disabled={isRandomizing}
                  className={`flex items-center text-sm rounded-full px-3 py-1 ${
                    theme === '镜像' 
                      ? 'text-cyan-300 hover:text-cyan-200' 
                      : 'text-indigo-300 hover:text-indigo-200'
                  } transition-colors ${isRandomizing ? 'opacity-70' : ''}`}
                >
                  {isRandomizing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      传送中...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6V4H7v2h6zm-4 7h2V8H9v5z" />
                        <path fillRule="evenodd" d="M7 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2V3a1 1 0 00-1-1H7zm5 10V8H8v4h4z" clipRule="evenodd" />
                      </svg>
                      随机跳跃
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedArticlesData.slice(0, 6).map((article, index) => (
                renderArticleCard(article, index)
              ))}
            </div>
          </div>
        </div>
    </main>
    </>
  );
}