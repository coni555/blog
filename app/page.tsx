'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  
  // 分类内容的引用
  const categoryContentRef = useRef<HTMLDivElement>(null);
  // 最新文章的引用
  const latestArticlesRef = useRef<HTMLDivElement>(null);
  // 分类卡片的引用
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  const groupedArticles = useMemo(() => groupArticlesByCategory(sortedArticlesData), []);
  const categories = useMemo(() => Object.keys(groupedArticles), [groupedArticles]);
  
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
            <Link href={`/article/${article.id}`} className="text-blue-300 hover:text-blue-200 hover:underline transition-colors">
              阅读全文 &rarr;
            </Link>
          )}
          {isCarousel && (
            <span className="text-blue-300">阅读全文 &rarr;</span>
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
          onClick={isCarousel ? undefined : () => window.open(`/article/${article.id}`, '_self')}
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
          onClick={undefined}
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
        onClick={() => window.open(`/article/${article.id}`, '_self')}
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
                    href={`/category/${getSlugFromCategoryName(activeCategory)}`}
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
                            onClick={() => window.open(`/article/${article.id}`, '_self')}
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
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">最新文章</h2>
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