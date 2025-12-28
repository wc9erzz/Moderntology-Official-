'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getAstrologyReadings } from '@/utils/supabase/astrology-queries';
import { AstrologyReading } from '@/types_astrology';
import { AstrologyChartDisplay } from '@/components/AstrologyChartDisplay';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, MapPin } from 'lucide-react';

export default function AstrologyHubPage() {
    const [loading, setLoading] = useState(true);
    const [reading, setReading] = useState<AstrologyReading | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [chartSystem, setChartSystem] = useState<'western' | 'vedic'>('western');
    const [chartData, setChartData] = useState<any>(null);
    const [isFetching, setIsFetching] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const loadReading = async () => {
            try {
                const supabase = createClient();
                const readings = await getAstrologyReadings(supabase as any);
                if (readings && readings.length > 0) {
                    setReading(readings[0]); // Get the latest one
                    setChartSystem(readings[0].system || 'western');
                    setChartData(readings[0].chart_data);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load reading');
            } finally {
                setLoading(false);
            }
        };

        loadReading();
    }, []);

    const refetchChart = async (newSystem: 'western' | 'vedic') => {
        if (!reading) return;

        setIsFetching(true);
        try {
            const res = await fetch('/api/astrology', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: reading.date_of_birth,
                    time: reading.time_of_birth,
                    city: reading.birth_city,
                    country: reading.birth_country,
                    system: newSystem
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to calculate chart');
            }

            setChartData(data);
            setChartSystem(newSystem);
        } catch (err: any) {
            console.error('Refetch error:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSystemChange = (newSystem: 'western' | 'vedic') => {
        if (newSystem === chartSystem) return;
        refetchChart(newSystem);
    };

    // Starry background effect
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
            particles = Array.from({ length: 100 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                alpha: Math.random(),
                speed: Math.random() * 0.05
            }));
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.alpha += p.speed * (Math.random() > 0.5 ? 1 : -1);
                if (p.alpha < 0) p.alpha = 0;
                if (p.alpha > 1) p.alpha = 1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
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

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
        );
    }

    if (!reading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
                <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none opacity-50" />
                <div className="relative z-10 text-center max-w-lg">
                    <div className="mb-6 opacity-30">
                        <BookOpen className="h-24 w-24 mx-auto" />
                    </div>
                    <h1 className="text-3xl font-light mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                        No Saved Chart Found
                    </h1>
                    <p className="text-white/40 mb-8">
                        Generate and save your astrology chart to unlock your celestial blueprint.
                    </p>
                    <Link
                        href="/reading/astrology"
                        className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-lg font-medium hover:bg-gray-200 transition-all rounded-lg"
                    >
                        Create Chart
                    </Link>
                    <div className="mt-8">
                        <Link href="/account" className="text-white/40 hover:text-white text-sm transition-colors">
                            Return to Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen relative bg-black text-white overflow-hidden">
            <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none opacity-50" />

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-12">
                    <Link href="/account" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Account
                    </Link>
                    <div className="text-xs uppercase tracking-widest text-white/20">
                        Astrology Library
                    </div>
                </div>

                {/* Profile Summary Card */}
                <div className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-light mb-2">My Cosmic Profile</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(reading.date_of_birth).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {reading.birth_city}, {reading.birth_country}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {/* System Switcher */}
                            <div className="inline-flex rounded-lg bg-white/5 p-1 border border-white/10">
                                <button
                                    onClick={() => handleSystemChange('western')}
                                    disabled={isFetching}
                                    className={`px-4 py-1.5 rounded-md text-xs font-medium tracking-wider uppercase transition-all duration-300 ${chartSystem === 'western' ? 'bg-purple-500/20 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'text-white/40 hover:text-white/70'} ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Western
                                </button>
                                <button
                                    onClick={() => handleSystemChange('vedic')}
                                    disabled={isFetching}
                                    className={`px-4 py-1.5 rounded-md text-xs font-medium tracking-wider uppercase transition-all duration-300 ${chartSystem === 'vedic' ? 'bg-blue-500/20 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'text-white/40 hover:text-white/70'} ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Vedic
                                </button>
                            </div>
                            <Link
                                href="/reading/astrology"
                                className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-lg text-sm text-white/80"
                            >
                                Generate New Chart
                            </Link>
                        </div>
                    </div>
                </div>

                {/* The Chart Display */}
                {chartData && (
                    <AstrologyChartDisplay
                        chartData={chartData}
                        system={chartSystem}
                    />
                )}
            </div>
        </main>
    );
}
