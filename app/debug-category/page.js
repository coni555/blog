'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import articlesData from '../../data/articles.json';
import { getLinkHref } from '../utils/urlHelper';

export default function DebugCategoryPage() {
  const [categoryData, setCategoryData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
        'self-improvement': '自我提升',
        'thinking': '思维培养',
        'exercise': '运动',
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
        '自我提升': 'self-improvement',
        '思维培养': 'thinking',
        '运动': 'exercise',
        'AI人格模拟': 'ai-persona',
      };
      
      return reverseMap[categoryName.trim()] || categoryName.toLowerCase();
    };

    // 统计每个分类的文章数
    const categoryCounts = articlesData.reduce((acc, article) => {
      const category = article.category.trim();
      if (!acc[category]) {
        acc[category] = { count: 0, articles: [], slug: getSlugFromCategoryName(category) };
      }
      acc[category].count++;
      acc[category].articles.push({
        id: article.id,
        title: article.title
      });
      return acc;
    }, {});

    // 添加特殊分类：自我提升
    if (!categoryCounts['自我提升']) {
      categoryCounts['自我提升'] = { count: 0, articles: [], slug: 'self-improvement' };
    }

    // 统计旧分类中属于自我提升的文章
    const oldCategories = ['高效计划', 'AI协作SOP', '个性化打造', 'AI小确幸'];
    const selfImprovementArticles = articlesData.filter(article => 
      oldCategories.includes(article.category.trim()) || article.category.trim() === '自我提升'
    );
    
    categoryCounts['自我提升 (合并)'] = { 
      count: selfImprovementArticles.length, 
      articles: selfImprovementArticles.map(a => ({ id: a.id, title: a.title, category: a.category })),
      slug: 'self-improvement'
    };

    // 转换为数组并排序
    const result = Object.entries(categoryCounts).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => a.name.localeCompare(b.name));

    setCategoryData(result);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="p-8">正在加载分类数据...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">分类调试页面</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">分类链接测试</h2>
        <div className="space-y-2">
          <div>
            <a href="/blog/category/self-improvement" className="text-blue-500 underline">
              硬编码链接: /blog/category/self-improvement
            </a>
          </div>
          <div>
            <Link href={getLinkHref('/category/self-improvement')} className="text-blue-500 underline">
              使用getLinkHref: {getLinkHref('/category/self-improvement')}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {categoryData.map((category) => (
          <div key={category.name} className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <p>文章数量: {category.count}</p>
            <p>分类Slug: {category.slug}</p>
            <div className="mt-2">
              <Link 
                href={getLinkHref(`/category/${category.slug}`)} 
                className="text-blue-500 underline"
              >
                查看该分类
              </Link>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium">文章列表:</h3>
              <ul className="list-disc list-inside">
                {category.articles.map((article) => (
                  <li key={article.id} className="line-clamp-1">
                    {article.title}
                    {article.category && ` (${article.category})`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 