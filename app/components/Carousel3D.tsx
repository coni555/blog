'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Carousel3DProps {
  children: React.ReactNode[];
  className?: string;
  itemWidth?: number;
  perspective?: number;
  radius?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

const Carousel3D: React.FC<Carousel3DProps> = ({
  children,
  className = '',
  itemWidth = 300,
  perspective = 1200,
  radius = 600,
  autoRotate = false,
  rotationSpeed = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [autoRotateInterval, setAutoRotateInterval] = useState<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const anglePerItem = 360 / children.length;

  // Set up initial state and auto-rotation
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
      }
    };
  }, []);

  // Handle auto-rotation when enabled
  useEffect(() => {
    if (isMounted && autoRotate) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % children.length);
      }, rotationSpeed);
      setAutoRotateInterval(interval);
      return () => clearInterval(interval);
    } else if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
      setAutoRotateInterval(null);
    }
  }, [isMounted, autoRotate, children.length, rotationSpeed]);

  // Handle navigation
  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % children.length);
    }
  };

  // Handle item click to navigate to that item
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch and Mouse event handlers for dragging
  const handleDragStart = (clientX: number, event?: React.MouseEvent | React.TouchEvent) => {
    // Don't initiate drag if the click target is a link, button, or has specific class
    if (event) {
      const target = event.target as HTMLElement;
      // Check if clicking on a link, button, or other interactive element
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('text-blue-300') ||  // The "阅读全文" class
        target.classList.contains('cursor-pointer')
      ) {
        return;
      }
    }
    
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - currentX;
    setCurrentX(clientX);
    
    // Determine direction and threshold for navigation
    if (Math.abs(deltaX) > 10) {
      if (deltaX > 0) {
        navigate('prev');
      } else {
        navigate('next');
      }
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (autoRotate) return;
    handleDragStart(e.clientX, e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (autoRotate) return;
    handleDragStart(e.touches[0].clientX, e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const rotationAngle = -currentIndex * anglePerItem;

  return (
    <div className={`relative ${className}`}>
      {/* Navigation buttons */}
      <button
        onClick={() => navigate('prev')}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Previous item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => navigate('next')}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Next item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Carousel container with perspective */}
      <div
        ref={carouselRef}
        className="w-full h-full relative overflow-hidden"
        style={{
          perspective: `${perspective}px`,
          minHeight: '300px',
          touchAction: 'pan-y',
          pointerEvents: 'auto'
        }}
        data-prevent-clicks="false"
        data-prevent-clicks-propagation="false"
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Rotating carousel */}
        <div
          className="absolute w-full h-full transition-transform ease-out duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${radius}px) rotateY(${rotationAngle}deg)`,
          }}
        >
          {children.map((child, index) => {
            const theta = anglePerItem * index;
            const isActive = index === currentIndex;
            
            // Calculate circular distance to determine visibility and styling
            const distance = Math.abs(((index - currentIndex + children.length) % children.length));
            const circularDistance = Math.min(distance, children.length - distance);
            
            // Only render items that are visible in the carousel (within 180 degrees)
            const isVisible = circularDistance <= Math.ceil(children.length / 2);
            
            if (!isVisible) return null;
            
            return (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-500`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
                  width: `${itemWidth}px`,
                  height: 'auto',
                  left: '50%',
                  marginLeft: `-${itemWidth / 2}px`,
                  backfaceVisibility: 'hidden',
                  zIndex: isActive ? 10 : (10 - circularDistance)
                }}
                onClick={(e) => {
                  if (!isActive) {
                    goToIndex(index);
                  }
                  // Don't stop propagation for active items to allow clicks on inner elements
                }}
              >
                <div 
                  className="w-full h-full transition-all duration-300"
                  style={{
                    transform: isActive ? 'scale(1.1)' : `scale(${1 - circularDistance * 0.05})`,
                    opacity: isActive ? 1 : (1 - circularDistance * 0.2),
                    filter: isActive ? 'none' : `brightness(${1 - circularDistance * 0.15})`,
                    boxShadow: isActive ? '0 10px 30px rgba(0, 0, 0, 0.25)' : 'none',
                    pointerEvents: 'auto'
                  }}
                >
                  {/* 添加发光效果和高光 */}
                  {isActive && (
                    <div className="absolute inset-0 -z-10 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-0 opacity-40 animate-pulse" 
                        style={{
                          background: 'var(--gradient-primary, linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3)))',
                          filter: 'blur(15px)',
                        }}
                      />
                      <div 
                        className="absolute inset-0 opacity-70"
                        style={{
                          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 50%)',
                        }}
                      />
                    </div>
                  )}
                  
                  {/* 旋转粒子效果 */}
                  {isActive && (
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-lg">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-white/80"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `floatParticle ${3 + Math.random() * 4}s infinite linear`,
                            opacity: 0.4 + Math.random() * 0.6,
                            transform: `scale(${0.5 + Math.random() * 0.5})`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* 原有子元素 */}
                  {child}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicator dots */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {children.map((_, index) => (
          <button
            key={index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/40 w-2.5 hover:bg-white/70'
            }`}
            onClick={() => goToIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* 全局动画样式 */}
      <style jsx global>{`
        @keyframes floatParticle {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}${50 + Math.random() * 100}px, ${Math.random() > 0.5 ? '' : '-'}${50 + Math.random() * 100}px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Carousel3D; 