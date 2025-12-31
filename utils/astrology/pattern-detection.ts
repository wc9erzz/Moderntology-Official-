import { ChartData, PointData } from './types';

export interface PatternResult {
    id: string;
    type: 'Grand Trine' | 'T-Square' | 'Stellium' | 'Grand Cross' | 'Yod' | 'Kite' | 'Mystic Rectangle' | 'Cradle' | 'Grand Sextile' | 'Pentagram' | 'Parallel Cluster' | 'Parallel' | 'Contra-Parallel' | 'Vital Essence';
    planets: string[];
    description: string;
    element?: string;
    is_ghost?: boolean;
    tier?: 'basic' | 'expert';
    style: {
        color: string;
        gradient: string;
        icon: string;
        borderColor: string;
    };
    aspects: Array<{
        p1: string;
        p2: string;
        type: string;
        orb: number;
        is_ghost?: boolean;
    }>;
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
        icon: 'Minimize2'
    },
    'Contra-Parallel': {
        color: '#d946ef', // Fuchsia-500
        gradient: 'from-fuchsia-500/20 to-pink-900/20',
        borderColor: 'border-fuchsia-500/50',
        icon: 'Maximize2'
    },
    'Grand Cross': {
        color: '#ef4444', // Red-500
        gradient: 'from-red-600/20 to-rose-950/30',
        borderColor: 'border-red-600/50',
        icon: 'XCircle'
    },
    'Yod': {
        color: '#a3e635', // Lime-400
        gradient: 'from-lime-500/20 to-green-900/20',
        borderColor: 'border-lime-500/50',
        icon: 'MoveUp'
    },
    'Kite': {
        color: '#38bdf8', // Sky-400
        gradient: 'from-sky-500/20 to-blue-900/20',
        borderColor: 'border-sky-500/50',
        icon: 'Navigation'
    },
    'Mystic Rectangle': {
        color: '#c084fc', // Purple-400
        gradient: 'from-purple-500/20 to-indigo-900/20',
        borderColor: 'border-purple-500/50',
        icon: 'Box'
    },
    'Cradle': {
        color: '#fbbf24', // Amber-400
        gradient: 'from-amber-500/20 to-orange-900/20',
        borderColor: 'border-amber-500/50',
        icon: 'Anchor'
    },
    'Grand Sextile': {
        color: '#2dd4bf', // Teal-400
        gradient: 'from-teal-500/20 to-emerald-900/20',
        borderColor: 'border-teal-500/50',
        icon: 'Hexagon'
    },
    'Pentagram': {
        color: '#f472b6', // Pink-400
        gradient: 'from-pink-500/20 to-rose-900/20',
        borderColor: 'border-pink-500/50',
        icon: 'Star'
    },
    'Default': {
        color: '#e4e4e7',
        gradient: 'from-zinc-500/10 to-zinc-900/10',
        borderColor: 'border-zinc-500/30',
        icon: 'Star'
    }
};

const getStyle = (type: string, element?: string) => {
    if (type === 'Grand Trine' && element) {
        if (element === 'Fire') return { ...PATTERN_STYLES['Grand Trine'], color: '#fca5a5', gradient: 'from-orange-500/20 to-red-900/20', borderColor: 'border-orange-500/50' };
        if (element === 'Water') return { ...PATTERN_STYLES['Grand Trine'], color: '#67e8f9', gradient: 'from-cyan-500/20 to-blue-900/20', borderColor: 'border-cyan-500/50' };
        if (element === 'Earth') return { ...PATTERN_STYLES['Grand Trine'], color: '#86efac', gradient: 'from-emerald-500/20 to-green-900/20', borderColor: 'border-emerald-500/50' };
        if (element === 'Air') return { ...PATTERN_STYLES['Grand Trine'], color: '#fcd34d', gradient: 'from-yellow-200/20 to-amber-900/20', borderColor: 'border-yellow-200/50' };
    }
    return PATTERN_STYLES[type] || PATTERN_STYLES['Default'];
};

const buildAspectGraph = (aspects: ChartData['aspects']) => {
    const adj: Record<string, Array<{ target: string; type: string; is_ghost?: boolean; orb: number }>> = {};
    aspects.forEach(a => {
        if (!adj[a.p1]) adj[a.p1] = [];
        if (!adj[a.p2]) adj[a.p2] = [];
        adj[a.p1].push({ target: a.p2, type: a.type, is_ghost: a.is_ghost, orb: a.orb });
        adj[a.p2].push({ target: a.p1, type: a.type, is_ghost: a.is_ghost, orb: a.orb });
    });
    return adj;
};

// Helper to collect aspects between a set of planets, optionally filtering by type
function collectAspects(planets: string[], data: ChartData, allowedTypes?: string[]): PatternResult['aspects'] {
    return data.aspects.filter(a =>
        planets.includes(a.p1) && planets.includes(a.p2) &&
        (!allowedTypes || allowedTypes.includes(a.type))
    ).map(a => ({
        p1: a.p1,
        p2: a.p2,
        type: a.type,
        orb: a.orb,
        is_ghost: a.is_ghost
    }));
}

export function detectChartPatterns(data: ChartData, options: { allowNodes?: boolean } = {}): PatternResult[] {
    const results: PatternResult[] = [];
    const adj = buildAspectGraph(data.aspects);

    const targetPoints = Object.values(data.points).filter(p => {
        if (p.type === 'planet') return true;
        if (options.allowNodes && p.type === 'node') return true;
        return false;
    });

    const planetNames = targetPoints.map(p => p.name);

    // 1. DETECT STELLIUMS
    const bySign: Record<string, string[]> = {};
    Object.values(data.points).forEach(p => {
        if (!bySign[p.sign]) bySign[p.sign] = [];
        const isValid = p.type === 'planet' || (options.allowNodes && p.type === 'node');
        if (!isValid) return;
        bySign[p.sign].push(p.name);
    });

    Object.entries(bySign).forEach(([sign, signPlanets]) => {
        if (signPlanets.length < 3) return;
        const visited = new Set<string>();
        for (const planet of signPlanets) {
            if (visited.has(planet)) continue;
            const component: string[] = [];
            const queue = [planet];
            visited.add(planet);

            while (queue.length > 0) {
                const curr = queue.pop()!;
                component.push(curr);
                const neighbors = adj[curr] || [];
                neighbors.forEach(edge => {
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
                    element: getElement(sign),
                    tier: 'basic',
                    aspects: collectAspects(component, data, ['Conjunction'])
                });
            }
        }
    });

    // 2. DETECT GRAND TRINES
    const foundTrines = new Set<string>();
    planetNames.forEach(p1 => {
        const trinesFromP1 = adj[p1]?.filter(x => x.type === 'Trine' && planetNames.includes(x.target)) || [];
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
                            style: getStyle('Grand Trine', element),
                            tier: 'basic',
                            aspects: collectAspects(sorted, data, ['Trine'])
                        });
                    }
                }
            }
        }
    });

    // 3. DETECT T-SQUARES
    const foundTSquares = new Set<string>();
    planetNames.forEach(apex => {
        const squaresFromApex = adj[apex]?.filter(x => x.type === 'Square' && planetNames.includes(x.target)) || [];
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
                                style: getStyle('T-Square'),
                                tier: 'basic',
                                aspects: collectAspects([apex, pA, pB], data, ['Square', 'Opposition'])
                            });
                        }
                    }
                }
            }
        }
    });

    // 4. DETECT GRAND CROSS
    const foundCrosses = new Set<string>();
    const oppositions: Array<{ p1: string, p2: string, edge: any }> = [];
    planetNames.forEach((p1, k) => {
        adj[p1]?.forEach(x => {
            if (x.type === 'Opposition' && planetNames.indexOf(x.target) > k) {
                oppositions.push({ p1: p1, p2: x.target, edge: x });
            }
        });
    });

    for (let i = 0; i < oppositions.length; i++) {
        for (let j = i + 1; j < oppositions.length; j++) {
            const opp1 = oppositions[i];
            const opp2 = oppositions[j];
            const isSquare1 = adj[opp1.p1]?.some(x => x.target === opp2.p1 && x.type === 'Square');
            const isSquare2 = adj[opp1.p1]?.some(x => x.target === opp2.p2 && x.type === 'Square');

            if (isSquare1 && isSquare2) {
                const allPlanets = [opp1.p1, opp1.p2, opp2.p1, opp2.p2].sort();
                const key = allPlanets.join('-');

                if (!foundCrosses.has(key)) {
                    foundCrosses.add(key);
                    const isGhost = opp1.edge.is_ghost || opp2.edge.is_ghost;
                    results.push({
                        id: `grand-cross-${key}`,
                        type: 'Grand Cross',
                        planets: allPlanets,
                        is_ghost: isGhost,
                        description: `Significant tension and drive generated by ${allPlanets.join(', ')}.`,
                        style: getStyle('Grand Cross'),
                        tier: 'expert',
                        aspects: collectAspects(allPlanets, data, ['Square', 'Opposition'])
                    });
                }
            }
        }
    }

    // 5. DETECT YOD
    const foundYods = new Set<string>();
    planetNames.forEach(apex => {
        const quincunxFromApex = adj[apex]?.filter(x => x.type === 'Quincunx' && planetNames.includes(x.target)) || [];
        if (quincunxFromApex.length >= 2) {
            for (let i = 0; i < quincunxFromApex.length; i++) {
                for (let j = i + 1; j < quincunxFromApex.length; j++) {
                    const pA = quincunxFromApex[i].target;
                    const pB = quincunxFromApex[j].target;

                    const isSextile = adj[pA]?.some(x => x.target === pB && x.type === 'Sextile');
                    if (isSextile) {
                        const key = `yod-apex-${apex}-base-${[pA, pB].sort().join('-')}`;
                        if (!foundYods.has(key)) {
                            foundYods.add(key);
                            const isGhost = quincunxFromApex[i].is_ghost || quincunxFromApex[j].is_ghost;
                            results.push({
                                id: key,
                                type: 'Yod',
                                planets: [apex, pA, pB],
                                is_ghost: isGhost,
                                description: `A 'Finger of God' pointing to ${apex}, demanding adjustment.`,
                                style: getStyle('Yod'),
                                tier: 'expert',
                                aspects: collectAspects([apex, pA, pB], data, ['Quincunx', 'Sextile'])
                            });
                        }
                    }
                }
            }
        }
    });

    // 6. DETECT KITE
    const grandTrines = results.filter(r => r.type === 'Grand Trine');
    grandTrines.forEach(gt => {
        const trinePlanets = gt.planets;
        planetNames.forEach(pD => {
            if (trinePlanets.includes(pD)) return;

            let sextiles = 0;
            let oppositions = 0;
            trinePlanets.forEach(triP => {
                const aspects = adj[pD] || [];
                if (aspects.some(x => x.target === triP && x.type === 'Sextile')) sextiles++;
                if (aspects.some(x => x.target === triP && x.type === 'Opposition')) oppositions++;
            });

            if (sextiles >= 2 && oppositions >= 1) {
                const kitePlanets = [...trinePlanets, pD].sort();
                const key = `kite-${kitePlanets.join('-')}`;

                if (!results.some(r => r.id === key)) {
                    results.push({
                        id: key,
                        type: 'Kite',
                        planets: kitePlanets,
                        description: `${pD} provides a focal point for the energy of the Grand Trine.`,
                        style: getStyle('Kite'),
                        tier: 'expert',
                        aspects: collectAspects(kitePlanets, data, ['Trine', 'Sextile', 'Opposition'])
                    });
                }
            }
        });
    });

    // 7. MYSTIC RECTANGLE
    for (let i = 0; i < oppositions.length; i++) {
        for (let j = i + 1; j < oppositions.length; j++) {
            const opp1 = oppositions[i];
            const opp2 = oppositions[j];
            const p1 = opp1.p1; const p2 = opp1.p2;
            const p3 = opp2.p1; const p4 = opp2.p2;

            const checkType = (a: string, b: string) => {
                const types = adj[a]?.filter(x => x.target === b).map(x => x.type) || [];
                if (types.includes('Sextile')) return 'Sextile';
                if (types.includes('Trine')) return 'Trine';
                return null;
            };

            const sides = [
                checkType(p1, p3), checkType(p1, p4),
                checkType(p2, p3), checkType(p2, p4)
            ];

            const sextileCount = sides.filter(s => s === 'Sextile').length;
            const trineCount = sides.filter(s => s === 'Trine').length;

            if (sextileCount === 2 && trineCount === 2) {
                const all = [p1, p2, p3, p4].sort();
                const key = `mystic-${all.join('-')}`;
                if (!results.some(r => r.id === key)) {
                    results.push({
                        id: key,
                        type: 'Mystic Rectangle',
                        planets: all,
                        description: `Practical mysticism: connecting opposite forces (${p1}-${p2} & ${p3}-${p4}).`,
                        style: getStyle('Mystic Rectangle'),
                        tier: 'expert',
                        aspects: collectAspects(all, data, ['Trine', 'Sextile', 'Opposition'])
                    });
                }
            }
        }
    }

    // 8. PENTAGRAM
    if (planetNames.length >= 5) {
        const pentagramsFound = new Set<string>();
        const findQuintileCycle = (current: string, path: string[], visited: Set<string>) => {
            if (path.length === 5) {
                const first = path[0];
                const closes = adj[current]?.some(x => x.target === first && x.type === 'Quintile');
                if (closes) {
                    const sorted = [...path].sort();
                    const key = sorted.join('-');
                    if (!pentagramsFound.has(key)) {
                        pentagramsFound.add(key);
                        results.push({
                            id: `pentagram-${key}`,
                            type: 'Pentagram',
                            planets: sorted,
                            description: `A rare creative star pattern involving ${sorted.join(', ')}.`,
                            style: getStyle('Pentagram'),
                            tier: 'expert',
                            aspects: collectAspects(sorted, data, ['Quintile'])
                        });
                    }
                }
                return;
            }
            const links = adj[current]?.filter(x => x.type === 'Quintile') || [];
            for (const link of links) {
                if (!visited.has(link.target) && link.target !== path[0]) {
                    const newVisited = new Set(visited);
                    newVisited.add(link.target);
                    findQuintileCycle(link.target, [...path, link.target], newVisited);
                }
            }
        };
        planetNames.forEach(p => findQuintileCycle(p, [p], new Set([p])));
    }

    // 9. DETECT PARALLEL CLUSTERS
    const parallels: Record<string, string[]> = {};
    planetNames.forEach(p => {
        const connected = adj[p]?.filter(x => x.type === 'Parallel' && planetNames.includes(x.target)).map(x => x.target) || [];
        if (connected.length > 0) parallels[p] = connected;
    });

    const visitedParallels = new Set<string>();
    Object.keys(parallels).forEach(p => {
        if (visitedParallels.has(p)) return;
        const cluster = new Set<string>();
        const queue = [p];

        while (queue.length > 0) {
            const curr = queue.pop()!;
            if (visitedParallels.has(curr)) continue;
            visitedParallels.add(curr);
            cluster.add(curr);
            const neighbors = parallels[curr] || [];
            neighbors.forEach(n => {
                if (!visitedParallels.has(n)) queue.push(n);
            });
        }

        if (cluster.size >= 2) {
            const planets = Array.from(cluster).sort();
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
                style: getStyle('Parallel Cluster'),
                tier: 'basic',
                aspects: collectAspects(planets, data, ['Parallel'])
            } as any);
        }
    });

    // 10. DETECT CONTRA-PARALLELS
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
                    style: getStyle('Contra-Parallel'),
                    tier: 'basic',
                    aspects: collectAspects(sorted, data, ['Contra-Parallel'])
                } as any);
            }
        });
    });

    // Final clean up: ensure all have tiers
    results.forEach(r => {
        if (!r.tier) r.tier = 'expert';
        if (!r.aspects) r.aspects = [];
    });

    return results;
}

function getElement(sign: string): string {
    const map: Record<string, string> = {
        'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
        'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
        'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
        'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
    };
    return map[sign] || 'Unknown';
}
