'use client';

import { Clock } from 'lucide-react';

interface TimeDropdownProps {
    hour: string;
    minute: string;
    period: string;
    onHourChange: (value: string) => void;
    onMinuteChange: (value: string) => void;
    onPeriodChange: (value: string) => void;
    className?: string;
}

export function TimeDropdown({
    hour,
    minute,
    period,
    onHourChange,
    onMinuteChange,
    onPeriodChange,
    className = ''
}: TimeDropdownProps) {
    // Generate hours 1-12
    const hours = [
        { value: '', label: 'Hour' },
        ...Array.from({ length: 12 }, (_, i) => {
            const h = i + 1;
            return { value: h.toString(), label: h.toString() };
        })
    ];

    // Generate minutes 00-59
    const minutes = [
        { value: '', label: 'Min' },
        ...Array.from({ length: 60 }, (_, i) => {
            const m = i;
            return { value: m.toString().padStart(2, '0'), label: m.toString().padStart(2, '0') };
        })
    ];

    const periods = [
        { value: '', label: 'AM/PM' },
        { value: 'AM', label: 'AM' },
        { value: 'PM', label: 'PM' },
    ];

    return (
        <div className={`relative ${className}`}>
            <div className="grid grid-cols-3 gap-3">
                {/* Hour Select */}
                <select
                    value={hour}
                    onChange={(e) => onHourChange(e.target.value)}
                    className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '12px'
                    }}
                >
                    {hours.map(h => (
                        <option
                            key={h.value}
                            value={h.value}
                            className="bg-black text-white"
                            hidden={h.value === ''}
                            disabled={h.value === ''}
                        >
                            {h.label}
                        </option>
                    ))}
                </select>

                {/* Minute Select */}
                <select
                    value={minute}
                    onChange={(e) => onMinuteChange(e.target.value)}
                    className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '12px'
                    }}
                >
                    {minutes.map(m => (
                        <option
                            key={m.value}
                            value={m.value}
                            className="bg-black text-white"
                            hidden={m.value === ''}
                            disabled={m.value === ''}
                        >
                            {m.label}
                        </option>
                    ))}
                </select>

                {/* Period Select */}
                <select
                    value={period}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '12px'
                    }}
                >
                    {periods.map(p => (
                        <option
                            key={p.value}
                            value={p.value}
                            className="bg-black text-white"
                            hidden={p.value === ''}
                            disabled={p.value === ''}
                        >
                            {p.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Clock className="w-6 h-6" />
            </div>
        </div>
    );
}
