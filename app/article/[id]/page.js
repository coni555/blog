import Link from 'next/link';

export default function Page({ params }) {
  // 简单查找文章
  const articlesData = require('../../../data/articles.json');
  const article = articlesData.find(a => a.id === params.id);
  
  if (!article) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">文章未找到</h1>
        <p>抱歉，您请求的文章不存在。</p>
        <Link href="/">返回首页</Link>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <Link href="/">返回首页</Link>
      <h1 className="text-2xl font-bold mt-4">{article.title}</h1>
      <p>作者: {article.author} | 日期: {article.date}</p>
      {article.url && (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
          阅读原文
        </a>
      )}
    </div>
  );
}