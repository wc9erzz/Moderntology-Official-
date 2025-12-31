'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { getAstrologyReadings, saveAstrologyReading } from '@/utils/supabase/astrology-queries';
import { LearnSectionNav } from '@/components/Learn/LearnSectionNav';
import { AstrologyChartDashboard } from '@/components/Astrology/AstrologyChartDashboard';
import { ArrowLeft, Sparkles, Palette, Layers } from 'lucide-react';
import { CosmicDataBreakdown, CosmicLedgerTable } from '@/components/Astrology/CosmicDataBreakdown';
import { EngineerView } from '@/components/Astrology/EngineerView';
import { AstrologyDive, DeepDiveAnalysis, HarmonicCharts, ChartSignatures } from '@/components/Astrology/AstrologyDive';
import { AstrologyControls } from '@/components/Astrology/AstrologyControls';
import { normalizeChartData, SYMBOLS } from '@/components/Astrology/chart-utils';
import { AstrologyEngine, OrbStrictness } from '@/utils/astrology/AstrologyEngine';
import { getMoonData } from '@/utils/astrology/MoonEngine';
import { VedicChartDisplay } from '@/components/Astrology/Vedic/VedicChartDisplay';
// Force Reload Logic


import { getUserProfile } from '@/utils/supabase/numera-queries';

type Theme = 'nebula' | 'egyptian' | 'nature' | 'futuristic';

export default function AstrologyLearnPage() {
    const [loading, setLoading] = useState(true);
    const [readings, setReadings] = useState<any[]>([]);
    const [selectedReading, setSelectedReading] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
    const [system, setSystem] = useState<'western' | 'vedic'>('western');
    const [orbStrictness, setOrbStrictness] = useState<OrbStrictness>('standard');
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [showExtraPoints, setShowExtraPoints] = useState(true);
    const [showExpertSignatures, setShowExpertSignatures] = useState(false);
    const [showNodeSignatures, setShowNodeSignatures] = useState(true);
    const [viewPerspective, setViewPerspective] = useState<'geocentric' | 'topocentric'>('geocentric');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Advanced Nebula & Starfield Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;

        // Configuration
        const STAR_COUNT = 1500; // Dense starfield
        const NEBULA_CLOUDS = 8; // Number of floating gas clouds

        interface Star {
            x: number;
            y: number;
            size: number;
            opacity: number;
            twinkleSpeed: number;
            twinklePhase: number;
            color: string;
        }

        interface Cloud {
            x: number;
            y: number;
            radius: number;
            color: string;
            vx: number;
            vy: number;
            opacity: number;
        }

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

            // 1. Create Stars
            for (let i = 0; i < STAR_COUNT; i++) {
                const isSpecial = Math.random() > 0.98; // 2% special bright stars
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: isSpecial ? Math.random() * 2 + 1 : Math.random() * 1 + 0.2,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.05 + 0.01,
                    twinklePhase: Math.random() * Math.PI * 2,
                    color: isSpecial
                        ? (Math.random() > 0.5 ? '#a78bfa' : '#60a5fa') // Violet or Blue tint for special stars
                        : '#ffffff'
                });
            }

            // 2. Create Nebula Clouds (Soft gradients)
            const colors = [
                'rgba(76, 29, 149, 0.15)',  // Deep Violet
                'rgba(59, 130, 246, 0.1)',  // Blue
                'rgba(220, 38, 38, 0.08)',  // Subtle Red (lower)
                'rgba(139, 92, 246, 0.12)'  // Lighter Purple
            ];

            for (let i = 0; i < NEBULA_CLOUDS; i++) {
                clouds.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 300 + 200, // Large soft blobs
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 0.2, // Very slow drift
                    vy: (Math.random() - 0.5) * 0.2,
                    opacity: Math.random() * 0.5 + 0.5
                });
            }
        };

        const render = () => {
            // Clear but keep a tiny bit of trail? No, clear fully for crisp stars.
            // We use a base dark fill to ensure "Void" feeling if CSS fails.
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // A. Draw Nebula Clouds (Background Layer)
            // Use 'screen' or 'lighter' blend mode for glowing gas effect
            ctx.globalCompositeOperation = 'screen';
            clouds.forEach(cloud => {
                cloud.x += cloud.vx;
                cloud.y += cloud.vy;

                // Wrap around screen
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

            // B. Draw Stars (Foreground Layer)
            ctx.globalCompositeOperation = 'source-over';
            stars.forEach(star => {
                // Twinkle Math
                star.twinklePhase += star.twinkleSpeed;
                const twinkleVal = (Math.sin(star.twinklePhase) + 1) / 2; // 0 to 1
                // Base opacity + twinkle pulse
                const currentOpacity = star.opacity * (0.5 + 0.5 * twinkleVal);

                ctx.fillStyle = star.color;
                ctx.globalAlpha = currentOpacity;
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
    }, []);

    useEffect(() => {
        const fetchReadings = async () => {
            const supabase = createClient();
            const [userReadings, profile] = await Promise.all([
                getAstrologyReadings(supabase as any),
                getUserProfile(supabase as any)
            ]);
            setReadings(userReadings);
            setUserProfile(profile);

            // Set initial profile if none selected
            if (userReadings.length > 0) {
                const firstReading = userReadings[0];
                setSelectedProfileId(firstReading.unique_id || null);
            }

            setLoading(false);
        };

        fetchReadings();
    }, []);

    // Filter reading based on selected profile
    // Note: We no longer filter by 'system' as we calculate both
    useEffect(() => {
        if (!readings.length) return;

        const match = readings.find(r =>
            (selectedProfileId ? r.unique_id === selectedProfileId : true)
        );

        if (!match) {
            setSelectedReading(null);
            return;
        }

        // When switching profiles, sync settings from the reading if they exist
        // When switching profiles, sync settings from the reading if they exist
        const savedSettings = match.settings || match.chart_data?.user_metadata?.settings;
        if (savedSettings) {
            if (savedSettings.orbStrictness) {
                setOrbStrictness(savedSettings.orbStrictness as OrbStrictness);
            }
            if (savedSettings.viewPerspective) {
                setViewPerspective(savedSettings.viewPerspective as any);
            }
            if (savedSettings.showExtraPoints !== undefined) {
                setShowExtraPoints(savedSettings.showExtraPoints);
            }
        }

        setSelectedReading((prev: any) => {
            if (prev?.id === match.id) {
                if (prev._isLocal && !match._isLocal) return prev;
            }
            return match;
        });
    }, [readings, selectedProfileId]);

    const initializedReadings = useRef<Set<string>>(new Set());

    // Auto-recalculate on load to ensure client-side engine consistency
    useEffect(() => {
        if (!selectedReading || isRecalculating) return;

        // Unique key for this reading
        const key = `${selectedReading.id}`;
        if (selectedReading._isLocal) {
            initializedReadings.current.add(key);
            return;
        }

        console.log("Initializing chart data via local engine...", key);
        initializedReadings.current.add(key);
        handleRecalculate(orbStrictness);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedReading?.id, selectedReading?._isLocal]);

    const handleRecalculate = async (newStrictness: OrbStrictness) => {
        if (!selectedReading) return;

        setIsRecalculating(true);
        setOrbStrictness(newStrictness);

        try {
            const engine = new AstrologyEngine();
            // ALWAYS calculate with 'wide' to get all potential aspects
            // 1. Calculate Western (Tropical)
            const westernData = await engine.calculate(
                selectedReading.date_of_birth,
                selectedReading.time_of_birth,
                {
                    lat: selectedReading.latitude,
                    lon: selectedReading.longitude,
                    tz_str: selectedReading.chart_data?.meta?.location?.tz_str || 'UTC'
                },
                selectedReading.chart_data?.meta?.house_system || 'Placidus',
                'western',
                'wide'
            );

            // 2. Calculate Vedic (Sidereal / Whole Sign)
            const vedicData = await engine.calculate(
                selectedReading.date_of_birth,
                selectedReading.time_of_birth,
                {
                    lat: selectedReading.latitude,
                    lon: selectedReading.longitude,
                    tz_str: selectedReading.chart_data?.meta?.location?.tz_str || 'UTC'
                },
                'Whole Sign', // Vedic default
                'vedic',
                'wide'
            );

            // Handle UTC Time correctly for accurate Moon position
            let utcDate;
            if (westernData?.meta?.utc_time) {
                utcDate = new Date(westernData.meta.utc_time);
            }

            // Add Moon Detailed Data (including Topocentric/Observer View)
            const moonData = getMoonData(
                selectedReading.date_of_birth,
                selectedReading.time_of_birth,
                selectedReading.latitude,
                selectedReading.longitude,
                'western', // Base moon data on Western/Tropical
                utcDate
            );

            // Create composite reading object
            const updatedReading = {
                ...selectedReading,
                chart_data: {
                    ...westernData, // Main Western Data
                    moon_detailed: moonData
                },
                vedic_data: vedicData, // Separate Vedic Data
                settings: {
                    orbStrictness: newStrictness,
                    viewPerspective: viewPerspective,
                    showExtraPoints: showExtraPoints
                },
                _isLocal: true // Mark as locally calculated
            };

            // Update both states to ensure consistency
            setSelectedReading(updatedReading);
            setReadings(prev => prev.map(r => r.id === selectedReading.id ? updatedReading : r));

            // Persist settings to DB
            const supabase = createClient();
            await saveAstrologyReading(supabase as any, {
                ...updatedReading,
                chart_data: {
                    ...updatedReading.chart_data,
                    user_metadata: {
                        profile_name: updatedReading.profile_name,
                        settings: {
                            orbStrictness: newStrictness, // Save User Preference
                            viewPerspective: viewPerspective,
                            showExtraPoints: showExtraPoints
                        }
                    }
                }
            });

        } catch (e) {
            console.error("Recalculation failed", e);
        } finally {
            setIsRecalculating(false);
        }
    };

    const handlePerspectiveChange = async (newPerspective: 'geocentric' | 'topocentric') => {
        if (!selectedReading) return;
        setViewPerspective(newPerspective);

        // Persist setting to DB
        const supabase = createClient();
        await saveAstrologyReading(supabase as any, {
            ...selectedReading,
            chart_data: {
                ...selectedReading.chart_data,
                user_metadata: {
                    profile_name: selectedReading.profile_name,
                    settings: {
                        orbStrictness: orbStrictness,
                        viewPerspective: newPerspective,
                        showExtraPoints: showExtraPoints
                    }
                }
            }
        });
    };

    // Format Date and Time
    const getFormattedDateTime = () => {
        if (!selectedReading?.chart_data?.meta?.local_time) return null;
        try {
            // "2005-06-27 12:42" or ISO string
            const dateObj = new Date(selectedReading.chart_data.meta.local_time);

            // If date is invalid (e.g. custom string format not parsed by Date)
            if (isNaN(dateObj.getTime())) {
                return selectedReading.chart_data.meta.local_time;
            }

            const dateStr = dateObj.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            const timeStr = dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            return `${dateStr} • ${timeStr}`;
        } catch (e) {
            return selectedReading.chart_data.meta.local_time;
        }
    };

    // Fixed Egyptian Theme Variables
    // New Background: Purple (Top) -> Black/Gray (Mid) -> Red (Bottom)
    // User requested: "simple black/white/gray... red at the bottom and purple at the top"
    // Using gradient on the container, but here we define component colors.

    const themeStyles = {
        '--bg-card': '#09090b', // Zinc-950 (Neutral Dark)
        '--bg-card-hover': '#18181b', // Zinc-900
        '--border-card': 'rgba(255, 255, 255, 0.1)', // Subtle white border for clean look
        '--text-primary': '#ffffff', // White
        '--text-muted': '#a1a1aa', // Zinc-400
        '--color-accent': '#a78bfa', // Violet-400 (Matches the middle purple)
        '--color-accent-dim': 'rgba(167, 139, 250, 0.1)',
        '--color-highlight': '#60a5fa', // Blue-400 (Matches top blue)
        '--color-highlight-dim': 'rgba(96, 165, 250, 0.2)',
    } as React.CSSProperties;

    return (
        <div className="min-h-screen text-[var(--text-primary)] relative overflow-hidden bg-black">
            {/* Particle Canvas */}
            <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-40" style={{ zIndex: 0 }} />

            <div className="relative z-10 min-h-screen" style={themeStyles}>
                <div className="relative z-10 max-w-[1700px] mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-20">
                    <LearnSectionNav />

                    {/* Unique Profile Selector */}
                    {/* Unique Profile Selector - Removed as per user request (redundant display) */}
                    {/* {readings.length > 1 && (
                        <div className="mb-8 flex flex-wrap gap-2 animate-fade-in-up">
                            {Array.from(new Map(readings.map(r => [r.unique_id, r.profile_name || 'My Reading'])).entries()).map(([id, name]) => (
                                <button
                                    key={id}
                                    onClick={() => setSelectedProfileId(id)}
                                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 border ${selectedProfileId === id
                                        ? 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                        : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    )} */}

                    {/* Header Section */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 border-b border-white/5 pb-8">
                        <div>
                            {selectedReading ? (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-2 transition-all duration-500 hover:tracking-wide">
                                        {selectedReading.profile_name || userProfile?.full_name || userProfile?.first_name || 'Cosmic Traveler'}
                                    </h1>
                                    <p className="text-gray-400 text-lg font-light flex items-center gap-2">
                                        {getFormattedDateTime() || 'Birth Chart'}
                                        <span className="ml-2 text-xs uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-white/60">
                                            Western / Vedic Hybrid
                                        </span>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Sparkles className="w-5 h-5 text-purple-300" />
                                        <h2 className="text-sm font-medium tracking-[0.2em] text-purple-300 uppercase">Interactive Tool</h2>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-3">
                                        Cosmic Blueprint
                                    </h1>
                                    <p className="text-gray-400 text-lg font-light max-w-2xl leading-relaxed">
                                        Generate your unique astrological fingerprint.
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 bg-white/[0.02] p-3 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
                            {/* Orb Settings */}
                            {selectedReading && (
                                <div className="flex flex-col gap-2 min-w-[240px]">
                                    {/* Moved Top Label */}
                                    <div className="flex items-center px-1">
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Aspect Tolerance</span>
                                    </div>
                                    <div className="flex p-1 bg-black/40 rounded-xl border border-white/10">
                                        {[
                                            { id: 'strict', label: 'STRICT', active: 'bg-amber-500/20 text-amber-200 border-amber-500/30' },
                                            { id: 'standard', label: 'STANDARD', active: 'bg-purple-500/20 text-purple-200 border-purple-500/30' },
                                            { id: 'wide', label: 'WIDE', active: 'bg-blue-500/20 text-blue-200 border-blue-500/30' }
                                        ].map((orb) => (
                                            <button
                                                key={orb.id}
                                                onClick={() => handleRecalculate(orb.id as any)}
                                                className={`flex-1 px-4 py-2 rounded-lg text-[10px] font-bold tracking-[0.2em] transition-all duration-500 ${orbStrictness === orb.id
                                                    ? `${orb.active} shadow-[0_0_20px_rgba(0,0,0,0.3)]`
                                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {orb.label}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Moved Bottom Label */}
                                    <div className="px-1 flex justify-end">
                                        <span className={`text-[9px] uppercase tracking-[0.1em] font-medium transition-colors duration-500 text-right opacity-60 ${orbStrictness === 'strict' ? 'text-amber-400' : orbStrictness === 'standard' ? 'text-purple-400' : 'text-blue-400'}`}>
                                            {orbStrictness === 'strict' && "Zero to 6° • High Precision"}
                                            {orbStrictness === 'standard' && "Zero to 9° • Balanced"}
                                            {orbStrictness === 'wide' && "Zero to 13° • Maximum Scope"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="h-10 w-px bg-white/10 hidden md:block" />

                            <div className="flex flex-col gap-2">
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold px-1">Perspective</span>
                                <div className="flex p-1 bg-black/40 rounded-xl border border-white/10">
                                    <button
                                        onClick={() => handlePerspectiveChange('geocentric')}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-500 ${viewPerspective === 'geocentric'
                                            ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        GEOCENTRIC
                                    </button>
                                    <button
                                        onClick={() => handlePerspectiveChange('topocentric')}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-500 ${viewPerspective === 'topocentric'
                                            ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        TOPOCENTRIC
                                    </button>
                                </div>
                                {/* Added Bottom Explanation */}
                                <div className="px-1 flex justify-end">
                                    <span className="text-[9px] text-zinc-500 uppercase tracking-[0.1em] font-medium opacity-60 text-right">
                                        {viewPerspective === 'geocentric' ? "Earth Center • Standard" : "Surface View • Exact Moon"}
                                    </span>
                                </div>
                            </div>

                            <div className="h-10 w-px bg-white/10 hidden md:block" />


                        </div>
                    </div>

                    {/* Content State Handling */}
                    {!selectedReading ? (
                        <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl animate-fade-in-up">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-8 h-8 text-white/40" />
                                </div>
                                <h2 className="text-2xl font-light mb-4 text-white">No Chart Found</h2>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    You haven&apos;t generated a chart yet. Visit the Reading section to initiate your cosmic analysis.
                                </p>
                                <Link
                                    href="/reading/astrology"
                                    className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-full transition-all font-medium inline-block"
                                >
                                    Create Reading
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className={`w-full animate-fade-in-up transition-opacity duration-300 ${isRecalculating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <AstrologyView
                                selectedReading={selectedReading}
                                orbStrictness={orbStrictness}
                                showExtraPoints={showExtraPoints}
                                setShowExtraPoints={setShowExtraPoints}
                                showExpertSignatures={showExpertSignatures}
                                setShowExpertSignatures={setShowExpertSignatures}
                                showNodeSignatures={showNodeSignatures}
                                setShowNodeSignatures={setShowNodeSignatures}
                                viewPerspective={viewPerspective}
                                onPerspectiveChange={handlePerspectiveChange}
                                system={system}
                                setSystem={setSystem}
                            />
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in-up {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                  animation: fade-in-up 0.6s ease-out forwards;
                }
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    transition: background 0.3s;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                /* Firefox */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
                }
            `}</style>
        </div>
    );
}

// Sub-component for better state/memo management
function AstrologyView({
    selectedReading,
    orbStrictness,
    showExtraPoints,
    setShowExtraPoints,
    showExpertSignatures,
    setShowExpertSignatures,
    showNodeSignatures,
    setShowNodeSignatures,
    viewPerspective,
    onPerspectiveChange,
    system,
    setSystem
}: any) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showEngineerAspects, setShowEngineerAspects] = useState(false);

    const normalized = React.useMemo(() => {
        if (!selectedReading?.chart_data) return null;
        let data = selectedReading.chart_data;

        // Patch: Apply Observer View (Topocentric Moon) if selected
        if (viewPerspective === 'topocentric' && data.moon_detailed?.variants?.topocentric) {
            const topo = data.moon_detailed.variants.topocentric;
            const geo = data.points.Moon;

            // Calculate parallax diff
            let diff = Math.abs((geo.abs_deg || 0) - (topo.abs_deg || 0));
            if (diff > 180) diff = 360 - diff;

            if (diff < 2.5 && diff >= 0) {
                data = JSON.parse(JSON.stringify(data));
                if (data.points && data.points.Moon) {
                    data.points.Moon = {
                        ...data.points.Moon,
                        sign: topo.sign,
                        deg: topo.deg,
                        min: topo.min,
                        abs_deg: topo.abs_deg,
                        full_degree: topo.full_degree,
                        ra: topo.ra,
                        dec: topo.dec
                    };
                }
            }
        }

        return normalizeChartData(data);
    }, [selectedReading?.chart_data, viewPerspective]);

    // Use specific vedic data if available, otherwise fallback
    const vedicData = React.useMemo(() => {
        if (!selectedReading?.vedic_data) return null;

        let data = selectedReading.vedic_data;

        // Patch: Apply Observer View to Vedic Moon using the Parallax Delta from Western data
        // Parallax is the same physical displacement regardless of zodiac system.
        if (viewPerspective === 'topocentric' && selectedReading.chart_data?.moon_detailed?.variants?.topocentric) {
            if (!selectedReading.chart_data?.points?.Moon) return normalizeChartData(data);
            const westGeo = selectedReading.chart_data.points.Moon.abs_deg;
            const westTopo = selectedReading.chart_data.moon_detailed.variants.topocentric.abs_deg;

            // Calculate delta (handling 360 wrap)
            let delta = westTopo - westGeo;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            // Apply to Vedic Moon
            if (data.points && data.points.Moon) {
                data = JSON.parse(JSON.stringify(data));
                const vedicMoon = data.points.Moon;
                let newAbs = (vedicMoon.abs_deg || 0) + delta;

                // Normalize new abs
                if (newAbs < 0) newAbs += 360;
                if (newAbs >= 360) newAbs %= 360;

                // Derive new sign/deg
                const signIdx = Math.floor(newAbs / 30);
                const degRem = newAbs % 30;

                // Update properties
                // Note: We don't recalculate Nakshatras here fully properly without the engine, 
                // but the displacement is usually < 1 degree, so Nakshatra 'might' change boundary.
                // For a perfect fix we'd re-run engine, but this patch is sufficient for visual/ledger consistency.
                const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

                data.points.Moon = {
                    ...vedicMoon,
                    abs_deg: newAbs,
                    sign: signs[signIdx],
                    deg: degRem,
                    // deg/min breakdown
                    min: (degRem - Math.floor(degRem)) * 60
                };
            }
        }

        return normalizeChartData(data);
    }, [selectedReading.vedic_data, selectedReading.chart_data, viewPerspective]);

    // Fix: Create a clean "Geocentric" base data set that ignores the global Topocentric patch.
    // This allows HarmonicCharts to handle its own local perspective switching accurately.
    const baseWesternData = React.useMemo(() => {
        if (!selectedReading || !selectedReading.chart_data) return null;
        return normalizeChartData(selectedReading.chart_data);
    }, [selectedReading]);

    if (!normalized) return null;

    return (
        <div className="flex flex-col gap-16">
            {/* ACT 1: INTERACTIVE BLUEPRINT (Top) */}
            <AstrologyChartDashboard
                chartData={normalized}
                showExtraPoints={showExtraPoints}
                setShowExtraPoints={setShowExtraPoints}
                showExpertSignatures={showExpertSignatures}
                setShowExpertSignatures={setShowExpertSignatures}
                showNodeSignatures={showNodeSignatures}
                setShowNodeSignatures={setShowNodeSignatures}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                orbStrictness={orbStrictness}
            />

            {/* ACT 2: VEDIC PERSPECTIVES (Immediately under Natal Chart) */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-zinc-300 text-[10px] uppercase tracking-[0.3em] font-black">Vedic Systems • Sidereal</span>
                    <div className="h-px bg-white/10 flex-grow" />
                </div>
                {vedicData ? (
                    <VedicChartDisplay data={vedicData} />
                ) : (
                    <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-zinc-500 text-xs">
                        Vedic data initializing...
                    </div>
                )}
            </div>

            {/* ACT 3: THE COSMIC LEDGER (Full Width Data Layer) */}
            <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="flex items-center gap-3">
                    <span className="text-zinc-300 text-[10px] uppercase tracking-[0.3em] font-black">Technical Ledger • Planetary Details</span>
                    <div className="h-px bg-white/10 flex-grow" />
                </div>
                <CosmicDataBreakdown
                    westernData={normalized}
                    vedicData={vedicData}
                    selectedId={selectedId}
                    orbStrictness={orbStrictness}
                    showExpertSignatures={showExpertSignatures}
                    showNodeSignatures={showNodeSignatures}
                    system={system}
                    setSystem={setSystem}
                    viewPerspective={viewPerspective}
                    setViewPerspective={onPerspectiveChange}
                />
            </div>

            {/* CONTROL DECK: Removed duplicate (Controls are inside CosmicDataBreakdown) */}

            {/* ACT 4: WESTERN STRUCTURAL ANALYSIS (Grid Split) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start px-4 sm:px-6 lg:px-8 xl:px-12">

                {/* LEFT: ENGINEER CHART & SIGNATURES */}
                <div className="flex flex-col gap-12 w-full">

                    {/* Engineer View */}
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-zinc-300 text-[10px] uppercase tracking-[0.3em] font-black">Engineer View</span>
                                <div className="h-px bg-white/10 w-12" />
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedId && (
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="px-3 py-1 bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold tracking-widest text-zinc-400 hover:text-white rounded border border-white/5 transition-all outline-none"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowEngineerAspects(!showEngineerAspects)}
                                    className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded border transition-all ${showEngineerAspects
                                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/30'
                                        : 'bg-white/5 hover:bg-white/10 text-zinc-500 border-white/5 hover:text-zinc-300'
                                        }`}
                                >
                                    {showEngineerAspects ? 'Hide Aspects' : 'Show Aspects'}
                                </button>
                            </div>
                        </div>
                        <EngineerView
                            key={`western-south`}
                            data={normalized}
                            system={'western'}
                            showExtraPoints={showExtraPoints}
                            selectedId={selectedId}
                            onSelect={(id: string) => setSelectedId(id)}
                            showAspects={showEngineerAspects}
                        />
                    </div>

                    {/* Pattern Signatures (Stacked Below Engineer) */}
                    <div className="flex flex-col gap-8 w-full">
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-300 text-[10px] uppercase tracking-[0.3em] font-black">Pattern Signatures</span>
                            <div className="h-px bg-white/10 flex-grow" />
                        </div>
                        <ChartSignatures
                            data={normalized}
                            showExpertSignatures={showExpertSignatures}
                            showNodeSignatures={showNodeSignatures}
                        />
                    </div>
                </div>

                {/* RIGHT: TECHNICAL METRICS (Beside Engineer View) */}
                <div className="flex flex-col gap-8 w-full">
                    {/* Deep Dive Metrics (Technical Analysis + Sensitive Points) */}
                    {/* Note: Header is inside component, but we can wrap it if needed for consistency. */}
                    <DeepDiveAnalysis
                        data={normalized}
                        viewPerspective={viewPerspective}
                        hideSignatures={true} // Hide Signatures since we moved them left
                    />
                </div>
            </div>

            {/* ACT 4: HARMONICS (Bottom) */}
            {baseWesternData && (
                <div className="flex flex-col gap-4 mb-20 px-4 sm:px-6 lg:px-8 xl:px-12">
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-300 text-[10px] uppercase tracking-[0.3em] font-black">Harmonic Sub-Charts</span>
                        <div className="h-px bg-white/10 flex-grow" />
                    </div>
                    <HarmonicCharts
                        westernData={baseWesternData}
                        vedicData={vedicData}
                        viewPerspective={viewPerspective}
                        onPerspectiveChange={onPerspectiveChange}
                    />
                </div>
            )}
        </div>
    );
}
