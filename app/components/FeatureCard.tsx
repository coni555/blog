'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  bgClassName?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  href,
  bgClassName = 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${bgClassName} backdrop-blur-sm border border-white/10 shadow-lg p-6 flex flex-col h-full transition-all duration-300 ${isHovered ? 'transform -translate-y-1 shadow-xl' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"></div>
      <div className="relative z-10">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 mb-4 flex-grow">{description}</p>
        <Link href={href} className="inline-flex items-center text-indigo-300 hover:text-indigo-200 transition-colors">
          <span>探索更多</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard; 