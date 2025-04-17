'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useReadingHistory } from '../hooks/useReadingHistory';
import ArticleCard from './ArticleCard';

const RecommendedArticles = ({ articles }) => {
  const router = useRouter();
  const { 
    isArticleRead, 
    markAsRead, 
    getRecommendedArticles,
    getRandomUnreadArticle
  } = useReadingHistory(articles);
  
  const [recommended, setRecommended] = useState([]);
  const [randomArticle, setRandomArticle] = useState(null);
  
  // 初始化推荐文章
  useEffect(() => {
    if (articles && articles.length > 0) {
      setRecommended(getRecommendedArticles(3));
      setRandomArticle(getRandomUnreadArticle());
    }
  }, [articles]);
  
  // 处理文章点击，标记为已读并跳转
  const handleArticleClick = (id) => {
    markAsRead(id);
    router.push(`/article/${id}`);
  };
  
  // 获取随机文章
  const handleRandomArticle = () => {
    const article = getRandomUnreadArticle();
    if (article) {
      markAsRead(article.id);
      router.push(`/article/${article.id}`);
    }
  };
  
  // 统计阅读进度
  const calculateProgress = () => {
    if (!articles || articles.length === 0) return 0;
    const readCount = articles.filter(article => isArticleRead(article.id)).length;
    return Math.round((readCount / articles.length) * 100);
  };
  
  return (
    <div className="my-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">推荐阅读</h2>
        
        <div className="flex items-center space-x-4">
          {/* 阅读进度 */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{calculateProgress()}%</span>
          </div>
          
          {/* 随机探索按钮 */}
          <motion.button
            onClick={handleRandomArticle}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            随机探索
          </motion.button>
        </div>
      </div>
      
      {/* 推荐文章网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommended.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            date={article.date}
            category={article.category}
            url={article.url}
            isRead={isArticleRead(article.id)}
            onCardClick={handleArticleClick}
          />
        ))}
      </div>
      
      {/* 随机推荐卡片 */}
      {randomArticle && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">特别推荐</h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ArticleCard
              id={randomArticle.id}
              title={randomArticle.title}
              date={randomArticle.date}
              category={randomArticle.category}
              url={randomArticle.url}
              isRead={isArticleRead(randomArticle.id)}
              onCardClick={handleArticleClick}
              className="border-indigo-500 dark:border-indigo-600 shadow-indigo-500/10"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RecommendedArticles; 