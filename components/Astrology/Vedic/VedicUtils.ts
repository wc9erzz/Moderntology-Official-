export const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const SIGN_RULERS: Record<string, string> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

/**
 * Standardized context extractor for Vedic charts
 */
export const getVedicContext = (data: any) => {
    if (!data) return { ascSign: 'Aries', ascIndex: 0 };

    // Find Ascendant sign reliably across different data shapes
    const points = data.points || {};
    const angles = data.angles || {};
    const ascPoint = points['Ascendant'] || points['ASC'] || angles['Ascendant'] || angles['ASC'] ||
        Object.values(points).find((p: any) => p.name?.toUpperCase() === 'ASCENDANT' || p.name?.toUpperCase() === 'ASC');

    const sign = ascPoint?.sign || 'Aries';
    const index = ZODIAC_SIGNS.findIndex(s => s.toLowerCase() === sign.toLowerCase());

    return {
        ascSign: sign,
        ascIndex: index === -1 ? 0 : index
    };
};

/**
 * Standardized degree formatter for Vedic charts.
 */
export const formatVedicDegree = (absDeg: number, precise = false) => {
    const degInSign = absDeg % 30;
    const d = Math.floor(degInSign);
    if (!precise) return `${d}°`;
    const m = Math.floor((degInSign - d) * 60);
    return `${d}° ${m.toString().padStart(2, '0')}'`;
};

/**
 * Returns Nakshatra name and Pada (1-4)
 */
export const getNakshatraInfo = (absDeg: number) => {
    const totalMinutes = absDeg * 60;
    const nakshatraMinutes = 800; // 13 deg 20 min
    const index = Math.floor(totalMinutes / nakshatraMinutes);
    const remainder = totalMinutes % nakshatraMinutes;
    const pada = Math.floor(remainder / 200) + 1;
    return {
        name: NAKSHATRAS[index % 27],
        pada: pada > 4 ? 4 : pada
    };
};

export const SIGN_ELEMENTS: Record<string, string> = {
    'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
    'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
    'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
    'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
};

export const ELEMENT_COLORS: Record<string, { bg: string; text: string }> = {
    'Fire': { bg: 'rgba(239, 68, 68, 0.03)', text: 'rgba(239, 68, 68, 0.6)' },
    'Earth': { bg: 'rgba(34, 197, 94, 0.03)', text: 'rgba(34, 197, 94, 0.6)' },
    'Air': { bg: 'rgba(59, 130, 246, 0.03)', text: 'rgba(59, 130, 246, 0.6)' },
    'Water': { bg: 'rgba(168, 85, 247, 0.03)', text: 'rgba(168, 85, 247, 0.6)' }
};
