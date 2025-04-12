import React from 'react';
import Link from 'next/link';
// 导入 JSON 数据
import articlesData from '..//data/articles.json';
// 定义文章类型（与详情页一致）
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

// 类型断言
const typedArticlesData = articlesData as Article[];

// 按分类分组文章的函数
const groupArticlesByCategory = (articles: Article[]) => {
  return articles.reduce((acc, article) => {
    const category = article.category || '未分类'; // 如果没有分类，则归入“未分类”
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(article);
    return acc;
  }, {} as Record<string, Article[]>); // 初始化为空对象，键为分类名，值为文章数组
};

export default function Home() {
  const groupedArticles = groupArticlesByCategory(typedArticlesData);
  const categories = Object.keys(groupedArticles); // 获取所有分类名称

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-center mb-2">我的公众号文章</h1>
        <p className="text-center text-gray-600">分享我的思考与经验</p>
      </header>

      {/* 按分类渲染文章列表 */}
      {categories.map(category => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">{category}</h2>
          <div className="space-y-6">
            {groupedArticles[category].map(article => (
              <article key={article.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-medium mb-2">{article.title}</h3>
                {article.summary && <p className="text-gray-600 mb-3">{article.summary}</p>}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{article.date}</span>
                  <Link href={`/article/${article.id}`} className="text-blue-600 hover:underline">
                    阅读全文 &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
      
    </main>
  );
}