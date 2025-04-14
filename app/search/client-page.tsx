'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StarBackground from '../components/StarBackground';
import DataFlowBackground from '../components/DataFlowBackground';
import { getLinkHref } from '../utils/urlHelper';

export default function ClientSearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams ? searchParams.get('q') : '';
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [theme, setTheme] = useState<'星空感' | '镜像'>('星空感');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // 更强健的查询参数处理
    if (typeof window !== 'undefined') {
      // 1. 首先尝试从useSearchParams获取
      let queryValue = queryParam || '';
      
      // 2. 如果为空，尝试直接从URL获取（处理GitHub Pages上的特殊情况）
      if (!queryValue) {
        const urlParams = new URLSearchParams(window.location.search);
        queryValue = urlParams.get('q') || '';
        
        // 3. 如果仍为空且在GitHub Pages上，尝试解析路径部分
        if (!queryValue && window.location.hostname.includes('github.io')) {
          // 例如 /blog/search?q=test 或 /blog/search/q=test
          const pathSegments = window.location.pathname.split('/');
          const searchSegmentIndex = pathSegments.indexOf('search');
          
          if (searchSegmentIndex >= 0 && searchSegmentIndex < pathSegments.length - 1) {
            const possibleQuery = pathSegments[searchSegmentIndex + 1];
            if (possibleQuery && possibleQuery.includes('=')) {
              const [param, value] = possibleQuery.split('=');
              if (param === 'q') {
                queryValue = value;
              }
            }
          }
        }
      }
      
      console.log('搜索查询参数:', queryValue);
      setQuery(queryValue);
    }
    
    // 从localStorage读取主题设置
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as '星空感' | '镜像' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, [queryParam]);
  
  // 动态导入文章数据
  useEffect(() => {
    let articlesData: any[] = [];
    
    // 使用动态导入从客户端加载数据
    import('../../data/articles.json').then((module) => {
      articlesData = module.default;
      
      if (query && isMounted) {
        const results = performSearch(query, articlesData);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    });
  }, [query, isMounted]);
  
  // 搜索逻辑
  const performSearch = (searchQuery: string, articlesData: any[]) => {
    const lowercaseQuery = searchQuery.toLowerCase();
    
    return articlesData.filter(article => {
      // 在标题、摘要和内容中搜索
      const titleMatch = article.title.toLowerCase().includes(lowercaseQuery);
      const summaryMatch = article.summary ? article.summary.toLowerCase().includes(lowercaseQuery) : false;
      const contentMatch = article.content ? article.content.toLowerCase().includes(lowercaseQuery) : false;
      const categoryMatch = article.category.toLowerCase().includes(lowercaseQuery);
      
      return titleMatch || summaryMatch || contentMatch || categoryMatch;
    });
  };
  
  // 渲染背景
  const renderBackground = () => {
    if (theme === '镜像' && isMounted) {
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
      <div className="min-h-screen p-8 max-w-4xl mx-auto relative z-10">
        {/* 面包屑导航 */}
        <div className="mb-6 flex items-center text-sm text-indigo-300">
          <Link href={getLinkHref("/")} className="hover:text-indigo-100 transition-colors hover:scale-105 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            首页
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">搜索结果</span>
        </div>
        
        <header className="mb-10 pt-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-white">
            {query ? `"${query}" 的搜索结果` : '搜索文章'}
          </h1>
          {searchResults.length > 0 ? (
            <p className="text-center text-indigo-200">找到 {searchResults.length} 篇相关文章</p>
          ) : (
            query && <p className="text-center text-indigo-200">没有找到相关文章</p>
          )}
        </header>
        
        {/* 搜索表单 */}
        <form 
          className="mb-12 flex justify-center" 
          action={getLinkHref("/search")}
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
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              name="q"
              placeholder="输入关键词搜索文章"
              defaultValue={query}
              className="w-full px-5 py-3 rounded-full bg-black/30 border border-white/20 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-indigo-300/50"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full text-indigo-300 hover:text-white hover:bg-indigo-600/50 transition-colors"
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
          </div>
        </form>
        
        {/* 搜索结果 */}
        {searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map((article) => (
              <Link key={article.id} href={getLinkHref(`/article/${article.id}`)} className="block">
                <article className={`border rounded-lg p-6 hover:transform hover:scale-[1.01] transition-all duration-300 ${
                  theme === '镜像' 
                    ? 'border-white/10 bg-black/30 backdrop-blur-md hover:bg-black/40' 
                    : 'border-indigo-500/20 bg-indigo-900/20 backdrop-blur-sm hover:bg-indigo-900/30'
                }`}>
                  <h2 className="text-xl font-medium mb-2 text-white">{article.title}</h2>
                  {article.summary && <p className="text-indigo-200 mb-3 line-clamp-2">{article.summary}</p>}
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-center space-x-3 mb-2 md:mb-0">
                      <span className="text-sm text-indigo-300/80">{article.date}</span>
                      <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                        {article.category.trim()}
                      </span>
                    </div>
                    <span className="text-indigo-300 hover:text-indigo-100 transition-colors">
                      阅读全文 &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          query && (
            <div className="text-center py-16 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-xl text-white">没有找到与 "{query}" 相关的文章</p>
              <p className="mt-4 text-indigo-200">尝试使用其他关键词或浏览分类目录</p>
              <div className="mt-8 space-x-4">
                <Link 
                  href={getLinkHref("/")}
                  className={`inline-block px-6 py-2 rounded-full transition-all hover:scale-105 ${
                    theme === '镜像' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  }`}
                >
                  返回首页
                </Link>
                <Link 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.back();
                  }}
                  className="inline-block px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-105"
                >
                  返回上一页
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
} 