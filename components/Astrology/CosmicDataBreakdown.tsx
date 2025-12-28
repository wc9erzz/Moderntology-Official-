'use client';

import { useState } from 'react';
import { Lock, Unlock, Activity, Layers, ArrowRight, Star, Sparkles, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { ChartData, PointData, SYMBOLS, normalizeChartData, ELEMENT_MAP, MODALITY_MAP, getDignity, SIGN_COLORS, ASPECT_CONFIG, ORB_LIMITS, getSignIndex } from './chart-utils';
import { detectChartPatterns, PatternResult } from '@/utils/astrology/pattern-detection';
import { AstrologyReferenceGuide } from './AstrologyReferenceGuide';
import { AstrologyControls } from './AstrologyControls';

interface Props {
    chartData: any;
    selectedId?: string | null;
    orbStrictness?: 'strict' | 'standard' | 'wide';
    showNodeSignatures?: boolean;
    system?: 'western' | 'vedic';
}

export function CosmicLedgerTable({ chartData: rawData, orbStrictness = 'standard', showNodeSignatures = false, system = 'western' }: Props) {
    const [activeTab, setActiveTab] = useState<'main' | 'extras'>('main');

    // 1. Defensively handle data structure (Match ProVedicChart logic)
    // If 'rawData' already has 'points', it's likely normalized.
    const chartData = rawData.points ? rawData : normalizeChartData(rawData);

    const planets = (Object.values(chartData.points || {}) as PointData[]).sort((a, b) => {
        // Custom sort order: Lights -> Planets -> Nodes -> Asteroids -> Angles
        const order = [
            'Sun', 'Moon',
            'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
            'North Node', 'South Node',
            'Chiron', 'Lilith',
            // Angles at the bottom
            'Ascendant', 'Midheaven', 'Descendant', 'IC', 'Vertex', 'EastPoint', 'East Point'
        ];
        const idxA = order.indexOf(a.name);
        const idxB = order.indexOf(b.name);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
    });

    const MAIN_BODIES = [
        'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
        'North Node', 'South Node', 'Chiron', 'Lilith', 'Ascendant', 'Midheaven'
    ];

    const filteredPlanets = planets.filter(p => {
        const isMain = MAIN_BODIES.includes(p.name);
        if (activeTab === 'main') return isMain;
        // Extras includes explicitly listed extras AND any stars
        return !isMain || p.type === 'star';
    });

    return (
        <div className="w-full space-y-4">
            {/* Tab Switcher */}
            <div className="flex items-center gap-6 px-4 border-b border-[var(--border-card)]">
                <button
                    onClick={() => setActiveTab('main')}
                    className={`pb-3 text-sm font-bold tracking-widest uppercase transition-colors relative outline-none focus:outline-none focus:ring-0 ring-0 border-none ${activeTab === 'main' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-zinc-300'
                        }`}
                    style={{ outline: 'none', boxShadow: 'none' }}
                >
                    Main Bodies
                    {activeTab === 'main' && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent-primary)]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('extras')}
                    className={`pb-3 text-sm font-bold tracking-widest uppercase transition-colors relative outline-none focus:outline-none focus:ring-0 ring-0 border-none ${activeTab === 'extras' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-zinc-300'
                        }`}
                    style={{ outline: 'none', boxShadow: 'none' }}
                >
                    Extras
                    {activeTab === 'extras' && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent-primary)]" />
                    )}
                </button>
            </div>

            {/* SECTION 2: THE PLANETARY LEDGER (The Standard Pro View) */}
            <div>
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        height: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(0, 0, 0, 0.1);
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: var(--border-card, rgba(255,255,255,0.1));
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: var(--text-muted, rgba(255,255,255,0.3));
                    }
                `}</style>
                <div className="overflow-x-auto rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xl backdrop-blur-md custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-card)] bg-white/[0.02] text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                                <th className="p-3 pl-6 py-4 w-[20%]">Body</th>
                                <th className="p-3 py-4 w-[15%]">Sign</th>
                                <th className="px-3 py-4 w-[10%]">Properties</th>
                                <th className="p-3 py-4">Aspects</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-card)]">
                            {filteredPlanets.map((planet: PointData, i: number) => {
                                const element = ELEMENT_MAP[planet.sign];
                                const modality = MODALITY_MAP[planet.sign];
                                const dignityInfo = chartData.dignities?.[planet.name];

                                let elementColor = 'text-[var(--text-muted)]';
                                if (element === 'Fire') elementColor = 'text-orange-500';
                                if (element === 'Earth') elementColor = 'text-emerald-300';
                                if (element === 'Air') elementColor = 'text-amber-300';
                                if (element === 'Water') elementColor = 'text-blue-300';

                                const isAngle = ['Ascendant', 'Midheaven', 'MC', 'Descendant', 'IC', 'Imum Coeli', 'Vertex', 'EastPoint', 'East Point'].includes(planet.name);

                                return (
                                    <tr key={i} className="hover:bg-[var(--bg-card-hover)] transition-colors group">
                                        <td className="p-3 pl-6 py-4">
                                            <div className="flex items-start gap-4">
                                                {/* Icon Column (Fixed Width for Alignment) */}
                                                <div className="w-6 flex justify-center shrink-0 pt-0.5">
                                                    {planet.type === 'star' ? (
                                                        <>
                                                            {planet.name === 'Pleiades' && <Sparkles className="w-5 h-5 text-blue-300 opacity-90" />}
                                                            {planet.name === 'Sirius' && <Star className="w-5 h-5 text-white fill-white opacity-90 drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]" />}
                                                            {planet.name === 'Arcturus' && <Star className="w-5 h-5 text-orange-300 opacity-90" />}
                                                            {planet.name === 'Orion' && <Activity className="w-5 h-5 text-rose-400 opacity-90" />}
                                                            {planet.name === 'Andromeda' && <Layers className="w-5 h-5 text-purple-300 opacity-90" />}
                                                            {planet.name === 'Lyra' && <div className="w-5 h-5 text-cyan-300 font-serif font-black flex items-center justify-center">α</div>}
                                                            {!['Pleiades', 'Sirius', 'Arcturus', 'Andromeda', 'Orion', 'Lyra'].includes(planet.name) && (
                                                                <Star className="w-5 h-5 text-zinc-400 opacity-60" />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className={`text-xl opacity-90 group-hover:opacity-100 transition-opacity ${SIGN_COLORS[planet.sign] || 'text-[var(--text-muted)]'}`} style={{ fontFamily: '"Segoe UI Symbol", "Apple Color Emoji", serif' }}>
                                                            {SYMBOLS[planet.name] || ''}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Name & Status Column */}
                                                <div className="flex flex-col gap-1">
                                                    <span className={`block font-bold tracking-tight text-sm ${SIGN_COLORS[planet.sign] || 'text-[var(--text-primary)]'}`}>
                                                        {planet.name}
                                                    </span>

                                                    {/* Status Badge Row */}
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {planet.isRetro && (
                                                            <span className="text-[10px] text-rose-400 uppercase tracking-widest border border-rose-500/30 px-1.5 py-0.5 rounded font-black">Rx</span>
                                                        )}
                                                        {!isAngle && dignityInfo && dignityInfo.score !== 0 && (
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[9px] uppercase font-black tracking-widest border ${dignityInfo.score > 0
                                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                                }`}>
                                                                {dignityInfo.label || dignityInfo.items.join(', ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-sm font-bold tracking-wide ${SIGN_COLORS[planet.sign] || 'text-[var(--text-primary)]'}`}>{planet.sign}</span>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">
                                                        {Math.floor(planet.deg)}°{String(Math.floor(planet.min)).padStart(2, '0')}'
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            {!isAngle && (
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-[10px] font-black ${elementColor} uppercase tracking-tight flex items-center gap-1.5`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${element === 'Fire' ? 'bg-orange-500' : element === 'Water' ? 'bg-blue-400' : element === 'Earth' ? 'bg-emerald-400' : 'bg-amber-300'} shadow-[0_0_8px_currentColor]`} />
                                                        {element}
                                                    </span>
                                                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-tight font-bold opacity-80">
                                                        {modality}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 py-4">
                                            <div className="flex flex-wrap gap-2 max-w-[480px]">
                                                {chartData.aspects
                                                    .filter((a: any) => {
                                                        const involvesPlanet = a.p1 === planet.name || a.p2 === planet.name;
                                                        if (!involvesPlanet) return false;

                                                        // Node Signature Toggle
                                                        if (!showNodeSignatures) {
                                                            const p1IsNode = ['North Node', 'South Node', 'Rahu', 'Ketu'].includes(a.p1);
                                                            const p2IsNode = ['North Node', 'South Node', 'Rahu', 'Ketu'].includes(a.p2);
                                                            if (p1IsNode || p2IsNode) return false;
                                                        }

                                                        return true;
                                                    })
                                                    .sort((a: any, b: any) => a.orb - b.orb)
                                                    .map((asp: any, idx: number) => {
                                                        const other = asp.p1 === planet.name ? asp.p2 : asp.p1;
                                                        const cfg = ASPECT_CONFIG[asp.type];
                                                        if (!cfg) return null;

                                                        // Ghost Logic
                                                        const limits = ORB_LIMITS[orbStrictness] || ORB_LIMITS['standard'];
                                                        const limit = (limits as any)[asp.type] || limits.default;
                                                        const isGhost = asp.orb > limit;

                                                        // Styling
                                                        const opacity = isGhost ? 0.4 : 1;
                                                        const isParallel = asp.type === 'Parallel' || asp.type === 'Contra-Parallel';
                                                        const borderStyle = isGhost || isParallel ? 'border-dashed' : 'border-solid';

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 bg-[var(--bg-main)]/50 rounded-lg border border-[var(--border-card)] hover:bg-[var(--bg-card-hover)] transition-colors shadow-sm ${borderStyle}`}
                                                                title={`${asp.type} ${other} (${Number(asp.orb.toFixed(3))}°) ${isGhost ? '[Ghost / Wide Orb]' : ''}`}
                                                                style={{ opacity }}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <span style={{ color: cfg.color }} className="text-[14px] leading-none drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]">{cfg.symbol}</span>
                                                                    <span className="text-[10px] text-[var(--text-primary)] font-black uppercase tracking-widest">{SYMBOLS[other] || other.substring(0, 2)}</span>
                                                                </div>
                                                                <span className="text-[10px] text-[var(--text-secondary)] font-mono leading-none font-bold">{asp.orb.toFixed(1)}°</span>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// New Props Interface to support toggling
interface BreakdownProps {
    westernData: any;
    vedicData?: any;
    selectedId?: string | null;
    orbStrictness?: 'strict' | 'standard' | 'wide';
    showNodeSignatures?: boolean;
    // New Props for Controls
    system: 'western' | 'vedic';
    setSystem: (s: 'western' | 'vedic') => void;
    viewPerspective: 'geocentric' | 'topocentric';
    setViewPerspective: (p: 'geocentric' | 'topocentric') => void;
}

export function CosmicDataBreakdown({
    westernData,
    vedicData,
    selectedId,
    orbStrictness,
    showNodeSignatures,
    system,
    setSystem,
    viewPerspective,
    setViewPerspective
}: BreakdownProps) {
    // Fallback to western if vedic is missing or selected system is western
    const activeData = system === 'vedic' && vedicData ? vedicData : westernData;
    const isVedicAvailable = !!vedicData;

    return (
        <div className="w-full space-y-4">
            {/* Stacked Layout: Controls -> Legend -> Ledger */}
            <div className="flex flex-col gap-4 w-full">

                {/* 1. Controls (Top) */}
                <div className="w-full flex justify-center z-10">
                    <AstrologyControls
                        system={system}
                        setSystem={setSystem}
                        viewPerspective={viewPerspective}
                        setViewPerspective={setViewPerspective}
                        vedicDisabled={!isVedicAvailable}
                    />
                </div>

                {/* 2. Legend Key (Middle) */}
                <div className="w-full opacity-90 hover:opacity-100 transition-opacity">
                    <AstrologyReferenceGuide />
                </div>
            </div>

            {/* Data Table */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CosmicLedgerTable
                    chartData={activeData}
                    selectedId={selectedId}
                    orbStrictness={orbStrictness}
                    showNodeSignatures={showNodeSignatures}
                    system={system}
                />
            </div>
        </div>
    );
}

