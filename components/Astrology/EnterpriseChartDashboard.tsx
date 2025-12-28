'use client';

import React, { useState } from 'react';
import { InteractiveNatalChart } from './InteractiveNatalChart';
import { SYMBOLS } from './chart-utils';
import { Activity, Crosshair } from 'lucide-react';

export function EnterpriseChartDashboard({ chartData }: { chartData: any }) {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    return (
        <div className="flex flex-col md:flex-row w-full gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm shadow-2xl min-h-[800px]">

            {/* LEFT: The Chart Area */}
            <div className="flex-grow relative aspect-square md:aspect-auto md:min-h-[600px] border border-white/5 rounded-xl bg-black/20 overflow-hidden">
                <InteractiveNatalChart
                    data={chartData}
                    onSelect={setSelectedItem}
                    className="z-10 relative"
                />

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />

                {/* Empty State Overlay */}
                {!selectedItem && (
                    <div className="absolute bottom-6 left-6 pointer-events-none opacity-50 text-sm font-light text-white/60">
                        Select a planet or aspect line to view details
                    </div>
                )}
            </div>

            {/* RIGHT: The Sidebar Visualization (Digital Readout) */}
            <div className="w-full md:w-96 flex-shrink-0">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 h-full shadow-inner relative overflow-hidden">
                    {/* decorative header line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

                    {selectedItem && selectedItem.type === 'planet' ? (
                        <div className="animate-fade-in-right h-full flex flex-col">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-4xl font-light text-white mb-1">{selectedItem.id}</h2>
                                    <p className="text-purple-400 text-sm tracking-widest uppercase">
                                        {selectedItem.data.sign}
                                    </p>
                                </div>
                                <div className="text-5xl opacity-50 text-white" style={{ fontFamily: '"Segoe UI Symbol", "Apple Color Emoji", serif' }}>
                                    {SYMBOLS[selectedItem.id]}
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Position</div>
                                    <div className="text-xl font-mono text-white">
                                        {selectedItem.data.deg}° {selectedItem.data.min}'
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">House</div>
                                    <div className="text-xl font-mono text-white">
                                        {selectedItem.data.house}<span className="text-sm align-top opacity-50">th</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Motion</div>
                                    <div className={`text-lg font-medium flex items-center gap-2 ${selectedItem.data.retrograde ? 'text-red-400' : 'text-green-400'}`}>
                                        {selectedItem.data.retrograde ? 'Retrograde' : 'Direct'}
                                        {selectedItem.data.retrograde && <Activity size={14} className="animate-pulse" />}
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Velocity</div>
                                    <div className="text-lg font-mono text-white">
                                        {selectedItem.data.speed?.toFixed(3) || '0.000'}
                                    </div>
                                </div>
                            </div>

                            {/* Short Description */}
                            <div className="mt-auto p-4 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {selectedItem.id} in {selectedItem.data.sign} represents a specific energetic signature.
                                    {selectedItem.data.retrograde ? " It's internalization suggests a review of past karma." : " Direct motion facilitates outward expression."}
                                </p>
                            </div>
                        </div>
                    ) : selectedItem && selectedItem.type === 'aspect' ? (
                        <div className="animate-fade-in-right h-full flex flex-col">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-light text-white mb-1">{selectedItem.data.type}</h2>
                                    <p className="text-purple-400 text-sm tracking-widest uppercase">
                                        {selectedItem.data.p1} - {selectedItem.data.p2}
                                    </p>
                                </div>
                                <div className="text-4xl opacity-50 text-white">☍</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4">
                                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Orb</div>
                                <div className="text-xl font-mono text-white">
                                    {selectedItem.data.orb?.toFixed(4)}°
                                </div>
                            </div>
                            <div className="text-sm text-gray-400 leading-relaxed p-4 border border-white/5 rounded-xl">
                                This {selectedItem.data.type} creates a geometric relationship between {selectedItem.data.p1} and {selectedItem.data.p2}.
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-600">
                            <div className="text-center">
                                <Crosshair className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-light tracking-wide uppercase">Select a celestial body</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
