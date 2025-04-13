import articlesData from '../../../data/articles.json';
import CategoryClientPage from './client-page';

// 反向映射表（从显示名称到URL参数）
const getSlugFromCategoryName = (categoryName: string) => {
  const reverseMap: Record<string, string> = {
    '提问': 'question',
    '写作': 'writing',
    '阅读': 'reading',
    '英语': 'english',
    '彩蛋文': 'special',
    '多模态创作': 'multimodal',
    '科普': 'science',
    '高效计划': 'planning',
    'AI协作SOP': 'ai-sop',
    '个体思考': 'thinking',
    '个性化打造': 'personalization',
    '运动': 'exercise',
    'AI小确幸': 'ai-happiness',
    'AI人格模拟': 'ai-persona',
  };
  
  return reverseMap[categoryName.trim()] || categoryName.toLowerCase();
};

// 获取唯一的分类名称列表
const getUniqueCategories = () => {
  const categories = new Set<string>();
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
  return getUniqueCategories().map((slug) => ({
    slug
  }));
}

// 与 ArticlePage 保持一致的简单格式
export default function CategoryPage({ params }: { params: any }) {
  return <CategoryClientPage slug={params.slug} />;
} 