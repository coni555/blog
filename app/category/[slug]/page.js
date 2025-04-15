import articlesData from '../../../data/articles.json';
import CategoryClientPage from './client-page';

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

// 获取唯一的分类名称列表
const getUniqueCategories = () => {
  const categories = new Set();
  articlesData.forEach(article => {
    const categoryName = article.category.trim();
    const slug = getSlugFromCategoryName(categoryName);
    categories.add(slug);
  });
  return Array.from(categories);
};

// 为静态导出添加generateStaticParams函数
export function generateStaticParams() {
  // 获取所有分类的 slug
  const categorySlugs = getUniqueCategories();
  
  // 确保一定包含自我提升分类
  if (!categorySlugs.includes('self-improvement')) {
    categorySlugs.push('self-improvement');
  }
  
  console.log('静态生成的分类页面:', categorySlugs);
  
  return categorySlugs.map((slug) => ({
    slug
  }));
}

// 与 ArticlePage 保持一致的简单格式
export default function CategoryPage({ params }) {
  return <CategoryClientPage slug={params.slug} />;
} 