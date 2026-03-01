'use client';

import './globals.css';
import { useEffect, useRef } from 'react';

const DisableFeatures = () => {
  useEffect(() => {
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', preventPinchZoom, { passive: false });

    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', preventKeyboardZoom);

    const preventScrollZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', preventScrollZoom, { passive: false });

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', preventContextMenu);

    const preventDevTools = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      if (e.metaKey && e.altKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keydown', preventDevTools);

    return () => {
      document.removeEventListener('touchstart', preventPinchZoom);
      document.removeEventListener('keydown', preventKeyboardZoom);
      document.removeEventListener('wheel', preventScrollZoom);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventDevTools);
    };
  }, []);

  return null;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initStarSystem = (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const setSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      setSize();
      window.addEventListener('resize', setSize);
      
      const stars: any[] = [];
      
      class StarParticle {
        x: number; y: number; size: number; opacity: number; fadeDirection: 'IN' | 'OUT';
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 1;
          this.opacity = 0;
          this.fadeDirection = 'IN';
        }
        update() {
          if (this.fadeDirection === 'IN') {
            this.opacity += 0.01;
            if (this.opacity >= 0.8) this.fadeDirection = 'OUT';
          } else {
            this.opacity -= 0.01;
          }
        }
        draw() {
          if (!ctx) return;
          ctx.save(); ctx.translate(this.x, this.y); ctx.beginPath();
          const s = this.size;
          ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
          ctx.shadowBlur = 4; ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
          ctx.fill(); ctx.restore();
        }
      }
      
      let animId: number;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.05) stars.push(new StarParticle()); 
        for (let i = stars.length - 1; i >= 0; i--) {
          const s = stars[i];
          s.update(); s.draw();
          if (s.opacity <= 0 && s.fadeDirection === 'OUT') stars.splice(i, 1);
        }
        animId = requestAnimationFrame(animate);
      };
      animate();
      
      return () => {
        window.removeEventListener('resize', setSize);
        cancelAnimationFrame(animId);
      };
    };
    
    const cleanupBg = bgCanvasRef.current ? initStarSystem(bgCanvasRef.current) : undefined;
    const cleanupFg = fgCanvasRef.current ? initStarSystem(fgCanvasRef.current) : undefined;
    
    return () => {
      if (cleanupBg) cleanupBg();
      if (cleanupFg) cleanupFg();
    };
  }, []);
  
  return (
    <html lang="en">
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
        />
      </head>
      <body className="antialiased text-[#fae8e8] overflow-hidden select-none">
        
        <DisableFeatures />
        
        <div 
          className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
          style={{
            backgroundColor: '#320B0B', 
            backgroundImage: `
              radial-gradient(circle at 0% 0%, rgba(255, 80, 80, 0.25) 0%, rgba(120, 20, 20, 0.1) 40%, transparent 60%),
              radial-gradient(circle at 100% 100%, rgba(255, 215, 0, 0.15) 0%, rgba(120, 80, 0, 0.1) 40%, transparent 60%)
            `,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full" />
        </div>
        
        <div className="relative z-0 w-full h-full">
          {children}
        </div>
        
        <canvas ref={fgCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-50" />
        
      </body>
    </html>
  );
}