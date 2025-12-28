'use client';

import React, { useEffect, useRef } from 'react';

export type AstrologyTheme = 'nebula' | 'deep-space' | 'mythic-gold';

interface AstrologyThemeWrapperProps {
    theme: AstrologyTheme;
    children: React.ReactNode;
}

export function AstrologyThemeWrapper({ theme, children }: AstrologyThemeWrapperProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // CSS Variable Maps for Themes
    const themeStyles: Record<AstrologyTheme, React.CSSProperties> = {
        'nebula': {
            '--bg-main': '#000000',
            '--bg-card': 'rgba(24, 24, 27, 0.6)', // Zinc-900/60
            '--bg-card-hover': 'rgba(39, 39, 42, 0.7)', // Zinc-800/70
            '--border-card': 'rgba(255, 255, 255, 0.1)',
            '--text-primary': '#ffffff',
            '--text-secondary': '#a1a1aa', // Zinc-400
            '--accent-primary': '#a78bfa', // Violet-400
            '--accent-secondary': '#60a5fa', // Blue-400
            '--font-size-xs': '0.75rem', // 12px
            '--font-size-sm': '0.875rem', // 14px
            '--font-size-base': '1rem', // 16px
        } as React.CSSProperties,
        'deep-space': {
            '--bg-main': '#020617', // Slate-950
            '--bg-card': 'rgba(15, 23, 42, 0.5)', // Slate-900/50
            '--bg-card-hover': 'rgba(30, 41, 59, 0.6)', // Slate-800/60
            '--border-card': 'rgba(148, 163, 184, 0.1)', // Slate-400/10
            '--text-primary': '#f8fafc', // Slate-50
            '--text-secondary': '#94a3b8', // Slate-400
            '--accent-primary': '#38bdf8', // Sky-400
            '--accent-secondary': '#818cf8', // Indigo-400
            '--font-size-xs': '0.75rem',
            '--font-size-sm': '0.875rem',
            '--font-size-base': '1rem',
        } as React.CSSProperties,
        'mythic-gold': {
            '--bg-main': '#1a1005', // Deep Brown/Black
            '--bg-card': 'rgba(40, 25, 10, 0.4)',
            '--bg-card-hover': 'rgba(60, 40, 20, 0.5)',
            '--border-card': 'rgba(217, 119, 6, 0.2)', // Amber-600/20
            '--text-primary': '#fffbeb', // Amber-50
            '--text-secondary': '#d6d3d1', // Stone-300
            '--accent-primary': '#fbbf24', // Amber-400
            '--accent-secondary': '#f59e0b', // Amber-500
            '--font-size-xs': '0.75rem',
            '--font-size-sm': '0.875rem',
            '--font-size-base': '1rem',
        } as React.CSSProperties,
    };

    // Canvas Animation Logic (Starfield/Nebula)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;

        // Configuration based on theme
        const STAR_COUNT = theme === 'deep-space' ? 2000 : 1500;
        const NEBULA_CLOUDS = theme === 'nebula' ? 8 : theme === 'mythic-gold' ? 4 : 0;

        // Colors
        let cloudColors: string[] = [];
        let starSpecialColors: string[] = [];

        if (theme === 'nebula') {
            cloudColors = ['rgba(76, 29, 149, 0.15)', 'rgba(59, 130, 246, 0.1)', 'rgba(220, 38, 38, 0.08)'];
            starSpecialColors = ['#a78bfa', '#60a5fa'];
        } else if (theme === 'mythic-gold') {
            cloudColors = ['rgba(180, 83, 9, 0.1)', 'rgba(234, 179, 8, 0.05)'];
            starSpecialColors = ['#fbbf24', '#f59e0b'];
        } else { // deep-space
            starSpecialColors = ['#38bdf8', '#818cf8'];
        }

        interface Star { x: number, y: number, size: number, opacity: number, twinkleSpeed: number, twinklePhase: number, color: string }
        interface Cloud { x: number, y: number, radius: number, color: string, vx: number, vy: number }

        let stars: Star[] = [];
        let clouds: Cloud[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initGalaxy();
        };

        const initGalaxy = () => {
            stars = [];
            clouds = [];

            // Stars
            for (let i = 0; i < STAR_COUNT; i++) {
                const isSpecial = Math.random() > 0.98;
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: isSpecial ? Math.random() * 2 + 1 : Math.random() * 1 + 0.2,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.05 + 0.01,
                    twinklePhase: Math.random() * Math.PI * 2,
                    color: isSpecial ? starSpecialColors[Math.floor(Math.random() * starSpecialColors.length)] : '#ffffff'
                });
            }

            // Clouds
            for (let i = 0; i < NEBULA_CLOUDS; i++) {
                clouds.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 300 + 200,
                    color: cloudColors[Math.floor(Math.random() * cloudColors.length)],
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                });
            }
        };

        const render = () => {
            if (!ctx) return;
            // Clear
            ctx.fillStyle = theme === 'mythic-gold' ? '#1a1005' : theme === 'deep-space' ? '#020617' : '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Clouds
            ctx.globalCompositeOperation = 'screen';
            clouds.forEach(cloud => {
                cloud.x += cloud.vx;
                cloud.y += cloud.vy;
                if (cloud.x < -cloud.radius) cloud.x = canvas.width + cloud.radius;
                if (cloud.x > canvas.width + cloud.radius) cloud.x = -cloud.radius;
                if (cloud.y < -cloud.radius) cloud.y = canvas.height + cloud.radius;
                if (cloud.y > canvas.height + cloud.radius) cloud.y = -cloud.radius;

                const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
                gradient.addColorStop(0, cloud.color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw Stars
            ctx.globalCompositeOperation = 'source-over';
            stars.forEach(star => {
                star.twinklePhase += star.twinkleSpeed;
                const twinkleVal = (Math.sin(star.twinklePhase) + 1) / 2;
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.opacity * (0.5 + 0.5 * twinkleVal);
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)] font-primary" style={themeStyles[theme]}>
            <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-40 pointer-events-none" style={{ zIndex: 0 }} />
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>
        </div>
    );
}
