
import { ChartData } from './types';

export interface YogaResult {
    id: string;
    name: string;
    description: string;
    planets: string[];
    effects: string;
    intensity: 'Major' | 'Medium' | 'Minor';
}

const KENDRA_HOUSES = [1, 4, 7, 10];
const TRIKONA_HOUSES = [1, 5, 9];
const WEALTH_HOUSES = [2, 11];

// Helper: Get Lord of a specific house
// Requires knowledge of Ascendant Sign to map House 1 -> Sign -> Ruler
const RULERSHIPS: Record<string, string> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

const ZODIAC_ORDER = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const EXALTATION_SIGNS: Record<string, string> = {
    'Sun': 'Aries', 'Moon': 'Taurus', 'Mars': 'Capricorn', 'Mercury': 'Virgo',
    'Jupiter': 'Cancer', 'Venus': 'Pisces', 'Saturn': 'Libra'
};

const OWN_SIGNS: Record<string, string[]> = {
    'Sun': ['Leo'],
    'Moon': ['Cancer'],
    'Mars': ['Aries', 'Scorpio'],
    'Mercury': ['Gemini', 'Virgo'],
    'Jupiter': ['Sagittarius', 'Pisces'],
    'Venus': ['Taurus', 'Libra'],
    'Saturn': ['Capricorn', 'Aquarius']
};

function getHouseLord(houseNum: number, ascSign: string): string {
    // 1. Find Sign of the House
    const ascIndex = ZODIAC_ORDER.indexOf(ascSign);
    if (ascIndex === -1) return '';

    // House 1 is Asc sign. House 2 is next sign.
    // Index = (AscIndex + (HouseNum - 1)) % 12
    const signIndex = (ascIndex + (houseNum - 1)) % 12;
    const signName = ZODIAC_ORDER[signIndex];

    return RULERSHIPS[signName] || '';
}

export function detectVedicYogas(data: ChartData): YogaResult[] {
    const results: YogaResult[] = [];
    const points = data.points;
    const ascSign = points['Ascendant']?.sign;

    if (!ascSign) return [];

    // Map: Planet -> House
    const planetHouses: Record<string, number> = {};
    Object.values(points).forEach(p => {
        if (p.type === 'planet') {
            planetHouses[p.name] = p.house;
        }
    });

    // --- 1. RAJA YOGA (Power) ---
    // Connection between Kendra Lord (1,4,7,10) and Trikona Lord (1,5,9)
    // "Connection" = Conjunction (same house) or Aspect (Mutual aspect in Vedic is usually 1/7)
    // Simplified: Conjunction only for MVP robustness

    // Identify Lords
    const kendraLords = KENDRA_HOUSES.map(h => ({ lord: getHouseLord(h, ascSign), house: h }));
    const trikonaLords = TRIKONA_HOUSES.map(h => ({ lord: getHouseLord(h, ascSign), house: h }));

    // Check Conjunctions
    kendraLords.forEach(k => {
        trikonaLords.forEach(t => {
            if (k.lord && t.lord && k.lord !== t.lord) {
                // If they are in the same house
                const houseK = planetHouses[k.lord];
                const houseT = planetHouses[t.lord];

                if (houseK && houseT && houseK === houseT) {
                    // Check deduplication
                    const id = `raja-${[k.lord, t.lord].sort().join('-')}`;
                    if (!results.find(r => r.id === id)) {
                        results.push({
                            id,
                            name: 'Raja Yoga',
                            description: `Union of ${k.lord} (Lord of H${k.house}) and ${t.lord} (Lord of H${t.house}) in House ${houseK}.`,
                            planets: [k.lord, t.lord],
                            effects: "Grants status, authority, and professional success.",
                            intensity: 'Major'
                        });
                    }
                }
            }
        });
    });

    // --- 2. DHANA YOGA (Wealth) ---
    // Lords of 2 or 11 connecting with Lords of 5 or 9
    const wealthLords = WEALTH_HOUSES.map(h => ({ lord: getHouseLord(h, ascSign), house: h }));
    const trinaLords = [5, 9].map(h => ({ lord: getHouseLord(h, ascSign), house: h })); // 1 is excluded usually for pure Dhana logic but can be included. Let's stick to 5/9 for clarity.

    wealthLords.forEach(w => {
        trinaLords.forEach(t => {
            if (w.lord && t.lord && w.lord !== t.lord) {
                const houseW = planetHouses[w.lord];
                const houseT = planetHouses[t.lord];

                if (houseW && houseT && houseW === houseT) {
                    const id = `dhana-${[w.lord, t.lord].sort().join('-')}`;
                    if (!results.find(r => r.id === id)) {
                        results.push({
                            id,
                            name: 'Dhana Yoga',
                            description: `Wealth combination: ${w.lord} (Lord of H${w.house}) and ${t.lord} (Lord of H${t.house}) joined.`,
                            planets: [w.lord, t.lord],
                            effects: "Indicates financial prosperity and accumulation of assets.",
                            intensity: 'Major'
                        });
                    }
                }
            }
        });
    });

    // --- 3. PANCHA MAHAPURUSHA YOGA (Great Man) ---
    // Mars, Mercury, Jupiter, Venus, Saturn -> In Own or Exalted Sign -> In a Kendra (Angle) from Ascendant
    const mahapurushaPlanets = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const yogaNames: Record<string, string> = {
        'Mars': 'Ruchaka Yoga',
        'Mercury': 'Bhadra Yoga',
        'Jupiter': 'Hamsa Yoga',
        'Venus': 'Malavya Yoga',
        'Saturn': 'Sasa Yoga'
    };

    mahapurushaPlanets.forEach(planet => {
        const pData = points[planet];
        if (!pData) return;

        // Condition 1: In Kendra House (1, 4, 7, 10)
        if (!KENDRA_HOUSES.includes(pData.house)) return;

        // Condition 2: Own or Exalted Sign
        const sign = pData.sign;
        const isOwn = OWN_SIGNS[planet]?.includes(sign);
        const isExalted = EXALTATION_SIGNS[planet] === sign;

        if (isOwn || isExalted) {
            results.push({
                id: `mahapurusha-${planet}`,
                name: yogaNames[planet],
                description: `${planet} is ${isExalted ? 'Exalted' : 'in Own Sign'} in the ${pData.house}${getOrdinal(pData.house)} House.`,
                planets: [planet],
                effects: `A 'Great Man' yoga granting powerful ${planet} qualities (Strength, Intellect, Wisdom, Valor, or Discipline).`,
                intensity: 'Major'
            });
        }
    });

    return results;
}

function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
