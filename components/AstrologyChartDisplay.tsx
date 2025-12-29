import React from 'react';

interface AstrologyChartDisplayProps {
    chartData: any;
    system?: 'western' | 'vedic';
}

export function AstrologyChartDisplay({ chartData, system }: AstrologyChartDisplayProps) {
    if (!chartData) return null;

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Header Section */}
            <div className="text-center pb-8 border-b border-white/10">
                <h2 className="text-3xl font-extralight tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200">
                    Celestial Blueprint
                </h2>
                <p className="text-white/60 font-light tracking-wide">{chartData.meta.location.address}</p>

                <div className="flex justify-center gap-4 mt-4 text-xs tracking-widest uppercase text-white/40">
                    <span>{chartData.meta.local_time.split(' ')[0]}</span>
                    <span>•</span>
                    <span>{chartData.extras.sect} Chart</span>
                    <span>•</span>
                    <span>{chartData.meta.house_system} Houses</span>
                    {system && (
                        <>
                            <span>•</span>
                            <span className={system === 'vedic' ? 'text-blue-400' : 'text-purple-400'}>
                                {system === 'vedic' ? 'Vedic (Sidereal)' : 'Western (Tropical)'}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Planetary Positions Column */}
                <div className="space-y-8">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 backdrop-blur-md transition-all hover:bg-white/[0.05]">
                        <h3 className="text-lg font-light text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                            Planetary Alignments
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(chartData.points).map(([name, data]: [string, any]) => (
                                <div key={name} className="group flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/5 px-2 rounded transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className={`text-sm font-medium ${['Sun', 'Moon', 'Ascendant'].includes(name) ? 'text-white' : 'text-white/70'}`}>
                                            {name}
                                        </span>
                                        {data.retrograde && (
                                            <span className="text-[10px] bg-red-500/20 text-red-200 px-1.5 py-0.5 rounded uppercase tracking-wider">Rx</span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-mono text-sm tracking-wide">
                                            {data.sign} <span className="text-white/40">{data.deg}°{data.min}&apos;</span>
                                        </div>
                                        <div className="text-[10px] text-white/30 uppercase tracking-widest">
                                            House {data.house}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Houses & Angles Column */}
                <div className="space-y-8">

                    {/* Angles */}
                    {chartData.angles && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 backdrop-blur-md transition-all hover:bg-white/[0.05]">
                            <h3 className="text-lg font-light text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                                Cardinal Angles
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(chartData.angles).map(([name, data]: [string, any]) => (
                                    <div key={name} className="bg-white/5 p-4 rounded-lg border border-white/5 text-center group hover:border-blue-500/30 transition-colors">
                                        <div className="text-blue-200/80 text-xs mb-1 uppercase tracking-wider">{name}</div>
                                        <div className="text-white font-light">
                                            {data.sign}
                                        </div>
                                        <div className="text-white/40 text-xs font-mono">
                                            {data.deg}° {data.min}&apos;
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Houses */}
                    {chartData.houses && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 backdrop-blur-md transition-all hover:bg-white/[0.05]">
                            <h3 className="text-lg font-light text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                House Cusps
                            </h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                {Object.entries(chartData.houses).map(([num, data]: [string, any]) => (
                                    <div key={num} className="flex justify-between items-center py-1.5 border-b border-white/5">
                                        <span className="text-white/30 text-xs font-mono w-6">{num}</span>
                                        <span className="text-white/80 text-sm">
                                            {data.sign} <span className="text-white/30 text-xs ml-1">{data.deg}°</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Aspects Display */}
            {chartData.aspects && chartData.aspects.length > 0 && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 backdrop-blur-md transition-all hover:bg-white/[0.05]">
                    <h3 className="text-lg font-light text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full shadow-[0_0_10px_rgba(251,113,133,0.8)]" />
                        Planetary Geometry
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {chartData.aspects.map((asp: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 text-sm text-white/90">
                                    <span>{asp.p1}</span>
                                    <span className="text-white/20">•</span>
                                    <span>{asp.p2}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-rose-300 text-xs font-medium uppercase tracking-wider">{asp.type}</div>
                                    <div className="text-white/20 text-[10px]">{asp.orb}° orb</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
