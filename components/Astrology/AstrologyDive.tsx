import React, { useState } from 'react';
import { ChartData, PointData as PlanetPosition } from './chart-utils';
import { ChevronDown, ChevronUp, Activity, Globe, Zap, Star, Search, Sparkles, Box, Triangle, Layers, Minimize2, Maximize2, Crosshair, Target } from 'lucide-react';
import { detectChartPatterns, PATTERN_STYLES } from '@/utils/astrology/pattern-detection';
import { VedicChartDisplay } from '@/components/Astrology/Vedic/VedicChartDisplay'; // Added import for VedicChartDisplay
import { AstrologyReferenceGuide } from './AstrologyReferenceGuide';
import { AstrologyControls } from './AstrologyControls';

const ZODIAC = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const toSignDegree = (abs: any) => {
    const val = Number(abs);
    if (isNaN(val)) return 'N/A';
    let deg = val % 360;
    if (deg < 0) deg += 360;
    const signIdx = Math.floor(deg / 30);
    const dFloat = (deg % 30).toFixed(2);
    return `${dFloat}° ${ZODIAC[signIdx]} `;
};

interface AstrologyDiveProps {
    data: ChartData;
    viewPerspective?: 'geocentric' | 'topocentric';
    hideSignatures?: boolean;
    vedicData?: any; // Added vedicData prop
}

const SectionCard = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="w-full flex flex-col gap-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-black/90 border border-white/10 hover:border-white/20 transition-all group shadow-2xl"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-black text-zinc-100 group-hover:text-purple-400 transition-colors border border-white/10 shadow-inner">
                        <Icon size={16} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-100 group-hover:text-white transition-colors">
                        {title}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="text-zinc-600" size={16} /> : <ChevronDown className="text-zinc-600" size={16} />}
            </button>

            {isOpen && (
                <div className="px-1 animate-fade-in-up">
                    {children}
                </div>
            )}
        </div>
    );
};

const DataGrid = ({ items }: { items: { label: string, value: string, sub?: string }[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
            <div key={i} className="flex flex-col p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-card)] hover:border-white/10 transition-all">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-1">{item.label}</span>
                <span className="text-[var(--text-primary)] font-mono">{item.value}</span>
                {item.sub && <span className="text-xs text-[var(--text-muted)] mt-1">{item.sub}</span>}
            </div>
        ))}
    </div>
);

const PlanetRow = ({ name, p }: { name: string, p: PlanetPosition }) => {
    return (
        <div className="flex flex-col gap-3 py-3 px-4 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
            {/* 1. Celestial Body Name - Full Width */}
            <div className="flex flex-col gap-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Celestial Body</span>
                <span className="text-base font-bold text-white tracking-wide shadow-sm break-words">{name}</span>
            </div>

            {/* 2. Metrics Grid - Declination & Velocity */}
            <div className="grid grid-cols-2 gap-4 bg-white/[0.02] rounded-lg p-2 border border-white/5">
                {/* Declination */}
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest group-hover:text-purple-400 transition-colors">Declination</span>
                    <span className="font-mono text-cyan-200 font-bold tracking-tight text-sm">{p.dec ? p.dec.toFixed(2) : '0.00'}°</span>
                </div>

                {/* Velocity */}
                <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest group-hover:text-purple-400 transition-colors">Velocity</span>
                    <span className="font-mono text-cyan-200 font-bold tracking-tight text-sm">{p.speed ? p.speed.toFixed(2) : '0.00'}</span>
                </div>
            </div>
        </div>
    );
};

const SignatureCard = ({ result }: { result: any }) => {
    const style = result.style || PATTERN_STYLES['Default'];
    const Icon = {
        'Triangle': Triangle,
        'Zap': Zap,
        'Layers': Layers,
        'Minimize2': Minimize2,
        'Maximize2': Maximize2,
        'Star': Star
    }[style.icon as string] || Star;

    return (
        <div
            className="relative overflow-hidden rounded-2xl bg-black/95 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.4)]"
        >
            <div className={`absolute inset - 0 bg - gradient - to - br ${style.gradient} opacity - [0.08] group - hover: opacity - [0.15] transition - opacity`} />

            <div className="relative p-5 z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-xl bg-white/5 border border-white/10">
                            <Icon size={18} className="text-zinc-400" style={{ color: style.color }} />
                        </div>
                        <h4 className="font-bold text-white text-sm tracking-wide">{result.type}</h4>
                    </div>
                </div>

                <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">
                    {result.description}
                </p>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-2">
                        {result.planets.map((p: string) => (
                            <span
                                key={p}
                                className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-100 uppercase tracking-tighter"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                    {result.element && (
                        <span className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-100 bg-white/10 px-2 py-1 rounded shadow-sm">
                            {result.element}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ChartSignatures = ({ data }: AstrologyDiveProps) => {
    const patterns = React.useMemo(() => detectChartPatterns(data), [data]);
    if (patterns.length === 0) return null;

    return (
        <SectionCard title="Pattern Signatures" icon={Sparkles} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {patterns.map((pat, i) => (
                    <SignatureCard key={i} result={pat} />
                ))}
            </div>
        </SectionCard>
    );
};

// Standalone component for the Data/Metrics side
export const DeepDiveMetrics = ({ data, viewPerspective }: AstrologyDiveProps) => {
    // Helper to format position
    const fmt = (p: PlanetPosition | undefined) => {
        if (!p) return 'N/A';
        const sec = p.sec !== undefined ? p.sec.toString().padStart(2, '0') : '00';
        return `${p.deg}° ${p.sign} ${p.min}' ${sec}"`;
    };

    // --- EXPERT CALCULATIONS ---
    const sun = data.points.Sun;
    const moon = data.points.Moon;
    const asc = data.points.Ascendant || data.points.ASC;

    // Arabic Parts
    const arabicParts = React.useMemo(() => {
        if (!sun || !moon || !asc) return null;
        const isDay = sun.house >= 7 && sun.house <= 12;
        const calc = (v1: number, v2: number, v3: number) => {
            let res = (v1 + v2 - v3) % 360;
            if (res < 0) res += 360;
            return res;
        };
        const toSign = (abs: number) => {
            const deg = Math.floor(abs % 30);
            const min = Math.floor(((abs % 30) - deg) * 60);
            return { sign: ZODIAC[Math.floor(abs / 30)], deg, min };
        };
        const fortune = isDay ? calc(asc.abs_deg, moon.abs_deg, sun.abs_deg) : calc(asc.abs_deg, sun.abs_deg, moon.abs_deg);
        const spirit = isDay ? calc(asc.abs_deg, sun.abs_deg, moon.abs_deg) : calc(asc.abs_deg, moon.abs_deg, sun.abs_deg);
        return { fortune: toSign(fortune), spirit: toSign(spirit) };
    }, [sun, moon, asc]);

    return (
        <div className="w-full animate-fade-in-up flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <span className="text-zinc-300 text-[10px] uppercase tracking-[0.3em] font-black">Technical Analysis</span>
                <div className="h-px bg-white/10 flex-grow" />
            </div>

            {/* 1. Celestial Analytics (Flexible Height) */}
            <div className="relative w-full min-h-[600px] max-w-3xl mx-auto bg-black/90 border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl flex flex-col">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <Globe className="text-purple-400" size={18} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                            Celestial Analytics
                        </span>
                    </div>
                    {/* Perspective Label */}
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        {viewPerspective === 'topocentric' ? 'Observer View' : 'Geocentric'}
                    </span>
                </div>

                <div className="flex-1 p-0">
                    <div className="flex flex-col divide-y divide-white/5">
                        {Object.entries(data.points)
                            .filter(([name]) => {
                                const exclude = [
                                    'Rahu', 'Ketu', 'North Node', 'South Node',
                                    'Ascendant', 'ASC', 'Midheaven', 'MC',
                                    'Descendant', 'IC', 'Vertex', 'EastPoint', 'East Point',
                                    'Lilith', 'Chiron',
                                    'Pleiades', 'Sirius', 'Arcturus', 'Andromeda', 'Orion', 'Lyra'
                                ];
                                return !exclude.includes(name);
                            })
                            .map(([name, p]) => (
                                <div key={name} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 hover:bg-white/5 transition-colors items-center group">
                                    {/* Name */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)] shrink-0"></span>
                                        <span className="text-base font-bold text-white tracking-wide">{name}</span>
                                    </div>

                                    {/* Declination */}
                                    <div className="flex flex-col sm:items-start pl-2 sm:border-l border-white/5">
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-0.5 group-hover:text-purple-300 transition-colors">
                                            Declination
                                        </span>
                                        <span className="font-mono text-cyan-200 text-base font-bold tracking-tight">
                                            {p.dec ? p.dec.toFixed(2) : '0.00'}°
                                        </span>
                                    </div>

                                    {/* Velocity */}
                                    <div className="flex flex-col sm:items-start pl-2 sm:border-l border-white/5">
                                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-0.5 group-hover:text-purple-300 transition-colors">
                                            Velocity
                                        </span>
                                        <span className="font-mono text-cyan-200 text-base font-bold tracking-tight">
                                            {p.speed ? p.speed.toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* 2. Universal & Mathematical Points (Merged UI) */}
            <div className="bg-black/80 p-6 rounded-2xl border border-white/5 shadow-xl mt-4">
                <h3 className="text-white font-black text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                    <Target size={14} className="text-purple-400" />
                    Calculated Points & Field Data
                </h3>

                {/* Main Cards: Fortune & Spirit */}
                {arabicParts && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 rounded-xl bg-black/60 border border-amber-500/10 flex flex-col gap-2 shadow-inner hover:border-amber-500/20 transition-all">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500/60 font-black">Part of Fortune</span>
                            <span className="text-2xl text-amber-200 font-light tracking-wide">{arabicParts.fortune.deg}° {arabicParts.fortune.sign}</span>
                            <span className="text-[10px] text-zinc-500 font-medium">Physical well-being & natural flow</span>
                        </div>
                        <div className="p-6 rounded-xl bg-black/60 border border-purple-500/10 flex flex-col gap-2 shadow-inner hover:border-purple-500/20 transition-all">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-purple-500/60 font-black">Part of Spirit</span>
                            <span className="text-2xl text-purple-200 font-light tracking-wide">{arabicParts.spirit.deg}° {arabicParts.spirit.sign}</span>
                            <span className="text-[10px] text-zinc-500 font-medium">Spiritual purpose & soul path</span>
                        </div>
                    </div>
                )}

                {/* Merged Grid: Vertex, EP, GC, Sun/Moon */}
                <DataGrid items={[
                    { label: 'Vertex (Vx)', value: fmt(data.angles?.Vertex), sub: 'Fated Encounters' },
                    { label: 'East Point', value: fmt(data.angles?.EastPoint), sub: 'Equatorial Ascendant' },
                    { label: 'Galactic Center', value: fmt(data.extras?.galactic_center), sub: 'Cosmic Homing Signal' },
                    { label: 'Sun/Moon Midpoint', value: data.midpoints ? `${data.midpoints['Sun/Moon']?.toFixed(2)}°` : 'N/A', sub: 'Inner Integration' }
                ]} />
            </div>
        </div>
    );
};

export const DeepDiveAnalysis = ({ data, viewPerspective, hideSignatures = false, vedicData }: AstrologyDiveProps) => {
    return (
        <div className="w-full animate-fade-in-up flex flex-col gap-10">
            {!hideSignatures && <ChartSignatures data={data} viewPerspective={viewPerspective} />}
            <DeepDiveMetrics data={data} viewPerspective={viewPerspective} />
        </div>
    );
};

// Enhanced Harmonic Charts with System & Perspective Toggles
interface HarmonicProps {
    westernData: ChartData;
    vedicData?: any;
    viewPerspective?: 'geocentric' | 'topocentric';
    onPerspectiveChange?: (p: 'geocentric' | 'topocentric') => void;
}

export const HarmonicCharts = ({ westernData, vedicData, viewPerspective = 'geocentric', onPerspectiveChange }: HarmonicProps) => {
    const [system, setSystem] = useState<'western' | 'vedic'>('western');
    const [localPerspective, setLocalPerspective] = useState<'geocentric' | 'topocentric'>(viewPerspective);

    // Sync local perspective if prop changes (optional, but good for parent control)
    React.useEffect(() => {
        setLocalPerspective(viewPerspective);
    }, [viewPerspective]);

    const handlePerspectiveClick = (p: 'geocentric' | 'topocentric') => {
        setLocalPerspective(p);
        if (onPerspectiveChange) {
            onPerspectiveChange(p);
        }
    };

    // specific data selection
    const activeData = system === 'vedic' && vedicData ? vedicData : westernData;
    const isVedicAvailable = !!vedicData;

    if (!activeData || !activeData.harmonics) return null;

    // Helper: Logic to derive precise Moon position based on Local Toggle
    const getMoonPosition = () => {
        // 0. Calculate Ayanamsa Delta (Tropical - Vedic) using current active points
        // Assumption: Both westernData and vedicData are in the same 'Perspective' state (Global Toggle)
        // so the difference between them reflects the Ayanamsa correctly.
        const wMoon = westernData.points.Moon?.abs_deg || 0;
        const vMoon = vedicData?.points?.Moon?.abs_deg || 0;

        let delta = wMoon - vMoon;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        // 1. Handle Explicit Perspective Lookups securely from 'moon_detailed'
        // This bypasses any 'patching' done by parent components on the main points.
        const variants = westernData.moon_detailed?.variants;

        if (localPerspective === 'topocentric' && variants?.topocentric) {
            const val = variants.topocentric.abs_deg;
            return system === 'vedic' ? (val - delta + 360) % 360 : val;
        }

        if (localPerspective === 'geocentric' && variants?.geocentric) {
            const val = variants.geocentric.abs_deg;
            return system === 'vedic' ? (val - delta + 360) % 360 : val;
        }

        // 2. Fallback: Use the data as-is from the active set
        // This usually means inheriting the Global setting.
        return activeData.points.Moon?.abs_deg || 0;
    };

    const renderChart = (title: string, harmonicKey: 'h5' | 'h7' | 'h9', multiplier: number) => (
        <div className="bg-black/80 p-6 rounded-2xl border border-white/5 shadow-xl hover:border-white/10 transition-all">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.25em] mb-5 flex items-center gap-2 border-b border-white/5 pb-3">
                {title}
            </h4>
            <div className="space-y-3">
                {Object.entries(activeData.harmonics[harmonicKey] || {}).map(([name, deg]: any) => {
                    // Filter out non-planets if needed, or keep all
                    const originalDeg = Number(deg);

                    let finalAbsDeg = originalDeg;

                    // Special Handling for Moon
                    if (name === 'Moon') {
                        // We must recalculate the harmonic position from scratch using our High Precision Moon
                        // originalDeg is based on standard Engine run (Geo).
                        const preciseMoon = getMoonPosition(); // This returns Absolute Degree (0-360)

                        // Harmonic Formula: (AbsDeg * Multiplier) % 360
                        finalAbsDeg = (preciseMoon * multiplier) % 360;
                    }

                    return (
                        <div key={name} className="flex justify-between items-center text-sm py-2 border-b border-white/[0.03] last:border-0 group">
                            <span className="text-zinc-500 font-bold group-hover:text-zinc-400 transition-colors text-xs uppercase tracking-wider">{name}</span>
                            <span className="text-zinc-200 font-mono font-medium">{toSignDegree(finalAbsDeg)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <SectionCard title="Harmonic Sub-Charts" icon={Star}>
            <div className="flex flex-col gap-6">
                {/* Control Bar (Integrated) */}
                <div className="flex justify-center">
                    <AstrologyControls
                        system={system}
                        setSystem={setSystem}
                        viewPerspective={localPerspective}
                        setViewPerspective={handlePerspectiveClick}
                        vedicDisabled={!isVedicAvailable}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderChart(system === 'western' ? 'H5: Quintile (Creative)' : 'D5: Panchamsha (Legacy)', 'h5', 5)}
                    {renderChart(system === 'western' ? 'H7: Septile (Destiny)' : 'D7: Saptamsha (Progeny)', 'h7', 7)}
                    {renderChart(system === 'western' ? 'H9: Novile (Growth)' : 'D9: Navamsha (Spiritual)', 'h9', 9)}
                </div>
            </div>
        </SectionCard>
    );
};

// Deprecated default for backward compat temporarily, but page.tsx should update
export const AstrologyDive = DeepDiveAnalysis;
