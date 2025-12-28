'use client';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { ModeToggle } from '@/components/ui/ModeToggle';

export default function ReadingDirectory() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reuse particle effect for consistency
  useEffect(() => {
    // ... existing effect code ...
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      initParticles();
    };

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number; color: string;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = Math.random() > 0.7 ? '#8A2BE2' : '#E5E4E2';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.floor((canvas!.width * canvas!.height) / 40000);
      for (let i = 0; i < numberOfParticles; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#1a1025] via-[#0f0f0f] to-black text-white flex items-center justify-center">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-60" style={{ zIndex: 0 }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 md:pt-32">
        <ModeToggle currentMode="reading" />

        <h1 className="text-4xl md:text-6xl font-thin tracking-widest text-white mb-2">
          OBTAIN YOUR BLUEPRINT
        </h1>
        <p className="text-white/40 mb-16 tracking-[0.2em] uppercase text-sm">SELECT YOUR PATH</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/reading/numerology" className="group relative block p-8 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:bg-white/10">
            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-xl" />
            <h2 className="text-2xl font-light mb-4 relative z-10 group-hover:text-purple-300 transition-colors">Numerology</h2>
            <p className="text-white/40 text-sm relative z-10">
              Discover the hidden meaning of numbers in your life.
            </p>
          </Link>

          <Link href="/reading/astrology" className="group relative block p-8 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:bg-white/10">
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-xl" />
            <h2 className="text-2xl font-light mb-4 relative z-10 group-hover:text-blue-300 transition-colors">Astrology</h2>
            <p className="text-white/40 text-sm relative z-10">
              Explore planetary influences on your journey.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}