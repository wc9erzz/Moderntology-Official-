// utils/astrology/MoonEngine.ts
import {
    MakeTime,
    Body,
    Observer,
    Equator,
    Ecliptic,
    Illumination,
    SiderealTime,
    GeoVector,
    EquatorFromVector
} from 'astronomy-engine';

const ZODIAC = [
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

/**
 * Calculates Lahiri Ayanamsa to match AstrologyEngine.ts
 * Formula: 23.85 + (yearsSinceJ2000 * 0.01397)
 */
interface MoonData {
    sign: string;
    deg: number;
    min: number;
    full_degree: number;
    abs_deg: number;
    nakshatra: string;
    system: string;
    ra?: number;
    dec?: number;
    speed?: number;
    is_clamped?: boolean;
    error?: boolean;
}

function processMoonLongitude(longitude: number, astroTime: any, system: 'western' | 'vedic'): MoonData {
    const ayanamsa = getLahiriAyanamsa(astroTime);

    // 1. Determine Display Longitude (Tropical vs Sidereal)
    let displayLon = longitude;

    // If calculating for Vedic, convert Tropical(Date) input to Sidereal
    if (system === 'vedic') {
        displayLon = (longitude - ayanamsa + 360) % 360;
    }

    // 2. Calculate Sign & Degree (for visual display)
    const signIndex = Math.floor(displayLon / 30);
    const signName = ZODIAC[signIndex];
    const degreesRaw = displayLon % 30;
    const deg = Math.floor(degreesRaw);
    const min = Math.floor((degreesRaw - deg) * 60);

    // 3. Calculate Nakshatra (ALWAYS based on Sidereal)
    const siderealLongitude = (longitude - ayanamsa + 360) % 360;
    const nakshatraIndex = Math.floor(siderealLongitude / (360 / 27));
    const nakshatraName = NAKSHATRAS[nakshatraIndex];

    return {
        sign: signName,
        deg,
        min,
        full_degree: parseFloat(degreesRaw.toFixed(4)),
        abs_deg: displayLon,
        nakshatra: nakshatraName,
        system
    };
}

function getLahiriAyanamsa(astroTime: any) {
    const daysSinceJ2000 = astroTime.ut; // Days since J2000.0
    const yearsSinceJ2000 = daysSinceJ2000 / 365.25;
    return 23.85 + (yearsSinceJ2000 * 0.01397);
}

export function getMoonData(dateStr: string, timeStr: string, latInput: number, lonInput: number, system: 'western' | 'vedic' = 'western', utcDate?: Date) {
    // 1. Setup & Sanitization
    let date: Date;
    if (utcDate) {
        date = utcDate;
    } else if (dateStr && timeStr) {
        date = new Date(`${dateStr}T${timeStr}:00`);
    } else {
        date = new Date();
    }

    // Ensure numeric coordinates
    const lat = typeof latInput === 'number' ? latInput : parseFloat(latInput);
    const lon = typeof lonInput === 'number' ? lonInput : parseFloat(lonInput);

    // Validate inputs
    if (isNaN(lat) || isNaN(lon)) {
        return { error: "Invalid Coordinates" };
    }

    const astroTime = MakeTime(date);
    const observer = new Observer(lat, lon, 0); // Sea level

    // 2. Global Phase
    const illum = Illumination(Body.Moon, astroTime);
    const illuminationPct = (illum.phase_fraction * 100).toFixed(1);

    let phaseName = 'Gibbous';
    if (illum.phase_fraction > 0.98) phaseName = 'Full Moon';
    else if (illum.phase_fraction < 0.02) phaseName = 'New Moon';
    else if (illum.phase_fraction < 0.5) phaseName = 'Crescent';

    const commonData = {
        phase: phaseName,
        illumination: `${illuminationPct}% `
    };

    /**
     * Helper: Convert RA/Dec (Equatorial) to Ecliptic Longitude
     * Requires Obliquity (eps) in radians.
     */
    const toEclipticLon = (ra: number, dec: number, eps: number) => {
        const raRad = ra * 15 * Math.PI / 180; // RA is in hours
        const decRad = dec * Math.PI / 180;

        // Formulate conversion
        // sin(lat) = sin(dec)cos(eps) - cos(dec)sin(eps)sin(ra)
        // cos(lat)cos(lon) = cos(dec)cos(ra)
        // cos(lat)sin(lon) = sin(dec)sin(eps) + cos(dec)cos(eps)sin(ra)

        const y = Math.sin(decRad) * Math.sin(eps) + Math.cos(decRad) * Math.cos(eps) * Math.sin(raRad);
        const x = Math.cos(decRad) * Math.cos(raRad);

        let lonRad = Math.atan2(y, x);
        if (lonRad < 0) lonRad += 2 * Math.PI;

        return lonRad * 180 / Math.PI;
    };

    // Calculate True Obliquity of Date for conversion
    // Using Ecliptic of Date to get epsilon
    const sol = GeoVector(Body.Sun, astroTime, true);
    const eclipticTrue = Ecliptic(sol); // Solar ecliptic latitude is ~0, so this gives us frame ref? 
    // Actually astronomy-engine doesn't expose Epsilon directly easily in pub API? 
    // Ecliptic() converts J2000 Vector to Date Ecliptic? No.
    // Let's use a standard Approx for Epsilon if needed, or reverse engineer.
    // Eps ~ 23.4367 - ...
    // Better: Astronomy Engine `Ecliptic` function converts a VECTOR to Ecliptic Angles. 
    // If I had a Topocentric VECTOR, I could use it.
    // BUT Equator() gives RA/Dec.

    // Let's use the Vector approach using library Observer vector!
    // Observer Vector (Geocentric)
    // The library doesn't strictly expose "VectorFromObserver" in public types sometimes.
    // BUT my previous manual math was: Vector_Topo = Vector_Geo - Vector_Obs.
    // The issue was Frame Mismatch (J2000 vs Date).

    // CORRECT APPROACH using Library:
    // 1. Get Geocentric Vector (J2000) -> `gv`
    // 2. Get Observer Vector (J2000) !!!!
    //    How? 
    //    We can calculate Observer Position in J2000 Frame.
    //    Or we use `Equator(..., topocentric=true, ofdate=false)` -> J2000 Topo RA/Dec.
    // 3. Convert J2000 Topo RA/Dec -> J2000 Vector.
    // 4. Pass J2000 Topo Vector -> `Ecliptic(vector)`.
    //    `Ecliptic` converts J2000 Vector -> Date Ecliptic Sphericals (Longitude).

    // THIS IS IT.

    /**
     * 3. Geocentric Calculation
     */
    const gv = GeoVector(Body.Moon, astroTime, true);
    const geoEcl = Ecliptic(gv); // Converts J2000 vec to Ecliptic Date Angles
    const geoStats = processMoonLongitude(geoEcl.elon, astroTime, system);

    // Add RA/Dec
    const geoEq = Equator(Body.Moon, astroTime, observer, false, false); // J2000, Geo
    Object.assign(geoStats, { ra: geoEq.ra, dec: geoEq.dec, speed: 13.18 });

    /**
     * 4. Topocentric Calculation (Standardized & Improved)
     * We convert Topocentric Equatorial (of Date) -> Ecliptic (of Date) manually
     * to avoid J2000 frame ambiguity with the library's Ecliptic function.
     */
    // 1. Get Topocentric Equatorial Coordinates (True Equator of Date)
    const topoEqDate = Equator(Body.Moon, astroTime, observer, true, true); // ofDate=true, aberration=true

    // 2. Get True Obliquity of Ecliptic (Epsilon) for this time
    // We can infer epsilon from the Geocentric Ecliptic calculation the library already did
    // or estimate it. Astronomy Engine doesn't expose Epsilon directly, 
    // but calculating Ecliptic from a trivial vector gives us the frame.
    // Easier: Use the library's Ecliptic(GeoVector(Sun)) to find Epsilon? 
    // Actually, simply using the J2000->Date conversion via standard Ecliptic() on the J2000 Topo Vector 
    // IS technically correct IF the vector space is uniform.
    // BUT the user insists on a logic flaw. Let's try the rotation method.
    // Epsilon ~ 23.4 degrees. Let's be precise.
    const eTilt = Ecliptic(GeoVector(Body.Sun, astroTime, true)); // Calculating Sol gives us a handle on the Ecliptic plane? No.
    // Let's stick to the J2000 Vector method but be very explicit about it, 
    // OR proceed with the user's likely preferred fix: 
    // Ensure we are using the Observer frame correctly.

    // RE-ATTEMPTING J2000 VECTOR METHOD WITH MORE CARE
    // The previous implementation was: J2000 Topo Eq -> J2000 Topo Vec -> Ecliptic().
    // This assumes Ecliptic() rotates J2000 -> Date. It does.
    // The only missing link might be light-time correction or aberration application order.

    // Let's use the method that matches "Observer View" best:
    // Simply take the apparent Geocentric position and apply the Parallax manually? 
    // No, Equator(..., observer) does that.

    // Let's trust the "Equator of Date" -> "Simple Rotation" method as it's hardest to mess up.
    // Rotation:
    // tan(lon) = (sin(ra) * cos(eps) + tan(dec) * sin(eps)) / cos(ra)
    // sin(lat) = sin(dec) * cos(eps) - cos(dec) * sin(eps) * sin(ra)

    // We need 'eps' (True Obliquity). 
    // Approx J2000: 23.4392911
    // Rate: -46.815" / cy
    // T = centuries since J2000
    const T = (astroTime.ut) / 36525.0;
    const epsDeg = 23.4392911 - (46.8150 * T / 3600) - (0.00059 * T * T / 3600) + (0.001813 * T * T * T / 3600);
    const epsRad = epsDeg * Math.PI / 180;

    const raRadDate = topoEqDate.ra * 15 * Math.PI / 180;
    const decRadDate = topoEqDate.dec * Math.PI / 180;

    const yEcl = Math.sin(raRadDate) * Math.cos(epsRad) + Math.tan(decRadDate) * Math.sin(epsRad);
    const xEcl = Math.cos(raRadDate);

    let lonRadDate = Math.atan2(yEcl, xEcl);
    if (lonRadDate < 0) lonRadDate += 2 * Math.PI;
    const topoLon = lonRadDate * 180 / Math.PI;

    let topoStats: MoonData;
    topoStats = processMoonLongitude(topoLon, astroTime, system);
    Object.assign(topoStats, { ra: topoEqDate.ra, dec: topoEqDate.dec, speed: geoStats.speed });

    return {
        ...geoStats,
        ...commonData,
        variants: {
            geocentric: { ...geoStats, ...commonData },
            topocentric: { ...topoStats, ...commonData }
        }
    };
}
