'use client';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMBOLS, ChartData, polarToCart, getVisualAngle, normalizeChartData, SIGNS, ASPECT_CONFIG, ORB_LIMITS, POINT_LABELS } from './chart-utils';
import { Minimize2 } from 'lucide-react'; // Import Minimize2

import { PatternResult } from '@/utils/astrology/pattern-detection';

// --- Constants & Theme ---
const THEME = {
    bg: '#050505',
    rings: {
        outer: 0.98,
        zodiac: 0.85,    // Reverted to 0.85
        house: 0.60,     // Reverted to 0.60
        houseText: 0.45, // Moved inward (was 0.50) to avoid planet overlap
        ticks: 0.83      // Reverted to 0.83
    },
    colors: {
        fire: '#FF7E5F',
        earth: '#66BB6A',
        air: '#FDD835',
        water: '#42A5F5',
        text: '#E0E0E0',
        line: 'rgba(255, 255, 255, 0.1)',
        highlight: '#FFFFFF',
        houseNum: '#FFD700'
    }
};

const ELEMENTS = { Fire: [0, 4, 8], Earth: [1, 5, 9], Air: [2, 6, 10], Water: [3, 7, 11] };

interface InteractiveNatalChartProps {
    data: ChartData;
    onSelect?: (item: { id: string; data: any }) => void;
    className?: string;
    patterns?: PatternResult[];
    selectedId?: string | null;
    showExtraPoints?: boolean;
    showNodeSignatures?: boolean;
    showTruePositions?: boolean;
    orbStrictness?: 'strict' | 'standard' | 'wide';
    displayMode?: 'glyphs' | 'text';
}

export function InteractiveNatalChart({
    data,
    onSelect,
    className = '',
    patterns = [],
    selectedId = null,
    showExtraPoints = false,
    showNodeSignatures = false,
    showTruePositions = false,
    orbStrictness = 'standard',
    displayMode = 'glyphs'
}: InteractiveNatalChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
    const { width, height } = dimensions;
    const size = Math.min(width, height);

    // Zoom & Pan State
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const cx = size / 2;
    const cy = size / 2;
    // Increase base radius slightly effectively since we can zoom out/in
    const radius = Math.min(cx, cy) * 0.95;
    const R = radius;

    // Normalize Data
    const normalizedData = useMemo(() => normalizeChartData(data), [data]);

    // Internal selection state
    const [hoverId, setHoverId] = useState<string | null>(null);

    // Initial Animation
    const [isLoaded, setIsLoaded] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const timer = setTimeout(() => setAnimationComplete(true), 2200);
        return () => clearTimeout(timer);
    }, []);

    // Responsive Sizing
    useEffect(() => {
        if (!chartRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) setDimensions({ width: entries[0].contentRect.width, height: entries[0].contentRect.height });
        });
        resizeObserver.observe(chartRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Wheel Event Handler (Non-passive to prevent scroll)
    useEffect(() => {
        const el = chartRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault(); // Stop page scroll
            const delta = -e.deltaY * 0.002; // Increased Sensitivity
            setZoom(z => Math.min(Math.max(1, z + delta), 20)); // Limit to min 1x, max 20x
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, []);

    // Touch Handlers for Mobile (Pan & Pinch Zoom)
    const lastTouchRef = useRef<{ x: number, y: number } | null>(null);
    const lastDistRef = useRef<number | null>(null);

    const getTouchDist = (t1: React.Touch, t2: React.Touch) => {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            // Pan Start
            const t = e.touches[0];
            lastTouchRef.current = { x: t.clientX, y: t.clientY };
            setIsDragging(true);
        } else if (e.touches.length === 2) {
            // Pinch Start
            const dist = getTouchDist(e.touches[0], e.touches[1]);
            lastDistRef.current = dist;
            setIsDragging(true); // Treat pinch as dragging to prevent heavy updates if any
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        // If zoom is 1 and not pinching, allow page scroll (don't prevent default)
        // But if pinching, or zoomed in and panning, we might want to capture.

        if (e.touches.length === 1) {
            // Pan
            if (zoom === 1) return; // Allow page scroll if not zoomed
            if (!lastTouchRef.current) return;

            // If we are zoomed in, we prevent default to allow panning without scrolling page
            // Note: simple e.preventDefault() might be needed in a non-React passive listener, 
            // but React synth events might struggle. We largely rely on touch-action css.

            const t = e.touches[0];
            const dx = t.clientX - lastTouchRef.current.x;
            const dy = t.clientY - lastTouchRef.current.y;

            const maxOffset = (size * zoom - size) / 2;
            setPan(p => ({
                x: Math.min(Math.max(p.x + dx, -maxOffset), maxOffset),
                y: Math.min(Math.max(p.y + dy, -maxOffset), maxOffset)
            }));

            lastTouchRef.current = { x: t.clientX, y: t.clientY };

        } else if (e.touches.length === 2) {
            // Pinch Zoom
            if (lastDistRef.current === null) return;
            const dist = getTouchDist(e.touches[0], e.touches[1]);
            const delta = dist - lastDistRef.current;

            // Sensitivity factor
            const zoomFactor = delta * 0.005;
            setZoom(z => Math.min(Math.max(1, z + zoomFactor), 8)); // Limit to min 1x for mobile

            lastDistRef.current = dist;
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        lastTouchRef.current = null;
        lastDistRef.current = null;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;

        // Calculate bounds based on zoom
        // If zoom is 1, max pan is 0. If zoom is 2, content is 2x size, so we can pan +/- 0.5 * size (from center)
        const maxOffset = (size * zoom - size) / 2;

        setPan({
            x: Math.min(Math.max(newX, -maxOffset), maxOffset),
            y: Math.min(Math.max(newY, -maxOffset), maxOffset)
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    // Ascendant & Rotation
    const ascDeg = normalizedData.angles?.Ascendant?.abs_deg ?? normalizedData.houses['1']?.abs_deg ?? 0;


    // Nodes Calculation (Physics-Based Force-Relaxation Solver)
    const planetNodes = useMemo(() => {
        if (!normalizedData.points) return [];
        const rawPoints = Object.values(normalizedData.points).filter(p => {
            if (!p || !p.name) return false;
            // Filter out angles unless we want them as nodes (usually handled separately)
            if (['Ascendant', 'Midheaven', 'Descendant', 'IC', 'ASC', 'MC', 'DSC', 'Vertex', 'EastPoint'].includes(p.name)) return false;
            if (p.type === 'angle') return false;
            if (p.type === 'node' || p.type === 'point') return showExtraPoints;
            if (p.type === 'star') return false; // Hide fixed stars from the visual wheel
            return true;
        });

        // 1. Initial Sort by True Angle (0-360)
        let nodes = rawPoints.map(p => ({
            ...p,
            // CORE CORRECTION: The user observed a +1 degree visual offset (e.g. 18 deg sitting on 19th tick).
            // We apply a -1.0 degree shift to alignment to visually match the labeled ticks.
            trueAngle: getVisualAngle(p.abs_deg - 1, ascDeg),
            visualAngle: getVisualAngle(p.abs_deg - 1, ascDeg), // Start at true pos
            // Push planets inward, closer to house numbers/center, avoiding outer ring overlap
            // Push planets inward, closer to house numbers/center, avoiding outer ring overlap
            // Adjusted Base Radius to be more centralized (0.65) to allow bidirectional stacking
            baseR: R * 0.65,
            track: 0 // Track index for radial stacking
        })).sort((a, b) => a.trueAngle - b.trueAngle);

        if (nodes.length === 0) return [];

        // 2. Physics Parameters: Tuned for "Pool Noodle" feel
        // We want tight packing but zero overlap.
        // As zoom increases (in), minSep (angular) decreases, allowing them to be visually close but numerically fine.
        // As zoom decreases (out), minSep increases, forcing them apart to maintain visual distinctness.
        // REDUCED glyphSizeFactor significantly (0.15 -> 0.06) to allow planets to cling closer to True Angle,
        // relying on the new Radial Stacking (below) to resolve collisions.
        const glyphSizeFactor = 0.06;
        // minSep is degrees of arc required for a node.
        const minSep = ((size * glyphSizeFactor) / zoom) / (2 * Math.PI * (R * 0.75)) * 360;

        const iterations = 50;
        const kSpring = 0.05; // Spring stiffness (pull to true)

        // 3. Solver Loop
        for (let iter = 0; iter < iterations; iter++) {

            // A. Constraint Pass (Separation)
            // We run forward and backward passes to resolve chains of collisions

            // Forward
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                const b = nodes[(i + 1) % nodes.length];

                let diff = b.visualAngle - a.visualAngle;
                if (diff < 0) diff += 360; // Wrap check

                if (diff < minSep) {
                    const overlap = minSep - diff;
                    // Distribute overlap: Push A back, B forward
                    const push = overlap / 2;
                    a.visualAngle -= push;
                    b.visualAngle += push;
                }
            }

            // Backward
            for (let i = nodes.length - 1; i >= 0; i--) {
                const a = nodes[i];
                const prev = nodes[(i - 1 + nodes.length) % nodes.length];

                let diff = a.visualAngle - prev.visualAngle;
                if (diff < 0) diff += 360;

                if (diff < minSep) {
                    const overlap = minSep - diff;
                    const push = overlap / 2;
                    prev.visualAngle -= push;
                    a.visualAngle += push;
                }
            }

            // B. Spring Pass (Homecoming)
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                // Distance to true home
                let delta = n.trueAngle - n.visualAngle;
                // Shortest angular path
                while (delta > 180) delta -= 360;
                while (delta < -180) delta += 360;

                // Apply spring force
                n.visualAngle += delta * kSpring;
            }
        }

        // --- C. RADIAL STACKING PASS (Smart Layering) ---
        // After angular relaxation, we resolve remaining overlaps by pushing planets to outer concentric tracks.
        nodes.sort((a, b) => a.visualAngle - b.visualAngle);

        // Threshold for visual overlap (based on the full icon size, not the reduced physics size)
        // We want ~0.16 factor worth of space between items on the SAME track.
        const layerThreshold = ((size * 0.16) / zoom) / (2 * Math.PI * (R * 0.75)) * 360;

        // Step size for each track (approx icon height + padded label)
        // Scaled by 1/zoom to maintain constant visual spacing on screen
        const radialStep = (size * 0.09) / zoom;

        nodes.forEach((n, i) => {
            let track = 0;

            // Check previous neighbors to find occupied tracks
            // We check a window of neighbors that would collide
            const occupied = new Set();

            // Look back (counter-clockwise)
            // We need to check enough neighbors to cover the potential cluster
            for (let j = 1; j <= 4; j++) {
                const prevIdx = (i - j + nodes.length) % nodes.length;
                const prev = nodes[prevIdx];

                let dist = n.visualAngle - prev.visualAngle;
                if (dist < 0) dist += 360; // Wrap correction

                // If the neighbor is within striking distance
                if (dist < layerThreshold) {
                    occupied.add(prev.track || 0);
                }
            }

            // Simple Greedy allocation: Pick lowest free track
            while (occupied.has(track)) {
                track++;
            }

            // Cap tracks to avoid running off the chart? 
            // 0, 1, 2 are safe. 3 is risky (might hit zodiac).
            if (track > 2) {
                // Determine which existing track is 'furthest' angularly?
                // Fallback: Just cycle 0-2
                track = track % 3;
            }

            n.track = track;

            // Apply Radial Offset
            // We alternate directions to keep cluster centered and within bounds
            // Track 0: Center
            // Track 1: Inward (-1)
            // Track 2: Outward (+1) - Only if necessary
            // Track 3: Inward (-2)

            let offsetMult = 0;
            if (track === 1) offsetMult = -1;
            else if (track === 2) offsetMult = 0.8; // Reduced outward step to avoid hitting Zodiac
            else if (track === 3) offsetMult = -2;
            else if (track > 3) offsetMult = -1.5; // Fallback compression

            n.baseR += (offsetMult * radialStep);
        });

        // 4. Final Output
        return nodes.map(p => {
            // Normalize visualAngle
            let v = p.visualAngle % 360;
            if (v < 0) v += 360;

            const pos = polarToCart(cx, cy, p.baseR, v);

            // Tick Marks at TRUE angle (showing where it actually is)
            const rTick = R * THEME.rings.ticks;
            const pTickStart = polarToCart(cx, cy, rTick, p.trueAngle);
            const pTickEnd = polarToCart(cx, cy, rTick - 10, p.trueAngle);

            return {
                ...p,
                x: pos.x, y: pos.y,
                visualAngle: v,
                trueAngle: p.trueAngle,
                pTickStart, pTickEnd
            };
        });

    }, [normalizedData, ascDeg, R, cx, cy, zoom, size, showExtraPoints]);


    // Geometry Memos
    const patternShapes = useMemo(() => {
        if (!patterns || patterns.length === 0) return [];
        // Pattern Radius: Must match the aspect lines radius for visual consistency
        const aspectR = R * 0.35;

        return patterns.map(pat => {
            const planetNodesList = planetNodes.filter(n => pat.planets.includes(n.name));

            // Hide Parallel patterns from Pattern Engine (Straight Lines) - they are now handled by Aspect Engine (Curves)
            // This "inverts" the previous logic.
            if (pat.type === 'Parallel Cluster' || pat.type === 'Parallel' || pat.type === 'Contra-Parallel') return null;

            // Allow 2-point patterns (others) to be drawn as lines if needed, but Parallels are skipped above.
            if (planetNodesList.length < 2) return null;

            // Map nodes to the inner aspect circle coordinates
            const innerCoords = planetNodesList.map(p => polarToCart(cx, cy, aspectR, p.visualAngle));

            // Only close the shape for geometric patterns
            const geometricTypes = ['Grand Trine', 'Grand Cross', 'T-Square', 'Yod', 'Kite', 'Mystic Rectangle'];
            const shouldClose = geometricTypes.includes(pat.type);

            const d = 'M ' + innerCoords.map(p => `${p.x} ${p.y}`).join(' L ') + (planetNodesList.length > 2 && shouldClose ? ' Z' : '');
            // Add GLOW effect to signatures
            return { id: pat.id, d, style: { ...pat.style, filter: 'url(#glow)' }, is_ghost: pat.is_ghost };
        }).filter(Boolean);
    }, [patterns, planetNodes, cx, cy, R]);

    const zodiacSegments = useMemo(() => {
        return SIGNS.map((sign, i) => {
            const startAngle = getVisualAngle(i * 30, ascDeg);
            const endAngle = getVisualAngle((i + 1) * 30, ascDeg);
            const rIn = R * THEME.rings.zodiac;
            const rOut = R * THEME.rings.outer; // Standard outer ring

            // Standard arc drawing
            const p1 = polarToCart(cx, cy, rOut, startAngle);
            const p2 = polarToCart(cx, cy, rOut, endAngle);
            const p3 = polarToCart(cx, cy, rIn, endAngle);
            const p4 = polarToCart(cx, cy, rIn, startAngle);

            const path = `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 0 1 ${p4.x} ${p4.y} Z`;

            let fill = THEME.colors.earth;
            if (ELEMENTS.Fire.includes(i)) fill = THEME.colors.fire;
            if (ELEMENTS.Air.includes(i)) fill = THEME.colors.air;
            if (ELEMENTS.Water.includes(i)) fill = THEME.colors.water;

            const midR = (rIn + rOut) / 2;
            const midAngle = getVisualAngle((i * 30) + 15, ascDeg);
            const glyphPos = polarToCart(cx, cy, midR, midAngle);

            return { path, fill, symbol: (SYMBOLS[sign] ? SYMBOLS[sign] + '\uFE0E' : sign[0]), glyphPos, name: sign, startAngle, endAngle, midAngle, midR, rIn, rOut };
        });
    }, [ascDeg, R, cx, cy]);

    // --- 3. DEGREE TICK RING ---
    // --- 3. DEGREE TICKS & LABELS ---
    const { ticks, tickLabels } = useMemo(() => {
        const t: any[] = [];
        const l: any[] = [];

        for (let i = 0; i < 360; i++) {
            const angle = getVisualAngle(i, ascDeg);
            const isTen = i % 10 === 0;
            const isFive = i % 5 === 0;

            // Dynamic tick lengths
            const rBase = R * THEME.rings.ticks; // Base radius for ticks
            const len = isTen ? 12 : isFive ? 8 : 4;

            const p1 = polarToCart(cx, cy, rBase, angle);
            const p2 = polarToCart(cx, cy, rBase - len, angle);

            t.push({
                x1: p1.x, y1: p1.y,
                x2: p2.x, y2: p2.y,
                strokeWidth: (isTen ? 1.5 : isFive ? 1 : 0.5),
                opacity: (isTen ? 0.8 : isFive ? 0.6 : 0.3)
            });

            // Labels for 0, 5, 10, 15, 20, 25 inside the sign
            if (i % 5 === 0) {
                const degInSign = i % 30;
                const isMajor = i % 10 === 0;
                const labelPos = polarToCart(cx, cy, rBase - 20, angle);
                l.push({
                    x: labelPos.x, y: labelPos.y,
                    text: degInSign.toString(),
                    isMajor,
                    angle
                });
            }
        }
        return { ticks: t, tickLabels: l };
    }, [ascDeg, R, cx, cy]);

    const houseData = useMemo(() => {
        if (!normalizedData.houses) return [];
        const houses = [];
        for (let i = 1; i <= 12; i++) {
            const prev = (normalizedData.houses as any)[i === 1 ? '12' : (i - 1).toString()] || { abs_deg: 0, deg: 0 };
            const next = (normalizedData.houses as any)[i === 12 ? '1' : (i + 1).toString()] || { abs_deg: 0, deg: 0 };

            const currentHouse = (normalizedData.houses as any)[i.toString()] || { abs_deg: (i - 1) * 30 };
            const nextHouse = (normalizedData.houses as any)[i === 12 ? '1' : (i + 1).toString()] || { abs_deg: i * 30 };

            let start = currentHouse.abs_deg;
            let end = nextHouse.abs_deg;
            if (end < start) end += 360;

            const cuspAngle = getVisualAngle(start, ascDeg);
            const midDeg = (start + end) / 2;
            const textAngle = getVisualAngle(midDeg % 360, ascDeg);

            const lineEnd = polarToCart(cx, cy, R * THEME.rings.zodiac, cuspAngle);
            const lineStart = polarToCart(cx, cy, R * 0.2, cuspAngle);
            const labelPos = polarToCart(cx, cy, R * THEME.rings.houseText, textAngle);

            houses.push({ num: i, line: { x1: lineStart.x, y1: lineStart.y, x2: lineEnd.x, y2: lineEnd.y }, labelPos });
        }
        return houses;
    }, [normalizedData.houses, ascDeg, R, cx, cy]);

    // Angles Data for Axis Rendering
    const anglesData = useMemo(() => {
        const results: any[] = [];
        const angleNames: [string, string][] = [
            ['Ascendant', 'Descendant'],
            ['Midheaven', 'IC']
        ];

        angleNames.forEach(([main, opposite]) => {
            const p1 = normalizedData.points[main];
            // We use 180 opposite for Desc/IC if not explicitly in data
            const deg1 = p1?.abs_deg ?? 0;
            const deg2 = (deg1 + 180) % 360;

            const startAngle = getVisualAngle(deg1, ascDeg);
            const endAngle = getVisualAngle(deg2, ascDeg);

            const rInner = R * 0.1; // Axis starts from slightly off-center
            const rOuter = R * THEME.rings.zodiac;
            const rLabel = R * (THEME.rings.outer + 0.05);

            const pStart = polarToCart(cx, cy, rInner, startAngle);
            const pEnd = polarToCart(cx, cy, rOuter, startAngle);

            // Opposite side
            const pStartOpp = polarToCart(cx, cy, rInner, endAngle);
            const pEndOpp = polarToCart(cx, cy, rOuter, endAngle);

            // Labels
            const labelPos = polarToCart(cx, cy, R * 0.92, startAngle);
            const labelPosOpp = polarToCart(cx, cy, R * 0.92, endAngle);

            results.push({
                name: main,
                label: main === 'Ascendant' ? 'ASC' : 'MC',
                line: { x1: pStart.x, y1: pStart.y, x2: pEnd.x, y2: pEnd.y },
                labelPos,
                deg: deg1 % 30 // Degree in sign
            });
            results.push({
                name: opposite,
                label: opposite === 'Descendant' ? 'DSC' : 'IC',
                line: { x1: pStartOpp.x, y1: pStartOpp.y, x2: pEndOpp.x, y2: pEndOpp.y },
                labelPos: labelPosOpp,
                deg: deg2 % 30
            });
        });
        return results;
    }, [normalizedData.points, ascDeg, R, cx, cy]);

    const aspectPaths = useMemo(() => {
        return normalizedData.aspects.map((asp, i) => {
            const p1 = planetNodes.find(n => n.name === asp.p1);
            const p2 = planetNodes.find(n => n.name === asp.p2);
            if (!p1 || !p2) return null;

            // Trigger exit animation by returning null when toggle is OFF
            if (!showNodeSignatures) {
                if (p1.type === 'node' || p2.type === 'node') return null;
            }

            const limits = ORB_LIMITS[orbStrictness] || ORB_LIMITS['standard'];
            const limit = (limits as any)[asp.type] || limits.default;
            const isGhost = asp.orb > limit;

            const config = ASPECT_CONFIG[asp.type] || { color: 'rgba(255,255,255,0.2)' };

            let opacity = 1;
            let color = config.color;

            // GHOST vs ACTIVE Styling
            if (isGhost) {
                // Ghost: Gray, Dashed, Dim but visible
                color = 'rgba(230, 230, 230, 0.8)'; // Increased visibility (was 200, 0.5)
                opacity = 0.6; // Increased from 0.3
            } else {
                // Active: Keep styling vivid! Do NOT dim excessively based on orb.
                // We want them to feel "lit up".
                color = config.color;
                opacity = 0.8 + ((1 - (asp.orb / limit)) * 0.2); // 0.8 to 1.0 based on tightness
            }

            // Aspect Radius: Tiny central circle
            const aspectR = R * 0.35;
            const start = polarToCart(cx, cy, aspectR, p1.visualAngle);
            const end = polarToCart(cx, cy, aspectR, p2.visualAngle);

            const d = `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
            // FIX: Include isGhost in key to force re-mount (redraw) on state change
            const key = `aspect-${asp.p1}-${asp.p2}-${asp.type}-${isGhost ? 'ghost' : 'active'}`;

            return { d, color, opacity, id: key, is_ghost: isGhost, ...asp };
        }).filter(Boolean);
    }, [planetNodes, normalizedData.aspects, cx, cy, showNodeSignatures, orbStrictness, R]);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1 } }
    };

    // Semantic Scale Factor: Invert zoom so elements stay same size visually
    const semanticScale = 1 / zoom;

    // --- SIGNATURE & AURA ---
    const dominantSignature = useMemo(() => {
        const counts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
        planetNodes.forEach(p => {
            // We need to know the element of the sign.
            // p.sign is a string like "Aries".
            // We can lookup index in SIGNS array then check ELEMENTS.
            const signIndex = SIGNS.indexOf(p.sign);
            if (signIndex === -1) return;

            if (ELEMENTS.Fire.includes(signIndex)) counts.Fire++;
            else if (ELEMENTS.Earth.includes(signIndex)) counts.Earth++;
            else if (ELEMENTS.Air.includes(signIndex)) counts.Air++;
            else if (ELEMENTS.Water.includes(signIndex)) counts.Water++;
        });

        // Find max
        const max = Math.max(...Object.values(counts));
        // Prioritize: Fire > Earth > Air > Water if tie (arbitrary/standard)
        if (counts.Fire === max) return { element: 'Fire', color: THEME.colors.fire };
        if (counts.Earth === max) return { element: 'Earth', color: THEME.colors.earth };
        if (counts.Air === max) return { element: 'Air', color: THEME.colors.air };
        return { element: 'Water', color: THEME.colors.water };
    }, [planetNodes]);

    // Connector Spoke Data
    // We calculate these here to keep render clean
    const connectorSpokes = useMemo(() => {
        return planetNodes.map(p => {
            // Spoke from Inner Web (R * 0.35) to Planet Glyph
            const aspectR = R * 0.35;
            const planetR = p.baseR - (size * 0.04);

            const start = polarToCart(cx, cy, aspectR, p.visualAngle);
            const end = polarToCart(cx, cy, planetR, p.visualAngle);

            return {
                id: p.name,
                x1: start.x, y1: start.y,
                x2: end.x, y2: end.y,
                color: THEME.colors.line
            };
        });
    }, [planetNodes, R, cx, cy, size]);

    return (
        <div
            ref={chartRef}
            className={`relative w-full h-full overflow-hidden cursor-move ${className}`}
            role="graphics-document"
            aria-label="Natal Astrology Chart"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: zoom > 1 ? 'none' : 'pan-y' }} // Allow page scroll if not zoomed, block if zoomed to pan
        >
            <motion.svg
                viewBox={`${(size - width) / 2} ${(size - height) / 2} ${width} ${height}`}
                className="w-full h-full select-none"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <div style={{ display: 'none' }}>
                    {/* Access definitions via standard SVG defs below */}
                </div>
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Stronger Planet Glow */}
                    <filter id="planet-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feFlood floodColor="white" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                        <feComposite in="glow" in2="SourceGraphic" operator="over" />
                    </filter>
                    <filter id="text-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feFlood floodColor={THEME.colors.highlight} result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                        <feComposite in="glow" in2="SourceGraphic" operator="over" />
                    </filter>

                    <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#1a1a2e" stopOpacity="1" />
                        <stop offset="100%" stopColor="#050505" stopOpacity="1" />
                    </radialGradient>

                    {/* Dynamic Aura Gradient */}
                    <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="60%" stopColor={dominantSignature.color} stopOpacity="0" />
                        <stop offset="90%" stopColor={dominantSignature.color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={dominantSignature.color} stopOpacity="0" />
                    </radialGradient>

                    {/* Arrow Markers for Axes */}
                    <marker id="arrow-asc" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill={THEME.colors.highlight} />
                    </marker>
                    <marker id="arrow-mc" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill={THEME.colors.houseNum} />
                    </marker>

                    {/* Elemental Gradients for Professional Look */}
                    <linearGradient id="grad-fire" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={THEME.colors.fire} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={THEME.colors.fire} stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="grad-earth" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={THEME.colors.earth} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={THEME.colors.earth} stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="grad-air" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={THEME.colors.air} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={THEME.colors.air} stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="grad-water" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={THEME.colors.water} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={THEME.colors.water} stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* TRANSFORM GROUP: Applied Zoom & Pan here */}
                <g transform={`translate(${pan.x}, ${pan.y}) translate(${cx}, ${cy}) scale(${zoom}) translate(${-cx}, ${-cy})`}>

                    {/* VIBRATING AURA BACKGROUND */}
                    <motion.circle
                        cx={cx} cy={cy}
                        r={R * 1.05}
                        fill="url(#auraGradient)"
                        filter="url(#glow)"
                        animate={{
                            scale: [1, 1.02, 1],
                            opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* BACKGROUND & HOUSES */}
                    <circle cx={cx} cy={cy} r={R * THEME.rings.outer} fill="#0a0a0a" stroke="#ffffff" strokeWidth={1} strokeOpacity={0.1} filter="url(#glow)" />

                    {/* Inner Web Circle Boundary */}
                    <circle cx={cx} cy={cy} r={R * 0.35} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="4,4" />

                    {/* Connector Spokes (Web to Planets) */}
                    <g opacity="0.8">
                        {connectorSpokes.map(spoke => (
                            <line
                                key={`spoke-${spoke.id}`}
                                x1={spoke.x1} y1={spoke.y1}
                                x2={spoke.x2} y2={spoke.y2}
                                stroke="rgba(255, 255, 255, 0.4)" // Manually brighter than THEME.colors.line
                                strokeWidth={1 * semanticScale}
                                strokeDasharray="2,4"
                            />
                        ))}
                    </g>

                    {/* House Lines */}
                    <g opacity="0.4">
                        {houseData.map((h, i) => (
                            <motion.line
                                key={`house-line-${i}`}
                                x1={h.line.x1} y1={h.line.y1}
                                x2={h.line.x2} y2={h.line.y2}
                                stroke={THEME.colors.line}
                                strokeWidth={1 * semanticScale} // CONSTANT STROKE WIDTH
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.4 }}
                                transition={{ duration: 1, delay: 0.5 + (i * 0.05) }}
                            />
                        ))}
                    </g>

                    {/* Degree Ticks Ring */}
                    <g opacity="0.6">
                        {ticks.map((tick, i) => (
                            <line
                                key={`deg-tick-${i}`}
                                x1={tick.x1} y1={tick.y1}
                                x2={tick.x2} y2={tick.y2}
                                stroke="rgba(255,255,255,0.7)"
                                strokeWidth={tick.strokeWidth * semanticScale}
                                strokeOpacity={tick.opacity}
                            />
                        ))}
                    </g>

                    {/* Degree Labels on Ring */}
                    <g>
                        {tickLabels.map((lbl, i) => (
                            <text
                                key={`deg-lbl-${i}`}
                                x={lbl.x} y={lbl.y}
                                textAnchor="middle" dominantBaseline="middle"
                                fill="rgba(255,255,255,0.5)"
                                fontSize={size * 0.012}
                                style={{ pointerEvents: 'none' }}
                            >
                                {lbl.text}
                            </text>
                        ))}
                    </g>

                    {/* ZODIAC RING */}
                    <g>
                        {zodiacSegments.map((seg, i) => {
                            let gradId = "grad-earth";
                            if (ELEMENTS.Fire.includes(i)) gradId = "grad-fire";
                            if (ELEMENTS.Air.includes(i)) gradId = "grad-air";
                            if (ELEMENTS.Water.includes(i)) gradId = "grad-water";

                            // Calculate Text Path for Curved Text matching the segment
                            const { midR, startAngle, endAngle, midAngle } = seg;

                            // Determine if text should be inverted (Top Hemisphere)
                            // In standard SVG coords, y < cy is Top.
                            // We want text to always be readable (upright).
                            // Bottom Half (y > cy): Standard CCW path (Start -> End) works (Text sits on "floor" of arc).
                            // Top Half (y < cy): Text would be upside down on "ceiling" of arc.
                            // Solution: Reverse path direction (End -> Start) for Top Half.
                            const glyphY = polarToCart(cx, cy, midR, midAngle).y;
                            const isTopHalf = glyphY < cy;

                            const tpStart = polarToCart(cx, cy, midR, startAngle);
                            const tpEnd = polarToCart(cx, cy, midR, endAngle);

                            // Define Path logic
                            const textPathId = `zodiac-curve-${i}`;

                            // Standard: Start -> End (CCW). Sweep 0 (Small arc).
                            // Reversed: End -> Start (CW). Sweep 0 (Small arc).

                            // FLIPPED LOGIC (User Request):
                            // Top Text -> Frown (Arc Over). Bottom -> Smile (Cup Under).

                            // 1. DIRECTION: Keep text Left-to-Right (Legible).
                            // Top (CW): End -> Start. Bottom (CCW): Start -> End.
                            const p1 = isTopHalf ? tpEnd : tpStart;
                            const p2 = isTopHalf ? tpStart : tpEnd;

                            // 2. CURVATURE: Flip arc sweep to invert smile/frown.
                            // User Feedback: Toggle sweep to fix inverted logic.
                            // Top Frown -> Sweep 1. Bottom Smile -> Sweep 0.
                            const sweep = isTopHalf ? 1 : 0;

                            const textPathD = `M ${p1.x} ${p1.y} A ${midR} ${midR} 0 0 ${sweep} ${p2.x} ${p2.y}`;

                            return (
                                <g key={seg.name}>
                                    {/* Hidden Path for Text Definition - Unique ID per segment */}
                                    <defs>
                                        <path id={textPathId} d={textPathD} />
                                    </defs>

                                    {/* Segment Body with Gradient */}
                                    <path
                                        d={seg.path}
                                        fill={`url(#${gradId})`}
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth={1 * semanticScale}
                                    />

                                    {/* Inner/Outer Rim Accents */}

                                    {/* Semantic Zoom for Zodiac Glyphs */}
                                    <g>
                                        {displayMode === 'text' ? (
                                            <text
                                                fontSize={size * 0.022}
                                                fontWeight="600"
                                                fill={seg.fill}
                                                fillOpacity="0.9"
                                                dy={isTopHalf ? -size * 0.015 : size * 0.015} // Extra Strong outward nudge
                                                style={{
                                                    pointerEvents: 'none',
                                                    letterSpacing: isTopHalf ? '0.15em' : '0.15em',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                <textPath
                                                    href={`#${textPathId}`}
                                                    startOffset="50%"
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                >
                                                    {seg.name}
                                                </textPath>
                                            </text>
                                        ) : (
                                            <g transform={`translate(${seg.glyphPos.x}, ${seg.glyphPos.y}) scale(${semanticScale})`}>
                                                <text
                                                    textAnchor="middle" dominantBaseline="central"
                                                    fill={seg.fill}
                                                    fillOpacity="0.9"
                                                    fontSize={size * 0.04}
                                                    fontWeight="bold"
                                                    style={{
                                                        pointerEvents: 'none'
                                                    }}
                                                >
                                                    {seg.symbol}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                </g>
                            );
                        })}
                    </g>

                    {/* House Numbers */}
                    <g>
                        {houseData.map((h, i) => (
                            <g key={`house-num-${i}`} transform={`translate(${h.labelPos.x}, ${h.labelPos.y}) scale(${semanticScale})`}>
                                <text
                                    textAnchor="middle" dominantBaseline="central"
                                    fill={THEME.colors.houseNum}
                                    fontSize={size * 0.03}
                                    fontWeight="bold"
                                    opacity={animationComplete ? 0.9 : 0.6}
                                    style={{
                                        pointerEvents: 'none',
                                        paintOrder: 'stroke fill',
                                        WebkitFontSmoothing: 'antialiased'
                                    }}
                                >
                                    {h.num}
                                </text>
                            </g>
                        ))}
                    </g>

                    {/* Pattern Highlights */}
                    <g className="pattern-highlights">
                        <AnimatePresence>
                            {patternShapes.map((shape: any) => (
                                <motion.path
                                    key={shape.id}
                                    d={shape.d}
                                    fill={shape.is_ghost ? 'rgba(230, 230, 230, 0.6)' : shape.style.color}
                                    stroke={shape.is_ghost ? 'rgba(255, 255, 255, 0.8)' : shape.style.color}
                                    strokeWidth={1 * semanticScale}
                                    strokeDasharray={shape.is_ghost ? "4,4" : "none"}
                                    fillOpacity={shape.is_ghost ? 0.15 : 0.15}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        mixBlendMode: 'screen',
                                        filter: `drop-shadow(0 0 8px ${shape.style.color})`
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </g>

                    {/* Aspects */}
                    <g className="aspect-lines opacity-80 pointer-events-none">
                        <AnimatePresence>
                            {aspectPaths.map((asp: any) => {
                                const isActive = selectedId === asp.p1 || selectedId === asp.p2;
                                const isHover = hoverId && (hoverId === asp.p1 || hoverId === asp.p2);
                                const shouldShow = !selectedId || isActive;
                                const isParallel = asp.type === 'Parallel' || asp.type === 'Contra-Parallel';

                                // Calculate "Dull" state for inactive aspects
                                // When something is selected, non-active aspects get muted but not hidden
                                const displayOpacity = shouldShow ? (isActive ? 1 : asp.opacity) : 0.25;
                                const displayColor = shouldShow ? asp.color : "rgba(100, 100, 100, 0.4)"; // Muted gray-scale for "dull" effect

                                return (
                                    <React.Fragment key={asp.id}>
                                        {/* Glow Effect for Parallels */}
                                        {isParallel && (isActive || shouldShow) && (
                                            <motion.path
                                                d={asp.d}
                                                stroke={displayColor}
                                                strokeWidth={4 * semanticScale}
                                                opacity={0.3}
                                                fill="none"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{
                                                    opacity: shouldShow ? 0.3 : 0.1,
                                                    pathLength: 1,
                                                    filter: "blur(4px)"
                                                }}
                                                exit={{ opacity: 0, pathLength: 0 }}
                                                transition={{ duration: 1.2 }}
                                            />
                                        )}

                                        <motion.path
                                            d={asp.d}
                                            stroke={displayColor}
                                            strokeWidth={(isActive || isHover ? (isParallel ? 3 : 2.5) : (isParallel ? 1.5 : 1.2)) * semanticScale}
                                            strokeDasharray={asp.is_ghost ? "6,4" : (isParallel ? "6,4" : "none")}
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{
                                                opacity: displayOpacity,
                                                pathLength: 1,
                                                stroke: displayColor // Force color update on animation update
                                            }}
                                            exit={{ pathLength: 0, opacity: 0, transition: { duration: 1.5 } }}
                                            transition={{
                                                // Default fast transition for Selection updates (Color/Opacity)
                                                default: { duration: 0.3, ease: "easeInOut" },
                                                // Slow delayed transition ONLY for Drawing (Mount/Unmount)
                                                pathLength: {
                                                    duration: 1.5,
                                                    ease: "easeInOut",
                                                    delay: 1.4 // Wait for exit of previous state
                                                }
                                            }}
                                            fill="none"
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </AnimatePresence>
                    </g>

                    {/* PLANETS with Semantic Zoom */}
                    <g role="list" aria-label="Planets">
                        {planetNodes.map((p, i) => {
                            const isSelected = selectedId === p.name;
                            const isHovered = hoverId === p.name;

                            // Semantic Zoom Container for each planet
                            // Locate at planet pos, then Scale DOWN (counter-zoom) so it stays same visual size
                            // BUT... as we zoom in, the distance between them (x, y) grows, which is what we want.
                            return (
                                <motion.g
                                    key={p.name}
                                    initial={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
                                    animate={{
                                        x: p.x,
                                        y: p.y,
                                        scale: (isHovered || isSelected) ? semanticScale * 1.3 : semanticScale,
                                        opacity: 1
                                    }}
                                    transition={{
                                        default: { type: "spring", stiffness: 200, damping: 20 },
                                        scale: { duration: 0.1 }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onSelect) onSelect({ id: p.name, data: p });
                                    }}
                                    onMouseEnter={() => setHoverId(p.name)}
                                    onMouseLeave={() => setHoverId(null)}
                                    className="cursor-pointer outline-none"
                                >
                                    {/* Tick Mark (needs to be outside scale? No, tick should scale with chart or stay fixed?) 
                                         Usually ticks scale with chart. But if we put them here, they will stay small fixed size.
                                         The tick lines are actually defined by absolute chart coords (pTickStart). 
                                         If we render them inside this semantic-scaled group, they will be tiny.
                                         So we should render ticks OUTSIDE this group if we want them to look 'attached to ring', 
                                         OR we maintain them here but draw them 'long' to match ring? 
                                         Better: Render ticks in the main chart group, not in the planet Semantic group.
                                     */}

                                    {/* Animated Border Ring - Removed per user request */}
                                    {/* <motion.circle
                                        cx={0} cy={0}
                                        r={size * 0.03}
                                        fill="none"
                                        stroke={THEME.colors.highlight}
                                        strokeWidth={1}
                                        strokeOpacity={0.3}
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            strokeOpacity: [0.3, 0.6, 0.3]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.2
                                        }}
                                    /> */}

                                    {/* Selection Pulse */}
                                    {isSelected && (
                                        <motion.circle
                                            cx={0} cy={0}
                                            r={size * 0.025}
                                            fill="none"
                                            stroke={THEME.colors.highlight}
                                            strokeWidth={1}
                                            animate={{ scale: 1.8, opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}

                                    {/* Glyph */}
                                    <circle
                                        cx={0} cy={0}
                                        r={size * 0.025}
                                        fill={isSelected ? THEME.colors.highlight : "#111"}
                                        stroke={isSelected ? THEME.colors.highlight : "rgba(255,255,255,0.5)"}
                                        strokeWidth={isSelected ? 0 : 1}
                                    />
                                    <text
                                        textAnchor="middle" dominantBaseline="central"
                                        fill={isSelected ? "#000" : "#FFF"}
                                        fontSize={displayMode === 'text' ? size * 0.013 : ((p.type === 'angle' || p.type === 'point') ? size * 0.024 : size * 0.03)}
                                        style={{ pointerEvents: 'none', opacity: (p.type === 'angle' || p.type === 'point') ? 0.8 : 1 }}
                                    >
                                        {displayMode === 'text'
                                            ? (POINT_LABELS[p.name] || p.name.substring(0, 3).toUpperCase())
                                            : ((SYMBOLS[p.name] ? SYMBOLS[p.name] + '\uFE0E' : (p.name ? p.name[0] : '?')))
                                        }
                                    </text>

                                    {/* Name Label - Moved Above Glyph */}
                                    <text
                                        y={-(size * 0.045)}
                                        textAnchor="middle"
                                        fill={isSelected ? THEME.colors.highlight : "rgba(255,255,255,0.9)"}
                                        stroke="#000"
                                        strokeWidth={3}
                                        fontSize={size * 0.018}
                                        fontWeight="600"
                                        style={{
                                            pointerEvents: 'none',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            paintOrder: 'stroke',
                                            strokeLinejoin: 'round',
                                            opacity: (isHovered || isSelected) ? 1 : 0, // Hide overhead text by default in both modes
                                            transition: 'opacity 0.2s ease'
                                        }}
                                    >
                                        {p.name}
                                    </text>

                                    {/* VISIBLE DEGREE MARKER - Moved Below Glyph */}
                                    <text
                                        y={(size * 0.055)}
                                        textAnchor="middle"
                                        fill="#7FFFD4" // NEW COLOR: Mint/Cyan for robustness against Yellow houses
                                        stroke="#000"
                                        strokeWidth={3}
                                        fontSize={size * 0.020}
                                        opacity={1}
                                        style={{
                                            pointerEvents: 'none',
                                            paintOrder: 'stroke',
                                            strokeLinejoin: 'round',
                                            fontFeatureSettings: '"tnum"',
                                            fontWeight: '600',
                                        }}
                                    >
                                        {(() => {
                                            const val = p.abs_deg % 30;
                                            const d = Math.floor(val);
                                            const m = Math.floor((val - d) * 60);
                                            // Show precise DMS if Global Toggle ON -OR- Hover/Selected
                                            if (showTruePositions || isHovered || isSelected) {
                                                return `${d}° ${m.toString().padStart(2, '0')}'`;
                                            }
                                            return `${d}°`;
                                        })()}
                                    </text>
                                </motion.g>
                            );
                        })}
                    </g>

                    {/* Connector Lines & Ticks */}
                    <g>
                        {planetNodes.map(p => {
                            // Check if visually displaced enough to warrant a leader line
                            const isDisplaced = Math.abs(p.trueAngle - p.visualAngle) > 0.5;
                            const leaderOpacity = isDisplaced ? 0.3 : 0;

                            return (
                                <g key={`connector-${p.name}`}>
                                    {/* True Position Tick on Ring */}
                                    <line
                                        x1={p.pTickStart.x} y1={p.pTickStart.y}
                                        x2={p.pTickEnd.x} y2={p.pTickEnd.y}
                                        stroke={THEME.colors.highlight}
                                        strokeWidth={1.5 * semanticScale}
                                        opacity="0.8"
                                    />

                                    {/* Leader Line from Tick to Glyph - BRIGHTENED */}
                                    <motion.line
                                        x1={p.pTickEnd.x} y1={p.pTickEnd.y}
                                        x2={p.x} y2={p.y}
                                        stroke="rgba(255, 255, 255, 0.4)" // Match connector brightness
                                        strokeWidth={1 * semanticScale} // Slightly thicker
                                        strokeDasharray={`${2 * semanticScale} ${2 * semanticScale}`}
                                        animate={{ opacity: 0.8 }} // Always visible, bright
                                    />
                                </g>
                            );
                        })}
                    </g>

                    {/* Angles (ASC/MC) - Clean & Informative */}
                    <g>
                        {anglesData.map((angle) => {
                            const color = (angle.name === 'Ascendant' || angle.name === 'Descendant') ? THEME.colors.highlight : THEME.colors.houseNum;
                            return (
                                <g key={angle.name}>
                                    {/* Line: Cleaner, thinner, no arrows */}
                                    <line
                                        x1={angle.line.x1} y1={angle.line.y1}
                                        x2={angle.line.x2} y2={angle.line.y2}
                                        stroke={color}
                                        strokeWidth={1.5 * semanticScale} // Reverted from 2
                                        strokeLinecap="round"
                                        strokeDasharray={(angle.name === 'Ascendant' || angle.name === 'Midheaven') ? "none" : "4,4"}
                                        opacity={0.8}
                                    />
                                    {/* Label & Degree */}
                                    <g transform={`translate(${angle.labelPos.x}, ${angle.labelPos.y}) scale(${semanticScale})`}>
                                        <text
                                            textAnchor="middle" dominantBaseline="auto"
                                            y={-4} // Shift up more Since baseline is bottom-ish
                                            fill={color}
                                            fontSize={size * 0.022}
                                            fontWeight="bold"
                                            style={{ textShadow: `0 1px 2px rgba(0,0,0,0.8)` }} // Subtle shadow only
                                        >
                                            {angle.label}
                                        </text>
                                        <text
                                            textAnchor="middle" dominantBaseline="hanging"
                                            y={2} // Shift down
                                            fill="#FFF"
                                            fontSize={size * 0.018}
                                            opacity={0.9}
                                            style={{ fontFeatureSettings: '"tnum"' }}
                                        >
                                            {Math.floor(angle.deg)}°
                                        </text>
                                    </g>
                                </g>
                            );
                        })}
                    </g>

                </g>
            </motion.svg>

            {/* RESET ZOOM BUTTON */}
            <AnimatePresence>
                {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => {
                            setZoom(1);
                            setPan({ x: 0, y: 0 });
                            onSelect?.({ id: '', type: 'planet' } as any);
                        }}
                        className="absolute top-8 right-2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/10 shadow-xl transition-colors group"
                        title="Reset View"
                    >
                        <Minimize2 size={20} className="group-hover:scale-90 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>


        </div>
    );
}
