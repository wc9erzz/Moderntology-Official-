'use client';
import React, { useState } from 'react';
import { InteractiveNatalChart } from './InteractiveNatalChart';
import { normalizeChartData, SYMBOLS, ASPECT_CONFIG, ORB_LIMITS } from './chart-utils';
import { AlertTriangle, Activity, Crosshair, Star, Info, LayoutTemplate, Zap, Triangle, Layers, Hexagon, RefreshCcw } from 'lucide-react';
import { detectChartPatterns } from '@/utils/astrology/pattern-detection';
import { ChartLegend } from './ChartLegend';

// Helper to render dynamic icons
const PatternIcon = ({ icon, color }: { icon: string, color: string }) => {
    switch (icon) {
        case 'Triangle': return <Triangle size={14} style={{ fill: color, stroke: color }} />;
        case 'Zap': return <Zap size={14} style={{ fill: color, stroke: color }} />;
        case 'Layers': return <Layers size={14} style={{ color: color }} />;
        default: return <Star size={14} style={{ fill: color, stroke: color }} />;
    }
};

export function AstrologyChartDashboard({
    chartData: rawData,
    showExtraPoints,
    setShowExtraPoints,
    showNodeSignatures,
    setShowNodeSignatures,
    selectedId,
    setSelectedId,
    orbStrictness = 'standard'
}: {
    chartData: any;
    showExtraPoints?: boolean;
    setShowExtraPoints?: (show: boolean) => void;
    showNodeSignatures?: boolean;
    setShowNodeSignatures?: (show: boolean) => void;
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    orbStrictness?: 'strict' | 'standard' | 'wide';
}) {
    const chartData = React.useMemo(() => normalizeChartData(rawData), [rawData]);

    // Local State
    const [showTruePositions, setShowTruePositions] = useState(false);
    const [displayMode, setDisplayMode] = useState<'glyphs' | 'text'>('glyphs');
    const [activeTab, setActiveTab] = useState<'signatures' | 'key'>('signatures');

    // Detect Patterns
    const patterns = React.useMemo(() =>
        detectChartPatterns(chartData, { allowNodes: showNodeSignatures }),
        [chartData, showNodeSignatures]
    );

    // Filter patterns
    const activePatterns = React.useMemo(() => {
        let currentPatterns = patterns;
        if (selectedId) {
            currentPatterns = patterns.filter(p => p.planets.includes(selectedId));
        }

        // Default Signatures (Sun Essence)
        if (!selectedId && currentPatterns.length < 3) {
            const sun = chartData.points['Sun'];
            if (sun && sun.house) {
                currentPatterns = [{
                    id: 'core-essence',
                    type: 'Vital Essence',
                    description: `Your core purpose (Sun) shines in the ${sun.house}th House.`,
                    planets: ['Sun'],
                    style: {
                        color: '#FFD700',
                        icon: 'Fingerprint',
                        gradient: 'from-yellow-500/20 via-orange-500/10 to-transparent',
                        borderColor: 'border-yellow-500/30'
                    }
                }, ...currentPatterns] as any;
            }
        }
        return currentPatterns;
    }, [patterns, selectedId, chartData]);

    const activeItem = React.useMemo(() => {
        if (!selectedId) return null;
        const point = chartData.points[selectedId];
        if (!point) return null;
        return { id: selectedId, data: point };
    }, [selectedId, chartData]);

    // Robustness Check
    if (!chartData || !chartData.points || Object.keys(chartData.points).length === 0) {
        return (
            <div className="w-full h-[500px] flex flex-col items-center justify-center bg-[var(--bg-card)] rounded-xl border border-red-500/20 text-red-200">
                <AlertTriangle className="w-10 h-10 mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Chart Data Unavailable</h3>
                <p className="text-sm opacity-60">The planetary data could not be loaded.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* LEFT: CHART VISUALIZATION */}
                <div className="xl:col-span-8 order-1 flex flex-col">
                    <div className="flex-grow bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-2 md:p-6 pb-12 relative overflow-visible flex flex-col items-center justify-center shadow-2xl min-h-[500px] xl:h-[850px]">

                        {/* Chart Header */}
                        <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 pointer-events-none">
                            <h2 className="text-[var(--text-primary)] text-xl md:text-2xl font-light tracking-wide">Natal Chart</h2>
                            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs uppercase tracking-widest bg-[var(--bg-card)] border border-[var(--border-card)] px-2 py-1 rounded-full w-fit pointer-events-auto">
                                <Star size={10} />
                                <span>{chartData.meta?.house_system || 'Placidus'} System</span>
                            </div>
                        </div>

                        {/* Top Right Controls */}
                        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                            {selectedId && (
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs uppercase tracking-wider transition-all border border-[var(--border-card)] mr-8"
                                >
                                    <RefreshCcw size={12} />
                                    <span className="hidden md:inline">Reset View</span>
                                </button>
                            )}
                        </div>



                        {/* Bottom Left Controls: Glyph/Text Toggle */}
                        <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start gap-2">
                            <button
                                onClick={() => setDisplayMode(displayMode === 'glyphs' ? 'text' : 'glyphs')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border shadow-lg ${displayMode === 'text'
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-card)] hover:text-white'
                                    }`}
                            >
                                <LayoutTemplate size={12} className={displayMode === 'text' ? 'animate-pulse' : 'opacity-50'} />
                                <span className="hidden md:inline">Mode: {displayMode === 'text' ? 'TEXT' : 'GLYPHS'}</span>
                            </button>
                        </div>

                        {/* Bottom Right Controls */}
                        <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-2">
                            <button
                                onClick={() => setShowTruePositions(!showTruePositions)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border shadow-lg ${showTruePositions
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-card)] hover:text-white'
                                    }`}
                            >
                                <Crosshair size={12} className={showTruePositions ? 'animate-pulse' : 'opacity-50'} />
                                <span className="hidden md:inline">True Pos: {showTruePositions ? 'ON' : 'OFF'}</span>
                            </button>

                            <button
                                onClick={() => setShowNodeSignatures?.(!showNodeSignatures)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border shadow-lg ${showNodeSignatures
                                    ? 'bg-purple-500/30 text-purple-100 border-purple-400/50'
                                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-card)] hover:text-white'
                                    }`}
                            >
                                <Activity size={12} className={showNodeSignatures ? 'animate-pulse' : ''} />
                                <span className="hidden md:inline">Node Signatures: {showNodeSignatures ? 'ON' : 'OFF'}</span>
                            </button>
                        </div>

                        {/* The Chart */}
                        <div className="w-full h-full flex items-center justify-center relative z-0">
                            <InteractiveNatalChart
                                key={`${chartData.meta?.system}-${chartData.meta?.house_system}`}
                                data={chartData}
                                onSelect={(item) => setSelectedId(item.id)}
                                patterns={activePatterns}
                                selectedId={selectedId}
                                showExtraPoints={showExtraPoints}
                                showNodeSignatures={showNodeSignatures}
                                showTruePositions={showTruePositions}
                                orbStrictness={orbStrictness}
                                displayMode={displayMode}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: INSIGHTS & DETAILS */}
                <div className="xl:col-span-4 order-2 flex flex-col gap-6 xl:h-[850px]">

                    {/* TOP CARD: Signature / Key */}
                    <div className={`bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl shadow-lg relative flex flex-col overflow-hidden min-h-[200px] transition-all duration-300 ${selectedId ? 'flex-[0.4]' : 'flex-1'}`}>
                        <div className="flex-none bg-black/20 border-b border-[var(--border-card)] px-4 pt-4 pb-3 z-10">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveTab('signatures')}
                                    className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${activeTab === 'signatures' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-zinc-300'}`}
                                >
                                    <Hexagon size={16} /> Signatures
                                </button>
                                <div className="h-4 w-[1px] bg-[var(--border-card)]" />
                                <button
                                    onClick={() => setActiveTab('key')}
                                    className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${activeTab === 'key' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-zinc-300'}`}
                                >
                                    <LayoutTemplate size={16} /> Key
                                </button>
                            </div>
                        </div>

                        {/* CONTENT: Signatures */}
                        {activeTab === 'signatures' && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 animate-fade-in-right">
                                {activePatterns.length > 0 ? (
                                    activePatterns.map((pat) => (
                                        <div key={pat.id} className={`p-4 rounded-xl border transition-all bg-gradient-to-r ${pat.style.gradient} ${pat.style.borderColor}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <PatternIcon icon={pat.style.icon} color={pat.style.color} />
                                                    <span className="font-bold text-sm" style={{ color: pat.style.color }}>{pat.type}</span>
                                                </div>
                                            </div>
                                            <p className="text-[var(--text-primary)] opacity-90 text-sm leading-relaxed font-light mb-2">{pat.description}</p>
                                        </div>
                                    ))
                                ) : <div className="text-[var(--text-secondary)] text-sm italic text-center py-8">No major signatures detected.</div>}
                            </div>
                        )}

                        {/* CONTENT: Key */}
                        {activeTab === 'key' && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 animate-fade-in-right">
                                <ChartLegend />
                            </div>
                        )}
                    </div>

                    {/* BOTTOM CARD: Selected Insight */}
                    <div className={`bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col min-h-0 transition-all duration-300 ${selectedId ? 'flex-[0.6]' : 'flex-[0.2]'}`}>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-70" />

                        {activeItem ? (
                            <div className="animate-fade-in-right h-full flex flex-col overflow-y-auto custom-scrollbar pr-2">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-3xl font-light text-[var(--text-primary)] tracking-tight mb-1">{activeItem.id}</h2>
                                        <div className="text-[var(--accent-primary)] text-sm tracking-widest uppercase font-bold flex items-center gap-2">
                                            <span>{activeItem.data.sign}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                                            <span>{activeItem.data.house}H</span>
                                        </div>
                                    </div>
                                    <div className="text-6xl text-[var(--text-primary)] opacity-90 filter-glow font-symbol">{SYMBOLS[activeItem.id] || '?'}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <InfoItem
                                        label="Position"
                                        value={`${Math.floor(activeItem.data.deg)}° ${Math.floor(activeItem.data.min).toString().padStart(2, '0')}'`}
                                    />
                                    <InfoItem label="House" value={`${activeItem.data.house}`} suffix="th" />
                                </div>

                                <div className="space-y-3 mb-6">
                                    <h4 className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-bold">Aspects</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {chartData.aspects
                                            .filter((asp: any) => (asp.p1 === activeItem.id || asp.p2 === activeItem.id) &&
                                                (showNodeSignatures || !['North Node', 'South Node'].some(n => [asp.p1, asp.p2].includes(n))))
                                            .sort((a: any, b: any) => a.orb - b.orb)
                                            .map((asp: any, i: number) => {
                                                const otherId = asp.p1 === activeItem.id ? asp.p2 : asp.p1;
                                                const config = ASPECT_CONFIG[asp.type] || { symbol: '?', color: '#888' };
                                                const isGhost = asp.orb > (ORB_LIMITS[orbStrictness] as any)[asp.type];

                                                return (
                                                    <div key={i} className={`flex items-center gap-2 px-3 py-2 bg-[var(--bg-card)] rounded-lg border text-sm ${isGhost ? 'border-dashed opacity-60' : 'border-[var(--border-card)]'}`}>
                                                        <span style={{ color: config.color }} className="font-bold text-base">{config.symbol}</span>
                                                        <span className="text-[var(--text-secondary)] font-medium">{otherId}</span>
                                                        <span className="text-[var(--text-secondary)] text-xs">({asp.orb.toFixed(1)}°)</span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>

                                <div className="mt-auto p-4 bg-[var(--bg-card-hover)] rounded-xl border border-[var(--border-card)]">
                                    <div className="flex items-center gap-2 mb-2 text-[var(--accent-secondary)] text-xs uppercase tracking-wider font-bold">
                                        <Info size={14} /> <span>Insight</span>
                                    </div>
                                    <p className="text-[var(--text-primary)] opacity-90 leading-relaxed font-light text-sm">
                                        {activeItem.id} in {activeItem.data.sign} represents a unique energetic signature in your chart.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] space-y-4">
                                <Crosshair className="w-12 h-12 opacity-30" />
                                <div className="text-center">
                                    <p className="text-base font-light">Details Viewer</p>
                                    <p className="text-xs font-bold tracking-widest uppercase opacity-50">Select a Planet</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style jsx global>{`
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(10px) scale(0.98); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .filter-glow { filter: drop-shadow(0 0 8px rgba(255,255,255,0.4)); }
            `}</style>
        </div >
    );
}

function InfoItem({ label, value, suffix }: { label: string, value: string | number, suffix?: string }) {
    return (
        <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-card)]">
            <div className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider mb-1 font-bold">{label}</div>
            <div className="text-lg font-mono text-[var(--text-primary)]">
                {value}<span className="text-sm align-top opacity-50 ml-0.5">{suffix}</span>
            </div>
        </div>
    );
}
