'use client';

import React, { useEffect, useRef, useState } from 'react';

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置Canvas大小
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 定义星星
    class Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      brightness: number;
      maxBrightness: number;
      brightnessChangeSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.1 - 0.05;
        this.speedY = Math.random() * 0.1 - 0.05;
        this.brightness = Math.random() * 0.5;
        this.maxBrightness = 0.5 + Math.random() * 0.5;
        this.brightnessChangeSpeed = 0.005 + Math.random() * 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 边界检查
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // 闪烁效果
        this.brightness += this.brightnessChangeSpeed;
        if (this.brightness >= this.maxBrightness || this.brightness <= 0) {
          this.brightnessChangeSpeed = -this.brightnessChangeSpeed;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.brightness})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 定义流星
    class ShootingStar {
      x: number = 0;
      y: number = 0;
      length: number = 0;
      speed: number = 0;
      opacity: number = 1;
      active: boolean = false;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height / 3;
        this.length = Math.random() * 80 + 50;
        this.speed = Math.random() * 10 + 5;
        this.opacity = 1;
        this.active = true;
      }

      update() {
        this.x += this.speed;
        this.y += this.speed;
        this.opacity -= 0.01;

        if (this.opacity <= 0 || this.x >= canvas.width || this.y >= canvas.height) {
          if (Math.random() < 0.01) { // 1%概率重置流星
            this.reset();
          } else {
            this.active = false;
          }
        }
      }

      draw() {
        if (!ctx || !this.active) return;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const angle = Math.atan2(this.speed, this.speed);
        const tailX = this.x - Math.cos(angle) * this.length;
        const tailY = this.y - Math.sin(angle) * this.length;
        
        ctx.lineTo(tailX, tailY);
        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 创建星星数组
    const stars: Star[] = [];
    const numStars = Math.floor(canvas.width * canvas.height / 5000);
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }

    // 创建流星数组
    const shootingStars: ShootingStar[] = [];
    for (let i = 0; i < 3; i++) {
      shootingStars.push(new ShootingStar());
    }

    // 星云效果
    class Nebula {
      x: number;
      y: number;
      radius: number;
      color: string;
      opacity: number;
      direction: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 100 + 50;
        
        // 随机从蓝紫色到紫红色的渐变
        const hue = Math.random() * 60 + 220; // 220-280是蓝紫色范围
        this.color = `hsl(${hue}, 70%, 60%)`;
        
        this.opacity = Math.random() * 0.1 + 0.05;
        this.direction = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        // 轻微移动
        this.x += Math.sin(Date.now() * 0.0001) * 0.2 * this.direction;
        this.y += Math.cos(Date.now() * 0.0001) * 0.2 * this.direction;
      }

      draw() {
        if (!ctx) return;
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        
        gradient.addColorStop(0, `${this.color.replace(')', `, ${this.opacity})`)}`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 创建星云
    const nebulae: Nebula[] = [];
    const numNebulae = 5;
    for (let i = 0; i < numNebulae; i++) {
      nebulae.push(new Nebula());
    }

    // 执行动画
    const animate = () => {
      if (!ctx) return;
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制星云背景
      for (const nebula of nebulae) {
        nebula.update();
        nebula.draw();
      }
      
      // 绘制星星
      for (const star of stars) {
        star.update();
        star.draw();
      }
      
      // 绘制流星
      for (const shootingStar of shootingStars) {
        if (shootingStar.active) {
          shootingStar.update();
          shootingStar.draw();
        } else if (Math.random() < 0.001) { // 低概率生成新流星
          shootingStar.reset();
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  // 统一背景样式，确保服务器端和客户端初始渲染一致
  const backgroundStyle = {
    background: 'linear-gradient(to bottom, #0f172a, #1e293b)'
  };

  // 服务器端渲染空的canvas元素，防止水合错误
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={backgroundStyle}
      aria-hidden="true"
    />
  );
};

export default StarBackground; 