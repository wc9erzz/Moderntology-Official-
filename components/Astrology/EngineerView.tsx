'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartData, PointData, SIGNS, SYMBOLS, getNakshatra, normalizeChartData, SIGN_COLORS, ASPECT_CONFIG, POINT_LABELS } from './chart-utils';

interface Props {
    data: any;
    system?: string;
    showExtraPoints?: boolean;
    selectedId?: string | null;
    onSelect?: (id: string) => void;
    showAspects?: boolean;
}

// South Indian Chart Fixed Layout
const SIGN_TO_GRID: Record<number, number> = {
    11: 0, 0: 1, 1: 2, 2: 3,   // Top Row
    10: 4, 3: 7,   // Middle Rows (Sides)
    9: 8, 4: 11,
    8: 12, 7: 13, 6: 14, 5: 15  // Bottom Row
};

const GRID_CELLS = [
    { gridIdx: 0, signIdx: 11 }, { gridIdx: 1, signIdx: 0 }, { gridIdx: 2, signIdx: 1 }, { gridIdx: 3, signIdx: 2 },
    { gridIdx: 4, signIdx: 10 }, { gridIdx: 7, signIdx: 3 },
    { gridIdx: 8, signIdx: 9 }, { gridIdx: 11, signIdx: 4 },
    { gridIdx: 12, signIdx: 8 }, { gridIdx: 13, signIdx: 7 }, { gridIdx: 14, signIdx: 6 }, { gridIdx: 15, signIdx: 5 },
];

export function EngineerView({ data, system, showExtraPoints = false, selectedId, onSelect, showAspects = false }: Props) {
    const chart = data.points ? data : normalizeChartData(data);

    // Find Ascendant Sign Index for House Calculation (Whole Sign)
    const ascP = Object.values(chart.points as Record<string, PointData>).find(p => p.name === 'Ascendant');
    const ascSignIdx = ascP ? SIGNS.indexOf(ascP.sign) : 0;

    const planetsBySign: Record<string, PointData[]> = {};
    Object.values(chart.points as Record<string, PointData>).forEach(p => {
        let shouldShow = false;
        if (p.type === 'planet' || p.name === 'Ascendant') {
            shouldShow = true;
        } else if ((p.type === 'node' || p.type === 'point') && showExtraPoints) {
            shouldShow = true;
        }
        if (!shouldShow) return;

        if (!planetsBySign[p.sign]) planetsBySign[p.sign] = [];
        planetsBySign[p.sign].push(p);
    });

    const getCenter = (gridIdx: number) => {
        const row = Math.floor(gridIdx / 4);
        const col = gridIdx % 4;
        return { x: col * 100 + 50, y: row * 100 + 50 };
    };

    const renderCell = (gridIdx: number, cornerClass: string = '') => {
        const cellMap = GRID_CELLS.find(c => c.gridIdx === gridIdx);

        if (!cellMap) {
            if (gridIdx === 5) {
                return (
                    <div className="text-center w-full h-full flex flex-col items-center justify-center col-span-2 row-span-2 bg-black/40">
                        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5 opacity-60 font-semibold text-center">Engineer View</div>
                        <div className="text-xl font-serif text-[var(--text-primary)] tracking-wide text-center">
                            {system === 'vedic' ? 'South Indian' : 'Tropical Layout'}
                        </div>
                        <div className={`mt-1.5 text-[9px] uppercase tracking-tighter font-bold text-center ${system === 'vedic' ? 'text-amber-500/50' : 'text-blue-400/50'}`}>
                            {system === 'vedic' ? 'Vedic System' : 'Western View'}
                        </div>
                    </div>
                );
            }
            return null;
        }

        const currentSignIdx = cellMap.signIdx;
        const houseNum = ((currentSignIdx - ascSignIdx + 12) % 12) + 1;

        const signName = SIGNS[cellMap.signIdx];
        const planets = planetsBySign[signName] || [];
        const isAsc = planets.some(p => p.name === 'Ascendant');
        const isSelected = selectedId && planets.some(p => p.name === selectedId);

        return (
            <div
                className={`
                    relative h-full w-full border-none bg-transparent backdrop-blur-sm p-2 flex flex-col gap-1 overflow-hidden group hover:bg-white/5 transition-all duration-300
                    ${isAsc ? 'ring-1 ring-inset ring-[var(--color-highlight)]/30 bg-[var(--color-highlight-dim)]' : ''}
                    ${isSelected ? 'bg-white/10 ring-1 ring-inset ring-white/30 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]' : ''}
                    ${cornerClass}
                `}
            >
                {/* House Number (Top Left) */}
                <div className="absolute top-1 left-2 text-xs font-black font-serif text-white opacity-90 group-hover:opacity-100 transition-opacity">
                    {houseNum}
                </div>

                {/* Sign Name (Top Right) - Updated to White */}
                <div className="absolute top-1 right-2 text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-sm">
                    {signName}
                </div>

                <div className="mt-1 w-full flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                    {planets.map((p, i) => (
                        <div
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onSelect) onSelect(p.name);
                            }}
                            className={`
                            flex items-center justify-between py-1 border-b border-white/10 last:border-0 
                            ${selectedId === p.name ? 'opacity-100 scale-[1.05] ring-1 ring-white/10 rounded-sm px-1 bg-white/10' : 'opacity-100 hover:bg-white/10'} 
                            transition-all bg-white/[0.02] mb-0.5 last:mb-0 cursor-pointer rounded-sm px-1
                        `}>
                            <div className="flex items-center gap-1.5">
                                <span style={{ fontFamily: '"Segoe UI Symbol", serif' }} className={`text-xl drop-shadow-md ${SIGN_COLORS[p.sign] || 'text-zinc-400'}`}>
                                    {SYMBOLS[p.name] || p.name.substring(0, 1)}
                                </span>
                                <span className={`${SIGN_COLORS[p.sign] || 'text-zinc-100'} text-[10px] font-black tracking-widest uppercase`}>
                                    {POINT_LABELS[p.name] || p.name.substring(0, 3).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-[10px] font-black font-mono text-white drop-shadow-sm">
                                {Math.floor(p.deg)}°
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full min-h-[600px] h-full mx-auto bg-black/90 border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
            <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
                {Array.from({ length: 16 }).map((_, i) => {
                    if (i === 6 || i === 9 || i === 10) return null;

                    let cornerClass = '';
                    if (i === 0) cornerClass = 'rounded-tl-2xl';
                    if (i === 3) cornerClass = 'rounded-tr-2xl';
                    if (i === 12) cornerClass = 'rounded-bl-2xl';
                    if (i === 15) cornerClass = 'rounded-br-2xl';

                    const isCenter = i === 5;

                    return (
                        <div
                            key={i}
                            className={`border border-white/5 h-full w-full ${isCenter ? 'col-span-2 row-span-2' : ''}`}
                        >
                            {renderCell(i, cornerClass)}
                        </div>
                    );
                })}
            </div>

            {/* SVG Overlay for Aspects */}
            {showAspects && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible" viewBox="0 0 400 400">
                    <AnimatePresence>
                        {chart.aspects?.map((asp: any, i: number) => {
                            const p1 = chart.points[asp.p1];
                            const p2 = chart.points[asp.p2];
                            if (!p1 || !p2) return null;

                            const sign1Idx = SIGNS.indexOf(p1.sign);
                            const sign2Idx = SIGNS.indexOf(p2.sign);
                            const g1 = SIGN_TO_GRID[sign1Idx];
                            const g2 = SIGN_TO_GRID[sign2Idx];

                            if (g1 === undefined || g2 === undefined) return null;

                            // PRECISION ANCHORING LOGIC
                            // Instead of cell center, we find the planet's row index in that cell
                            const getAnchor = (point: PointData, gridIdx: number) => {
                                const base = getCenter(gridIdx);
                                const planetsInSign = planetsBySign[point.sign] || [];
                                const pIdx = planetsInSign.findIndex(px => px.name === point.name);

                                if (pIdx === -1) return base;

                                // Calculate Y offset based on row position
                                // Cell is 100 units high. 
                                // Padding p-2 (approx 8 units), then mt-1 (4 units) for container
                                // Each row is py-1.5 (6 units) + text (~14 units).
                                // We center the line on the row's vertical midpoint.
                                const rowHeight = 24;
                                const topPadding = 18; // Offset for Sign label and container padding
                                const yOff = topPadding + (pIdx * rowHeight) + (rowHeight / 2);

                                // Adjust Y to be relative to cell top (base.y - 50)
                                return {
                                    x: base.x,
                                    y: (base.y - 50) + Math.min(yOff, 90) // Clamp to avoid bleeding out of cell
                                };
                            };

                            const c1 = getAnchor(p1, g1);
                            const c2 = getAnchor(p2, g2);

                            const config = ASPECT_CONFIG[asp.type] || { color: '#ffffff' };
                            let stroke = config.color;
                            let opacity = 0.6;
                            const isActive = selectedId === asp.p1 || selectedId === asp.p2;
                            const isSelectionActive = !!selectedId;

                            const displayOpacity = isSelectionActive ? (isActive ? opacity : 0.25) : opacity;
                            const displayColor = isSelectionActive && !isActive ? "rgba(100, 100, 100, 0.4)" : stroke;

                            return (
                                <motion.line
                                    key={`${asp.p1}-${asp.p2}-${asp.type}`}
                                    x1={c1.x}
                                    y1={c1.y}
                                    x2={c2.x}
                                    y2={c2.y}
                                    stroke={displayColor}
                                    strokeWidth={asp.is_ghost ? 2 : 3}
                                    strokeDasharray={asp.is_ghost ? "6,4" : "none"}
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: displayOpacity }}
                                    exit={{ pathLength: 0, opacity: 0 }}
                                    transition={{ duration: 1.8, ease: "easeInOut" }}
                                />
                            );
                        })}
                    </AnimatePresence>
                </svg>
            )}
        </div>
    );
}
