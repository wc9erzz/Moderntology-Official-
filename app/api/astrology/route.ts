import { NextResponse } from 'next/server';
import { AstrologyEngine } from '@/utils/astrology/AstrologyEngine';
import { getMoonData } from '@/utils/astrology/MoonEngine';
import { getGeoData } from '@/utils/astrology/geo';
import fs from 'fs';
import path from 'path';

// Singleton engine instance to avoid reloading WASM if possible 
// (though serverless might recreate it)
const engine = new AstrologyEngine();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, time, city, state, country, system } = body;

        console.log('🔍 API received system parameter:', system);

        // Validation
        if (!date || !time || !city || !country) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Geocode (Once per request)
        const location = await getGeoData(city, country, state);

        // Helper to generate a chart for a specific system
        const generateChart = async (sys: 'western' | 'vedic') => {
            // Explicitly use Placidus ('P') and 'standard' orb strictness
            const chart = await engine.calculate(date, time, location, 'P', sys, 'standard');

            // --- NEW MOON CALCULATION ---
            // Pass the EXACT UTC time from the engine to ensure consistency (avoids local machine TZ assumptions)
            const utcDate = chart.meta?.utc_time ? new Date(chart.meta.utc_time) : undefined;
            const extendedMoon = getMoonData(date, time, location.lat, location.lon, sys, utcDate);

            return {
                ...chart,
                moon_detailed: extendedMoon
            };
        };

        if (system === 'all') {
            const [western, vedic] = await Promise.all([
                generateChart('western'),
                generateChart('vedic')
            ]);
            console.log('🔍 API returning BOTH charts');
            return NextResponse.json({ western, vedic });
        } else {
            // Single system mode (Backward compatibility)
            const chartData = await generateChart(system || 'western');
            console.log('🔍 API returning chart with system:', chartData.meta.system);
            return NextResponse.json(chartData);
        }

    } catch (error: any) {
        const msg = error.message || String(error);
        const stack = error.stack || '';
        try {
            fs.appendFileSync(path.join(process.cwd(), 'debug_error.log'), `${new Date().toISOString()} ERROR: ${msg}\n${stack}\n`);
        } catch (e) { /* ignore */ }

        console.error('Astrology API Error:', error);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
