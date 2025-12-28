export interface GeoLocation {
    lat: number;
    lon: number;
    tz_str: string;
    address?: string;
}


export interface PointData {
    name: string;
    type: 'planet' | 'node' | 'point' | 'angle' | 'star';
    abs_deg: number;
    sign: string;
    deg: number;
    min: number;
    sec?: number;
    house: number;
    isRetro?: boolean;
    retrograde?: boolean;
    speed?: number;
    ra?: number;
    dec?: number;
    nakshatra?: string; // Phase 1: Vedic
    [key: string]: any;
}

export type Dignity = 'Rulership' | 'Exaltation' | 'Detriment' | 'Fall' | 'Peregrine' | 'Domicile';

export interface DignityInfo {
    score: number;
    items: Dignity[];
    label?: string; // Frontend compat
}

export interface Aspect {
    p1: string;
    p2: string;
    type: string;
    orb: number;
    orb_limit: number;
    applying: boolean;
    is_ghost?: boolean;
    ghost_threshold?: number;
}

export interface ChartData {
    meta: {
        local_time: string;
        utc_time: string;
        location: GeoLocation;
        house_system: string;
        system?: 'western' | 'vedic';
    };
    points: Record<string, PointData>; // Updated to PointData
    houses: Record<number, PointData>;
    angles: {
        Ascendant: PointData;
        MC: PointData;
        Descendant: PointData;
        IC: PointData;
        Vertex?: PointData;
        EastPoint?: PointData;
    };
    aspects: Aspect[];
    dignities: Record<string, DignityInfo>;
    extras: {
        sect: 'Day' | 'Night';
        galactic_center?: PointData;
        lilith?: PointData;
    };
    heliocentric?: Record<string, PointData>;
    harmonics?: {
        h5: Record<string, number>;
        h7: Record<string, number>;
        h9: Record<string, number>;
    };
    midpoints?: Record<string, number>;
    moon_detailed?: any; // Detailed Moon data with variants
    patterns?: any[]; // Western Patterns
    yogas?: any[]; // Vedic Yogas
}
