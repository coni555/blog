import articlesData from '../../../data/articles.json';
import ArticleContent from './client-page';

// 为静态导出添加generateStaticParams函数
export function generateStaticParams() {
  return articlesData.map((article) => ({
    id: article.id
  }));
}

// 服务器组件渲染页面框架
export default function ArticlePage({ params }) {
  return <ArticleContent id={params.id} />;
}