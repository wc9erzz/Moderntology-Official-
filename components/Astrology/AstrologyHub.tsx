'use client';

import React, { useState, useMemo } from 'react';
import { normalizeChartData, SYMBOLS } from '@/components/Astrology/chart-utils';
import { AstrologyChartDashboard } from '@/components/Astrology/AstrologyChartDashboard';
import { VedicChartDisplay } from '@/components/Astrology/Vedic/VedicChartDisplay';
import { CosmicDataBreakdown } from '@/components/Astrology/CosmicDataBreakdown';
import { EngineerView } from '@/components/Astrology/EngineerView';
import { AstrologyDive, DeepDiveAnalysis, HarmonicCharts, ChartSignatures } from '@/components/Astrology/AstrologyDive';
import {
    LayoutDashboard,
    ScrollText,
    TableProperties,
    Cpu,
    Search,
    Waves,
    Settings,
    Maximize2
} from 'lucide-react';
import { OrbStrictness } from '@/utils/astrology/AstrologyEngine';

interface AstrologyHubProps {
    selectedReading: any;
    orbStrictness: OrbStrictness;
    showExtraPoints: boolean;
    setShowExtraPoints: (show: boolean) => void;
    showNodeSignatures: boolean;
    setShowNodeSignatures: (show: boolean) => void;
    viewPerspective: 'geocentric' | 'topocentric';
    onPerspectiveChange: (p: 'geocentric' | 'topocentric') => void;
    system: 'western' | 'vedic';
    setSystem: (s: 'western' | 'vedic') => void;
}

type TabId = 'natal' | 'vedic' | 'ledger' | 'engineer' | 'technical' | 'harmonics';

export function AstrologyHub({
    selectedReading,
    orbStrictness,
    showExtraPoints,
    setShowExtraPoints,
    showNodeSignatures,
    setShowNodeSignatures,
    viewPerspective,
    onPerspectiveChange,
    system,
    setSystem
}: AstrologyHubProps) {
    const [activeTab, setActiveTab] = useState<TabId>('natal');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showEngineerAspects, setShowEngineerAspects] = useState(false);

    // --- DATA NORMALIZATION LOGIC (MOVED FROM PAGE.TSX) ---
    const normalized = useMemo(() => {
        let data = selectedReading.chart_data;

        // Patch: Apply Observer View (Topocentric Moon) if selected
        if (viewPerspective === 'topocentric' && data.moon_detailed?.variants?.topocentric) {
            const topo = data.moon_detailed.variants.topocentric;
            const geo = data.points.Moon;

            // Calculate parallax diff
            let diff = Math.abs((geo.abs_deg || 0) - (topo.abs_deg || 0));
            if (diff > 180) diff = 360 - diff;

            if (diff < 2.5 && diff >= 0) {
                data = JSON.parse(JSON.stringify(data));
                if (data.points && data.points.Moon) {
                    data.points.Moon = {
                        ...data.points.Moon,
                        sign: topo.sign,
                        deg: topo.deg,
                        min: topo.min,
                        abs_deg: topo.abs_deg,
                        full_degree: topo.full_degree,
                        ra: topo.ra,
                        dec: topo.dec
                    };
                }
            }
        }

        return normalizeChartData(data);
    }, [selectedReading.chart_data, viewPerspective]);

    // Use specific vedic data if available
    const vedicData = useMemo(() => {
        if (!selectedReading.vedic_data) return null;
        let data = selectedReading.vedic_data;

        // Patch: Apply Observer View to Vedic Moon
        if (viewPerspective === 'topocentric' && selectedReading.chart_data?.moon_detailed?.variants?.topocentric) {
            const westGeo = selectedReading.chart_data.points.Moon.abs_deg;
            const westTopo = selectedReading.chart_data.moon_detailed.variants.topocentric.abs_deg;

            // Calculate delta
            let delta = westTopo - westGeo;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            // Apply to Vedic Moon
            if (data.points && data.points.Moon) {
                data = JSON.parse(JSON.stringify(data));
                const vedicMoon = data.points.Moon;
                let newAbs = (vedicMoon.abs_deg || 0) + delta;
                if (newAbs < 0) newAbs += 360;
                if (newAbs >= 360) newAbs %= 360;

                // Derive new sign/deg (Rough Approx)
                const signIdx = Math.floor(newAbs / 30);
                const degRem = newAbs % 30;
                const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

                data.points.Moon = {
                    ...vedicMoon,
                    abs_deg: newAbs,
                    sign: signs[signIdx],
                    deg: degRem,
                    min: (degRem - Math.floor(degRem)) * 60
                };
            }
        }
        return normalizeChartData(data);
    }, [selectedReading.vedic_data, selectedReading.chart_data, viewPerspective]);

    // Clean Geocentric Base for Harmonics
    const baseWesternData = useMemo(() => {
        return normalizeChartData(selectedReading.chart_data);
    }, [selectedReading.chart_data]);

    // --- TAB CONFIGURATION ---
    const tabs: { id: TabId, label: string, icon: any }[] = [
        { id: 'natal', label: 'Natal Chart', icon: LayoutDashboard },
        { id: 'vedic', label: 'Vedic System', icon: ScrollText },
        { id: 'ledger', label: 'Cosmic Ledger', icon: TableProperties },
        { id: 'engineer', label: 'Engineer View', icon: Cpu },
        { id: 'technical', label: 'Deep Analysis', icon: Search },
        { id: 'harmonics', label: 'Harmonics', icon: Waves },
    ];

    return (
        <div className="w-full flex flex-col gap-6">

            {/* 1. TOP NAV / TAB BAR */}
            <div className="sticky top-0 z-50 px-4 pt-2 -mx-4 md:px-0 md:mx-0">
                <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-card)] rounded-xl md:rounded-2xl p-1.5 flex items-center gap-1 shadow-2xl overflow-x-auto custom-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20'
                                : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? "text-white" : "opacity-70"} />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <div className="min-h-[600px] animate-fade-in-up">

                {/* TAB: NATAL CHART */}
                {activeTab === 'natal' && (
                    <AstrologyChartDashboard
                        chartData={normalized}
                        showExtraPoints={showExtraPoints}
                        setShowExtraPoints={setShowExtraPoints}
                        showNodeSignatures={showNodeSignatures}
                        setShowNodeSignatures={setShowNodeSignatures}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        orbStrictness={orbStrictness}
                    />
                )}

                {/* TAB: VEDIC SYSTEM */}
                {activeTab === 'vedic' && (
                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ScrollText className="text-[var(--accent-secondary)]" size={20} />
                                <h3 className="text-lg font-light text-[var(--text-primary)]">Sidereal (Lahiri) System</h3>
                            </div>
                            <div className="text-xs text-[var(--text-secondary)] bg-white/5 px-3 py-1 rounded-full">
                                Whole Sign Houses
                            </div>
                        </div>
                        {vedicData ? (
                            <VedicChartDisplay data={vedicData} />
                        ) : (
                            <div className="p-12 border border-dashed border-[var(--border-card)] rounded-2xl text-center text-[var(--text-secondary)]">
                                Initializing Vedic data engine...
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: COSMIC LEDGER */}
                {activeTab === 'ledger' && (
                    <CosmicDataBreakdown
                        westernData={normalized}
                        vedicData={vedicData}
                        selectedId={selectedId}
                        orbStrictness={orbStrictness}
                        showNodeSignatures={showNodeSignatures}
                        system={system}
                        setSystem={setSystem}
                        viewPerspective={viewPerspective}
                        setViewPerspective={onPerspectiveChange}
                    />
                )}

                {/* TAB: ENGINEER VIEW */}
                {activeTab === 'engineer' && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-card)]">
                                <h3 className="text-[var(--text-primary)] font-light text-lg">Engineer Aspects</h3>
                                <div className="flex items-center gap-2">
                                    {selectedId && (
                                        <button
                                            onClick={() => setSelectedId(null)}
                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] hover:text-white rounded-lg border border-white/5 transition-all"
                                        >
                                            Reset
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowEngineerAspects(!showEngineerAspects)}
                                        className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-lg border transition-all ${showEngineerAspects
                                            ? 'bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)] border-[var(--accent-secondary)]/30'
                                            : 'bg-white/5 text-[var(--text-secondary)] border-white/5'
                                            }`}
                                    >
                                        Aspects: {showEngineerAspects ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            </div>
                            <EngineerView
                                key={`western-eng-view`}
                                data={normalized}
                                system={system}
                                showExtraPoints={showExtraPoints}
                                selectedId={selectedId}
                                onSelect={(id: string) => setSelectedId(id)}
                                showAspects={showEngineerAspects}
                            />
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-card)]">
                                <h3 className="text-[var(--text-primary)] font-light text-lg">Pattern Signatures</h3>
                            </div>
                            <ChartSignatures data={normalized} />
                        </div>
                    </div>
                )}

                {/* TAB: DEEP ANALYSIS */}
                {activeTab === 'technical' && (
                    <div className="flex flex-col gap-6">
                        <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-card)]">
                            <h3 className="text-[var(--text-primary)] font-light text-lg">Technical Analysis</h3>
                            <p className="text-sm text-[var(--text-secondary)]">Sensitive points, midpoints, and calculated Arabic parts.</p>
                        </div>
                        <DeepDiveAnalysis
                            data={normalized}
                            viewPerspective={viewPerspective}
                            hideSignatures={true}
                        />
                    </div>
                )}

                {/* TAB: HARMONICS */}
                {activeTab === 'harmonics' && (
                    <div className="flex flex-col gap-6">
                        <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-card)]">
                            <h3 className="text-[var(--text-primary)] font-light text-lg">Harmonic Charts</h3>
                            <p className="text-sm text-[var(--text-secondary)]">Vibrational analysis (H1 - H12) and subdivisions.</p>
                        </div>
                        <HarmonicCharts
                            westernData={baseWesternData}
                            vedicData={vedicData}
                            viewPerspective={viewPerspective}
                            onPerspectiveChange={onPerspectiveChange}
                        />
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border-card);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
