import React from 'react';
import Link from 'next/link';
import StarBackground from './components/StarBackground';

export default function NotFound() {
  return (
    <>
      <StarBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-white/10 text-center max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-xl text-white mb-2">页面未找到</p>
          <p className="text-gray-300 mb-6">抱歉，您请求的页面不存在或已被移除。</p>
          
          <div className="space-x-4">
            <Link 
              href="/" 
              className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all hover:scale-105"
            >
              返回首页
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-block px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-105"
            >
              返回上一页
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 