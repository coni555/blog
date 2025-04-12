'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  loop?: boolean;
  pauseBetweenLoops?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
  loop = false,
  pauseBetweenLoops = 2000,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 客户端挂载检测
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 重置状态
    setDisplayText('');
    setCurrentIndex(0);
    setStarted(false);
    setIsDeleting(false);
    setIsPaused(false);
  }, [text]);

  useEffect(() => {
    // 确保仅在客户端执行动画效果
    if (!isMounted) return;
    
    let timer: NodeJS.Timeout;

    // 初始延迟
    if (!started) {
      timer = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    // 暂停状态
    if (isPaused) {
      timer = setTimeout(() => {
        setIsPaused(false);
        if (loop) {
          setIsDeleting(true);
        }
      }, pauseBetweenLoops);
      return () => clearTimeout(timer);
    }

    // 删除文字效果（用于循环）
    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setCurrentIndex(0);
        return;
      }

      timer = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, speed / 2); // 删除速度比打字快

      return () => clearTimeout(timer);
    }

    // 开始打字效果
    if (started && currentIndex < text.length) {
      timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (started && currentIndex === text.length) {
      // 打字完成后
      if (onComplete) onComplete();
      
      if (loop) {
        // 如果需要循环，则先暂停一段时间
        setIsPaused(true);
      }
    }
  }, [text, currentIndex, speed, delay, started, onComplete, loop, pauseBetweenLoops, displayText, isDeleting, isPaused, isMounted]);

  // 服务器端渲染时返回空字符串，避免水合不匹配
  if (!isMounted) {
    return (
      <span className={className}>
        <span className="inline-block w-[0.1em] h-[1.2em] bg-indigo-400 animate-blink ml-1 align-middle"></span>
      </span>
    );
  }

  return (
    <span className={className}>
      {displayText}
      <span className="inline-block w-[0.1em] h-[1.2em] bg-indigo-400 animate-blink ml-1 align-middle"></span>
    </span>
  );
};

export default TypewriterEffect; 