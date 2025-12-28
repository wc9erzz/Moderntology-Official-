import { find } from 'geo-tz';
import { GeoLocation } from './types';
import { Country, State, City } from 'country-state-city';

// Open-Meteo Geocoding API (Free, No Key)
export async function getGeoData(city: string, country: string, state?: string): Promise<GeoLocation> {
    const query = `${city}, ${state ? state + ', ' : ''}${country}`;
    const queryKey = query.toLowerCase();

    // 1. Try Local Lookup (Fastest, Exact)
    try {
        console.log(`🔍 Geo: Attempting local lookup for "${query}"...`);

        // Find Country
        // optimization: strict match if possible, else partial
        const allCountries = Country.getAllCountries();
        const countryMatch = allCountries.find(c =>
            c.name.toLowerCase() === country.toLowerCase() ||
            c.isoCode.toLowerCase() === country.toLowerCase()
        );

        if (countryMatch) {
            let lat: number | undefined;
            let lon: number | undefined;
            let foundName = '';

            // Strategy: If specific State is provided, search there first.
            // If strictly City is provided without State, search all cities in Country (slower but thorough)
            if (state) {
                const allStates = State.getStatesOfCountry(countryMatch.isoCode);
                const stateMatch = allStates.find(s =>
                    s.name.toLowerCase() === state.toLowerCase() ||
                    s.isoCode.toLowerCase() === state.toLowerCase()
                );

                if (stateMatch) {
                    const cities = City.getCitiesOfState(countryMatch.isoCode, stateMatch.isoCode);
                    const cityMatch = cities.find(c => c.name.toLowerCase() === city.toLowerCase());
                    if (cityMatch && cityMatch.latitude && cityMatch.longitude) {
                        lat = parseFloat(cityMatch.latitude);
                        lon = parseFloat(cityMatch.longitude);
                        foundName = `${cityMatch.name}, ${stateMatch.name}, ${countryMatch.name}`;
                    }
                }
            } else {
                // Global search in country (fallback if no state provided)
                const cities = City.getCitiesOfCountry(countryMatch.isoCode);
                if (cities) {
                    const cityMatch = cities.find(c => c.name.toLowerCase() === city.toLowerCase());
                    if (cityMatch && cityMatch.latitude && cityMatch.longitude) {
                        lat = parseFloat(cityMatch.latitude);
                        lon = parseFloat(cityMatch.longitude);
                        foundName = `${cityMatch.name}, ${countryMatch.name}`;
                    }
                }
            }

            if (lat !== undefined && lon !== undefined) {
                console.log('✅ Geo: Local match found:', foundName);
                const tzResult = find(lat, lon);
                return {
                    lat,
                    lon,
                    tz_str: tzResult[0] || 'UTC',
                    address: foundName
                };
            }
        }

        // If we reached here, local lookup failed or data was missing
        console.warn('Geo: Local lookup incomplete/failed.');
        throw new Error('Local lookup failed'); // Force catch block

    } catch (localError) {
        // 2. Fallback to API
        console.warn('Failed Attempt, Trying Again (External API)...');
    }

    // --- FALLBACK: EXTERNAL API ---

    // Simple search by name, filtering by count 1
    // Hardcoded fallbacks for development/offline/API limits
    const FALLBACK_LOCATIONS: Record<string, GeoLocation> = {
        'new york, united states': { lat: 40.7128, lon: -74.0060, tz_str: 'America/New_York', address: 'New York, United States' },
        'london, united kingdom': { lat: 51.5074, lon: -0.1278, tz_str: 'Europe/London', address: 'London, United Kingdom' },
        'delhi, india': { lat: 28.6139, lon: 77.2090, tz_str: 'Asia/Kolkata', address: 'Delhi, India' },
        'tokyo, japan': { lat: 35.6762, lon: 139.6503, tz_str: 'Asia/Tokyo', address: 'Tokyo, Japan' },
        'sydney, australia': { lat: -33.8688, lon: 151.2093, tz_str: 'Australia/Sydney', address: 'Sydney, Australia' },
    };

    if (FALLBACK_LOCATIONS[queryKey]) {
        return FALLBACK_LOCATIONS[queryKey];
    }

    // Simple search by name, filtering by count 1
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'AuraAstrologyApp/1.0'
            }
        });
        if (!res.ok) {
            // If API limits or errors, try fallback if basic match
            // throw new Error(`Geocoding HTTP error: ${res.status}`);
            console.warn(`Geocoding API error ${res.status} for ${query}, falling back if possible.`);
            if (FALLBACK_LOCATIONS[queryKey]) return FALLBACK_LOCATIONS[queryKey];
            throw new Error(`Geocoding HTTP error: ${res.status}`);
        }

        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            // Fallback again
            if (FALLBACK_LOCATIONS[queryKey]) return FALLBACK_LOCATIONS[queryKey];
            throw new Error(`Location not found: ${query}`);
        }

        const result = data.results[0];
        const latitude = result.latitude;
        const longitude = result.longitude;
        const address = `${result.name}, ${result.admin1 || ''} ${result.country || ''}`.replace(/\s+/g, ' ').trim();

        if (latitude === undefined || longitude === undefined) {
            throw new Error(`Invalid coordinates for: ${query}`);
        }

        // Resolve Timezone
        const tzResult = find(latitude, longitude);
        if (!tzResult || tzResult.length === 0) {
            throw new Error(`Timezone not found for coordinates: ${latitude}, ${longitude}`);
        }
        const tz_str = tzResult[0];

        return {
            lat: latitude,
            lon: longitude,
            tz_str,
            address
        };
    } catch (error) {
        console.error("Geocoding Error:", error);
        throw error;
    }
}
