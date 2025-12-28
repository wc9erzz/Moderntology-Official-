'use client';

import React, { useState, useMemo } from 'react';
import { ChartData, PointData } from '@/utils/astrology/types';
import { SYMBOLS } from '@/components/Astrology/chart-utils';
import { calculateDignity } from '@/utils/astrology/vedic-calc';
import { formatVedicDegree, getNakshatraInfo, getVedicContext, ZODIAC_SIGNS, SIGN_RULERS } from './VedicUtils';

interface Props {
    data: ChartData;
    showSymbols?: boolean;
    showTruePositions?: boolean;
}

const VEDIC_PLANETS = ['Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

/**
 * South Indian Chart (Grid Style)
 * Standard layout: Signs are FIXED in position.
 */
export const SouthIndianChart: React.FC<Props> = ({
    data,
    showSymbols = true,
    showTruePositions = false
}) => {
    const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

    const { ascIndex } = useMemo(() => getVedicContext(data), [data]);

    // Group planets by sign
    const planetsBySign = useMemo(() => {
        const bySign: Record<number, PointData[]> = {};
        Object.values(data.points).forEach(p => {
            if (!VEDIC_PLANETS.includes(p.name)) return;
            const signIdx = ZODIAC_SIGNS.findIndex(s => s.toLowerCase() === p.sign.toLowerCase());
            if (signIdx === -1) return;
            const signNum = signIdx + 1;
            if (!bySign[signNum]) bySign[signNum] = [];
            bySign[signNum].push(p);
        });
        return bySign;
    }, [data.points]);

    /**
     * Grid Positioning (0-11)
     * Starts at Pisces (0,0) and proceeds clockwise.
     */
    const GRID_MAP = [
        { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 },
        { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 3, col: 3 }, { row: 3, col: 2 },
        { row: 3, col: 1 }, { row: 3, col: 0 }, { row: 2, col: 0 }, { row: 1, col: 0 }
    ];

    const renderCell = (idx: number) => {
        const pos = GRID_MAP[idx];

        // Logical sign mapping: idx 0 is Pisces, 1 is Aries...
        const signNum = idx === 0 ? 12 : idx;
        const signName = ZODIAC_SIGNS[signNum - 1];

        // House number relative to Ascendant
        const houseNum = (((signNum - 1) - ascIndex + 12) % 12) + 1;
        const isLagna = houseNum === 1;

        const planets = planetsBySign[signNum] || [];
        const planetCount = planets.length;

        // Dynamic Layout logic
        const isScrollMode = planetCount >= 3;
        const isGridMode = planetCount >= 2;

        // Define container class based on count
        let containerClass = "flex flex-wrap items-center justify-center content-center gap-1.5 flex-1 pt-6 pb-2";

        if (isScrollMode) {
            // 3+ Planets: Scrollable Grid
            containerClass = "grid grid-cols-2 gap-x-1 gap-y-2 items-start justify-items-center content-start w-full h-full overflow-y-auto custom-scrollbar pt-7 pb-1 px-0.5";
        } else if (isGridMode) {
            // 2 Planets: Static Grid (Centered)
            containerClass = "grid grid-cols-2 gap-1 items-center justify-items-center content-center flex-1 pt-6 pb-2 w-full h-full";
        }

        return (
            <div
                key={idx}
                className={`
                    relative bg-black/40 border border-white/5 flex flex-col p-1.5 h-full w-full overflow-hidden transition-all duration-500
                    ${isLagna ? 'bg-purple-500/5 ring-1 ring-inset ring-purple-500/20' : ''}
                    hover:bg-white/[0.03] hover:border-white/10
                `}
                style={{ gridRow: pos.row + 1, gridColumn: pos.col + 1 }}
            >
                {/* Header: Sign and House */}
                <div className="absolute top-1.5 left-2 flex flex-col z-10 pointer-events-none">
                    <span className="text-[11px] font-black text-white uppercase tracking-tighter leading-none opacity-100 drop-shadow-md">
                        {signName.slice(0, 3)}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-medium leading-none mt-0.5 opacity-50">
                        {SIGN_RULERS[signName].slice(0, 3)}
                    </span>
                </div>

                <div className="absolute top-1.5 right-2 z-10 pointer-events-none">
                    <span className={`text-[12px] font-black ${isLagna ? 'text-purple-400' : 'text-zinc-300'} drop-shadow-sm`}>
                        {isLagna ? 'ASC' : houseNum}
                    </span>
                </div>

                {/* Planets Container */}
                <div className={containerClass}>
                    {planets.map(p => (
                        <div key={p.name} className="relative flex justify-center items-center w-full">
                            <PlanetCell
                                planet={p}
                                showSymbols={showSymbols}
                                showTruePositions={showTruePositions}
                                isHovered={hoveredPlanet === p.name}
                                isFaded={hoveredPlanet !== null && hoveredPlanet !== p.name}
                                onHover={setHoveredPlanet}
                                compact={isScrollMode}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-[850px] mx-auto aspect-square bg-black border border-white/10 rounded-3xl overflow-visible shadow-2xl p-4 relative backdrop-blur-3xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,28,135,0.05),transparent_70%)] pointer-events-none" />

            <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-1">
                {/* Center Content */}
                <div className="col-start-2 col-span-2 row-start-2 row-span-2 flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-white/5 p-6 text-center group">
                    <div className="text-zinc-600 font-serif italic text-sm mb-1 group-hover:text-purple-300/40 transition-colors uppercase tracking-[0.2em]">
                        Sidereal Rasi
                    </div>
                    <div className="text-zinc-800 font-black text-2xl tracking-[0.2em] font-serif group-hover:text-purple-500/30 transition-colors uppercase">
                        South Indian
                    </div>
                </div>

                {/* Render all 12 cells */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0].map(renderCell)}
            </div>
        </div>
    );
};

interface PlanetCellProps {
    planet: PointData;
    showSymbols: boolean;
    showTruePositions: boolean;
    isHovered: boolean;
    isFaded: boolean;
    onHover: (name: string | null) => void;
    compact?: boolean;
}

const PlanetCell: React.FC<PlanetCellProps> = ({ planet, showSymbols, showTruePositions, isHovered, isFaded, onHover, compact }) => {
    const dignity = calculateDignity(planet.name, planet.sign);
    const nakshatra = getNakshatraInfo(planet.abs_deg || 0);
    const active = showTruePositions || isHovered;
    const isNode = planet.name === 'Rahu' || planet.name === 'Ketu' || planet.name === 'North Node' || planet.name === 'South Node';

    let colorClass = 'text-zinc-200';
    let glow = '';

    if (dignity === 'Exalted') {
        colorClass = 'text-emerald-400';
        glow = 'drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]';
    } else if (dignity === 'Debilitated') {
        colorClass = 'text-rose-500';
    } else if (dignity === 'Own Sign' || dignity === 'Moolatrikona') {
        colorClass = 'text-amber-300';
        glow = 'drop-shadow-[0_0_4px_rgba(252,211,77,0.4)]';
    } else if (planet.name === 'Sun') colorClass = 'text-amber-400';
    else if (planet.name === 'Moon') colorClass = 'text-blue-200';

    return (
        <div
            className={`
                relative flex flex-col items-center justify-center rounded-lg transition-all duration-300 cursor-pointer
                ${compact ? 'p-0.5' : 'p-1'}
                ${isHovered ? 'z-50' : ''}
            `}
            style={{
                opacity: isFaded ? 0.2 : 1,
                // Use transform for hover effect to prevent layout shift
                transform: isHovered ? 'scale(1.2)' : 'scale(1)'
            }}
            onMouseEnter={() => onHover(planet.name)}
            onMouseLeave={() => onHover(null)}
        >
            <span className={`text-[9px] font-bold uppercase tracking-tighter ${active ? 'text-cyan-400' : 'text-zinc-500'} ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
                {nakshatra.name.slice(0, 4)}
            </span>
            <span
                className={`leading-none font-bold transition-all ${showSymbols ? (compact ? 'text-[28px]' : 'text-[32px]') : (compact ? 'text-[14px]' : 'text-[18px]')} ${colorClass} ${glow}`}
                style={showSymbols ? { fontFamily: '"Segoe UI Symbol", "Apple Color Emoji", serif' } : {}}
            >
                {showSymbols ? (SYMBOLS[planet.name] || planet.name[0]) : planet.name.substring(0, 2)}
            </span>
            <span className={`font-mono font-bold text-cyan-400 ${active ? 'opacity-100' : 'opacity-80'} ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                {formatVedicDegree(planet.abs_deg || 0, active)}
            </span>
            {planet.isRetro && !isNode && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
            )}

            {/* Tooltip positioned absolutely relative to cell, ensuring z-index is high */}
            {isHovered && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 border border-white/20 px-2 py-1 rounded text-[10px] font-bold text-purple-300 tracking-wider whitespace-nowrap z-50 pointer-events-none shadow-xl">
                    P{nakshatra.pada}
                </div>
            )}
        </div>
    );
};

export default SouthIndianChart;
