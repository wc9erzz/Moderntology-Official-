
import { ChartData, PointData } from './types';

export type Dignity = 'Exalted' | 'Moolatrikona' | 'Own Sign' | 'Great Friend' | 'Friend' | 'Neutral' | 'Enemy' | 'Great Enemy' | 'Debilitated';
export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Dual';

export const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Planet Relationships (Simplified Parashara)
// Format: [Friends, Neutrals, Enemies] - but simplified to simplified lookup
// Actually we need standard table or simplified logic.
// Basic scheme:
// Sun: Fr(Moon, Mars, Jup), Nu(Mer), En(Ven, Sat)
// Moon: Fr(Sun, Mer), Nu(Mars, Jup, Ven, Sat), En(None - but often Rahu/Ketu)
// Mars: Fr(Sun, Moon, Jup), Nu(Ven, Sat), En(Mer)
// Mer: Fr(Sun, Ven), Nu(Mars, Jup, Sat), En(Moon)
// Jup: Fr(Sun, Moon, Mars), Nu(Sat), En(Mer, Ven)
// Ven: Fr(Mer, Sat), Nu(Mars, Jup), En(Sun, Moon)
// Sat: Fr(Mer, Ven), Nu(Jup), En(Sun, Moon, Mars)

const PLANET_RELATIONSHIPS: Record<string, { friends: string[], enemies: string[] }> = {
    'Sun': { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn', 'Rahu', 'Ketu'] },
    'Moon': { friends: ['Sun', 'Mercury'], enemies: ['Rahu', 'Ketu'] }, // Moon has no enemies usually, but for dignity calc, some treat others as neutral
    'Mars': { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury', 'Rahu', 'Ketu'] },
    'Mercury': { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
    'Jupiter': { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
    'Venus': { friends: ['Mercury', 'Saturn', 'Rahu', 'Ketu'], enemies: ['Sun', 'Moon'] },
    'Saturn': { friends: ['Mercury', 'Venus', 'Rahu', 'Ketu'], enemies: ['Sun', 'Moon', 'Mars'] },
    'Rahu': { friends: ['Venus', 'Saturn'], enemies: ['Sun', 'Moon', 'Mars'] },
    'Ketu': { friends: ['Mars', 'Venus'], enemies: ['Sun', 'Moon', 'Saturn'] }
};

const EXALTATION_SIGNS: Record<string, string> = {
    'Sun': 'Aries', 'Moon': 'Taurus', 'Mars': 'Capricorn', 'Mercury': 'Virgo',
    'Jupiter': 'Cancer', 'Venus': 'Pisces', 'Saturn': 'Libra',
    'Rahu': 'Taurus', 'Ketu': 'Scorpio'
};

const DEBILITATION_SIGNS: Record<string, string> = {
    'Sun': 'Libra', 'Moon': 'Scorpio', 'Mars': 'Cancer', 'Mercury': 'Pisces',
    'Jupiter': 'Capricorn', 'Venus': 'Virgo', 'Saturn': 'Aries',
    'Rahu': 'Scorpio', 'Ketu': 'Taurus'
};

const OWN_SIGNS: Record<string, string[]> = {
    'Sun': ['Leo'],
    'Moon': ['Cancer'],
    'Mars': ['Aries', 'Scorpio'],
    'Mercury': ['Gemini', 'Virgo'],
    'Jupiter': ['Sagittarius', 'Pisces'],
    'Venus': ['Taurus', 'Libra'],
    'Saturn': ['Capricorn', 'Aquarius'],
    'Rahu': ['Aquarius'], // Co-lord
    'Ketu': ['Scorpio']   // Co-lord
};

export function calculateDignity(planet: string, sign: string): Dignity {
    if (EXALTATION_SIGNS[planet] === sign) return 'Exalted';
    if (DEBILITATION_SIGNS[planet] === sign) return 'Debilitated';
    if (OWN_SIGNS[planet]?.includes(sign)) return 'Own Sign';

    // Simplified Friend/Enemy logic (ignoring temporary/compound relationships for UI simplicity)
    const rel = PLANET_RELATIONSHIPS[planet];
    if (!rel) return 'Neutral';

    // Get ruler of the sign
    const ruler = getSignRuler(sign);
    if (!ruler) return 'Neutral';
    if (ruler === planet) return 'Own Sign'; // Should be caught above but safety check

    if (rel.friends.includes(ruler)) return 'Friend';
    if (rel.enemies.includes(ruler)) return 'Enemy';

    return 'Neutral';
}

function getSignRuler(sign: string): string | null {
    for (const [planet, signs] of Object.entries(OWN_SIGNS)) {
        // Filter out Nodes co-lordships for primary ruler logic usually, but here fine.
        // Priority: Mars for Scorpio, Saturn for Aqua. 
        if (signs.includes(sign)) {
            // Prefer classical rulers
            if (sign === 'Scorpio' && planet === 'Ketu') continue;
            if (sign === 'Aquarius' && planet === 'Rahu') continue;
            return planet;
        }
    }
    return null;
}

// --- D9 Navamsa Calculation ---
// Each sign is 9 padas. 12 signs = 108 padas total.
// 1 Pada = 3deg 20min (3.333 deg)
export function calculateD9Chart(d1Points: Record<string, PointData>): Record<string, PointData> {
    const d9Points: Record<string, PointData> = {};

    Object.entries(d1Points).forEach(([name, p]) => {
        // Calculate total absolute longitude (0-360)
        let absDeg = p.abs_deg;
        if (absDeg === undefined) {
            const signIdx = ZODIAC_SIGNS.indexOf(p.sign);
            absDeg = (signIdx * 30) + p.deg + (p.min / 60);
        }

        const totalMin = absDeg * 60;
        const navamsaIdx = Math.floor(totalMin / 200); // 3deg 20min = 200min
        const d9SignIdx = navamsaIdx % 12;
        const d9Sign = ZODIAC_SIGNS[d9SignIdx];

        // Calculate degree within Navamsa (0-30 range for the Navamsa sign)
        const remainderMin = totalMin % 200;
        const degInNavamsa = (remainderMin / 200) * 30;
        const d = Math.floor(degInNavamsa);
        const m = Math.floor((degInNavamsa - d) * 60);

        d9Points[name] = {
            ...p,
            sign: d9Sign,
            deg: d,
            min: m,
            abs_deg: (d9SignIdx * 30) + degInNavamsa,
            house: 0, // Recalculated below
        };
    });

    // Recalculate Houses based on D9 Ascendant
    const ascSign = d9Points['Ascendant']?.sign;
    if (ascSign) {
        const ascIdx = ZODIAC_SIGNS.indexOf(ascSign);
        Object.values(d9Points).forEach(p => {
            const pIdx = ZODIAC_SIGNS.indexOf(p.sign);
            // House = (PlanetSign - AscSign) + 1
            // Handle wrap around math
            let h = (pIdx - ascIdx) + 1;
            if (h <= 0) h += 12;
            p.house = h;
        });
    }

    return d9Points;
}


// --- Vimshottari Dasha Calculation ---
// Cycle: Ketu(7y), Ven(20), Sun(6), Mon(10), Mar(7), Rah(18), Jup(16), Sat(19), Mer(17) = 120y
const DASHA_LORDS = [
    { name: 'Ketu', years: 7 },
    { name: 'Venus', years: 20 },
    { name: 'Sun', years: 6 },
    { name: 'Moon', years: 10 },
    { name: 'Mars', years: 7 },
    { name: 'Rahu', years: 18 },
    { name: 'Jupiter', years: 16 },
    { name: 'Saturn', years: 19 },
    { name: 'Mercury', years: 17 }
];

export function calculateVimshottari(moonAbsDeg: number, birthDate: Date) {
    // 1. Find Moon's Nakshatra position
    // Total 27 nakshatras. 360 / 27 = 13.3333 deg per nakshatra.
    const nakshatraSpan = 360 / 27;
    const nakshatraProgress = moonAbsDeg / nakshatraSpan; // e.g. 1.5 = Halfway through Bharani (2nd)

    const nakshatraIndex = Math.floor(nakshatraProgress); // 0-26
    const fractionTraversed = nakshatraProgress - nakshatraIndex; // 0.0 - 1.0 (How much passed)
    const fractionRemaining = 1.0 - fractionTraversed; // How much left at birth

    // 2. Map Nakshatra to Dasha Lord
    // Nakshatras 1,10,19 -> Ketu starts
    // Sequence wraps around. simpler:
    // Lord Index = nakshatraIndex % 9
    // BUT Verify standard mapping: Ashwini(0) -> Ketu. Bharani(1) -> Venus.
    // Yes, 1st Nakshatra ruled by Ketu.

    const startLordIdx = nakshatraIndex % 9;
    const startLord = DASHA_LORDS[startLordIdx];

    // 3. Calculate Balance of Dasha at Birth
    const balanceYears = startLord.years * fractionRemaining;
    const birthTime = birthDate.getTime();

    // 4. Generate Timeline
    const timeline = [];
    let currentTime = birthTime + (balanceYears * 365.25 * 24 * 60 * 60 * 1000); // End of first dasha

    // Add first period (Partial)
    timeline.push({
        lord: startLord.name,
        start: birthDate,
        end: new Date(currentTime),
        duration: balanceYears
    });

    // Add subsequent periods
    for (let i = 1; i <= 9; i++) {
        const nextIdx = (startLordIdx + i) % 9;
        const lord = DASHA_LORDS[nextIdx];
        const duration = lord.years;
        const startTime = new Date(currentTime);
        const endTimeMs = currentTime + (duration * 365.25 * 24 * 60 * 60 * 1000);

        timeline.push({
            lord: lord.name,
            start: startTime,
            end: new Date(endTimeMs),
            duration: duration
        });

        currentTime = endTimeMs;
        if (new Date(currentTime).getFullYear() > new Date().getFullYear() + 80) break; // Limit to ~100 years
    }

    return timeline;
}

export function calculateAntardashas(mahadashaLordName: string, mahadashaStartDate: Date) {
    const parent = DASHA_LORDS.find(l => l.name === mahadashaLordName);
    if (!parent) return [];

    const startIndex = DASHA_LORDS.findIndex(l => l.name === mahadashaLordName);
    const subPeriods = [];
    let currentTime = mahadashaStartDate.getTime();

    for (let i = 0; i < 9; i++) {
        const idx = (startIndex + i) % 9;
        const subLord = DASHA_LORDS[idx];

        // Formula: (Macro Years * Sub Years) / 120
        const subYears = (parent.years * subLord.years) / 120;

        const startTime = new Date(currentTime);
        const endTimeMs = currentTime + (subYears * 365.25 * 24 * 60 * 60 * 1000);

        subPeriods.push({
            lord: subLord.name,
            start: startTime,
            end: new Date(endTimeMs),
            duration: subYears
        });

        currentTime = endTimeMs;
    }
    return subPeriods;
}
