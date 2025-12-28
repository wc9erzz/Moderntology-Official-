'use client';
import { useRef, useEffect, useState } from 'react';
import { AstrologyView } from '../components/AstrologyView';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AstrologyPage() {
    const [user, setUser] = useState<any>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;
        let particles: any[] = [];
        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            particles = Array.from({ length: 50 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2,
            }));
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(200,200,255,0.15)'; // Blue/Purple tint
                ctx.fill();
            });
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
        <main className="min-h-screen relative bg-[#0a0a0a] text-white">
            <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" />
            <div className="relative z-10 container mx-auto px-4 py-8">

                <AstrologyView user={user} />
            </div>
        </main>
    );
}
