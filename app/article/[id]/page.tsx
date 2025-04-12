import React from 'react';
import Link from 'next/link';
import articlesData from '../../../data/articles.json';

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

// 类型断言
const typedArticlesData = articlesData as Article[];

// 使用Next.js App Router的标准页面组件格式
export default function Page({ params }: { params: { id: string } }) {
  // 查找文章
  const article = typedArticlesData.find(a => a.id === params.id);

  // 文章未找到
  if (!article) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
        <p className="mb-6">抱歉，您请求的文章不存在。</p>
        <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  // 如果有url字段
  if (article.url) {
    return (
      <main className="min-h-screen p-8 max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">&larr; 返回首页</Link>
        <article className="prose lg:prose-xl max-w-none">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="flex gap-4 text-gray-600 mb-8">
            <span>作者: {article.author}</span>
            <span>发布于: {article.date}</span>
          </div>
          {article.summary && <p className="mb-8">{article.summary}</p>}
          <div className="mt-6">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors no-underline">阅读原文</a>
          </div>
        </article>
      </main>
    );
  }

  // 默认返回
  return (
    <div className="min-h-screen p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">&larr; 返回首页</Link>
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <p>发布于: {article.date}</p>
      <p>作者: {article.author}</p>
    </div>
  );
}