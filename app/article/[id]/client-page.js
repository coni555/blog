'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StarBackground from '../../components/StarBackground';
import DataFlowBackground from '../../components/DataFlowBackground';
import { getLinkHref } from '../../utils/urlHelper';

export default function ArticleContent({ id }) {
  const articleId = id;
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [theme, setTheme] = useState('星空感');
  const [isMounted, setIsMounted] = useState(false);
  
  // 加载文章和相关文章
  useEffect(() => {
    // 导入在客户端动态导入文章数据
    import('../../../data/articles.json').then((module) => {
      const articlesData = module.default;
      // 查找当前文章
      const foundArticle = articlesData.find(a => a.id === articleId);
      setArticle(foundArticle);
      
      if (foundArticle) {
        // 查找相关文章（同类别）
        const related = articlesData
          .filter(a => a.id !== articleId && a.category === foundArticle.category);
        
        // 随机排序文章
        const shuffledRelated = [...related].sort(() => 0.5 - Math.random());
        
        // 如果相关文章不足3篇，再随机补充一些
        let finalRelated = shuffledRelated.slice(0, 3);
        
        if (finalRelated.length < 3) {
          const otherArticles = articlesData
            .filter(a => a.id !== articleId && !finalRelated.find(r => r.id === a.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3 - finalRelated.length);
          
          finalRelated = [...finalRelated, ...otherArticles];
        }
        
        setRelatedArticles(finalRelated.slice(0, 3));
      }
    });
  }, [articleId]);
  
  // 加载保存的主题设置
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
      
      // 强制加载链接修复脚本
      try {
        console.log('🔄 强制重新加载链接修复');
        // 动态加载link-fix.js脚本
        const existingScript = document.getElementById('link-fix-script');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
        
        const script = document.createElement('script');
        script.id = 'link-fix-script';
        script.src = '/blog/link-fix.js?v=' + new Date().getTime(); // 添加时间戳防止缓存
        script.async = true;
        document.body.appendChild(script);
      } catch (err) {
        console.error('加载链接修复脚本失败:', err);
      }
    }
  }, []);
  
  // 添加特殊链接修复
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 修复相关推荐链接问题
    const fixRelatedLinks = () => {
      try {
        // 查找所有相关推荐链接
        const relatedLinks = document.querySelectorAll('.related-recommendations a, .related-articles a');
        if (relatedLinks.length > 0) {
          console.log('找到相关推荐链接:', relatedLinks.length);
          
          relatedLinks.forEach(link => {
            // 获取原始href
            const originalHref = link.getAttribute('href');
            if (!originalHref) return;
            
            // 检查是否包含文章ID
            if (originalHref.includes('/article/')) {
              // 保存原始点击行为
              const originalOnClick = link.onclick;
              
              // 重写点击行为
              link.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // 提取文章ID
                const parts = originalHref.split('/article/');
                if (parts.length > 1) {
                  const articleId = parts[1].split('/')[0];
                  
                  // 构建正确的URL（确保包含 /blog 前缀）
                  let targetUrl = originalHref;
                  if (window.location.hostname.includes('github.io')) {
                    // 如果在 GitHub Pages 上
                    if (!targetUrl.startsWith('/blog')) {
                      targetUrl = '/blog' + targetUrl;
                    }
                  }
                  
                  console.log('相关推荐点击:', originalHref, '->', targetUrl);
                  window.location.href = targetUrl;
                  
                  return false;
                }
              };
            }
          });
        }
      } catch (err) {
        console.error('修复相关推荐链接错误:', err);
      }
    };
    
    // 在DOM加载完成后执行修复
    setTimeout(fixRelatedLinks, 1000);
    setTimeout(fixRelatedLinks, 2000);
    
    // 监视DOM变化
    const observer = new MutationObserver(mutations => {
      let hasRelatedContent = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // 检查是否添加了相关推荐内容
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1) { // 元素节点
              if (node.className && 
                  (node.className.includes('related') || 
                   node.querySelector && node.querySelector('.related-recommendations, .related-articles'))) {
                hasRelatedContent = true;
                break;
              }
            }
          }
        }
      });
      
      if (hasRelatedContent) {
        fixRelatedLinks();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);
  
  // 渲染背景
  const renderBackground = () => {
    if (theme === '镜像') {
      return (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-[#041434] to-[#000510] z-0" />
          <DataFlowBackground />
        </>
      );
    }
    return <StarBackground />;
  };
  
  // 文章未加载时显示加载状态
  if (!isMounted) {
    return <div className="min-h-screen bg-black"></div>;
  }
  
  // 如果文章未找到
  if (isMounted && !article) {
    return (
      <>
        {renderBackground()}
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-black/30 backdrop-blur-lg p-8 rounded-xl border border-white/10 text-center max-w-md">
            <h1 className="text-2xl font-bold text-white mb-4">文章未找到</h1>
            <p className="text-indigo-200 mb-6">抱歉，您请求的文章不存在或已被移除。</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all hover:scale-105"
            >
              返回首页
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  // 文章还未加载完成显示空白
  if (!article) {
    return <div className="min-h-screen bg-black"></div>;
  }
  
  return (
    <>
      {renderBackground()}
      <div className="min-h-screen py-16 px-4 relative z-10">
        {/* 返回按钮 */}
        <div className="max-w-3xl mx-auto mb-6">
          <Link 
            href={getLinkHref("/")}
            className="inline-flex items-center text-indigo-300 hover:text-indigo-100 transition-all duration-300 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回首页
          </Link>
        </div>
        
        {/* 文章内容 */}
        <article className="max-w-3xl mx-auto bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          {/* 文章头部信息 */}
          <div className="p-8 border-b border-white/10 bg-gradient-to-r from-indigo-900/40 to-purple-900/30">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                {article.category}
              </span>
              <span className="text-indigo-200">作者: {article.author}</span>
              <span className="text-indigo-200/70">{article.date}</span>
            </div>
          </div>
          
          {/* 文章摘要 */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">文章简介</h2>
              <p className="text-gray-300 leading-relaxed">
                {(() => {
                  // 根据文章ID返回对应的摘要
                  switch(articleId) {
                    case "1":
                      return "介绍了提升AI回答质量的三种提问技巧，包括明确具体问题、拆分复杂问题和补充背景信息，以获得更精准的回答。";
                    case "2":
                      return `分享了"目标+描述+需求+调整+人化"公式，帮助用户通过逐步完善提问内容，实现高效且个性化的AI输出。`;
                    case "3":
                      return `探讨了AI辅助写作的优势，如降低写作门槛、激发灵感和实现从零到一的创造，同时强调写作中真情实感的重要性。`;
                    case "4":
                      return `介绍了模仿名人风格写作和反问AI的技巧，展示了如何利用AI进行创作，同时提醒模仿应基于学习而非盲目照搬。`;
                    case "5":
                      return `演示了AI在英语四六级备考中的应用，包括作文评分、翻译和听力指导，强调了AI作为学习工具的高效性和局限性。`;
                    case "6":
                      return `展示了AI在文本生成、播客创作和逐字稿学习中的应用，强调了AI技术在学习与创作中的整合潜力和个人化学习的优势。`;
                    case "7":
                      return `AI助力阅读效率与深度，通过摘要生成、逻辑梳理和主题整合，帮助读者快速掌握重点并构建知识体系。`;
                    case "8":
                      return `AI根据兴趣和需求推荐书籍，结合关键词生成精准书单，帮助读者找到适合的内容并深化阅读体验。`;
                    case "9":
                      return `通过四大名著人物与AI的互动，展示AI如何为经典文学注入新活力，带来趣味性与现代解读。`;
                    case "10":
                      return `展示AI多模态创作流程，从故事生成到视频、音乐和播客制作，激发个人创造力，实现从0到1的突破。`;
                    case "11":
                      return `探讨AI在日常生活中的应用，如解答疑惑、优化购物选择和提升效率，鼓励养成与AI互动的习惯。`;
                    case "12":
                      return `AI助力寒假蜕变，通过目标设定、计划分解和实时反馈，帮助用户实现学习、健身等个性化目标。`;
                    case "13":
                      return `DeepSeek为家庭成员提供个性化服务，从孩子学习辅导到父母事务管理，再到老年人陪伴，打造智能家庭助手。`;
                    case "14":
                      return `分享"反问法"技巧，通过让AI提出创意问题或反向探索，激发多维度思考，提升提问质量与深度。`;
                    case "15":
                      return `介绍AI辅助阅读闭环流程（阅读、思考、应用、反馈），帮助用户将知识转化为可执行的行动计划。`;
                    case "16":
                      return `结合费曼学习法，利用AI作为"听众"和"反馈者"，通过输出和实践巩固知识，提升理解与应用能力。`;
                    case "17":
                      return `探讨AI如何帮助用户将知识迁移到不同领域，剥离底层逻辑，扩展思维边界。`;
                    case "18":
                      return `强调AI应作为"挑刺小助手"，通过逻辑挑战和观点重构，帮助用户深化思考而非替代思考。`;
                    case "19":
                      return `建议限制AI使用场景，培养独立思考能力，通过"无AI区"和慢思考锻炼大脑，避免过度依赖AI。`;
                    case "20":
                      return `通过记录情绪和日常反思，生成"情绪档案"并输入AI，让AI更精准理解用户需求，提供个性化建议。`;
                    case "21":
                      return `介绍AI速读法，通过精准提问快速获取书籍核心观点，提升阅读效率。`;
                    case "22":
                      return `利用AI优化英语学习，涵盖单词记忆、阅读理解、作文批改，提升备考效率。`;
                    case "23":
                      return `结合"甜蜜点"理论，通过AI分析跑步数据，制定个性化训练计划，提升跑步效果。`;
                    case "24":
                      return `将AI作为写作伙伴，通过互动优化文字表达，从结构、逻辑到情感进行深度打磨。`;
                    case "25":
                      return `借助AI多角度分析日常行为的价值，帮助用户发现隐藏的意义，增强成就感。`;
                    case "26":
                      return `提醒用户AI可能顺从个人观点，倡导以批判性思维使用AI，提出互动新标准保持思维独立。`;
                    case "27":
                      return `AI不会磨平创造力，关键在于个人是否注入灵魂与真实表达。AI是工具而非创造力的敌人，真正被淘汰的是不愿创造的人。`;
                    case "28":
                      return `通过模拟历史名人对话帮助用户解决生活困惑。作者以"转专业问题"为例，展示了AI模拟梭罗和叔本华的跨时空圆桌讨论，强调通过名人思想碰撞启发思考，而非提供标准答案。`;
                    default:
                      return article.summary || "这篇文章探讨了一个有趣的主题，点击下方按钮查看完整内容。";
                  }
                })()}
              </p>
            </div>
            
            <div className="bg-indigo-900/20 p-4 rounded-lg mb-8 border border-indigo-500/20">
              <p className="text-indigo-200 text-center">
                本页面仅提供文章信息介绍，点击下方按钮阅读公众号原文
              </p>
            </div>
            
            <div className="flex justify-center">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  theme === '镜像' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/20'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20'
                }`}
              >
                阅读完整文章
              </a>
            </div>
          </div>
        </article>
        
        {/* 相关推荐 */}
        {relatedArticles.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12">
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">相关推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => (
                <Link 
                  key={relatedArticle.id} 
                  href={getLinkHref(`/article/${relatedArticle.id}`)}
                  onClick={(e) => {
                    // 强制处理点击事件
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 构建正确的URL
                    const targetUrl = getLinkHref(`/article/${relatedArticle.id}`);
                    console.log('相关文章直接点击:', relatedArticle.id, '->', targetUrl);
                    
                    // 使用window.location直接导航
                    window.location.href = targetUrl;
                  }}
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 h-full hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{relatedArticle.title}</h3>
                    <p className="text-indigo-200 text-sm line-clamp-2">{relatedArticle.summary || ""}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-indigo-300">{relatedArticle.category}</span>
                      <span className="text-xs text-indigo-300/70">{relatedArticle.date.split('年')[0]}年</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 