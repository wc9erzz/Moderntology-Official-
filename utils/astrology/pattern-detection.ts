
import { ChartData, PointData } from './types';

export interface PatternResult {
    id: string;
    type: 'Grand Trine' | 'T-Square' | 'Stellium' | 'Grand Cross' | 'Yod' | 'Kite' | 'Parallel Cluster' | 'Parallel' | 'Contra-Parallel';
    planets: string[];
    description: string;
    element?: string;
    is_ghost?: boolean;
    style: {
        color: string;
        gradient: string;
        icon: string;
        borderColor: string;
    };
}


export const PATTERN_STYLES: Record<string, PatternResult['style']> = {
    'Grand Trine': {
        color: '#fbbf24', // Amber-400
        gradient: 'from-amber-500/20 to-yellow-900/20',
        borderColor: 'border-amber-500/50',
        icon: 'Triangle'
    },
    'T-Square': {
        color: '#f87171', // Red-400
        gradient: 'from-red-500/20 to-rose-900/20',
        borderColor: 'border-red-500/50',
        icon: 'Zap'
    },
    'Stellium': {
        color: '#818cf8', // Indigo-400
        gradient: 'from-indigo-500/20 to-blue-900/20',
        borderColor: 'border-indigo-500/50',
        icon: 'Layers'
    },
    'Parallel Cluster': {
        color: '#a855f7', // Purple-500
        gradient: 'from-purple-500/20 to-fuchsia-900/20',
        borderColor: 'border-purple-500/50',
        icon: 'Minimize2' // Icons handled by consumer usually, providing string name
    },
    'Contra-Parallel': {
        color: '#d946ef', // Fuchsia-500
        gradient: 'from-fuchsia-500/20 to-pink-900/20',
        borderColor: 'border-fuchsia-500/50',
        icon: 'Maximize2'
    },
    'Default': {
        color: '#e4e4e7',
        gradient: 'from-zinc-500/10 to-zinc-900/10',
        borderColor: 'border-zinc-500/30',
        icon: 'Star'
    }
};

const getStyle = (type: string, element?: string) => {
    // Optional: Customize Grand Trine by element
    if (type === 'Grand Trine' && element) {
        if (element === 'Fire') return { ...PATTERN_STYLES['Grand Trine'], color: '#fca5a5', gradient: 'from-orange-500/20 to-red-900/20', borderColor: 'border-orange-500/50' };
        if (element === 'Water') return { ...PATTERN_STYLES['Grand Trine'], color: '#67e8f9', gradient: 'from-cyan-500/20 to-blue-900/20', borderColor: 'border-cyan-500/50' };
        if (element === 'Earth') return { ...PATTERN_STYLES['Grand Trine'], color: '#86efac', gradient: 'from-emerald-500/20 to-green-900/20', borderColor: 'border-emerald-500/50' };
        if (element === 'Air') return { ...PATTERN_STYLES['Grand Trine'], color: '#fcd34d', gradient: 'from-yellow-200/20 to-amber-900/20', borderColor: 'border-yellow-200/50' };
    }
    return PATTERN_STYLES[type] || PATTERN_STYLES['Default'];
};


// Helper to build an adjacency map for easier graph traversal
const buildAspectGraph = (aspects: ChartData['aspects']) => {
    const adj: Record<string, Array<{ target: string; type: string; is_ghost?: boolean }>> = {};
    aspects.forEach(a => {
        if (!adj[a.p1]) adj[a.p1] = [];
        if (!adj[a.p2]) adj[a.p2] = [];
        adj[a.p1].push({ target: a.p2, type: a.type, is_ghost: a.is_ghost });
        adj[a.p2].push({ target: a.p1, type: a.type, is_ghost: a.is_ghost });
    });
    return adj;
};

export function detectChartPatterns(data: ChartData, options: { allowNodes?: boolean } = {}): PatternResult[] {
    const results: PatternResult[] = [];
    const adj = buildAspectGraph(data.aspects);

    // Filter points based on options
    const targetPoints = Object.values(data.points).filter(p => {
        if (p.type === 'planet') return true;
        if (options.allowNodes && p.type === 'node') return true;
        return false;
    });

    const planetNames = targetPoints.map(p => p.name);

    // 1. DETECT STELLIUMS (3+ planets in same sign or house)
    const bySign: Record<string, string[]> = {};
    Object.values(data.points).forEach(p => {
        if (!bySign[p.sign]) bySign[p.sign] = [];
        const isValid = p.type === 'planet' || (options.allowNodes && p.type === 'node');
        if (!isValid) return;
        bySign[p.sign].push(p.name);
    });

    Object.entries(bySign).forEach(([sign, signPlanets]) => {
        if (signPlanets.length < 3) return;

        // Find connected components within this sign using Conjunctions
        // This ensures planets are actually clustered together, not just in the same sign
        const visited = new Set<string>();

        for (const planet of signPlanets) {
            if (visited.has(planet)) continue;

            const component: string[] = [];
            const queue = [planet];
            visited.add(planet);

            while (queue.length > 0) {
                const curr = queue.pop()!;
                component.push(curr);

                // Check neighbors in adjacency graph
                const neighbors = adj[curr] || [];
                neighbors.forEach(edge => {
                    // Must be Conjunction AND in the same sign grouping
                    if (edge.type === 'Conjunction' && signPlanets.includes(edge.target) && !visited.has(edge.target)) {
                        visited.add(edge.target);
                        queue.push(edge.target);
                    }
                });
            }

            if (component.length >= 3) {
                results.push({
                    id: `stellium-${sign}-${component.join('-')}`,
                    type: 'Stellium',
                    planets: component,
                    description: `A powerful concentration of energy in ${sign} (${component.join(', ')}).`,
                    style: getStyle('Stellium'),
                    // @ts-ignore
                    element: getElement(sign)
                });
            }
        }
    });

    // 2. DETECT GRAND TRINES
    const foundTrines = new Set<string>();
    planetNames.forEach(p1 => {
        const trinesFromP1 = adj[p1]
            ?.filter(x => x.type === 'Trine' && planetNames.includes(x.target)) || [];

        for (let i = 0; i < trinesFromP1.length; i++) {
            for (let j = i + 1; j < trinesFromP1.length; j++) {
                const p2 = trinesFromP1[i].target;
                const p3 = trinesFromP1[j].target;
                const p2Aspects = adj[p2] || [];
                const isConnected = p2Aspects.some(x => x.target === p3 && x.type === 'Trine');

                if (isConnected) {
                    const sorted = [p1, p2, p3].sort();
                    const key = sorted.join('-');
                    if (!foundTrines.has(key)) {
                        foundTrines.add(key);
                        const element = getElement(data.points[p1]?.sign);

                        // Check if any edge in this triangle is a ghost
                        const edges = [
                            trinesFromP1[i],
                            trinesFromP1[j],
                            adj[p2].find(x => x.target === p3 && x.type === 'Trine')
                        ];
                        const isGhost = edges.some(e => e?.is_ghost);

                        results.push({
                            id: `grand-trine-${key}`,
                            type: 'Grand Trine',
                            planets: sorted,
                            element: element,
                            is_ghost: isGhost,
                            description: `A ${isGhost ? 'potential ' : ''}harmonious flow of ${element || ''} energy between ${sorted.join(', ')}.`,
                            style: getStyle('Grand Trine', element)
                        });
                    }
                }
            }
        }
    });

    // 3. DETECT T-SQUARES
    const foundTSquares = new Set<string>();
    planetNames.forEach(apex => {
        const squaresFromApex = adj[apex]
            ?.filter(x => x.type === 'Square' && planetNames.includes(x.target)) || [];

        if (squaresFromApex.length >= 2) {
            for (let i = 0; i < squaresFromApex.length; i++) {
                for (let j = i + 1; j < squaresFromApex.length; j++) {
                    const pA = squaresFromApex[i].target;
                    const pB = squaresFromApex[j].target;
                    const pA_Aspects = adj[pA] || [];
                    const isOpposite = pA_Aspects.some(x => x.target === pB && x.type === 'Opposition');

                    if (isOpposite) {
                        const key = `apex-${apex}-base-${[pA, pB].sort().join('-')}`;
                        if (!foundTSquares.has(key)) {
                            foundTSquares.add(key);

                            const edges = [
                                squaresFromApex[i],
                                squaresFromApex[j],
                                adj[pA].find(x => x.target === pB && x.type === 'Opposition')
                            ];
                            const isGhost = edges.some(e => e?.is_ghost);

                            results.push({
                                id: `t-square-${key}`,
                                type: 'T-Square',
                                planets: [apex, pA, pB],
                                is_ghost: isGhost,
                                description: `${apex} acts as the focal point for ${isGhost ? 'potential ' : ''}tension between ${pA} and ${pB}.`,
                                style: getStyle('T-Square')
                            });
                        }
                    }
                }
            }
        }
    });

    // 4. DETECT PARALLEL CLUSTERS
    // Group all planets that are connected by Parallel aspects within orb
    const parallels: Record<string, string[]> = {};
    planetNames.forEach(p => {
        const connected = adj[p]?.filter(x => x.type === 'Parallel' && planetNames.includes(x.target)).map(x => x.target) || [];
        if (connected.length > 0) {
            parallels[p] = connected;
        }
    });

    // Find clustering (connected components)
    const visited = new Set<string>();
    Object.keys(parallels).forEach(p => {
        if (visited.has(p)) return;

        const cluster = new Set<string>();
        const queue = [p];

        while (queue.length > 0) {
            const curr = queue.pop()!;
            if (visited.has(curr)) continue;
            visited.add(curr);
            cluster.add(curr);

            const neighbors = parallels[curr] || [];
            neighbors.forEach(n => {
                if (!visited.has(n)) queue.push(n);
            });
        }

        if (cluster.size >= 2) {
            const planets = Array.from(cluster).sort();

            // Check if ANY parallel in this cluster is a ghost
            let clusterGhost = false;
            planets.forEach(p1 => {
                adj[p1]?.forEach(edge => {
                    if (edge.type === 'Parallel' && planets.includes(edge.target) && edge.is_ghost) {
                        clusterGhost = true;
                    }
                });
            });

            results.push({
                id: `parallel-${planets.join('-')}`,
                type: 'Parallel Cluster',
                is_ghost: clusterGhost,
                description: `${clusterGhost ? 'Potential d' : 'D'}eclination alignment between ${planets.join(', ')}.`,
                planets: planets,
                style: getStyle('Parallel Cluster')
            } as any);
        }
    });

    // 5. DETECT CONTRA-PARALLELS (Pairs)
    const foundCP = new Set<string>();
    planetNames.forEach(p1 => {
        const cp = adj[p1]?.filter(x => x.type === 'Contra-Parallel' && planetNames.includes(x.target)).map(x => x.target) || [];
        cp.forEach(p2 => {
            const sorted = [p1, p2].sort();
            const key = sorted.join('-');
            if (!foundCP.has(key)) {
                foundCP.add(key);
                const isGhost = adj[p1]?.find(x => x.target === p2 && x.type === 'Contra-Parallel')?.is_ghost;
                results.push({
                    id: `contra-${key}`,
                    type: 'Contra-Parallel',
                    planets: sorted,
                    is_ghost: isGhost,
                    description: `Balancing ${isGhost ? 'potential ' : ''}opposite declinations: ${p1} & ${p2}.`,
                    style: getStyle('Contra-Parallel')
                } as any);
            }
        });
    });

    return results;
}

// Helper for Elements
function getElement(sign: string): string {
    const map: Record<string, string> = {
        'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
        'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
        'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
        'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
    };
    return map[sign] || 'Unknown';
}
