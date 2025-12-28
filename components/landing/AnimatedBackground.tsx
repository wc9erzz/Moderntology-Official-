'use client';

import { useRef, useEffect } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
}

export function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            // Lower particle density for professionalism
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 50000);

            for (let i = 0; i < numberOfParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.15, // Slower movement
                    vy: (Math.random() - 0.5) * 0.15,
                    size: Math.random() * 2 + 0.3,
                    opacity: Math.random() * 0.5 + 0.3,
                    // Sophisticated color palette: burgundy, rose, indigo, white
                    color: ['#E11D48', '#F43F5E', '#6366F1', '#E5E4E2'][Math.floor(Math.random() * 4)]
                });
            }
        };

        const drawParticle = (particle: Particle) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        };

        const updateParticle = (particle: Particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            // Gentle pulsing opacity
            particle.opacity = Math.sin(Date.now() / 2000 + particle.x) * 0.2 + 0.4;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                updateParticle(particle);
                drawParticle(particle);
            });

            // Draw subtle connections between nearby particles
            ctx.globalAlpha = 0.05;
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = '#E11D48';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            ctx.globalAlpha = 1;

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
        <>
            {/* Gradient Mesh Background */}
            <div className="fixed inset-0 bg-gradient-to-b from-[#1a0a1a] via-[#0a0a1a] to-black" style={{ zIndex: 0 }} />

            {/* Animated gradient blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
                <div
                    className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-rose-900/10 rounded-full blur-[150px]"
                    style={{
                        animation: 'float 20s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[120px]"
                    style={{
                        animation: 'float 15s ease-in-out infinite reverse',
                    }}
                />
                <div
                    className="absolute bottom-0 left-1/2 w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[140px]"
                    style={{
                        animation: 'float 18s ease-in-out infinite',
                        animationDelay: '-5s'
                    }}
                />
            </div>

            {/* Particle Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full opacity-30"
                style={{ zIndex: 2 }}
            />

            {/* CSS for floating animation */}
            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
        </>
    );
}
