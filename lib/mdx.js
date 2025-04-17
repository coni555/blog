import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import readingTime from 'reading-time';

// 文章目录路径
const postsDirectory = path.join(process.cwd(), 'data/posts');

/**
 * 获取所有文章的元数据
 * @returns {Array} 所有文章的元数据数组
 */
export async function getAllPosts() {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory not found:', postsDirectory);
    return [];
  }
  
  // 获取目录中的所有文件
  const filenames = fs.readdirSync(postsDirectory);
  const mdxFiles = filenames.filter(filename => 
    filename.endsWith('.mdx') || filename.endsWith('.md')
  );
  
  // 读取每个文件的元数据
  const posts = mdxFiles.map(filename => {
    // 读取文件内容
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // 使用gray-matter解析前置元数据
    const { data, content } = matter(fileContents);
    
    // 计算阅读时间
    const readTime = readingTime(content);
    
    // 生成唯一slug
    const slug = filename.replace(/\.mdx?$/, '');
    
    // 返回文章元数据
    return {
      slug,
      readTime: Math.ceil(readTime.minutes), // 向上取整的阅读分钟
      ...data,
    };
  });
  
  // 按日期排序（最新的优先）
  return posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
}

/**
 * 获取特定分类的所有文章
 * @param {string} category - 文章分类
 * @returns {Array} 指定分类的文章元数据数组
 */
export async function getPostsByCategory(category) {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.category === category);
}

/**
 * 获取所有分类及其文章数量
 * @returns {Array} 分类信息数组
 */
export async function getAllCategories() {
  const posts = await getAllPosts();
  
  // 统计每个分类的文章数量
  const categories = {};
  posts.forEach(post => {
    const category = post.category;
    if (category) {
      categories[category] = (categories[category] || 0) + 1;
    }
  });
  
  // 转换为数组格式
  return Object.keys(categories).map(name => ({
    name,
    count: categories[name]
  }));
}

/**
 * 根据slug获取单篇文章的完整数据
 * @param {string} slug - 文章的唯一标识
 * @returns {Object} 文章的完整数据，包括内容和元数据
 */
export async function getPostBySlug(slug) {
  // 尝试两种可能的扩展名
  let filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null; // 文章不存在
    }
  }
  
  // 读取文件内容
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  // 解析内容和元数据
  const { data, content } = matter(fileContents);
  
  // 序列化MDX内容
  const mdxSource = await serialize(content);
  
  // 计算阅读时间
  const readTime = readingTime(content);
  
  // 返回完整的文章数据
  return {
    slug,
    content: mdxSource,
    readTime: Math.ceil(readTime.minutes),
    ...data,
  };
}

/**
 * 获取相关文章推荐
 * @param {string} currentSlug - 当前文章的slug
 * @param {string} category - 当前文章的分类
 * @param {number} count - 推荐文章数量
 * @returns {Array} 推荐文章列表
 */
export async function getRelatedPosts(currentSlug, category, count = 3) {
  const allPosts = await getAllPosts();
  
  // 排除当前文章
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug);
  
  // 首先尝试从同一分类中获取相关文章
  let related = otherPosts.filter(post => post.category === category);
  
  // 如果同一分类的文章不足，则补充其他文章
  if (related.length < count) {
    const needMore = count - related.length;
    const otherCategories = otherPosts.filter(post => post.category !== category);
    related = [...related, ...otherCategories.slice(0, needMore)];
  }
  
  // 限制数量并返回
  return related.slice(0, count);
} 