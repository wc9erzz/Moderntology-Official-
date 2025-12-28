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

export function ChartLegend({ className = '' }: { className?: string }) {
    return (
        <div className={`pr-0 ${className}`}>

            {/* Educational Intro: The Ideology */}
            <div className="mb-6 pb-6 border-b border-white/5 space-y-4">
                <h3 className="text-white/90 text-sm font-medium uppercase tracking-widest">Chart Anatomy</h3>

                {/* Core Concepts */}
                <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <span className="text-indigo-300 font-bold block text-xs uppercase mb-1">Planets (What)</span>
                        <p className="text-xs text-indigo-100/70">The actors or psychological functions (e.g., "The Warrior").</p>
                    </div>
                    <div className="p-3 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 rounded-lg">
                        <span className="text-[var(--color-accent)] font-bold block text-xs uppercase mb-1">Signs (How)</span>
                        <p className="text-[var(--text-muted)] opacity-70 text-xs">The costumes or styles they wear (e.g., "Impulsive").</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <span className="text-emerald-300 font-bold block text-xs uppercase mb-1">Houses (Where)</span>
                        <p className="text-xs text-emerald-100/70">The stage or area of life where it happens (e.g., "Career").</p>
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
                    <h4 className="text-xs uppercase tracking-wider text-[var(--color-accent)] mb-3 font-semibold">Aspects (Geometry)</h4>
                    <p className="text-[10px] text-gray-500 mb-2 italic">Colored lines linking planets.</p>
                    <div className="grid grid-cols-1 gap-2">
                        {Object.entries(ASPECT_CONFIG).map(([name, conf]) => (
                            <div key={name} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                                <div className="flex items-center justify-center w-8 h-8 rounded bg-white/5 relative">
                                    <span style={{ color: conf.color }} className="text-lg relative z-10">{conf.symbol}</span>
                                    <div className="absolute inset-0 opacity-10 rounded" style={{ backgroundColor: conf.color }}></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-200 font-medium flex items-center gap-2">
                                        {name}
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: conf.color }} />
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
