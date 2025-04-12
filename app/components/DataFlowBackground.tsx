'use client';

import React, { useEffect, useRef } from 'react';

const DataFlowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    // 生成随机ASCII字符
    const getRandomChar = () => {
      const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
      return chars[Math.floor(Math.random() * chars.length)];
    };

    // 定义数据流
    class DataStream {
      x: number;
      y: number;
      speed: number;
      fontSize: number;
      color: string;
      characters: string[];
      opacity: number;
      length: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.speed = 1 + Math.random() * 3;
        this.fontSize = 10 + Math.random() * 16;
        
        // 随机选择颜色
        const colors = [
          'rgba(0, 255, 170, opacity)',   // 青绿色
          'rgba(0, 191, 255, opacity)',   // 深天蓝
          'rgba(105, 155, 255, opacity)', // 蓝紫色
          'rgba(66, 245, 215, opacity)',  // 绿松石色
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机生成字符
        this.length = 5 + Math.floor(Math.random() * 20);
        this.characters = Array(this.length).fill('').map(() => getRandomChar());
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.y += this.speed;
        
        // 更新字符 - 有小概率随机变化某个字符
        for (let i = 0; i < this.characters.length; i++) {
          if (Math.random() < 0.01) {
            this.characters[i] = getRandomChar();
          }
        }
        
        // 如果已经超出屏幕，重置到顶部
        if (this.y > canvas.height) {
          this.y = -this.length * this.fontSize;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        if (!ctx) return;
        
        for (let i = 0; i < this.characters.length; i++) {
          const charOpacity = this.opacity - (i * 0.02);
          if (charOpacity <= 0) continue;
          
          ctx.font = `${this.fontSize}px monospace`;
          ctx.fillStyle = this.color.replace('opacity', charOpacity.toString());
          ctx.fillText(
            this.characters[i], 
            this.x, 
            this.y + i * this.fontSize
          );
        }
      }
    }

    // 定义电流波
    class ElectricWave {
      points: {x: number, y: number}[];
      width: number;
      height: number;
      speed: number;
      amplitude: number;
      frequency: number;
      color: string;
      offset: number;

      constructor() {
        this.width = canvas.width;
        this.height = 2 + Math.random() * 3;
        this.speed = 0.5 + Math.random() * 2;
        this.amplitude = 20 + Math.random() * 50;
        this.frequency = 0.005 + Math.random() * 0.015;
        this.color = `rgba(126, 232, 250, ${0.2 + Math.random() * 0.4})`;
        this.offset = Math.random() * 1000;
        
        this.points = [];
        this.generatePoints();
      }

      generatePoints() {
        this.points = [];
        const y = Math.random() * canvas.height;
        
        for (let x = 0; x < this.width; x += 5) {
          this.points.push({
            x,
            y: y + Math.sin((x + this.offset) * this.frequency) * this.amplitude
          });
        }
      }

      update() {
        this.offset += this.speed;
        this.generatePoints();
      }

      draw() {
        if (!ctx || this.points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.height;
        ctx.stroke();

        // 添加发光效果
        ctx.shadowColor = 'rgba(126, 232, 250, 0.5)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // 创建数据流
    const dataStreams: DataStream[] = [];
    const numStreams = Math.floor(canvas.width / 20); // 根据屏幕宽度调整数量
    for (let i = 0; i < numStreams; i++) {
      dataStreams.push(new DataStream());
    }

    // 创建电流波
    const electricWaves: ElectricWave[] = [];
    const numWaves = 5; // 电流波数量
    for (let i = 0; i < numWaves; i++) {
      electricWaves.push(new ElectricWave());
    }

    // 执行动画
    const animate = () => {
      if (!ctx) return;
      
      // 使用半透明黑色清除画布，形成拖尾效果
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制数据流
      for (const stream of dataStreams) {
        stream.update();
        stream.draw();
      }
      
      // 绘制电流波
      for (const wave of electricWaves) {
        wave.update();
        wave.draw();
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
      style={{ background: 'linear-gradient(to bottom, #020617, #0f172a)' }}
    />
  );
};

export default DataFlowBackground; 