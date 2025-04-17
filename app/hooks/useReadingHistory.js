'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'reading_history';
const MAX_HISTORY = 100; // 最多存储100篇文章的历史记录

/**
 * 阅读历史钩子，用于追踪用户阅读过的文章并提供相关功能
 * @param {Array} allArticles - 所有可用的文章数组
 * @returns {Object} 包含阅读历史管理方法的对象
 */
export function useReadingHistory(allArticles = []) {
  // 存储阅读历史的状态
  const [readArticles, setReadArticles] = useState([]);
  
  // 初始化：从localStorage加载阅读历史
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setReadArticles(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading reading history:', error);
      // 如果读取失败，重置历史记录
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);
  
  // 保存阅读历史到localStorage
  const saveHistory = (newHistory) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving reading history:', error);
    }
  };
  
  // 标记文章为已读
  const markAsRead = (articleId) => {
    if (!articleId || readArticles.includes(articleId)) return;
    
    const newHistory = [
      articleId,
      ...readArticles.filter(id => id !== articleId)
    ].slice(0, MAX_HISTORY);
    
    setReadArticles(newHistory);
    saveHistory(newHistory);
  };
  
  // 检查文章是否已读
  const isArticleRead = (articleId) => {
    return readArticles.includes(articleId);
  };
  
  // 获取未读文章
  const getUnreadArticles = () => {
    if (!allArticles || allArticles.length === 0) return [];
    return allArticles.filter(article => !readArticles.includes(article.id));
  };
  
  // 获取推荐文章（优先未读）
  const getRecommendedArticles = (count = 3, category = null) => {
    if (!allArticles || allArticles.length === 0) return [];
    
    // 筛选指定分类的文章
    const filteredArticles = category 
      ? allArticles.filter(article => article.category === category)
      : allArticles;
    
    // 分离未读和已读文章
    const unread = filteredArticles.filter(article => !readArticles.includes(article.id));
    const read = filteredArticles.filter(article => readArticles.includes(article.id));
    
    // 优先返回未读文章，不足则补充已读文章
    let recommended = [...unread];
    if (recommended.length < count) {
      recommended = [...recommended, ...read].slice(0, count);
    } else {
      // 随机洗牌未读文章，增加多样性
      recommended = shuffleArray(recommended).slice(0, count);
    }
    
    return recommended;
  };
  
  // 获取随机未读文章
  const getRandomUnreadArticle = () => {
    const unread = getUnreadArticles();
    if (unread.length === 0) {
      // 所有文章都已读，则从所有文章中随机选择一篇
      return allArticles.length > 0 
        ? allArticles[Math.floor(Math.random() * allArticles.length)] 
        : null;
    }
    
    // 随机选择一篇未读文章
    return unread[Math.floor(Math.random() * unread.length)];
  };
  
  // 清除阅读历史
  const clearHistory = () => {
    setReadArticles([]);
    localStorage.removeItem(STORAGE_KEY);
  };
  
  // 辅助函数：数组随机洗牌
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  return {
    readArticles,
    markAsRead,
    isArticleRead,
    getUnreadArticles,
    getRecommendedArticles,
    getRandomUnreadArticle,
    clearHistory
  };
} 