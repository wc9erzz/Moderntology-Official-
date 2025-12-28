'use client';

import { MapPin } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { useMemo } from 'react';

interface PlaceDropdownProps {
    country: string;
    state: string;
    city: string;
    onCountryChange: (value: string) => void;
    onStateChange: (value: string) => void;
    onCityChange: (value: string) => void;
    className?: string;
}

export function PlaceDropdown({
    country,
    state,
    city,
    onCountryChange,
    onStateChange,
    onCityChange,
    className = ''
}: PlaceDropdownProps) {
    // 1. Get All Countries & Organize
    const { recommended, others } = useMemo(() => {
        const all = Country.getAllCountries();
        const recCodes = ['US', 'GB', 'CA', 'AU', 'IN']; // Recommended: USA, UK, Canada, Australia, India
        const rec = all.filter(c => recCodes.includes(c.isoCode));
        // Sort others alphabetically
        const oth = all.filter(c => !recCodes.includes(c.isoCode)).sort((a, b) => a.name.localeCompare(b.name));
        return { recommended: rec, others: oth };
    }, []);

    // 2. Derive Selected Country Code
    const selectedCountryCode = useMemo(() => {
        // Search in both lists
        const found = [...recommended, ...others].find(c => c.name === country);
        return found?.isoCode || '';
    }, [country, recommended, others]);

    // 3. Get States for Selected Country
    const states = useMemo(() => {
        if (!selectedCountryCode) return [];
        return State.getStatesOfCountry(selectedCountryCode);
    }, [selectedCountryCode]);

    // 4. Derive Selected State Code
    const selectedStateCode = useMemo(() => {
        if (!state || !selectedCountryCode) return '';
        const found = states.find(s => s.name === state);
        return found?.isoCode || '';
    }, [state, states, selectedCountryCode]);

    // 5. Get Cities
    const cities = useMemo(() => {
        if (!selectedCountryCode) return [];

        // If country has states, strict dependency on state selection for massive lists (like US)
        // But some countries might have states but we want to allow city search globally? 
        // Better to follow hierarchy: If states exist, user SHOULD select state to filter cities.

        if (states.length > 0) {
            if (!selectedStateCode) return []; // Wait for state selection
            return City.getCitiesOfState(selectedCountryCode, selectedStateCode);
        } else {
            // No states (e.g. Singapore, Monaco), get all cities of country
            return City.getCitiesOfCountry(selectedCountryCode) || [];
        }
    }, [selectedCountryCode, selectedStateCode, states.length]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onCountryChange(e.target.value);
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onStateChange(e.target.value);
    };

    return (
        <div className={`relative ${className} space-y-3`}>
            {/* Country Select */}
            <div className="relative">
                <select
                    value={country}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '12px'
                    }}
                >
                    <option value="" className="bg-black text-white" hidden disabled>Select Country</option>

                    {recommended.length > 0 && (
                        <optgroup label="Recommended" className="bg-black text-white">
                            {recommended.map(c => (
                                <option key={c.isoCode} value={c.name} className="bg-black text-white">
                                    {c.name}
                                </option>
                            ))}
                        </optgroup>
                    )}

                    <optgroup label="All Countries" className="bg-black text-white">
                        {others.map(c => (
                            <option key={c.isoCode} value={c.name} className="bg-black text-white">
                                {c.name}
                            </option>
                        ))}
                    </optgroup>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* State Select (Condition: Only if country has states) */}
                {states.length > 0 && (
                    <div className="relative">
                        <select
                            value={state}
                            onChange={handleStateChange}
                            disabled={!country}
                            className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer disabled:opacity-50"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '12px'
                            }}
                        >
                            <option value="" className="bg-black text-white" hidden disabled>Select State / Region</option>
                            {states.map(s => (
                                <option key={s.isoCode} value={s.name} className="bg-black text-white">
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* City Select (or Input fallback) */}
                <div className={`relative ${states.length === 0 ? 'md:col-span-2' : ''}`}>
                    {cities.length > 0 ? (
                        <select
                            value={city}
                            onChange={(e) => onCityChange(e.target.value)}
                            // Disable if states exist but none selected
                            disabled={!country || (states.length > 0 && !state)}
                            className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all appearance-none cursor-pointer disabled:opacity-50"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '12px'
                            }}
                        >
                            <option value="" className="bg-black text-white" hidden disabled>
                                {!country
                                    ? "Select Country First"
                                    : (states.length > 0 && !state) ? "Select State First" : "Select City"
                                }
                            </option>
                            {cities.map(c => (
                                <option key={`${c.name}-${c.latitude}`} value={c.name} className="bg-black text-white">
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => onCityChange(e.target.value)}
                            placeholder={country ? "Enter City manually" : "Select Country first"}
                            disabled={!country}
                            className="w-full px-4 py-5 bg-white/5 border border-white/20 rounded-none text-lg font-light text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-purple/60 focus:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    )}
                </div>
            </div>

            <div className="absolute right-4 top-4 text-gray-500 pointer-events-none hidden md:block">
                <MapPin className="w-6 h-6" />
            </div>
        </div>
    );
}
