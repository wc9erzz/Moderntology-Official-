'use client';

import React from 'react';
import { Globe, Crosshair, Map as MapIcon, Compass } from 'lucide-react';

interface AstrologyControlsProps {
    system: 'western' | 'vedic';
    setSystem: (s: 'western' | 'vedic') => void;
    viewPerspective: 'geocentric' | 'topocentric';
    setViewPerspective: (p: 'geocentric' | 'topocentric') => void;
    vedicDisabled?: boolean;
}

export const AstrologyControls = ({
    system,
    setSystem,
    viewPerspective,
    setViewPerspective,
    vedicDisabled = false
}: AstrologyControlsProps) => {
    return (
        <div className="w-full flex justify-center animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">

                {/* System Toggle */}
                <div className="flex items-center gap-2 px-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold hidden sm:block">Zodiac System</span>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setSystem('western')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${system === 'western'
                                ? 'bg-gradient-to-r from-blue-600/40 to-blue-400/20 text-blue-100 border border-blue-500/30'
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Compass size={14} />
                            Tropical
                        </button>
                        <button
                            onClick={() => setSystem('vedic')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${system === 'vedic'
                                ? 'bg-gradient-to-r from-purple-600/40 to-purple-400/20 text-purple-100 border border-purple-500/30'
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <MapIcon size={14} />
                            Sidereal
                        </button>
                    </div>
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                {/* Perspective Toggle */}
                <div className="flex items-center gap-2 px-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold hidden sm:block">Perspective</span>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setViewPerspective('geocentric')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${viewPerspective === 'geocentric'
                                ? 'bg-gradient-to-r from-blue-600/40 to-blue-400/20 text-blue-100 border border-blue-500/30'
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Globe size={14} />
                            Geocentric
                        </button>
                        <button
                            onClick={() => setViewPerspective('topocentric')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${viewPerspective === 'topocentric'
                                ? 'bg-gradient-to-r from-purple-600/40 to-purple-400/20 text-purple-100 border border-purple-500/30'
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Crosshair size={14} />
                            Topocentric
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
