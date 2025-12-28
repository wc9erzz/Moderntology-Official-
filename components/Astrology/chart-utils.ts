
export type { PointData, ChartData, Aspect, DignityInfo } from '@/utils/astrology/types';
import { PointData, ChartData, Aspect, DignityInfo } from '@/utils/astrology/types';
// Re-export common types



export const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];


export const SYMBOLS: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
    'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀',
    'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅',
    'Neptune': '♆', 'Pluto': '♇', 'Chiron': '⚷', 'North Node': '☊',
    'South Node': '☋', 'Rahu': '☊', 'Ketu': '☋',
    'Ascendant': 'As', 'Midheaven': 'Mc', 'Descendant': 'Ds', 'IC': 'Ic',
    'Vertex': 'Vx', 'EastPoint': 'Ea', 'East Point': 'Ea'
};

export const POINT_LABELS: Record<string, string> = {
    'Sun': 'SUN',
    'Moon': 'MOON',
    'Mercury': 'MER',
    'Venus': 'VEN',
    'Mars': 'MARS',
    'Jupiter': 'JUP',
    'Saturn': 'SAT',
    'Uranus': 'URA',
    'Neptune': 'NEP',
    'Pluto': 'PLU',
    'Chiron': 'CHI',
    'Rahu': 'RAHU',
    'Ketu': 'KETU',
    'North Node': 'RAHU',
    'South Node': 'KETU',
    'Ascendant': 'ASC',
    'Midheaven': 'MC',
    'Descendant': 'DSC',
    'IC': 'IC',
    'Vertex': 'VTX',
    'EastPoint': 'EP',
    'East Point': 'EP'
};

export const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const ASPECT_CONFIG: Record<string, { color: string; symbol: string; meaning: string; desc: string }> = {
    'Conjunction': { color: '#60a5fa', symbol: '☌', meaning: 'Merger', desc: 'Energies blend and act together (0°)' }, // Blue-400
    'Opposition': { color: '#f87171', symbol: '☍', meaning: 'Tension', desc: 'Polarity requiring balance (180°)' }, // Red-400
    'Square': { color: '#fb923c', symbol: '□', meaning: 'Friction', desc: 'Internal conflict driving action (90°)' }, // Orange-400
    'Trine': { color: '#4ade80', symbol: '△', meaning: 'Flow', desc: 'Natural harmony and ease (120°)' }, // Green-400
    'Sextile': { color: '#2dd4bf', symbol: '✱', meaning: 'Opportunity', desc: 'Cooperative connection (60°)' }, // Teal-400
    'Parallel': { color: '#a855f7', symbol: '∥', meaning: 'Synchronicity', desc: 'Equal declination (Power)' }, // Purple-500
    'Contra-Parallel': { color: '#d946ef', symbol: '⧉', meaning: 'Balance', desc: 'Opposite declination (Balance)' } // Fuchsia-500
};

export const ORB_LIMITS = {
    strict: { Conjunction: 6, Opposition: 6, Trine: 6, Square: 6, default: 6 },
    standard: { Conjunction: 9, Opposition: 9, Trine: 9, Square: 9, default: 9 },
    wide: { Conjunction: 13, Opposition: 13, Trine: 13, Square: 13, default: 13 }
};

// --- Pro Data Mappings ---

export const ELEMENT_MAP: Record<string, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
    'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
    'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
    'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
    'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
};

export const SIGN_COLORS: Record<string, string> = {
    'Aries': 'text-red-400',
    'Taurus': 'text-emerald-300',
    'Gemini': 'text-yellow-200',
    'Cancer': 'text-blue-200',
    'Leo': 'text-amber-400',
    'Virgo': 'text-lime-300',
    'Libra': 'text-rose-200',
    'Scorpio': 'text-indigo-400',
    'Sagittarius': 'text-purple-400',
    'Capricorn': 'text-zinc-300',
    'Aquarius': 'text-cyan-300',
    'Pisces': 'text-teal-200'
};

export const MODALITY_MAP: Record<string, 'Cardinal' | 'Fixed' | 'Mutable'> = {
    'Aries': 'Cardinal', 'Cancer': 'Cardinal', 'Libra': 'Cardinal', 'Capricorn': 'Cardinal',
    'Taurus': 'Fixed', 'Leo': 'Fixed', 'Scorpio': 'Fixed', 'Aquarius': 'Fixed',
    'Gemini': 'Mutable', 'Virgo': 'Mutable', 'Sagittarius': 'Mutable', 'Pisces': 'Mutable'
};

export const DIGNITIES: Record<string, { domicile: string[]; exaltation: string; detriment: string[]; fall: string }> = {
    'Sun': { domicile: ['Leo'], exaltation: 'Aries', detriment: ['Aquarius'], fall: 'Libra' },
    'Moon': { domicile: ['Cancer'], exaltation: 'Taurus', detriment: ['Capricorn'], fall: 'Scorpio' },
    'Mercury': { domicile: ['Gemini', 'Virgo'], exaltation: 'Virgo', detriment: ['Sagittarius', 'Pisces'], fall: 'Pisces' },
    'Venus': { domicile: ['Taurus', 'Libra'], exaltation: 'Pisces', detriment: ['Scorpio', 'Aries'], fall: 'Virgo' },
    'Mars': { domicile: ['Aries', 'Scorpio'], exaltation: 'Capricorn', detriment: ['Libra', 'Taurus'], fall: 'Cancer' },
    'Jupiter': { domicile: ['Sagittarius', 'Pisces'], exaltation: 'Cancer', detriment: ['Gemini', 'Virgo'], fall: 'Capricorn' },
    'Saturn': { domicile: ['Capricorn', 'Aquarius'], exaltation: 'Libra', detriment: ['Cancer', 'Leo'], fall: 'Aries' },
};

export const getDignity = (planet: string, sign: string) => {
    const d = DIGNITIES[planet];
    if (!d) return null;
    if (d.domicile.includes(sign)) return { type: 'Domicile', score: 5, label: 'RULERSHIP' };
    if (d.exaltation === sign) return { type: 'Exaltation', score: 4, label: 'EXALTED' };
    if (d.detriment.includes(sign)) return { type: 'Detriment', score: -5, label: 'DETRIMENT' };
    if (d.fall === sign) return { type: 'Fall', score: -4, label: 'FALL' };
    return null;
};

// --- Data Normalization ---

export const getSignIndex = (signName: string) => {
    return SIGNS.indexOf(signName);
};

export const normalizeChartData = (input: any): ChartData => {
    if (!input || !input.points) return { points: {}, houses: {}, aspects: [], meta: {} } as any;

    const points: Record<string, PointData> = {};

    // Normalize Points
    Object.entries(input.points).forEach(([key, val]: [string, any]) => {
        let name = val.name || key;
        // Normalize names for UI consistency and backward compatibility
        if (name === 'North Node' || name === 'Rahu') name = 'Rahu';
        if (name === 'South Node' || name === 'Ketu') name = 'Ketu';
        if (name === 'ASC' || name === 'Ascendant') name = 'Ascendant';
        if (name === 'MC' || name === 'Midheaven') name = 'Midheaven';

        const signIdx = getSignIndex(val.sign);
        const abs_deg = (val.abs_deg !== undefined) ? val.abs_deg : (signIdx * 30) + val.deg;

        // Categorize
        let type: 'planet' | 'node' | 'point' | 'angle' | 'star' = 'planet';
        const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
        const nodes = ['Rahu', 'Ketu'];
        const angles = ['Ascendant', 'Midheaven', 'Descendant', 'IC'];
        const pointsList = ['Vertex', 'East Point', 'EastPoint'];
        // Fixed stars
        const stars = ['Pleiades', 'Sirius', 'Arcturus', 'Andromeda', 'Orion', 'Lyra'];

        if (planets.includes(name)) type = 'planet';
        else if (nodes.includes(name)) type = 'node';
        else if (angles.includes(name)) type = 'angle';
        else if (pointsList.includes(name)) type = 'point';
        else if (stars.includes(name) || val.type === 'star') type = 'star';

        points[name] = {
            ...val,
            name: name,
            type,
            abs_deg: abs_deg,
            isRetro: val.retrograde || val.isRetro,
            speed: val.speed || 0
        };
    });

    // Ensure sensitive angles are present (mapping from engine keys to clean UI names)
    const angleMap: Record<string, string> = {
        'Ascendant': 'Ascendant',
        'MC': 'Midheaven',
        'Midheaven': 'Midheaven',
        'Descendant': 'Descendant',
        'IC': 'IC',
        'Vertex': 'Vertex',
        'EastPoint': 'EastPoint',
        'East Point': 'EastPoint'
    };

    const angles = input.angles || {};
    Object.entries(angleMap).forEach(([engineKey, uiName]) => {
        // Only add if it wasn't already normalized from 'points'
        if (!points[uiName]) {
            const angleData = angles[engineKey];
            if (angleData) {
                const signIdx = getSignIndex(angleData.sign);
                const abs_deg = (angleData.abs_deg !== undefined) ? angleData.abs_deg : (signIdx * 30) + angleData.deg;

                // Categorize angles
                let type: 'angle' | 'point' = 'angle';
                if (['Vertex', 'EastPoint', 'East Point'].includes(uiName)) type = 'point';

                points[uiName] = {
                    ...angleData,
                    name: uiName,
                    type,
                    abs_deg: abs_deg,
                    isRetro: false,
                    speed: 0
                };
            }
        }
    });

    // Normalize Houses 
    // (If input.houses exists, it might need abs_deg too if missing)
    const houses: Record<string, { abs_deg: number; deg: number; sign: string }> = {};
    if (input.houses) {
        Object.entries(input.houses).forEach(([key, val]: [string, any]) => {
            const signIdx = getSignIndex(val.sign);
            const abs_deg = (val.abs_deg !== undefined) ? val.abs_deg : (signIdx * 30) + val.deg;
            houses[key] = { ...val, abs_deg };
        });
    }

    // Normalize Aspects (simple pass-through usually)
    const aspects = Array.isArray(input.aspects) ? input.aspects : [];

    // Polyfill House Numbers (specifically for Vedic/Sidereal where engine might not return them)
    // Using Whole Sign House System logic relative to Ascendant
    const ascSign = points['Ascendant']?.sign || points['ASC']?.sign || (input.angles?.['Ascendant']?.sign);

    if (ascSign) {
        const ascIdx = getSignIndex(ascSign);
        Object.values(points).forEach(p => {
            // If house is missing or 0, calculate it
            if (!p.house) {
                const pIdx = getSignIndex(p.sign);
                if (pIdx !== -1 && ascIdx !== -1) {
                    // Whole Sign Calc: (Planet - Asc + 12) % 12 + 1
                    p.house = ((pIdx - ascIdx + 12) % 12) + 1;
                }
            }
        });
    }

    // Polyfill Aspects if missing (Simple Ptolemaic Calculator)
    // This ensures Vedic/Sidereal views have aspect data even if backend returns empty
    if (aspects.length === 0) {
        const aspectPairs = [
            'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
            'North Node', 'South Node', 'Chiron', 'Ascendant', 'Midheaven'
        ];

        for (let i = 0; i < aspectPairs.length; i++) {
            for (let j = i + 1; j < aspectPairs.length; j++) {
                const p1Name = aspectPairs[i];
                const p2Name = aspectPairs[j];
                const p1 = points[p1Name];
                const p2 = points[p2Name];

                if (p1 && p2) {
                    let diff = Math.abs(p1.abs_deg - p2.abs_deg);
                    if (diff > 180) diff = 360 - diff;

                    const orbSettings = ORB_LIMITS['standard']; // Default to standard for auto-calc

                    const checkAspect = (type: string, target: number) => {
                        const orb = Math.abs(diff - target);
                        const limit = (orbSettings as any)[type] || orbSettings.default;
                        if (orb <= limit) {
                            aspects.push({
                                p1: p1Name,
                                p2: p2Name,
                                type: type,
                                orb: orb
                            });
                        }
                    };

                    checkAspect('Conjunction', 0);
                    checkAspect('Sextile', 60);
                    checkAspect('Square', 90);
                    checkAspect('Trine', 120);
                    checkAspect('Opposition', 180);
                }
            }
        }
    }

    return {
        ...input,
        points,
        houses,
        aspects,
        meta: input.meta || {}
    };
};

// --- Advanced Calculations ---

export const getNakshatra = (absDeg: number) => {
    // Each Nakshatra is 13°20' (13.3333 degrees)
    const idx = Math.floor(absDeg / 13.333333);
    const percent = ((absDeg % 13.333333) / 13.333333) * 100;
    // Calculate Pada (Quarter) 1-4
    const pada = Math.floor(percent / 25) + 1;
    return {
        name: NAKSHATRAS[idx % 27],
        pada
    };
};

export const getAtmakaraka = (points: Record<string, PointData>) => {
    // Filter for 7 main planets (sometimes 8 with Rahu)
    // Jaimini usually uses: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
    const candidates = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

    let maxDeg = -1;
    let ak = null;

    candidates.forEach(name => {
        const p = points[name];
        if (p) {
            // Compare degree within sign (0-30)
            const degVal = p.deg + (p.min / 60);
            if (degVal > maxDeg) {
                maxDeg = degVal;
                ak = p;
            }
        }
    });

    return ak;
};

// --- Geometry Helpers ---


export const toRad = (deg: number) => (deg * Math.PI) / 180;
export const toDeg = (rad: number) => (rad * 180) / Math.PI;

export const polarToCart = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = toRad(angleDeg); // SVG standard: 0 is 3 o'clock, clockwise positive
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
};

// Converts astrological degree (0=Aries/Left, CCW) to SVG degree (0=3 o'clock, CW)
// adjusted for the Ascendant rotation
export const getVisualAngle = (absDeg: number, ascendantDeg: number) => {
    // 1. Shift so Ascendant is at 180 (Left)
    // Formula: (Degree - Asc) + 180
    let chartAngle = (absDeg - ascendantDeg) + 180;

    // 2. Normalize to 0-360
    chartAngle = (chartAngle + 360) % 360;

    // 3. SVG coordinate flip (Astrology is CCW, SVG is CW)
    // 0 deg (Aries/Asc) needs to be at 180 deg in SVG (Left)
    // Actually, simple projection: 
    // If Asc is 0 deg Aries. 
    // We want 0 deg Aries at 180 SVG.
    // We want 90 deg Cancer at 90 SVG (Bottom... wait SVG Y is down).
    // Let's stick to a standard rotation offset.
    return (360 - chartAngle) % 360;
};

// --- The "Anti-Collision" Solver ---
// Deprecated: Using clustering-utils.ts instead.

