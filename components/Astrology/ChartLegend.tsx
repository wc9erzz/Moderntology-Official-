'use client';

import React from 'react';
import { ASPECT_CONFIG } from './chart-utils';

const PLANET_MEANINGS = [
    { symbol: '☉', name: 'Sun', meaning: 'Core Self, Ego, Vitality' },
    { symbol: '☽', name: 'Moon', meaning: 'Emotions, Instincts, Inner World' },
    { symbol: 'AC', name: 'Ascendant', meaning: 'Mask, First Impressions, Appearance' },
    { symbol: '☿', name: 'Mercury', meaning: 'Communication, Intellect' },
    { symbol: '♀', name: 'Venus', meaning: 'Love, Beauty, Values' },
    { symbol: '♂', name: 'Mars', meaning: 'Action, Desire, Energy' },
    { symbol: '♃', name: 'Jupiter', meaning: 'Growth, Abundance, Luck' },
    { symbol: '♄', name: 'Saturn', meaning: 'Structure, Discipline, Karma' },
    { symbol: '♅', name: 'Uranus', meaning: 'Innovation, Rebellion' },
    { symbol: '♆', name: 'Neptune', meaning: 'Dreams, Illusion, Spirit' },
    { symbol: '♇', name: 'Pluto', meaning: 'Transformation, Power' },
];

export function ChartLegend({ className = '', showExpertSignatures = false }: { className?: string, showExpertSignatures?: boolean }) {
    const BASIC_ASPECTS = ['Conjunction', 'Opposition', 'Square', 'Trine', 'Sextile', 'Parallel'];

    return (
        <div className={`pr-0 ${className}`}>

            {/* Educational Intro: The Ideology */}
            <div className="mb-6 pb-6 border-b border-white/5 space-y-4">
                <h3 className="text-white/90 text-sm font-medium uppercase tracking-widest">Chart Anatomy</h3>

                {/* Core Concepts */}
                <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <span className="text-indigo-300 font-bold block text-xs uppercase mb-1">Planets (What)</span>
                        <p className="text-xs text-indigo-100/70">The actors or psychological functions (e.g., &quot;The Warrior&quot;).</p>
                    </div>
                    <div className="p-3 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 rounded-lg">
                        <span className="text-[var(--color-accent)] font-bold block text-xs uppercase mb-1">Signs (How)</span>
                        <p className="text-[var(--text-muted)] opacity-70 text-xs">The costumes or styles they wear (e.g., &quot;Impulsive&quot;).</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <span className="text-emerald-300 font-bold block text-xs uppercase mb-1">Houses (Where)</span>
                        <p className="text-xs text-emerald-100/70">The stage or area of life where it happens (e.g., &quot;Career&quot;).</p>
                    </div>
                </div>
            </div>

            {/* The Big Three */}
            <div className="mb-6 pb-6 border-b border-white/5">
                <h4 className="text-xs uppercase tracking-wider text-amber-300 mb-3 font-semibold">The Big Three</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg border border-amber-500/10">
                        <span className="text-xl w-6 text-center text-amber-200">☉</span>
                        <div>
                            <span className="text-sm text-amber-100 font-medium block">Sun</span>
                            <span className="text-[10px] text-amber-200/60 uppercase tracking-wider">Your Essence</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/10">
                        <span className="text-xl w-6 text-center text-blue-200">☽</span>
                        <div>
                            <span className="text-sm text-blue-100 font-medium block">Moon</span>
                            <span className="text-[10px] text-blue-200/60 uppercase tracking-wider">Your Inner World</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-zinc-500/10 to-transparent rounded-lg border border-zinc-500/10">
                        <span className="text-xl w-6 text-center text-zinc-200">AC</span>
                        <div>
                            <span className="text-sm text-zinc-100 font-medium block">Rising</span>
                            <span className="text-[10px] text-zinc-200/60 uppercase tracking-wider">Your Appearance</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Planets Section */}
                <div>
                    <h4 className="text-xs uppercase tracking-wider text-blue-300 mb-3 font-semibold">Planetary Symbols</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {PLANET_MEANINGS.map((item) => (
                            <div key={item.name} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group">
                                <span className="text-xl w-6 text-center text-white/90 group-hover:text-blue-200 transition-colors bg-white/5 rounded">{item.symbol}</span>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-200 font-medium">{item.name}</span>
                                    <span className="text-[10px] text-gray-500">{item.meaning}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Aspects Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">Aspects (Geometry)</h4>
                        {!showExpertSignatures && <span className="text-[9px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-white/40">Basic View</span>}
                    </div>
                    <p className="text-[10px] text-gray-500 mb-2 italic">Colored lines linking planets.</p>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.entries(ASPECT_CONFIG)
                            .filter(([name]) => showExpertSignatures || BASIC_ASPECTS.includes(name))
                            .map(([name, conf]) => (
                                <div key={name} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                                    <div className="flex items-center justify-center w-8 h-8 rounded bg-white/5 relative">
                                        <span style={{ color: conf.color }} className="text-lg relative z-10">{conf.symbol}</span>
                                        <div className="absolute inset-0 opacity-10 rounded" style={{ backgroundColor: conf.color }}></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-200 font-medium flex items-center gap-2">
                                            {name}
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: conf.color }} />
                                            {!BASIC_ASPECTS.includes(name) && <span className="text-[9px] border border-white/10 px-1 rounded text-white/30 uppercase">Expert</span>}
                                        </span>
                                        <span className="text-[10px] text-gray-500 leading-tight">{conf.desc}</span>
                                    </div>
                                </div>
                            ))}

                        {/* Ghost Aspects Legend Item */}
                        <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5 mt-1 bg-white/[0.02]">
                            <div className="flex items-center justify-center w-8 h-8 rounded bg-white/5 relative border border-dashed border-white/20">
                                <div className="w-6 h-0.5 bg-gray-400 opacity-50 transform rotate-45" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-300 font-medium">Ghost Aspects</span>
                                <span className="text-[10px] text-gray-500 leading-tight">
                                    Impending alignments. <strong className="text-gray-400">Brighter/Lighter grey</strong> means closer to activation; <strong className="text-zinc-600">Darker</strong> means farther away.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signatures Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs uppercase tracking-wider text-purple-300 font-semibold">Signatures (Patterns)</h4>
                        {!showExpertSignatures && <span className="text-[9px] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-white/40">Basic Patterns</span>}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { id: 'Grand Trine', name: 'Grand Trine', desc: 'Harmonious Flow (Triangle)', tier: 'basic', color: '#fbbf24', icon: '△' },
                            { id: 'T-Square', name: 'T-Square', desc: 'Active Tension (Red Triangle)', tier: 'basic', color: '#f87171', icon: '⚡' },
                            { id: 'Stellium', name: 'Stellium', desc: 'Conc. Energy (Cluster)', tier: 'basic', color: '#818cf8', icon: '⧉' },
                            { id: 'Parallel Cluster', name: 'Parallel Cluster', desc: 'Declination Alignment', tier: 'basic', color: '#a855f7', icon: '=' },
                            { id: 'Contra-Parallel', name: 'Contra-Parallel', desc: 'Declination Balance', tier: 'basic', color: '#d946ef', icon: '≠' },

                            { id: 'Grand Cross', name: 'Grand Cross', desc: 'Intense Drive (Square)', tier: 'expert', color: '#ef4444', icon: '☒' },
                            { id: 'Yod', name: 'Yod', desc: 'Finger of God', tier: 'expert', color: '#a3e635', icon: 'Y' },
                            { id: 'Kite', name: 'Kite', desc: 'Directed Harmony', tier: 'expert', color: '#38bdf8', icon: '♦' },
                            { id: 'Mystic Rectangle', name: 'Mystic Rectangle', desc: 'Practical Mysticism', tier: 'expert', color: '#c084fc', icon: '▭' },
                            { id: 'Pentagram', name: 'Pentagram', desc: 'Creative Star (5-Point)', tier: 'expert', color: '#f472b6', icon: '★' },
                        ]
                            .filter(p => showExpertSignatures || p.tier === 'basic')
                            .map((p) => (
                                <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                                    <div className="flex items-center justify-center w-8 h-8 rounded bg-white/5 relative">
                                        <span style={{ color: p.color }} className="text-sm font-bold relative z-10">{p.icon}</span>
                                        <div className="absolute inset-0 opacity-10 rounded" style={{ backgroundColor: p.color }}></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-200 font-medium flex items-center gap-2">
                                            {p.name}
                                            {p.tier === 'expert' && <span className="text-[9px] border border-white/10 px-1 rounded text-white/30 uppercase">Expert</span>}
                                        </span>
                                        <span className="text-[10px] text-gray-500 leading-tight">{p.desc}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Houses Section */}
                <div>
                    <h4 className="text-xs uppercase tracking-wider text-green-300 mb-3 font-semibold">Houses (Life Areas)</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { n: '1', m: 'Self & Body' }, { n: '2', m: 'Money & Value' },
                            { n: '3', m: 'Mind & Comm' }, { n: '4', m: 'Home & Roots' },
                            { n: '5', m: 'Creativity' }, { n: '6', m: 'Health & Work' },
                            { n: '7', m: 'Relationships' }, { n: '8', m: 'Transformation' },
                            { n: '9', m: 'Philosophy' }, { n: '10', m: 'Career & Rep' },
                            { n: '11', m: 'Community' }, { n: '12', m: 'Subconscious' },
                        ].map(h => (
                            <div key={h.n} className="p-2 bg-white/5 rounded border border-white/5 text-xs">
                                <strong className="text-gray-300">{h.n}</strong> <span className="text-gray-500 block text-[10px]">{h.m}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
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
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
