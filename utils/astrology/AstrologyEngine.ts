import { MakeTime, Body, Equator, Ecliptic, GeoVector, SiderealTime, Observer, HelioVector } from 'astronomy-engine';
import { DateTime } from 'luxon';
import { ChartData, PointData, Aspect, Dignity, DignityInfo, GeoLocation } from './types';
import { detectChartPatterns } from './pattern-detection';
import { detectVedicYogas } from './VedicYogas';

// Constants
const ZODIAC_NAMES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const MAJOR_ASPECTS: [string, number, number][] = [
    ["Conjunction", 0, 8], ["Sextile", 60, 6],
    ["Square", 90, 8], ["Trine", 120, 8], ["Opposition", 180, 8]
];

const RULERSHIPS: Record<string, string> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

const EXALTATIONS: Record<string, string> = {
    'Sun': 'Aries', 'Moon': 'Taurus', 'Mercury': 'Virgo',
    'Venus': 'Pisces', 'Mars': 'Capricorn', 'Jupiter': 'Cancer', 'Saturn': 'Libra'
};

const TRIPLICITY_MAP: Record<string, { day: string, night: string }> = {
    'fire': { 'day': 'Sun', 'night': 'Jupiter' },
    'earth': { 'day': 'Venus', 'night': 'Moon' },
    'air': { 'day': 'Saturn', 'night': 'Mercury' },
    'water': { 'day': 'Mars', 'night': 'Mars' }
};

const ELEMENT_MAP: Record<string, string> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagittarius': 'fire',
    'Taurus': 'earth', 'Virgo': 'earth', 'Capricorn': 'earth',
    'Gemini': 'air', 'Libra': 'air', 'Aquarius': 'air',
    'Cancer': 'water', 'Scorpio': 'water', 'Pisces': 'water'
};

const TERMS_STRUCTURE: Record<string, [number, string][]> = {
    'Aries': [[6, 'Jupiter'], [12, 'Venus'], [20, 'Mercury'], [25, 'Mars'], [30, 'Saturn']],
    'Taurus': [[8, 'Venus'], [14, 'Mercury'], [22, 'Jupiter'], [27, 'Saturn'], [30, 'Mars']],
    'Gemini': [[6, 'Mercury'], [12, 'Jupiter'], [17, 'Venus'], [24, 'Mars'], [30, 'Saturn']],
    'Cancer': [[7, 'Mars'], [13, 'Venus'], [19, 'Mercury'], [26, 'Jupiter'], [30, 'Saturn']],
    'Leo': [[6, 'Jupiter'], [11, 'Venus'], [18, 'Saturn'], [24, 'Mercury'], [30, 'Mars']],
    'Virgo': [[7, 'Mercury'], [17, 'Venus'], [21, 'Jupiter'], [28, 'Mars'], [30, 'Saturn']],
    'Libra': [[6, 'Saturn'], [14, 'Mercury'], [21, 'Jupiter'], [28, 'Venus'], [30, 'Mars']],
    'Scorpio': [[7, 'Mars'], [11, 'Venus'], [19, 'Mercury'], [24, 'Jupiter'], [30, 'Saturn']],
    'Sagittarius': [[12, 'Jupiter'], [17, 'Venus'], [21, 'Mercury'], [26, 'Saturn'], [30, 'Mars']],
    'Capricorn': [[7, 'Venus'], [14, 'Mercury'], [22, 'Jupiter'], [26, 'Mars'], [30, 'Saturn']],
    'Aquarius': [[7, 'Mercury'], [13, 'Venus'], [20, 'Jupiter'], [25, 'Mars'], [30, 'Saturn']],
    'Pisces': [[12, 'Venus'], [16, 'Jupiter'], [19, 'Mercury'], [28, 'Mars'], [30, 'Saturn']]
};

const FIXED_STARS: Record<string, number> = {
    'Andromeda': 14.30,   // Alpheratz (14° 18' Aries)
    'Pleiades': 59.98,    // Alcyone (29° 59' Taurus)
    'Orion': 88.75,       // Betelgeuse (28° 45' Gemini)
    'Sirius': 104.08,     // Sirius (14° 05' Cancer)
    'Arcturus': 204.23,   // Arcturus (24° 14' Libra)
    'Lyra': 285.32        // Vega (15° 19' Capricorn)
};

const CHALDEAN_ORDER = ['Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter'];

export type OrbStrictness = 'strict' | 'standard' | 'wide';

interface OrbPreset {
    conjunction: { base: number; luminaryBonus: number };
    opposition: { base: number; luminaryBonus: number };
    trine: { base: number; luminaryBonus: number };
    square: { base: number; luminaryBonus: number };
    sextile: { base: number; luminaryBonus: number };
}

const ORB_PRESETS: Record<OrbStrictness, OrbPreset> = {
    'strict': { // Modern / Sharp
        conjunction: { base: 6, luminaryBonus: 0 },
        opposition: { base: 6, luminaryBonus: 0 },
        trine: { base: 6, luminaryBonus: 0 },
        square: { base: 5, luminaryBonus: 0 },
        sextile: { base: 4, luminaryBonus: 0 }
    },
    'standard': { // Gold Standard (Default)
        conjunction: { base: 8, luminaryBonus: 2 },
        opposition: { base: 8, luminaryBonus: 2 },
        trine: { base: 8, luminaryBonus: 2 },
        square: { base: 7, luminaryBonus: 2 },
        sextile: { base: 6, luminaryBonus: 2 }
    },
    'wide': { // Classical / Witnessing
        conjunction: { base: 10, luminaryBonus: 3 },
        opposition: { base: 10, luminaryBonus: 3 },
        trine: { base: 10, luminaryBonus: 2 },
        square: { base: 8, luminaryBonus: 2 },
        sextile: { base: 6, luminaryBonus: 1 }
    }
};

export class AstrologyEngine {

    constructor(ephe_path: string | null = null) {
        // No init needed
    }

    private _toDms(totalDeg: number, extra: Partial<PointData> = {}): PointData {
        totalDeg = totalDeg % 360;
        if (totalDeg < 0) totalDeg += 360;

        let signId = Math.floor(totalDeg / 30);
        const degInSignFloat = totalDeg % 30;

        let d = Math.floor(degInSignFloat);
        const mFloat = (degInSignFloat - d) * 60;
        let m = Math.floor(mFloat);
        const sFloat = (mFloat - m) * 60;
        let s = Math.round(sFloat);

        if (s >= 60) { s -= 60; m += 1; }
        if (m >= 60) { m -= 60; d += 1; }
        if (d >= 30) {
            d -= 30;
            signId = (signId + 1) % 12;
        }

        return {
            name: '',
            sign: ZODIAC_NAMES[signId],
            deg: d,
            min: m,
            sec: s,
            abs_deg: totalDeg,
            retrograde: false,
            house: 0,
            type: 'planet', // Default
            ...extra
        };
    }

    private getBody(name: string): Body {
        switch (name) {
            case 'Sun': return Body.Sun;
            case 'Moon': return Body.Moon;
            case 'Mercury': return Body.Mercury;
            case 'Venus': return Body.Venus;
            case 'Mars': return Body.Mars;
            case 'Jupiter': return Body.Jupiter;
            case 'Saturn': return Body.Saturn;
            case 'Uranus': return Body.Uranus;
            case 'Neptune': return Body.Neptune;
            case 'Pluto': return Body.Pluto;
            default: return Body.Sun;
        }
    }

    private getAyanamsa(date: Date): number {
        // 1. Julian Days (J2000 epoch)
        // 2451545.5 is J2000.0 (Jan 1 2000 12:00 TT)
        // Date.getTime() is UTC. The difference (Delta T) is negligible 
        // for Ayanamsa over these timeframes, so using UTC is safe.
        const msPerDay = 86400000;
        const j2000Epoch = 946728000000; // ms from 1970 to 2000

        // Days since J2000.0
        const days = (date.getTime() - j2000Epoch) / msPerDay;

        // Julian Centuries (T)
        const T = days / 36525.0;

        // --- CONSTANTS ---
        // Base: 23° 51' 25.532"
        // 23 + (51/60) + (25.532/3600) = 23.85709222...
        const base = 23.8570922222;

        // Rate: 50.290966" per year = 5029.0966" per century
        // 5029.0966 / 3600 = 1.396971277... degrees/century
        const rate = 1.3969712778;

        // Acceleration: High precision secular term (optional but adds accuracy for < 1000 AD)
        // Swiss Eph uses a slightly complex polynomial, but standard IAU uses:
        const accel = 0.0003086;

        // Calculation
        const ayanamsa = base + (rate * T) + (accel * T * T);

        return ayanamsa;
    }

    private getOrbLimit(p1: string, p2: string, aspectType: string, strictness: OrbStrictness): number {
        const preset = ORB_PRESETS[strictness];
        let setting = preset.conjunction;

        switch (aspectType) {
            case 'Conjunction': setting = preset.conjunction; break;
            case 'Opposition': setting = preset.opposition; break;
            case 'Trine': setting = preset.trine; break;
            case 'Square': setting = preset.square; break;
            case 'Sextile': setting = preset.sextile; break;
        }

        const isLuminary = (name: string) => name === 'Sun' || name === 'Moon';
        const bonus = (isLuminary(p1) || isLuminary(p2)) ? setting.luminaryBonus : 0;

        return setting.base + bonus;
    }

    private isApplying(
        d1: number,
        d2: number,
        s1: number,
        s2: number,
        targetAngle: number
    ): boolean {
        // Normalize degrees
        const normalize = (d: number) => {
            let res = d % 360;
            if (res < 0) res += 360;
            return res;
        };

        const getDistFromTarget = (pos1: number, pos2: number) => {
            let diff = Math.abs(pos1 - pos2);
            if (diff > 180) diff = 360 - diff;
            return Math.abs(diff - targetAngle);
        };

        const currentOrb = getDistFromTarget(d1, d2);

        // Project 1 day forward
        // Apply speed (degrees per day)
        const d1_next = normalize(d1 + s1);
        const d2_next = normalize(d2 + s2);

        const nextOrb = getDistFromTarget(d1_next, d2_next);

        // If orbit is getting tighter, it's Applyng
        return nextOrb < currentOrb;
    }

    private getHouseSystemName(code: string): string {
        const names: Record<string, string> = {
            'W': 'Whole Sign',
            'E': 'Equal',
            'P': 'Placidus',
            'K': 'Koch',
            'R': 'Regiomontanus'
        };
        return names[code.toUpperCase()] || 'Equal';
    }

    /**
     * Calculate essential dignities for a planet
     * @param planetName - Name of the planet
     * @param signName - Zodiac sign the planet is in
     * @returns Array of dignity types (e.g., ['Rulership', 'Exaltation'])
     */
    private calculateDignities(planetName: string, signName: string): Dignity[] {
        const dignities: Dignity[] = [];

        // Rulership
        if (RULERSHIPS[signName] === planetName) {
            dignities.push('Rulership');
        }

        // Exaltation
        if (EXALTATIONS[planetName] === signName) {
            dignities.push('Exaltation');
        }

        // Detriment (opposite of rulership)
        const oppositeSignIdx = (ZODIAC_NAMES.indexOf(signName) + 6) % 12;
        const oppositeSign = ZODIAC_NAMES[oppositeSignIdx];
        if (RULERSHIPS[oppositeSign] === planetName) {
            dignities.push('Detriment');
        }

        // Fall (opposite of exaltation)
        if (EXALTATIONS[planetName]) {
            const exaltSignIdx = ZODIAC_NAMES.indexOf(EXALTATIONS[planetName]);
            const fallSign = ZODIAC_NAMES[(exaltSignIdx + 6) % 12];
            if (signName === fallSign) {
                dignities.push('Fall');
            }
        }

        // Peregrine (no dignities)
        if (dignities.length === 0) {
            dignities.push('Peregrine');
        }

        return dignities;
    }

    /**
     * Calculate dignity score
     * Rulership: +5, Exaltation: +4, Detriment: -5, Fall: -4, Peregrine: 0
     */
    private getDignityScore(dignities: Dignity[]): number {
        let score = 0;
        for (const dig of dignities) {
            switch (dig) {
                case 'Rulership': score += 5; break;
                case 'Exaltation': score += 4; break;
                case 'Detriment': score -= 5; break;
                case 'Fall': score -= 4; break;
                case 'Peregrine': score = 0; break;
            }
        }
        return score;
    }

    /**
     * Calculate house cusps based on the specified house system
     * @param system - House system code: 'W' (Whole Sign), 'E' (Equal), 'P' (Placidus), 'K' (Koch), 'R' (Regiomontanus)
     * @param ascDeg - Tropical Ascendant degree
     * @param mcDeg - Tropical MC degree  
     * @param latRad - Geographic latitude in radians
     * @param ramc - Right Ascension of MC in degrees
     * @param epsRad - Obliquity of ecliptic in radians
     * @param adjustment - Ayanamsa adjustment (0 for Western, ~24° for Vedic)
     * @returns Array of 12 house cusp longitudes (already adjusted for ayanamsa)
     */
    private calculateHouseCusps(
        system: string,
        ascDeg: number,
        mcDeg: number,
        latRad: number,
        ramc: number,
        epsRad: number,
        adjustment: number
    ): number[] {
        const cusps: number[] = [];

        switch (system.toUpperCase()) {
            case 'W': // Whole Sign Houses
                // 1. First, find a sidereal-aware Ascendant for sign determination
                // Robust Wrap: ((x % n) + n) % n ensures positive result even for large negative inputs
                // Ayanamsa is usually ~24, so simple +360 is fine, but this is safer for universal dates.
                let siderealAsc = ((ascDeg - adjustment) % 360 + 360) % 360;

                // 2. Each house is exactly 30°, starting from the 0° mark of the sidereal sign of the Ascendant
                const signStartSidereal = Math.floor(siderealAsc / 30) * 30;
                for (let i = 0; i < 12; i++) {
                    const cuspDeg = (signStartSidereal + (i * 30)) % 360;
                    cusps.push(cuspDeg);
                }
                break;

            case 'P': // Placidus (approximated via Porphyry for simplicity)
            case 'K': // Koch (using Porphyry as fallback)
            case 'R': // Regiomontanus (using Porphyry as fallback)
                // Porphyry: Divide quadrants by MC/IC and ASC/DSC into thirds
                // This is a geometric simplification of Placidus
                const asc = ascDeg % 360;
                const mc = mcDeg % 360;
                const dsc = (asc + 180) % 360;
                const ic = (mc + 180) % 360;

                // Quadrant 1: ASC to MC
                const q1_span = (mc - asc + 360) % 360;
                cusps[0] = asc;
                cusps[1] = (asc + q1_span / 3) % 360;
                cusps[2] = (asc + 2 * q1_span / 3) % 360;
                cusps[3] = mc;

                // Quadrant 2: MC to DSC
                const q2_span = (dsc - mc + 360) % 360;
                cusps[4] = (mc + q2_span / 3) % 360;
                cusps[5] = (mc + 2 * q2_span / 3) % 360;
                cusps[6] = dsc;

                // Quadrant 3: DSC to IC
                const q3_span = (ic - dsc + 360) % 360;
                cusps[7] = (dsc + q3_span / 3) % 360;
                cusps[8] = (dsc + 2 * q3_span / 3) % 360;
                cusps[9] = ic;

                // Quadrant 4: IC to ASC
                const q4_span = (asc - ic + 360) % 360;
                cusps[10] = (ic + q4_span / 3) % 360;
                cusps[11] = (ic + 2 * q4_span / 3) % 360;

                // Apply ayanamsa adjustment
                for (let i = 0; i < 12; i++) {
                    cusps[i] = (cusps[i] - adjustment + 360) % 360;
                }
                break;

            case 'E': // Equal Houses (default)
            default:
                for (let i = 0; i < 12; i++) {
                    let cuspDeg = (ascDeg + (i * 30)) % 360;
                    cuspDeg -= adjustment;
                    if (cuspDeg < 0) cuspDeg += 360;
                    cusps.push(cuspDeg);
                }
                break;
        }

        return cusps;
    }

    private getNakshatra(absDeg: number): string {
        // Nakshatra = 360 / 27 = 13.3333 degrees
        const index = Math.floor(absDeg / (360 / 27));
        return NAKSHATRAS[index] || '';
    }



    public async calculate(
        dateStr: string,
        timeStr: string,
        location: GeoLocation,
        houseSystem: string = 'P',
        system: 'western' | 'vedic' = 'western',
        orbStrictness: OrbStrictness = 'standard'
    ): Promise<ChartData> {
        // --- SYSTEM ENFORCEMENT ---
        // Western = Placidus (usually), Geometric Aspects
        // Vedic = Whole Sign, Parashari Aspects, Sidereal Ayanamsa

        let activeHouseSystem = houseSystem;
        if (system === 'vedic') {
            activeHouseSystem = 'W'; // Force Whole Sign for Vedic
            orbStrictness = 'strict'; // Not used in Parashari logic but good specific default
        }

        // 1. Time
        const [y, m, d] = dateStr.split('-').map(Number);
        const [h, min] = timeStr.split(':').map(Number);

        const dt = DateTime.fromObject(
            { year: y, month: m, day: d, hour: h, minute: min },
            { zone: location.tz_str }
        );

        const realUtcTs = dt.toMillis();
        const astroTime = MakeTime(new Date(realUtcTs));

        // Ayanamsa
        const adjustment = system === 'vedic' ? this.getAyanamsa(new Date(realUtcTs)) : 0;

        // 2. Planets - Use topocentric coordinates for better accuracy
        const observer = new Observer(location.lat, location.lon, 0); // altitude = 0 (sea level)

        const getTropicalPos = (body: Body, time: any) => {
            // Use topocentric correction especially important for the Moon
            const gVec = GeoVector(body, time, true);
            const currEcl = Ecliptic(gVec);
            const eq = Equator(body, time, observer, true, false);

            return {
                lon: currEcl.elon,
                ra: eq.ra * 15,
                dec: eq.dec
            };
        };

        const getHeliocentricPos = (body: Body, time: any) => {
            if (body === Body.Sun || body === Body.Moon) return null;
            const vec = HelioVector(body, time);
            let lonRad = Math.atan2(vec.y, vec.x);
            if (lonRad < 0) lonRad += 2 * Math.PI;
            return lonRad * 180 / Math.PI;
        }

        const positions: Record<string, { abs_deg: number, speed: number }> = {};
        const points: Record<string, PointData> = {};
        const helioPoints: Record<string, PointData> = {};

        const bodyList = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

        for (const name of bodyList) {
            const body = this.getBody(name);
            const trop = getTropicalPos(body, astroTime);
            let lon = trop.lon - adjustment;
            if (lon < 0) lon += 360;

            // Retrograde Calculation (1 min Delta for instant velocity)
            // Note: For Applying/Separating, we ideally want Daily Motion. 
            // Instant speed * 1440 gives deg/day approx.
            const t2 = MakeTime(new Date(realUtcTs + 60000));
            const trop2 = getTropicalPos(body, t2);
            let speed = (trop2.lon - trop.lon);
            if (speed > 180) speed -= 360;
            if (speed < -180) speed += 360;
            speed = speed * 1440; // deg/day

            const posData = this._toDms(lon, {
                name,
                speed,
                ra: trop.ra,
                dec: trop.dec,
                retrograde: speed < 0,
                abs_deg: lon
            });
            posData.house = 0; // Filled later

            points[name] = posData;
            positions[name] = { abs_deg: lon, speed };

            // Heliocentric
            if (name !== 'Sun' && name !== 'Moon') {
                let hLon = getHeliocentricPos(body, astroTime);
                if (hLon !== null) {
                    hLon -= adjustment;
                    if (hLon < 0) hLon += 360;
                    helioPoints[name] = { ...this._toDms(hLon), name, abs_deg: hLon };
                }
            } else if (name === 'Sun') {
                let earthLon = (lon + 180) % 360;
                helioPoints['Earth'] = this._toDms(earthLon, { name: 'Earth', speed: 0 });
            }
        }

        // Calculate Mean North Node (Rahu) and South Node (Ketu)
        // Mean North Node formula: 125.0446° - 0.0529539° * days_since_J2000
        const daysJ2000 = (realUtcTs - new Date('2000-01-01T12:00:00Z').getTime()) / 86400000;
        let rahuLon = (125.0446 - 0.0529539 * daysJ2000) % 360;
        if (rahuLon < 0) rahuLon += 360;

        // Apply ayanamsa for Vedic
        let rahuAdjusted = rahuLon - adjustment;
        if (rahuAdjusted < 0) rahuAdjusted += 360;

        // Ketu is always 180° opposite Rahu
        let ketuAdjusted = (rahuAdjusted + 180) % 360;

        // Add to points
        points['Rahu'] = { ...this._toDms(rahuAdjusted), name: 'Rahu', retrograde: true, abs_deg: rahuAdjusted };
        points['Ketu'] = { ...this._toDms(ketuAdjusted), name: 'Ketu', retrograde: true, abs_deg: ketuAdjusted };

        // Add to positions for house assignment
        positions['Rahu'] = { abs_deg: rahuAdjusted, speed: -0.053 }; // Mean daily motion (retrograde)
        positions['Ketu'] = { abs_deg: ketuAdjusted, speed: -0.053 };

        // Galactic Center
        // J2000 Position: ~26° 57' 05" Sagittarius = 26.95139° relative to Sag (240°)
        // Precession Rate: ~50.23" per year = ~0.013953° per year
        const yearsJ2000 = daysJ2000 / 365.25;
        let gcDegSag = 26.95139 + (yearsJ2000 * 0.013953);
        let gcAbs = 240 + gcDegSag;
        gcAbs -= adjustment;
        const galacticCenter = {
            ...this._toDms(gcAbs),
            name: 'Galactic Center',
            type: 'point' as const,
            house: 0 // Will be assigned house logic if needed, or treated as background point
        };
        // Removed erroneous data.extras assignment; galacticCenter constant is used in baseData construction below

        // 3. Angles & Houses
        const gmst = SiderealTime(astroTime);
        // ... (Existing house math kept same for stability, condensed for brevity in block view but preserving logic) ...
        const latRad = location.lat * Math.PI / 180;
        const ramc = (gmst * 15 + location.lon) % 360;
        const ramcRad = ramc * Math.PI / 180;
        const epsRad = 23.4365 * Math.PI / 180;

        // MC
        let mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad));
        if (mcRad < 0) mcRad += 2 * Math.PI;
        const mcDeg = mcRad * 180 / Math.PI;

        // Ascendant
        const ascY = Math.cos(ramcRad);
        const ascX = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
        let ascRad = Math.atan2(ascY, ascX);
        if (ascRad < 0) ascRad += 2 * Math.PI;
        const ascDeg = ascRad * 180 / Math.PI;

        // Adjust Angles for Sidereal
        let ascCalc = ascDeg - adjustment;
        if (ascCalc < 0) ascCalc += 360;
        let mcCalc = mcDeg - adjustment;
        if (mcCalc < 0) mcCalc += 360;

        const angles = {
            Ascendant: { ...this._toDms(ascCalc), name: 'Ascendant', abs_deg: ascCalc },
            MC: { ...this._toDms(mcCalc), name: 'Midheaven', abs_deg: mcCalc },
            Descendant: { ...this._toDms((ascCalc + 180) % 360), name: 'Descendant', abs_deg: (ascCalc + 180) % 360 },
            IC: { ...this._toDms((mcCalc + 180) % 360), name: 'Imum Coeli', abs_deg: (mcCalc + 180) % 360 },
            Vertex: { ...this._toDms(0), name: 'Vertex', abs_deg: 0 }, // Placeholder
            EastPoint: { ...this._toDms(0), name: 'East Point', abs_deg: 0 }, // Placeholder
        };

        // Vertex
        const coLatRad = (90 - location.lat) * Math.PI / 180;
        const ramcVx = ramcRad + Math.PI;
        const vxY_val = Math.cos(ramcVx);
        const vxX_val = -Math.sin(ramcVx) * Math.cos(epsRad) - Math.tan(coLatRad) * Math.sin(epsRad);
        let vxRad = Math.atan2(vxY_val, vxX_val);
        if (vxRad < 0) vxRad += 2 * Math.PI;
        let vxDeg = vxRad * 180 / Math.PI;
        vxDeg -= adjustment;
        angles.Vertex = { ...this._toDms(vxDeg), name: 'Vertex', abs_deg: vxDeg };

        // East Point
        const epY = Math.cos(ramcRad);
        const epX = -Math.sin(ramcRad) * Math.cos(epsRad);
        let epRad = Math.atan2(epY, epX);
        if (epRad < 0) epRad += 2 * Math.PI;
        let epDeg = epRad * 180 / Math.PI;
        epDeg -= adjustment;
        angles.EastPoint = { ...this._toDms(epDeg), name: 'East Point', abs_deg: epDeg };

        // House Cusps - Support Multiple Systems
        const houses: Record<number, PointData> = {};
        const cusps = this.calculateHouseCusps(houseSystem, ascDeg, mcDeg, latRad, ramc, epsRad, adjustment);

        for (let i = 1; i <= 12; i++) {
            houses[i] = { ...this._toDms(cusps[i - 1]), abs_deg: cusps[i - 1] };
        }

        // Assign Houses to planets/nodes
        Object.keys(points).forEach(name => {
            const p = points[name];
            let found = false;
            for (let i = 1; i <= 12; i++) {
                let start = cusps[i - 1];
                let end = cusps[i % 12];
                let test = p.abs_deg;

                // Handle wraparound
                if (end < start) {
                    if (test >= start || test < end) {
                        p.house = i;
                        found = true;
                        break;
                    }
                } else {
                    if (test >= start && test < end) {
                        p.house = i;
                        found = true;
                        break;
                    }
                }
            }
        });

        // --- FIXED STARS CALCULATION ---
        // Precession Rate: 50.23" per year = 0.013953° per year
        const precessionAdjustment = yearsJ2000 * 0.013953;

        Object.entries(FIXED_STARS).forEach(([name, j2000Lon]) => {
            // 1. Apply Precession to get Current Tropical Longitude
            let currentLon = j2000Lon + precessionAdjustment;

            // 2. Adjust for Vedic if needed
            if (system === 'vedic') {
                currentLon -= adjustment;
            }

            // Normalize
            currentLon = (currentLon % 360 + 360) % 360;

            const starData = this._toDms(currentLon, {
                name,
                type: 'star',
                speed: 0
            });

            // Assign House
            for (let i = 1; i <= 12; i++) {
                let start = cusps[i - 1];
                let end = cusps[i % 12];
                let test = currentLon;
                if (end < start) {
                    if (test >= start || test < end) {
                        starData.house = i;
                        break;
                    }
                } else {
                    if (test >= start && test < end) {
                        starData.house = i;
                        break;
                    }
                }
            }

            points[name] = starData;
        });

        // 4. Aspects (Mode Dependent)
        const aspects: Aspect[] = [];

        if (system === 'western') {
            // Standard Geometric Aspects (Western)
            const aspectBodyList = [...bodyList, 'Rahu', 'Ketu']; // Nodes included in Western often
            for (let i = 0; i < aspectBodyList.length; i++) {
                for (let j = i + 1; j < aspectBodyList.length; j++) {
                    const p1 = aspectBodyList[i];
                    const p2 = aspectBodyList[j];
                    const d1 = positions[p1].abs_deg;
                    const d2 = positions[p2].abs_deg;
                    const s1 = positions[p1].speed;
                    const s2 = positions[p2].speed;

                    let diff = Math.abs(d1 - d2);
                    if (diff > 180) diff = 360 - diff;

                    for (const [asp, exact, _ignoredBaseOrb] of MAJOR_ASPECTS) {
                        const limit = this.getOrbLimit(p1, p2, asp, orbStrictness);
                        const wideLimit = this.getOrbLimit(p1, p2, asp, 'wide');
                        const currentOrb = Math.abs(diff - exact);

                        if (currentOrb <= wideLimit) {
                            const isApp = this.isApplying(d1, d2, s1, s2, exact);
                            let isGhost = currentOrb > limit;

                            if (isGhost && !isApp) continue;

                            aspects.push({
                                p1,
                                p2,
                                type: asp,
                                orb: parseFloat(currentOrb.toFixed(2)),
                                orb_limit: isGhost ? wideLimit : limit,
                                ghost_threshold: limit,
                                applying: isApp,
                                is_ghost: isGhost
                            });
                        }
                    }
                }
            }

            // Parallel/Contra-Parallel (Western Only)
            for (let i = 0; i < bodyList.length; i++) {
                for (let j = i + 1; j < bodyList.length; j++) {
                    const p1 = bodyList[i];
                    const p2 = bodyList[j];
                    const dec1 = points[p1].dec || 0;
                    const dec2 = points[p2].dec || 0;

                    if (Math.abs(dec1 - dec2) < 1.0) {
                        aspects.push({
                            p1, p2, type: 'Parallel', orb: Math.abs(dec1 - dec2), orb_limit: 1.0, applying: false
                        });
                    }
                    if (Math.abs(Math.abs(dec1) - Math.abs(dec2)) < 0.1 && dec1 * dec2 < 0) {
                        aspects.push({
                            p1, p2, type: 'Contra-Parallel', orb: Math.abs(Math.abs(dec1) - Math.abs(dec2)), orb_limit: 1.0, applying: false
                        });
                    }
                }
            }

        } else {
            // Vedic (Parashari) Aspects - Sign Based
            // TODO: Implement full Parashari logic here if desired, 
            // but for now we might rely on the 'Yogas' to tell the story.
            // Or we can implement simple 1/7 opposition for all + special rays.
            // For MVP: Let's stick to generating 'Yogas' as the primary "aspect" data for Vedic
            // and maybe return basic Opposition/Conjunction for the chart lines via Geometric check (widened) 
            // so visualized lines still appear? 
            // Users usually expect lines. Let's run a simplified geometric check for Vedic (Whole Sign Aspect)
            // Implementation: If in 7th sign from self -> aspect.

            // Simplified Vedic Aspects (for visualization lines)
            const aspectBodyList = [...bodyList]; // Nodes usually don't cast aspects in some schools, but let's keep simple
            for (let i = 0; i < aspectBodyList.length; i++) {
                for (let j = i + 1; j < aspectBodyList.length; j++) {
                    const p1 = aspectBodyList[i];
                    const p2 = aspectBodyList[j];
                    // Sign-based approach
                    // House distance = (Sign2 - Sign1 + 12) % 12 + 1

                    const sign1 = ZODIAC_NAMES.indexOf(points[p1].sign);
                    const sign2 = ZODIAC_NAMES.indexOf(points[p2].sign);

                    // Conjunction (1/1)
                    if (sign1 === sign2) {
                        aspects.push({ p1, p2, type: 'Conjunction', orb: 0, orb_limit: 15, applying: false });
                    }

                    // Opposition (1/7)
                    const dist = (sign2 - sign1 + 12) % 12 + 1;
                    if (dist === 7) {
                        aspects.push({ p1, p2, type: 'Opposition', orb: 0, orb_limit: 15, applying: false });
                    }

                    // Special Aspects (Mars 4/8, Saturn 3/10, Jupiter 5/9)
                    const checkSpecial = (planet: string, houseDist: number) => {
                        if (p1 === planet && dist === houseDist) return true;
                        if (p2 === planet && ((sign1 - sign2 + 12) % 12 + 1) === houseDist) return true; // Inverse
                        return false;
                    }

                    // We can add these later if we want detailed lines, for now Conjunction/Opposition is core visual
                }
            }
        }

        // Calculate Dignities for all planets
        const dignities: Record<string, DignityInfo> = {};
        for (const name of bodyList) {
            const sign = points[name].sign;
            const digList = this.calculateDignities(name, sign);
            dignities[name] = {
                score: this.getDignityScore(digList),
                items: digList
            };
        }



        const sunHouse = points['Sun'].house;
        const isDay = (sunHouse >= 7 && sunHouse <= 12);

        // --- DATA OBJECT ASSEMBLY ---
        const baseData: ChartData = {
            meta: {
                local_time: `${dateStr} ${timeStr}`,
                utc_time: new Date(realUtcTs).toISOString(),
                location,
                house_system: this.getHouseSystemName(activeHouseSystem),
                system: system
            },
            points,
            houses, // Now properly typed
            angles,
            aspects,
            dignities,
            extras: {
                sect: isDay ? 'Day' : 'Night',
                galactic_center: galacticCenter
            },
            heliocentric: helioPoints as any,
            harmonics: {
                h5: Object.fromEntries(Object.entries(positions).map(([k, v]) => [k, (v.abs_deg * 5) % 360])),
                h7: Object.fromEntries(Object.entries(positions).map(([k, v]) => [k, (v.abs_deg * 7) % 360])),
                h9: Object.fromEntries(Object.entries(positions).map(([k, v]) => [k, (v.abs_deg * 9) % 360]))
            },
            midpoints: {
                'Sun/Moon': (positions['Sun'].abs_deg + positions['Moon'].abs_deg) / 2
            }
        };

        // --- SIGNATURE DETECTION ---
        if (system === 'western') {
            baseData.patterns = detectChartPatterns(baseData);
        } else {
            baseData.yogas = detectVedicYogas(baseData);

            // Attach Nakshatras to all points
            Object.values(baseData.points).forEach(p => {
                p.nakshatra = this.getNakshatra(p.abs_deg);
            });
            // And Ascendant/MC
            baseData.angles.Ascendant.nakshatra = this.getNakshatra(baseData.angles.Ascendant.abs_deg);
            baseData.angles.MC.nakshatra = this.getNakshatra(baseData.angles.MC.abs_deg);
        }

        return baseData;
    }
}
