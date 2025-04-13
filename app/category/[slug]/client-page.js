'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SimpleCard from '../../components/SimpleCard';
import GlassCard from '../../components/GlassCard';
import StarBackground from '../../components/StarBackground';
import DataFlowBackground from '../../components/DataFlowBackground';
import articlesData from '../../../data/articles.json';
import { getLinkHref } from '../../utils/urlHelper';

// 获取分类映射表（URL参数到显示名称）
const getCategoryDisplayName = (slug) => {
  const categoryMap = {
    'question': '提问',
    'writing': '写作',
    'reading': '阅读',
    'english': '英语',
    'special': '彩蛋文',
    'multimodal': '多模态创作',
    'science': '科普',
    'planning': '高效计划',
    'ai-sop': 'AI协作SOP',
    'thinking': '个体思考',
    'personalization': '个性化打造',
    'exercise': '运动',
    'ai-happiness': 'AI小确幸',
    'ai-persona': 'AI人格模拟',
  };
  
  return categoryMap[slug] || slug;
};

// 反向映射表（从显示名称到URL参数）
const getSlugFromCategoryName = (categoryName) => {
  const reverseMap = {
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
  
  return reverseMap[categoryName.trim()] || categoryName.toLowerCase();
};

// 生成渐变色函数
const generateGradient = (index) => {
  return {
    from: `rgba(${index % 2 === 0 ? '94, 114, 235' : '95, 109, 255'}, 0.2)`,
    to: `rgba(${index % 2 === 0 ? '61, 192, 237' : '56, 189, 248'}, 0.1)`
  };
};

export default function CategoryClientPage({ slug }) {
  const [categorySlug, setCategorySlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [sortedArticles, setSortedArticles] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState('星空感');
  
  // 初始化分类信息
  useEffect(() => {
    setCategorySlug(slug);
    setDisplayName(getCategoryDisplayName(slug));
  }, [slug]);
  
  // 加载文章数据
  useEffect(() => {
    if (categorySlug) {
      // 使用动态导入在客户端加载数据
      import('../../../data/articles.json').then((module) => {
        const articlesData = module.default;
        
        // 过滤出此分类的文章
        const categoryDisplayName = getCategoryDisplayName(categorySlug);
        const articles = articlesData.filter(
          article => {
            // 使用显示名称和slug都进行匹配
            return article.category.trim() === categoryDisplayName || 
                  getSlugFromCategoryName(article.category.trim()) === categorySlug;
          }
        );
        
        // 按日期排序文章（从新到旧）
        const sorted = [...articles].sort((a, b) => {
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
        
        setSortedArticles(sorted);
      });
    }
  }, [categorySlug]);
  
  // 加载主题设置
  useEffect(() => {
    setIsMounted(true);
    
    // 从localStorage读取主题设置
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);
  
  // 渲染背景
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
  
  if (!isMounted) {
    return <div className="min-h-screen bg-black"></div>;
  }
  
  return (
    <>
      {renderBackground()}
      <main className="min-h-screen p-8 max-w-5xl mx-auto relative z-10">
        <div className="pt-20 mb-8">
          <Link href={getLinkHref("/")} className="text-indigo-300 hover:text-indigo-200 transition-colors mb-4 inline-block">
            &larr; 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {displayName} <span className="text-lg opacity-70">({sortedArticles.length}篇)</span>
          </h1>
          <div className={`h-1 w-20 rounded-full ${theme === '镜像' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}></div>
        </div>
        
        {sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedArticles.map((article, index) => {
              const gradientColors = generateGradient(index);
              const articleContent = (
                <>
                  <h3 className="text-xl font-medium mb-2 text-white">{article.title}</h3>
                  {article.summary && <p className="text-indigo-100 mb-3 opacity-90 line-clamp-3">{article.summary}</p>}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-indigo-200">{article.date}</span>
                    <Link href={getLinkHref(`/article/${article.id}`)} className="text-blue-300 hover:text-blue-200 hover:underline transition-colors">
                      阅读全文 &rarr;
                    </Link>
                  </div>
                </>
              );
              
              if (theme === '镜像') {
                return (
                  <GlassCard
                    key={article.id}
                    className="shadow-lg"
                    intensity={1.05}
                    onClick={() => window.open(getLinkHref(`/article/${article.id}`), '_self')}
                  >
                    {articleContent}
                  </GlassCard>
                );
              }
              
              return (
                <SimpleCard
                  key={article.id}
                  gradientFrom={gradientColors.from}
                  gradientTo={gradientColors.to}
                  hoverScale={1.03}
                  className="shadow-lg"
                >
                  {articleContent}
                </SimpleCard>
              );
            })}
          </div>
        ) : (
          <div className={theme === '镜像' ? "text-center py-12" : ""}>
            {theme === '镜像' ? (
              <GlassCard className="py-12 text-center">
                <p className="text-white text-xl">该分类下暂无文章</p>
                <Link href={getLinkHref("/")} className="text-blue-300 hover:text-blue-200 mt-4 inline-block">
                  返回首页
                </Link>
              </GlassCard>
            ) : (
              <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-xl p-8 text-center backdrop-blur-sm">
                <p className="text-white text-xl">该分类下暂无文章</p>
                <Link href={getLinkHref("/")} className="text-blue-300 hover:text-blue-200 mt-4 inline-block">
                  返回首页
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
} 