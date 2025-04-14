'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 粒子动画组件
const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置Canvas尺寸为窗口大小
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // 增加星星类
    class Star {
      x: number;
      y: number;
      size: number;
      color: string;
      twinkleSpeed: number;
      twinkleValue: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.4})`;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleValue = Math.random() * Math.PI;
      }
      
      update() {
        this.twinkleValue += this.twinkleSpeed;
        if (this.twinkleValue > Math.PI * 2) this.twinkleValue = 0;
      }
      
      draw() {
        if (!ctx) return;
        const alpha = (Math.sin(this.twinkleValue) + 1) / 2 * 0.7 + 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 粒子类
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.7 - 0.35; // 增加速度
        this.speedY = Math.random() * 0.7 - 0.35; // 增加速度
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 创建星星数组和粒子数组
    const starsArray: Star[] = [];
    const particlesArray: Particle[] = [];
    
    // 增加星星数量
    const numberOfStars = Math.min(200, Math.floor(window.innerWidth / 5));
    for (let i = 0; i < numberOfStars; i++) {
      starsArray.push(new Star());
    }
    
    // 增加粒子数量
    const numberOfParticles = Math.min(150, Math.floor(window.innerWidth / 10));
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
    
    // 动画循环
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制星星
      for (let i = 0; i < starsArray.length; i++) {
        starsArray[i].update();
        starsArray[i].draw();
      }
      
      // 绘制粒子
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default function AboutPage() {
  const [avatarSrc, setAvatarSrc] = useState('/anime-space-avatar.svg');
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load saved avatar on component mount
  useEffect(() => {
    setIsMounted(true);
    // Get saved avatar from localStorage if it exists
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('userAvatar');
      if (savedAvatar) {
        setAvatarSrc(savedAvatar);
      }
    }
  }, []);
  
  // 处理头像上传
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 创建一个临时URL来预览上传的图片
      const objectUrl = URL.createObjectURL(file);
      setAvatarSrc(objectUrl);
      
      // Convert to base64 for localStorage persistence
      const reader = new FileReader();
      reader.onloadend = () => {
        // This runs once the reader has completed reading the file
        const base64String = reader.result as string;
        if (base64String) {
          // Save base64 string to localStorage
          localStorage.setItem('userAvatar', base64String);
          
          // Update avatar with base64 data
          setAvatarSrc(base64String);
          
          // Revoke the temporary object URL to free up memory
          URL.revokeObjectURL(objectUrl);
        }
      };
      reader.readAsDataURL(file);
      
      // 实际项目中，这里应该调用一个API上传图片到服务器
      console.log('上传了新头像:', file.name);
    }
  };
  
  // 触发文件选择对话框
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 py-16 relative overflow-hidden">
      <StarryBackground />
      
      {/* 添加额外的装饰星星 */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-200 rounded-full opacity-70 animate-pulse"></div>
      <div className="absolute top-40 right-40 w-3 h-3 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-40 left-1/4 w-5 h-5 bg-purple-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-pink-200 rounded-full opacity-40 animate-pulse"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* 面包屑导航 */}
        <div className="mb-8 flex items-center text-sm text-gray-300">
          <Link href="/" className="hover:text-indigo-400 transition-colors">
            首页
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-100">关于我</span>
        </div>

        {/* 主要内容 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/20">
          <div className="flex flex-col md:flex-row">
            {/* 左侧内容区 */}
            <div className="md:w-3/5 p-8 md:p-12">
              <h1 className="text-4xl font-bold text-white mb-6 font-serif">
                About Me
              </h1>
              
              {/* 欢迎语 */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
                  Hello! 👋
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed">
                  你好呀，我是幻语，一名在AI浪潮中记录灵感、追问世界、探索自我的创作者。
                </p>
              </div>
              
              {/* 我是谁？ */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
                  Who Am I?
                </h2>
                <ul className="space-y-3 text-gray-200">
                  <li className="flex">
                    <span className="mr-2 flex-shrink-0">📍</span>
                    <span className="flex-1"><strong>目前身份：</strong>大学生｜AI应用者｜公众号运营者</span>
                  </li>
                  <li className="flex">
                    <span className="mr-2 flex-shrink-0">🛠</span>
                    <span className="flex-1"><strong>正在探索：</strong>AI工具 × 深度阅读 × 自我表达</span>
                  </li>
                  <li className="flex">
                    <span className="mr-2 flex-shrink-0">💡</span>
                    <span className="flex-1"><strong>擅长：</strong>把复杂的东西讲简单、把抽象的思考写具体</span>
                  </li>
                  <li className="flex">
                    <span className="mr-2 flex-shrink-0">🌱</span>
                    <span className="flex-1"><strong>信条：</strong>写，是为了成为更清楚的自己；AI，是我理解世界的外置大脑</span>
                  </li>
                </ul>
              </div>
              
              {/* 我的远景 */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
                  My Vision
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed">
                  希望这个网站，能成为一个有温度的AI创作小宇宙。🌌
                </p>
              </div>
              
              {/* 我用的工具 */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
                  Tools I Use
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["ChatGPT", "Claude", "DeepSeek", "Cursor", "Midjourney"].map((tool) => (
                    <span 
                      key={tool}
                      className="px-3 py-1 bg-indigo-900/50 text-amber-200 rounded-full text-sm border border-indigo-500/30"
                    >
                      {tool}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-indigo-900/50 text-amber-200 rounded-full text-sm border border-indigo-500/30">
                    更多...
                  </span>
                </div>
              </div>
              
              {/* 怎么联系我 */}
              <div>
                <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
                  Contact Me
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed">
                  欢迎留言或关注公众号（名字为"AI-幻语"）
                </p>
                <div className="mt-6 inline-block">
                  <Link 
                    href="/"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    返回首页
                  </Link>
                </div>
              </div>
            </div>
            
            {/* 右侧图片区 */}
            <div className="md:w-2/5 p-8 md:p-12 flex flex-col items-center justify-center relative">
              <div className="anime-character-container relative w-full max-w-xs rounded-xl border-4 border-pink-200/30 shadow-xl overflow-hidden bg-gradient-to-b from-indigo-100/20 to-purple-200/20 backdrop-blur-sm">
                <div className="relative aspect-square w-full h-auto">
                  {/* 动漫角色图片 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-purple-900/30">
                    <div className="anime-character w-full h-full flex items-center justify-center">
                      {/* 图片区域 */}
                      <div className="w-full h-full relative overflow-hidden group">
                        <img 
                          src={avatarSrc}
                          alt="幻语头像"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* 上传按钮悬浮层 */}
                        <div 
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                          onClick={triggerFileInput}
                        >
                          <div className="text-white text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>点击上传头像</p>
                          </div>
                        </div>
                        
                        {/* 隐藏的文件输入 */}
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarUpload}
                        />
                      </div>
                      <style jsx>{`
                        .anime-character {
                          position: relative;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        }
                        .anime-character::before {
                          content: '';
                          position: absolute;
                          inset: 0;
                          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23fff' d='M50 20L54.9 39H75l-16.5 12 6.5 19-16-12-16 12 6.5-19L22 39h20.1z'/%3E%3C/svg%3E");
                          background-size: 20px;
                          background-repeat: repeat;
                          opacity: 0.1;
                          animation: twinkle 4s linear infinite;
                        }
                        @keyframes twinkle {
                          0%, 100% { opacity: 0.05; }
                          50% { opacity: 0.15; }
                        }
                      `}</style>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-white">幻语</h3>
                <p className="text-gray-300 mb-2">AI Creative Studio</p>
                <div className="flex justify-center gap-2">
                  <span className="text-xs text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-full">♂️ 男生</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 