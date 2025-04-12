import React from 'react';
import Link from 'next/link';
// 导入 JSON 数据
import articlesData from '../../../data/articles.json';

// 定义文章类型（可选，但推荐）
type Article = {
  id: string;
  title: string;
  date: string; // 注意这里没有空格
  author: string;
  category: string;
  url: string;
  summary?: string; // 可选字段
  content?: string; // 可选字段
};

// 类型断言，告诉 TypeScript 导入的数据是 Article 数组
const typedArticlesData = articlesData as Article[];

export default function ArticlePage({ params }: { params: { id: string } }) {
  // 从导入的数据中查找文章
  const article = typedArticlesData.find(a => a.id === params.id);

  // ... (处理文章未找到、有 url、有 content 的逻辑保持不变) ...

  // 处理文章未找到
  if (!article) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
        <p className="mb-6">抱歉，您请求的文章不存在。</p>
        <Link href="/" className="text-blue-600 hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  // 如果有 url 字段
  if (article.url) {
    return (
      <main className="min-h-screen p-8 max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; 返回首页
        </Link>
        
        <article className="prose lg:prose-xl max-w-none">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="flex gap-4 text-gray-600 mb-8">
            <span>作者: {article.author}</span>
            <span>发布于: {article.date}</span>
            <span className="bg-gray-200 px-2 py-1 rounded text-sm">分类: {article.category}</span> {/* 显示分类 */}
          </div>
          
          {article.summary && <p className="mb-8">{article.summary}</p>}
          
          <div className="mt-6">
            <a href={article.url} target="_blank" rel="noopener noreferrer" 
               className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors no-underline"> 
              阅读原文
            </a> 
          </div>
        </article>
      </main>
    );
  }

  // 如果没有 url 但有 content 字段
  if (article.content) {
      return ( 
        <main className="min-h-screen p-8 max-w-3xl mx-auto">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            &larr; 返回首页
          </Link>
          
          <article className="prose lg:prose-xl max-w-none">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="flex gap-4 text-gray-600 mb-8">
              <span>作者: {article.author}</span>
              <span>发布于: {article.date}</span>
               <span className="bg-gray-200 px-2 py-1 rounded text-sm">分类: {article.category}</span> {/* 显示分类 */}
            </div>
            
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
        </main>
      ); 
  } 

  // 如果既没有 url 也没有 content
  return ( 
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">{article.title || "文章加载错误"}</h1>
      <p className="mb-6">文章内容缺失或格式错误。</p>
      <Link href="/" className="text-blue-600 hover:underline">
        返回首页
      </Link>
    </div>
  ); 
}