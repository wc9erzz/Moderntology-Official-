import React, { useMemo, useState, useEffect } from 'react';
import { calculateVimshottari, calculateAntardashas } from '@/utils/astrology/vedic-calc';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    moonAbsDeg: number;
    birthDate: string; // ISO string
}

export const VimshottariDasha: React.FC<Props> = ({ moonAbsDeg, birthDate }) => {
    const timeline = useMemo(() => {
        if (!moonAbsDeg || !birthDate) return [];
        return calculateVimshottari(moonAbsDeg, new Date(birthDate));
    }, [moonAbsDeg, birthDate]);

    const now = new Date();

    // Find active index based on current date
    const activeIndex = useMemo(() => {
        return timeline.findIndex(p => now >= p.start && now < p.end);
    }, [timeline]);

    // State for selected Mahadasha index
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    // Sync selected with active on first load
    useEffect(() => {
        if (activeIndex !== -1) setSelectedIndex(activeIndex);
    }, [activeIndex]);

    const selectedPeriod = timeline[selectedIndex];

    // Calculate Antardashas for the selected period
    const subPeriods = useMemo(() => {
        if (!selectedPeriod) return [];
        return calculateAntardashas(selectedPeriod.lord, selectedPeriod.start);
    }, [selectedPeriod]);

    // Formatters
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (!selectedPeriod) return null;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Navigation Header */}
            <div className="bg-white/5 px-2 py-3 flex items-center justify-between border-b border-white/5">
                <button
                    onClick={() => setSelectedIndex(prev => Math.max(0, prev - 1))}
                    disabled={selectedIndex === 0}
                    className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft size={16} className="text-zinc-400" />
                </button>

                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${selectedIndex === activeIndex ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-transparent'}`} />
                        <span className="text-sm font-bold text-zinc-200 uppercase tracking-widest">
                            {selectedPeriod.lord} Mahadasha
                        </span>
                    </div>
                    <span className="text-sm text-zinc-400 font-mono">
                        {Math.round(selectedPeriod.duration)} Years • {formatDate(selectedPeriod.start)} — {formatDate(selectedPeriod.end)}
                    </span>
                </div>

                <button
                    onClick={() => setSelectedIndex(prev => Math.min(timeline.length - 1, prev + 1))}
                    disabled={selectedIndex === timeline.length - 1}
                    className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
                >
                    <ChevronRight size={16} className="text-zinc-400" />
                </button>
            </div>

            {/* List of Antardashas */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {subPeriods.map((sub, i) => {
                    const isCurrentSub = now >= sub.start && now < sub.end;

                    return (
                        <div
                            key={i}
                            className={`
                                relative p-3 px-4 rounded-lg border flex items-center justify-between transition-all
                                ${isCurrentSub ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col gap-0.5">
                                    <span className={`text-sm font-bold uppercase tracking-wide ${isCurrentSub ? 'text-amber-200' : 'text-zinc-300'}`}>
                                        {sub.lord}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Antardasha</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-mono text-zinc-400">
                                <span>{formatDate(sub.start)} - {formatDate(sub.end)}</span>
                                {isCurrentSub && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Legend */}
            <div className="px-4 py-2 bg-black/20 border-t border-white/5 text-[9px] text-zinc-600 text-center">
                Use arrows to navigate Dasha Cycles
            </div>
        </div>
    );
};
