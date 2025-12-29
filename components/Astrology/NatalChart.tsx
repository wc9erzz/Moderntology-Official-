'use client';
import React, { useMemo, useState } from 'react';

// --- Constants & Types ---
const SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ELEMENTS = {
    Fire: ['Aries', 'Leo', 'Sagittarius'],
    Earth: ['Taurus', 'Virgo', 'Capricorn'],
    Air: ['Gemini', 'Libra', 'Aquarius'],
    Water: ['Cancer', 'Scorpio', 'Pisces']
};

const ELEMENT_COLORS: Record<string, string> = {
    Fire: '#FF5722',   // Red/Orange
    Earth: '#4CAF50',  // Green
    Air: '#FFC107',    // Yellow/Gold
    Water: '#2196F3'   // Blue
};

const SYMBOLS: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 'Leo': '♌', 'Virgo': '♍',
    'Libra': '♎', 'Scorpio': '♏', 'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
    'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂', 'Jupiter': '♃',
    'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇', 'Chiron': '⚷',
    'North Node': '☊', 'South Node': '☋', 'Ascendant': 'AC', 'Midheaven': 'MC'
};

interface NatalChartProps {
    data: {
        points: Record<string, { abs_deg: number; house: number; sign: string }>;
        houses: Record<string, { abs_deg: number; house: number }>;
        aspects: Array<{ p1: string; p2: string; type: string; orb: number }>;
        angles: Record<string, { abs_deg: number }>;
    };
    width?: number;
    height?: number;
}

export function NatalChart({ data, width = 600, height = 600 }: NatalChartProps) {
    const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

    // Dimensions
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 40;
    const innerRadius = radius * 0.85;
    const planetRadiusBase = radius * 0.65;

    // 1. MATH: Normalize Rotation so Ascendant is at 9 o'clock (180 deg in SVG)
    // SVG 0 is 3 o'clock. 180 is 9 o'clock.
    // We want Ascendant Degree to map to 180.
    // Delta = 180 - Ascendant.
    const ascDeg = data.angles?.Ascendant?.abs_deg || 0;

    // Helper: degrees to radians for SVG (Standard Anti-Clockwise Astrology Logic)
    // In SVG, Y is down. To simulate standard math (CCW), we invert Y or angle.
    // Let's use: x = cx + r * cos(rad), y = cy + r * sin(rad)
    // But we want 0 deg = Left (180 SVG). 
    // SVG mapping: TargetAngle = 180 - (PlanetAbsDeg - AscAbsDeg)


    const getCoords = React.useCallback((deg: number, r: number) => {
        // Correct Visual Logic: 
        // VisualAngle = 180 + (PlanetAbs - AscAbs).
        // SVG increases clockwise. Astrology increases counter-clockwise.
        // If we want 0 at Left (180), and increasing degrees move DOWN (CCW visual in chart usually goes 1st house is below AC),
        // Then 1st house (AC + 30) should be at 180 + 30 = 210.
        const visualAngle = (180 - (deg - ascDeg));
        const radVisual = visualAngle * (Math.PI / 180);

        return {
            x: cx + r * Math.cos(radVisual),
            y: cy + r * Math.sin(radVisual)
        };
    }, [cx, cy, ascDeg]);

    // 2. DATA PREP: Segments
    const zodiacSegments = useMemo(() => {
        return SIGNS.map((sign, i) => {
            // 0 deg Aries. 
            const startDeg = i * 30;
            const endDeg = (i + 1) * 30;

            // Determine Element Color
            const element = Object.keys(ELEMENTS).find(k => ELEMENTS[k as keyof typeof ELEMENTS].includes(sign));
            const color = element ? ELEMENT_COLORS[element] : '#555';

            const p1Outer = getCoords(startDeg, radius);
            const p2Outer = getCoords(endDeg, radius);
            const p1Inner = getCoords(startDeg, innerRadius);
            const p2Inner = getCoords(endDeg, innerRadius);

            // Label Position
            const labelPos = getCoords(startDeg + 15, (radius + innerRadius) / 2);

            return {
                sign,
                symbol: SYMBOLS[sign],
                color,
                path: `
          M ${p1Outer.x} ${p1Outer.y} 
          A ${radius} ${radius} 0 0 1 ${p2Outer.x} ${p2Outer.y} 
          L ${p2Inner.x} ${p2Inner.y} 
          A ${innerRadius} ${innerRadius} 0 0 0 ${p1Inner.x} ${p1Inner.y} 
          Z
        `,
                labelPos
            };
        });
    }, [radius, innerRadius, getCoords]);

    // 3. COLLISION LOGIC for Planets
    const planetNodes = useMemo(() => {
        if (!data.points) return [];

        // Convert to array and sort by degree
        const rawPoints = Object.entries(data.points).map(([name, p]) => ({
            name,
            ...p,
            symbol: SYMBOLS[name] || name[0]
        })).sort((a, b) => a.abs_deg - b.abs_deg);

        // Simple collision adjustment
        const adjustedPoints: any[] = [];
        for (let i = 0; i < rawPoints.length; i++) {
            const p = rawPoints[i];
            let rOffset = 0;

            // Check previous planet closeness logic
            // We only care about visual closeness, which correlates to degree closeness.
            if (i > 0) {
                const prev = adjustedPoints[i - 1];
                // Handle wrap-around diff (359 and 1 are close)
                const degDiff = Math.min(
                    Math.abs(p.abs_deg - prev.abs_deg),
                    360 - Math.abs(p.abs_deg - prev.abs_deg)
                );

                if (degDiff < 10) {
                    // Toggle offset based on stack
                    // If prev was 0, I go 20. If prev was 20, I go -20. If prev was -20, I go 40? 
                    // Simple 3-track toggle: 0 -> 20 -> -20 -> 40?
                    // Or just alternate 0 and 20 for basic cleanliness
                    if (prev.rOffset === 0) rOffset = 20;
                    else if (prev.rOffset === 20) rOffset = -20;
                    else if (prev.rOffset === -20) rOffset = 40; // Dense stellium
                    else rOffset = 0;
                }
            }
            adjustedPoints.push({ ...p, rOffset });
        }

        return adjustedPoints.map(p => ({
            ...p,
            pos: getCoords(p.abs_deg, planetRadiusBase + (p.rOffset || 0))
        }));
    }, [data.points, planetRadiusBase, getCoords]);

    // 4. CURVED ASPECTS
    const aspectPaths = useMemo(() => {
        return (data.aspects || []).map((asp, i) => {
            const p1 = planetNodes.find(p => p.name === asp.p1);
            const p2 = planetNodes.find(p => p.name === asp.p2);
            if (!p1 || !p2) return null;

            // Color coding
            let stroke = 'rgba(255,255,255,0.1)';
            if (['Square', 'Opposition'].includes(asp.type)) stroke = 'rgba(255, 80, 80, 0.4)';
            if (['Trine', 'Sextile'].includes(asp.type)) stroke = 'rgba(100, 255, 100, 0.4)';

            if ((asp as any).is_ghost) {
                stroke = 'rgba(255, 255, 255, 0.65)';
            }

            // Quadratic Bezier Curve: Pull towards center (cx, cy)
            const d = `M ${p1.pos.x} ${p1.pos.y} Q ${cx} ${cy} ${p2.pos.x} ${p2.pos.y}`;

            return (
                <path
                    key={i}
                    d={d}
                    stroke={stroke}
                    fill="none"
                    strokeWidth="1"
                    strokeDasharray={(asp as any).is_ghost ? "4,4" : "none"}
                />
            );
        });
    }, [planetNodes, cx, cy, data.aspects]);

    return (
        <div className="relative flex justify-center items-center bg-gray-950 p-4 rounded-xl shadow-2xl overflow-hidden">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="select-none font-serif">
                <defs>
                    <filter id="glow-text">
                        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="white" floodOpacity="0.5" />
                    </filter>
                </defs>

                {/* --- Background --- */}
                <circle cx={cx} cy={cy} r={radius} fill="rgba(0,0,0,0.3)" />

                {/* --- Aspects (Bottom Layer) --- */}
                <g>{aspectPaths}</g>

                {/* --- Houses Division Lines --- */}
                {Object.values(data.houses || {}).map((h, i) => {
                    const start = getCoords(h.abs_deg, innerRadius);
                    const end = getCoords(h.abs_deg, planetRadiusBase - 40);
                    return (
                        <line
                            key={i}
                            x1={start.x} y1={start.y}
                            x2={end.x} y2={end.y}
                            stroke="rgba(255,255,255,0.1)"
                            strokeDasharray="2 4"
                        />
                    );
                })}

                {/* --- Zodiac Ring --- */}
                <g>
                    {zodiacSegments.map((seg, i) => (
                        <g key={i} className="transition-opacity hover:opacity-80">
                            <path d={seg.path} fill={seg.color} fillOpacity="0.2" stroke="rgba(255,255,255,0.1)" />
                            <text
                                x={seg.labelPos.x} y={seg.labelPos.y}
                                textAnchor="middle" dominantBaseline="middle"
                                fill={seg.color} fontSize="14" fontWeight="bold"
                            >
                                {seg.symbol}
                            </text>
                        </g>
                    ))}
                </g>

                {/* --- Planets --- */}
                {planetNodes.map((p, i) => {
                    const isHovered = hoveredPoint === p.name;
                    return (
                        <g
                            key={i}
                            transform={`translate(${p.pos.x}, ${p.pos.y})`}
                            onMouseEnter={() => setHoveredPoint(p.name)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="cursor-pointer"
                        >
                            <circle
                                r={isHovered ? 14 : 10}
                                fill="#1a1a1a"
                                stroke={isHovered ? '#fff' : '#ccc'}
                                strokeWidth={isHovered ? 2 : 1}
                                className="transition-all duration-300"
                            />
                            <text
                                textAnchor="middle" dominantBaseline="middle"
                                fill={['Sun', 'Moon'].includes(p.name) ? '#fff' : '#ddd'}
                                fontSize={isHovered ? "16" : "12"}
                                filter={['Sun', 'Moon'].includes(p.name) ? "url(#glow-text)" : ""}
                            >
                                {p.symbol}
                            </text>
                        </g>
                    );
                })}

                {/* --- Center Decoration --- */}
                <circle cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.3)" />
            </svg>

            {/* --- Simple HTML Tooltip Overlay --- */}
            {hoveredPoint && data.points && data.points[hoveredPoint] && (
                <div className="absolute bottom-4 bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 shadow-xl text-sm pointer-events-none">
                    <strong>{hoveredPoint}</strong> in {data.points[hoveredPoint].sign}
                    <div className="text-gray-400 text-xs">
                        {Math.floor(data.points[hoveredPoint].abs_deg % 30)}° House {data.points[hoveredPoint].house}
                    </div>
                </div>
            )}
        </div>
    );
}
