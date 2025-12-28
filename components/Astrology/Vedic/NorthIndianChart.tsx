'use client';

import React, { useState, useMemo } from 'react';
import { ChartData, PointData } from '@/utils/astrology/types';
import { SYMBOLS } from '@/components/Astrology/chart-utils';
import { calculateDignity } from '@/utils/astrology/vedic-calc';
import { formatVedicDegree, getNakshatraInfo, getVedicContext, ZODIAC_SIGNS, SIGN_ELEMENTS, ELEMENT_COLORS } from './VedicUtils';

interface Props {
    data: ChartData;
    showSymbols?: boolean;
    showTruePositions?: boolean;
}

const VEDIC_PLANETS = ['Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

interface GlyphProps {
    planet: PointData;
    x: number;
    y: number;
    showSymbols: boolean;
    showTruePositions: boolean;
    isHovered: boolean;
    isFaded: boolean;
    onHover: (name: string | null) => void;
    scale?: number;
}

const PlanetGlyph: React.FC<GlyphProps> = ({ planet, x, y, showSymbols, showTruePositions, isHovered, isFaded, onHover, scale = 1 }) => {
    const dignity = calculateDignity(planet.name, planet.sign);
    const nakshatra = getNakshatraInfo(planet.abs_deg || 0);
    const active = showTruePositions || isHovered;
    const isNode = planet.name === 'Rahu' || planet.name === 'Ketu';

    let color = '#d4d4d8';
    if (dignity === 'Exalted') color = '#34d399';
    else if (dignity === 'Debilitated') color = '#f43f5e';
    else if (dignity === 'Own Sign' || dignity === 'Moolatrikona') color = '#fcd34d';
    else if (planet.name === 'Sun') color = '#fbbf24';
    else if (planet.name === 'Moon') color = '#bfdbfe';

    // Scale-aware dimensions
    const fontSize = (showSymbols ? 6 : 4) * scale;
    const subSize = 2.8 * scale;

    return (
        <g
            transform={`translate(${x}, ${y})`}
            className={`cursor-pointer transition-all duration-300 ${isFaded ? 'opacity-20 blur-[1px]' : 'opacity-100'}`}
            onMouseEnter={() => onHover(planet.name)}
            onMouseLeave={() => onHover(null)}
        >
            <rect x={-8 * scale} y={-8 * scale} width={16 * scale} height={16 * scale} fill="transparent" />

            <g className="transition-transform duration-300 hover:scale-110">
                <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={color}
                    style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: showSymbols ? '"Segoe UI Symbol", serif' : 'inherit',
                        fontWeight: 700,
                        filter: isHovered ? 'drop-shadow(0 0 4px rgba(167, 139, 250, 0.8))' : 'none'
                    }}
                >
                    {showSymbols ? (SYMBOLS[planet.name] || planet.name[0]) : planet.name.substring(0, 2)}
                </text>

                <text
                    x="0" y={5.5 * scale}
                    textAnchor="middle"
                    style={{
                        fontSize: `${subSize}px`,
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        fill: active ? '#22d3ee' : 'rgba(34, 211, 238, 0.8)'
                    }}
                >
                    {formatVedicDegree(planet.abs_deg || 0, active)}
                </text>

                {planet.isRetro && !isNode && (
                    <text x={4.5 * scale} y={-2.5 * scale} style={{ fontSize: `${2.5 * scale}px`, fill: '#f43f5e', fontWeight: 900 }}>R</text>
                )}

                {isHovered && (
                    <text x="0" y={9.5 * scale} textAnchor="middle" style={{ fontSize: `${2.5 * scale}px`, fill: '#a78bfa', fontWeight: 700 }}>
                        {nakshatra.name} P{nakshatra.pada}
                    </text>
                )}
            </g>
        </g>
    );
};

/**
 * North Indian Chart (Diamond Style)
 * House 1 = Left (Western rotation), displaying Sign numerals
 */
export const NorthIndianChart: React.FC<Props> = ({
    data,
    showSymbols = true,
    showTruePositions = false
}) => {
    const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

    const { ascIndex } = useMemo(() => getVedicContext(data), [data]);

    // Group planets by house
    const planetsByHouse = useMemo(() => {
        const byHouse: Record<number, PointData[]> = {};
        Object.values(data.points).forEach(p => {
            if (!VEDIC_PLANETS.includes(p.name)) return;
            const signIdx = ZODIAC_SIGNS.findIndex(s => s.toLowerCase() === p.sign.toLowerCase());
            if (signIdx === -1) return;
            const houseNum = ((signIdx - ascIndex + 12) % 12) + 1;
            if (!byHouse[houseNum]) byHouse[houseNum] = [];
            byHouse[houseNum].push(p);
        });
        return byHouse;
    }, [data.points, ascIndex]);

    const HOUSE_CENTERS: Record<number, { cx: number; cy: number; type: 'diamond' | 'triangle' }> = {
        1: { cx: 50, cy: 25, type: 'diamond' },    // Top Diamond (Lagna)
        2: { cx: 25, cy: 12.5, type: 'triangle' }, // Top-Left Triangle
        3: { cx: 12.5, cy: 25, type: 'triangle' }, // Left-Top Triangle
        4: { cx: 25, cy: 50, type: 'diamond' },    // Left Diamond
        5: { cx: 12.5, cy: 75, type: 'triangle' }, // Left-Bottom Triangle
        6: { cx: 25, cy: 87.5, type: 'triangle' }, // Bottom-Left Triangle
        7: { cx: 50, cy: 75, type: 'diamond' },    // Bottom Diamond
        8: { cx: 75, cy: 87.5, type: 'triangle' }, // Bottom-Right Triangle
        9: { cx: 87.5, cy: 75, type: 'triangle' }, // Right-Bottom Triangle
        10: { cx: 75, cy: 50, type: 'diamond' },   // Right Diamond
        11: { cx: 87.5, cy: 25, type: 'triangle' },// Right-Top Triangle
        12: { cx: 75, cy: 12.5, type: 'triangle' } // Top-Right Triangle
    };

    const renderHouse = (houseNum: number) => {
        const center = HOUSE_CENTERS[houseNum];

        // North Indian: Sign Number is Fixed to House Number relative to Ascendant
        // House 1 (Top) always shows Ascendant Sign Number
        // House 2 (Top Left) always shows (Asc + 1)
        const signNum = ((ascIndex + houseNum - 1) % 12) + 1;

        const signName = ZODIAC_SIGNS[signNum - 1];
        const element = SIGN_ELEMENTS[signName];
        const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.Fire;
        const planets = planetsByHouse[houseNum] || [];

        return (
            <g key={`house-${houseNum}`}>
                <path
                    d={center.type === 'diamond'
                        ? (houseNum === 1 ? "M50 0 L75 25 L50 50 L25 25 Z" :          // Top
                            houseNum === 4 ? "M0 50 L25 75 L50 50 L25 25 Z" :         // Left
                                houseNum === 7 ? "M50 100 L75 75 L50 50 L25 75 Z" :   // Bottom
                                    "M100 50 L75 75 L50 50 L75 25 Z")                 // Right (H10)
                        : (houseNum === 2 ? "M0 0 L50 0 L25 25 Z" :                   // Top Left
                            houseNum === 3 ? "M0 0 L25 25 L0 50 Z" :                  // Left Top
                                houseNum === 5 ? "M0 100 L25 75 L0 50 Z" :            // Left Bottom
                                    houseNum === 6 ? "M0 100 L50 100 L25 75 Z" :      // Bottom Left
                                        houseNum === 8 ? "M50 100 L100 100 L75 75 Z" :// Bottom Right
                                            houseNum === 9 ? "M100 100 L100 50 L75 75 Z" : // Right Bottom
                                                houseNum === 11 ? "M100 0 L75 25 L100 50 Z" : // Right Top
                                                    "M50 0 L100 0 L75 25 Z")}         // Top Right (H12)
                    fill={colors.bg}
                    className="pointer-events-none"
                    stroke="white" strokeWidth="0.05" strokeOpacity="0.1"
                />

                {/* Subtle Background Text - Stacked List */}
                <text
                    x={center.cx} y={center.cy - 3}
                    textAnchor="middle" dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    style={{ fontSize: '6px', fontWeight: 600, fill: '#fff', opacity: 0.2, letterSpacing: '0.05em' }}
                >
                    {signName.slice(0, 3).toUpperCase()}
                </text>
                <text
                    x={center.cx} y={center.cy + 4}
                    textAnchor="middle" dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    style={{ fontSize: '5px', fontWeight: 600, fill: '#a78bfa', opacity: 0.6 }}
                >
                    H{houseNum}
                </text>

                {/* Planets - Orbit/Arc Layout */}
                <g>
                    {planets.map((p, i) => {
                        const count = planets.length;

                        // --- Orbit Configuration ---
                        // Standard Radius for Diamonds
                        const diamondRadius = 14;

                        // Edge clearance for Triangles
                        const edgeMargin = 12;

                        let tx = center.cx;
                        let ty = center.cy;

                        if (center.type === 'diamond') {
                            // --- Circle Distribution ---
                            // Spread full 360, but offset start to look nice (e.g. start at top)
                            const angleStep = 360 / Math.max(1, count);
                            const startAngle = -90; // Top
                            const currentAngle = startAngle + (i * angleStep);

                            // Convert to radians
                            const rad = (currentAngle * Math.PI) / 180;
                            tx = center.cx + (diamondRadius * Math.cos(rad));
                            ty = center.cy + (diamondRadius * Math.sin(rad));

                        } else {
                            // --- Arc / Half-Oval Distribution for Triangles ---
                            // We push points towards the "Base" of the triangle (the outer chart edge)
                            // H2: Top Edge (y=0). H3: Left Edge (x=0). etc.

                            // Map House to "Edge Strategy"
                            // H2 (Top Left), H12 (Top Right) -> Top Edge
                            // H3 (Left Top), H5 (Left Bottom) -> Left Edge? No H5 is Left Bottom. 
                            // Let's look at geometries.

                            /*
                                H2: Triangle pointing DOWN. Base on TOP.
                                H12: Triangle pointing DOWN. Base on TOP.
                                H3: Triangle pointing RIGHT. Base on LEFT.
                                H5: Triangle pointing RIGHT. Base on LEFT. (Wait, H5 is bottom-left? No H5 center is 12.5, 75. Left edge.)
                                H6: Triangle pointing UP. Base on BOTTOM.
                                H8: Triangle pointing UP. Base on BOTTOM.
                                H9: Triangle pointing LEFT. Base on RIGHT.
                                H11: Triangle pointing LEFT. Base on RIGHT.
                            */

                            let arcStart = 0;
                            let arcEnd = 0;
                            let radiusX = 14;
                            let radiusY = 14;
                            let arcCx = center.cx;
                            let arcCy = center.cy;

                            // Define Arc params based on House
                            if (houseNum === 2 || houseNum === 12) { // Top Edge
                                arcCx = center.cx;
                                arcCy = 40; // Push gravity center down so arc curves up? 
                                // Actually, easier to define strict line or subtle curve along y=10
                                const widthSpread = 25;
                                const xStart = center.cx - (widthSpread / 2);
                                const step = widthSpread / (count + 1);
                                tx = xStart + (step * (i + 1));
                                ty = 12; // Close to top edge

                                // Curve it slightly?
                                ty += Math.abs(tx - center.cx) * 0.1; // Dip edges down? No, dip center down. 
                                // Actually H2 shape is M0 0 L50 0 L25 25. Top is flat.
                                // Just a line is safest.

                            } else if (houseNum === 6 || houseNum === 8) { // Bottom Edge
                                const widthSpread = 25;
                                const xStart = center.cx - (widthSpread / 2);
                                const step = widthSpread / (count + 1);
                                tx = xStart + (step * (i + 1));
                                ty = 88; // Close to bottom edge
                            } else if (houseNum === 3 || houseNum === 5) { // Left Edge
                                const heightSpread = 25;
                                const yStart = center.cy - (heightSpread / 2);
                                const step = heightSpread / (count + 1);
                                tx = 12; // Close to left edge
                                ty = yStart + (step * (i + 1));
                            } else if (houseNum === 9 || houseNum === 11) { // Right Edge
                                const heightSpread = 25;
                                const yStart = center.cy - (heightSpread / 2);
                                const step = heightSpread / (count + 1);
                                tx = 88; // Close to right edge
                                ty = yStart + (step * (i + 1));
                            }
                        }

                        return (
                            <PlanetGlyph
                                key={p.name}
                                planet={p}
                                x={tx}
                                y={ty}
                                showSymbols={showSymbols}
                                showTruePositions={showTruePositions}
                                isHovered={hoveredPlanet === p.name}
                                isFaded={hoveredPlanet !== null && hoveredPlanet !== p.name}
                                onHover={setHoveredPlanet}
                                scale={1.25} // Reduced from 1.8 (Too Big) to 1.25 (Comfortable)
                            />
                        );
                    })}
                </g>

            </g>
        );
    };

    return (
        <div className="w-full max-w-[750px] mx-auto aspect-square bg-black border border-white/10 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-3xl overflow-visible backdrop-blur-3xl p-4 md:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.08),transparent_70%)] pointer-events-none" />
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
                <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.15" strokeOpacity="0.15" />
                <path d="M50 0 L0 50 L50 100 L100 50 Z" stroke="white" strokeWidth="0.2" strokeOpacity="0.25" fill="none" />
                <path d="M0 0 L100 0 L100 100 L0 100 Z" stroke="white" strokeWidth="0.2" strokeOpacity="0.25" fill="none" />
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => renderHouse(h))}
            </svg>
        </div>
    );
};



export default NorthIndianChart;
