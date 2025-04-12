'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// 导入文章数据
import articlesData from '../../data/articles.json';

// 定义文章类型
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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  
  useEffect(() => {
    if (query) {
      // 执行搜索
      const results = performSearch(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query]);
  
  // 搜索逻辑
  const performSearch = (searchQuery: string) => {
    const typedArticlesData = articlesData as Article[];
    const lowercaseQuery = searchQuery.toLowerCase();
    
    return typedArticlesData.filter(article => {
      // 在标题、摘要和内容中搜索
      const titleMatch = article.title.toLowerCase().includes(lowercaseQuery);
      const summaryMatch = article.summary ? article.summary.toLowerCase().includes(lowercaseQuery) : false;
      const contentMatch = article.content ? article.content.toLowerCase().includes(lowercaseQuery) : false;
      const categoryMatch = article.category.toLowerCase().includes(lowercaseQuery);
      
      return titleMatch || summaryMatch || contentMatch || categoryMatch;
    });
  };
  
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      {/* 面包屑导航 */}
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          首页
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">搜索结果</span>
      </div>
      
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-center mb-2">
          {query ? `"${query}" 的搜索结果` : '搜索'}
        </h1>
        {searchResults.length > 0 ? (
          <p className="text-center text-gray-600">找到 {searchResults.length} 篇相关文章</p>
        ) : (
          query && <p className="text-center text-gray-600">没有找到相关文章</p>
        )}
      </header>
      
      {/* 搜索表单 */}
      <form className="mb-8 flex justify-center" action="/search">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            name="q"
            placeholder="输入关键词搜索文章"
            defaultValue={query}
            className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>
      
      {/* 搜索结果 */}
      {searchResults.length > 0 ? (
        <div className="space-y-6">
          {searchResults.map((article) => (
            <article key={article.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-medium mb-2">{article.title}</h2>
              {article.summary && <p className="text-gray-600 mb-3">{article.summary}</p>}
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <span className="text-sm text-gray-500">{article.date}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {article.category.trim()}
                  </span>
                </div>
                <Link href={`/article/${article.id}`} className="text-blue-600 hover:underline">
                  阅读全文 &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        query && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">没有找到与 "{query}" 相关的文章</p>
            <p className="mt-2 text-gray-500">尝试使用其他关键词或浏览分类目录</p>
            <div className="mt-6">
              <Link href="/" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                返回首页
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
} 