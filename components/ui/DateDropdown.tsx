// components/ui/DateDropdown.tsx
'use client';

import { Calendar } from 'lucide-react';

interface DateDropdownProps {
    month: string;
    day: string;
    year: string;
    onMonthChange: (value: string) => void;
    onDayChange: (value: string) => void;
    onYearChange: (value: string) => void;
    className?: string;
}

export function DateDropdown({
    month,
    day,
    year,
    onMonthChange,
    onDayChange,
    onYearChange,
    className = ''
}: DateDropdownProps) {
    const months = [
        { value: '', label: 'Month' },
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const days = [
        { value: '', label: 'Day' },
        ...Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1;
            return { value: dayNum.toString().padStart(2, '0'), label: dayNum.toString() };
        })
    ];

    const currentYear = new Date().getFullYear();
    const years = [
        { value: '', label: 'Year' },
        ...Array.from({ length: 120 }, (_, i) => {
            const yearNum = currentYear - i;
            return { value: yearNum.toString(), label: yearNum.toString() };
        })
    ];

    return (
        <div className={`relative ${className}`}>
            <div className="grid grid-cols-3 gap-3">
                <select
                    value={month}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '12px'
                    }}
                >
                    {months.map(m => (
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

                <select
                    value={day}
                    onChange={(e) => onDayChange(e.target.value)}
                    className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '12px'
                    }}
                >
                    {days.map(d => (
                        <option
                            key={d.value}
                            value={d.value}
                            className="bg-black text-white"
                            hidden={d.value === ''}
                            disabled={d.value === ''}
                        >
                            {d.label}
                        </option>
                    ))}
                </select>

                <select
                    value={year}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '12px'
                    }}
                >
                    {years.map(y => (
                        <option
                            key={y.value}
                            value={y.value}
                            className="bg-black text-white"
                            hidden={y.value === ''}
                            disabled={y.value === ''}
                        >
                            {y.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Calendar className="w-6 h-6" />
            </div>
        </div>
    );
}
