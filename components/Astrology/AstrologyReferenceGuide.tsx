import { useState } from 'react';
import { Info, ChevronUp, ChevronDown } from 'lucide-react';

export function AstrologyReferenceGuide() {
    const [showKey, setShowKey] = useState(false);

    return (
        <div className="rounded-2xl border border-white/10 bg-black/90 shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300">
            <button
                onClick={() => setShowKey(!showKey)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group"
            >
                <div className="flex items-center gap-3 text-zinc-400 group-hover:text-purple-300 transition-colors">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                        <Info className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Protocol Key • Technical Ledger Guide</span>
                </div>
                {showKey ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </button>

            {showKey && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Retrograde Section */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider text-rose-300 font-semibold flex items-center gap-2">
                            <span className="text-[10px] border border-rose-500/30 px-1.5 rounded text-rose-400">Rx</span>
                            Retrograde Motion
                        </h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            When a planet is Retrograde, it appears to move backward in the sky. Astrologically, this energy becomes
                            <span className="text-zinc-200 font-medium"> internalized</span>. It suggests a need to review, reflect, and re-process the themes of that planet before expressing them outwardly.
                        </p>
                    </div>

                    {/* Dignity Section */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Planetary Dignity</h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            <div className="space-y-0.5">
                                <span className="text-amber-200 text-xs font-bold uppercase tracking-wide">Rulership</span>
                                <p className="text-[10px] text-zinc-500">Pure expression.</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-amber-200 text-xs font-bold uppercase tracking-wide">Exalted</span>
                                <p className="text-[10px] text-zinc-500">High energy.</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-rose-300 text-xs font-bold uppercase tracking-wide">Detriment</span>
                                <p className="text-[10px] text-zinc-500">Uncomfortable.</p>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-rose-300 text-xs font-bold uppercase tracking-wide">Fall</span>
                                <p className="text-[10px] text-zinc-500">Under-valued.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sensitive Points Section */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-bold">Karmic Nodes</h4>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2"><span className="text-zinc-200 text-xs font-bold">☊ Rahu:</span><span className="text-[11px] text-zinc-500">Destiny (North Node)</span></div>
                                <div className="flex items-center gap-2"><span className="text-zinc-200 text-xs font-bold">☋ Ketu:</span><span className="text-[11px] text-zinc-500">Past Karma (South Node)</span></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">Core Angles</h4>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2"><span className="text-zinc-200 text-xs font-bold">ASC:</span><span className="text-[11px] text-zinc-500">Personality/Mask</span></div>
                                <div className="flex items-center gap-2"><span className="text-zinc-200 text-xs font-bold">MC:</span><span className="text-[11px] text-zinc-500">Career/Reputation</span></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">Horizon</h4>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2"><span className="text-zinc-200 text-xs font-bold">DSC:</span><span className="text-[11px] text-zinc-500">Relationships</span></div>
                                <div className="flex items-center gap-2"><span className="text-zinc-200 text-xs font-bold">IC:</span><span className="text-[11px] text-zinc-500">Roots/Private Life</span></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-bold">Special Points</h4>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2"><span className="text-zinc-200 text-xs font-bold">Vertex:</span><span className="text-[11px] text-zinc-500">Fated Encounters</span></div>
                                <div className="flex items-center gap-2"><span className="text-zinc-200 text-xs font-bold">EP:</span><span className="text-[11px] text-zinc-500">Equatorial Asc.</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
