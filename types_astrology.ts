export interface AstrologyPoint {
    sign: string;
    deg: number;
    min: number;
    house?: number;
    retrograde?: boolean;
}

export interface AstrologyAngle {
    sign: string;
    deg: number;
    min: number;
}

export interface AstrologyHouse {
    sign: string;
    deg: number;
}

export interface AstrologyAspect {
    p1: string;
    p2: string;
    type: string;
    orb: number;
}

export interface AstrologyChartData {
    meta: {
        location: {
            address: string;
            lat: number;
            lon: number;
            tz_str?: string;
        };
        local_time: string;
        house_system: string;
        system: 'western' | 'vedic';
    };
    extras: {
        sect: string;
    };
    points: Record<string, AstrologyPoint>;
    angles: Record<string, AstrologyAngle>;
    houses: Record<string, AstrologyHouse>;
    aspects: AstrologyAspect[];
    user_metadata?: {
        profile_name?: string;
        settings?: {
            orbStrictness?: string;
            viewPerspective?: string;
            showExtraPoints?: boolean;
        };
    };
}

export interface AstrologyReading {
    id: number;
    user_id: string; // UUID
    unique_id?: number; // Optional link to Numera profile unique_id if needed
    date_of_birth: string; // YYYY-MM-DD
    time_of_birth: string; // HH:MM
    birth_city: string;
    birth_country: string;
    latitude: number;
    longitude: number; // Storing coordinates is critical for precise recalculation
    system: 'western' | 'vedic';
    chart_data: AstrologyChartData;
    created_at: string;
    notes?: string;
}
