'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChartData, PointData } from '@/utils/astrology/types';
import { SYMBOLS } from '@/components/Astrology/chart-utils';
import { calculateDignity, calculateD9Chart, ZODIAC_SIGNS } from '@/utils/astrology/vedic-calc';
import { formatVedicDegree } from './VedicUtils';
import { NorthIndianChart } from './NorthIndianChart';
import { SouthIndianChart } from './SouthIndianChart';
import { VimshottariDasha } from './VimshottariDasha';
import { Star, ChevronDown, Layers, Crosshair } from 'lucide-react';

interface Props {
    data: ChartData;
}

export const VedicChartDisplay: React.FC<Props> = ({ data }) => {
    const [varga, setVarga] = useState<'D1' | 'D9'>('D1');
    const [style, setStyle] = useState<'north' | 'south'>('north'); // Default to North based on user focus
    const [showSymbols, setShowSymbols] = useState(true);
    const [showTruePositions, setShowTruePositions] = useState(false);
    const [activeTab, setActiveTab] = useState<'positions' | 'dasha' | 'yogas'>('positions');



    // Calculate D9 Navamsa Chart
    const d9Data = useMemo(() => {
        // We use the calculateD9Chart helper which transforms all points/angles
        const d9Points = calculateD9Chart(data.points);
        return {
            ...data,
            points: d9Points,
            // Angles are also normalized into points by the engine/normalize helper
        };
    }, [data]);

    const activeData = varga === 'D1' ? data : d9Data;


    // Calculate Atmakaraka (Soul Planet)
    // Planet with highest degree among Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
    const atmakaraka = useMemo(() => {
        const candidates = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
        let maxDeg = -1;
        let ak = '';

        candidates.forEach(planet => {
            const p = activeData.points[planet];
            if (!p) return;
            // Use degree within sign (0-30) + minutes
            // PointData has deg and min
            const val = p.deg + (p.min / 60);
            if (val > maxDeg) {
                maxDeg = val;
                ak = planet;
            }
        });
        return ak;
    }, [activeData]);

    return (
        <div className="w-full p-2">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Chart + Controls (7 cols) */}
                <div className="xl:col-span-7 flex flex-col gap-4">
                    {/* Main Chart Card */}
                    <div className="relative w-full aspect-square xl:aspect-auto xl:min-h-[800px] bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-4 md:p-8 pb-12 shadow-2xl overflow-visible flex flex-col">

                        {/* Background Ambiance */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,40,250,0.03),transparent_60%)] pointer-events-none" />

                        {/* Header Row (Absolute Top) */}
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-0">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-2xl font-light tracking-wide text-[var(--text-primary)] flex items-center gap-2 font-display">
                                    Vedic Perspectives
                                </h3>

                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                {/* Divisional Toggle */}
                                <div className="relative group z-30">
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0f0f16] border border-white/10 rounded-full hover:bg-white/5 transition-all group-hover:border-purple-500/30">
                                        <Layers size={14} className="text-purple-300" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 min-w-[80px] text-center">
                                            {varga === 'D1' ? 'Rasi (D1)' : 'Navamsa (D9)'}
                                        </span>
                                        <ChevronDown size={12} className="text-zinc-500 group-hover:text-purple-300 transition-colors" />
                                    </button>
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#0f0f16] border border-white/10 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                                        <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Divisional Charts</div>
                                        <button onClick={() => setVarga('D1')} className="w-full text-left px-4 py-3 text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between group/item">
                                            <span>Rasi (D1)</span>
                                            {varga === 'D1' && <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />}
                                        </button>
                                        <button onClick={() => setVarga('D9')} className="w-full text-left px-4 py-3 text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between group/item">
                                            <span>Navamsa (D9)</span>
                                            {varga === 'D9' && <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="w-px h-6 bg-white/10" />

                                {/* Style Toggle */}
                                <div className="flex bg-black/40 p-0.5 rounded-full border border-white/10">
                                    <button onClick={() => setStyle('north')} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${style === 'north' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>North</button>
                                    <button onClick={() => setStyle('south')} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${style === 'south' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>South</button>
                                </div>

                                <div className="w-px h-6 bg-white/10" />

                                {/* Symbol/Text Toggle */}
                                <div className="flex bg-black/40 p-0.5 rounded-full border border-white/10">
                                    <button onClick={() => setShowSymbols(true)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${showSymbols ? 'bg-purple-500/20 text-purple-200' : 'text-zinc-500 hover:text-zinc-300'}`}>Glyphs</button>
                                    <button onClick={() => setShowSymbols(false)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${!showSymbols ? 'bg-blue-500/20 text-blue-200' : 'text-zinc-500 hover:text-zinc-300'}`}>Text</button>
                                </div>

                                <div className="w-px h-6 bg-white/10" />

                                {/* True Positions Toggle */}
                                <button
                                    onClick={() => setShowTruePositions(!showTruePositions)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${showTruePositions
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                        : 'bg-white/5 text-zinc-500 border border-white/10 hover:bg-white/10 hover:text-zinc-300'
                                        }`}
                                    title={showTruePositions ? 'Showing precise positions (DD° MM\')' : 'Showing integer degrees (DD°)'}
                                >
                                    <div className="flex items-center gap-2">
                                        <Crosshair size={10} className={showTruePositions ? 'animate-pulse' : 'opacity-50'} />
                                        <span>{showTruePositions ? 'TRUE POS: ON' : 'TRUE POS: OFF'}</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 flex items-center justify-center py-6 pb-12 relative z-0 px-4">
                            <motion.div
                                key={`${style}-${varga}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="w-full max-w-[720px] grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                            >
                                {style === 'south' ? (
                                    <SouthIndianChart
                                        data={activeData}
                                        showSymbols={showSymbols}
                                        showTruePositions={showTruePositions}
                                    />
                                ) : (
                                    <NorthIndianChart
                                        data={activeData}
                                        showSymbols={showSymbols}
                                        showTruePositions={showTruePositions}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Graha Sphutas (Fixed Details) (5 cols) */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                    <div className="flex-1 flex flex-col bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl overflow-hidden shadow-xl min-h-[500px] xl:min-h-[700px]">
                        {/* Tab Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-black/20">
                            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 w-full">
                                <button
                                    onClick={() => setActiveTab('positions')}
                                    className={`flex-1 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'positions' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    Sphutas
                                </button>
                                <button
                                    onClick={() => setActiveTab('dasha')}
                                    className={`flex-1 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'dasha' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    Dasha
                                </button>
                                <button
                                    onClick={() => setActiveTab('yogas')}
                                    className={`flex-1 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'yogas' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    Yogas
                                </button>
                            </div>
                        </div>

                        <div className="relative flex-1 overflow-hidden">
                            {activeTab === 'positions' && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute inset-0 flex flex-col">
                                    <div className="grid grid-cols-12 px-6 py-5 bg-white/5 text-[11px] uppercase tracking-widest text-zinc-400 font-bold border-b border-white/5">
                                        <div className="col-span-4 pl-2">Graha</div>
                                        <div className="col-span-2">Sign</div>
                                        <div className="col-span-2 text-right">Deg</div>
                                        <div className="col-span-1 text-center pr-2">House</div>
                                        <div className="col-span-3 text-right pr-2">Nakshatra</div>
                                    </div>
                                    <div className="overflow-y-auto custom-scrollbar flex-1 p-3 space-y-1">
                                        {['Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].map((key, i) => {
                                            const p = activeData.points[key] || (key === 'Ascendant' ? activeData.angles.Ascendant : null);
                                            if (!p) return null;

                                            // Re-calculate sign index and degrees from abs_deg to ensure sidereal accuracy
                                            const degInSign = p.abs_deg % 30;
                                            const d = Math.floor(degInSign);
                                            const m = Math.floor((degInSign - d) * 60);

                                            // Recalculate house (Whole Sign)
                                            const ascSign = activeData.points['Ascendant']?.sign || activeData.angles?.Ascendant?.sign;
                                            const ascIdx = ZODIAC_SIGNS.indexOf(ascSign || 'Aries');
                                            const signIdx = ZODIAC_SIGNS.indexOf(p.sign);
                                            let house = ((signIdx - ascIdx + 12) % 12) + 1;

                                            const isAK = key === atmakaraka;

                                            const isOdd = i % 2 === 0;
                                            return (
                                                <div key={key} className={`relative group grid grid-cols-12 items-center px-4 py-5 rounded-lg transition-all ${isOdd ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.06] border border-transparent hover:border-white/5`}>
                                                    <div className="col-span-4 flex items-center gap-2 pl-1">
                                                        {isAK && (
                                                            <div className="text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1 rounded-sm" title="Atmakaraka (Soul Planet)">
                                                                AK
                                                            </div>
                                                        )}
                                                        <span className={`font-bold ${key === 'Ascendant' ? 'text-purple-300' : 'text-zinc-100'} ${showSymbols ? 'text-xl' : 'text-base'}`} style={showSymbols ? { fontFamily: '"Segoe UI Symbol", serif' } : {}}>
                                                            {showSymbols ? (SYMBOLS[key] || key) : (key === 'Ascendant' ? 'Asc' : key)}
                                                        </span>
                                                    </div>
                                                    <div className={`col-span-2 text-zinc-300 ${showSymbols ? 'text-lg' : 'text-sm font-serif'}`} style={showSymbols ? { fontFamily: '"Segoe UI Symbol", serif' } : {}}>
                                                        {showSymbols ? (SYMBOLS[p.sign] || p.sign.slice(0, 3)) : p.sign.slice(0, 3)}
                                                    </div>
                                                    <div className="col-span-2 text-right font-mono text-white/90 font-bold tabular-nums text-sm">
                                                        {`${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}`}
                                                    </div>
                                                    <div className="col-span-1 text-center text-cyan-300 font-mono text-sm font-bold">
                                                        H{house}
                                                    </div>
                                                    <div className="col-span-3 text-right text-zinc-400 text-xs truncate pl-2 font-medium">
                                                        {p.nakshatra || '-'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'dasha' && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute inset-0">
                                    <div className="h-full p-2">
                                        <VimshottariDasha
                                            moonAbsDeg={(activeData.points['Moon'] || activeData.points['MOON'])?.abs_deg || 0}
                                            birthDate={data.meta.utc_time}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'yogas' && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                                    {(!data.yogas || data.yogas.length === 0) ? (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                                            <Star size={32} className="opacity-20" />
                                            <p className="text-xs uppercase tracking-widest text-center">No Major Yogas Detected</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {data.yogas.map((yoga, i) => (
                                                <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-xl hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-2 opacity-50">
                                                        {yoga.intensity === 'Major' && <Star size={12} className="text-amber-400" />}
                                                    </div>
                                                    <h4 className="text-amber-200 font-bold text-sm mb-1">{yoga.name}</h4>
                                                    <p className="text-zinc-400 text-xs leading-relaxed mb-2">{yoga.description}</p>
                                                    <p className="text-zinc-500 text-[10px] italic border-t border-white/5 pt-2 mt-2">"{yoga.effects}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};
