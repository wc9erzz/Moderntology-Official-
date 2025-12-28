'use client';

import { useState, useEffect } from 'react';
import { DateDropdown } from '@/components/ui/DateDropdown';
import { TimeDropdown } from '@/components/ui/TimeDropdown';
import { PlaceDropdown } from '@/components/ui/PlaceDropdown';
import { createClient } from '@/utils/supabase/client';
import { saveAstrologyReading } from '@/utils/supabase/astrology-queries';
import { getUserProfile } from '@/utils/supabase/numera-queries';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { Save, Loader2, User, MessageCircle } from 'lucide-react';
import { AstrologyEngine, OrbStrictness } from '@/utils/astrology/AstrologyEngine'; // Import Engine
import Link from 'next/link';
import { InteractiveNatalChart } from '@/components/Astrology/InteractiveNatalChart';
import { motion } from 'framer-motion';

interface AstrologyViewProps {
    user: any;
}

export function AstrologyView({ user }: AstrologyViewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [dobMonth, setDobMonth] = useState('');
    const [dobDay, setDobDay] = useState('');
    const [dobYear, setDobYear] = useState('');

    const [birthHour, setBirthHour] = useState('');
    const [birthMinute, setBirthMinute] = useState('');
    const [birthPeriod, setBirthPeriod] = useState('AM');

    const [birthCountry, setBirthCountry] = useState('');
    const [birthState, setBirthState] = useState('');
    const [birthCity, setBirthCity] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [westernData, setWesternData] = useState<any>(null);
    const [vedicData, setVedicData] = useState<any>(null);
    const [chartSystem, setChartSystem] = useState<'western' | 'vedic'>('western');
    const [viewPerspective, setViewPerspective] = useState<'geocentric' | 'topocentric'>('geocentric');
    const [isSaving, setIsSaving] = useState(false);
    const [profileName, setProfileName] = useState('');

    // Load saved form data on mount
    useEffect(() => {
        const saved = localStorage.getItem('astrology_form_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.dobMonth) setDobMonth(data.dobMonth);
                if (data.dobDay) setDobDay(data.dobDay);
                if (data.dobYear) setDobYear(data.dobYear);
                if (data.birthHour) setBirthHour(data.birthHour);
                if (data.birthMinute) setBirthMinute(data.birthMinute);
                if (data.birthPeriod) setBirthPeriod(data.birthPeriod);
                if (data.birthCountry) setBirthCountry(data.birthCountry);
                if (data.birthState) setBirthState(data.birthState);
                if (data.birthCity) setBirthCity(data.birthCity);
                if (data.profileName) setProfileName(data.profileName);
            } catch (e) {
                console.error('Failed to load saved form data', e);
            }
        }
    }, []);

    // Save form data on change
    useEffect(() => {
        const data = {
            dobMonth, dobDay, dobYear,
            birthHour, birthMinute, birthPeriod,
            birthCountry, birthState, birthCity,
            profileName
        };
        localStorage.setItem('astrology_form_data', JSON.stringify(data));
    }, [dobMonth, dobDay, dobYear, birthHour, birthMinute, birthPeriod, birthCountry, birthState, birthCity, profileName]);



    const isFormValid =
        dobMonth !== '' &&
        dobDay !== '' &&
        dobYear !== '' &&
        birthHour !== '' &&
        birthMinute !== '' &&
        birthPeriod !== '' &&
        birthCountry !== '' &&
        birthCity.trim().length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔍 Generating BOTH Western and Vedic charts simultaneously...');
        setError('');
        setLoading(true);
        setWesternData(null);
        setVedicData(null);

        // Format Date: YYYY-MM-DD
        const monthNum = new Date(`${dobMonth} 1`).getMonth() + 1;
        const fmtMonth = monthNum.toString().padStart(2, '0');
        const fmtDay = dobDay.toString().padStart(2, '0');
        const dateStr = `${dobYear}-${fmtMonth}-${fmtDay}`;

        // Format Time: HH:MM (24h)
        let hour = parseInt(birthHour, 10);
        // Standard 12h -> 24h conversion
        // 12 AM -> 00:00 (Midnight)
        // 12 PM -> 12:00 (Noon)
        if (birthPeriod === 'PM' && hour < 12) hour += 12;
        if (birthPeriod === 'AM' && hour === 12) hour = 0;
        const fmtTime = `${hour.toString().padStart(2, '0')}:${birthMinute.toString().padStart(2, '0')}`;

        try {
            // Fetch BOTH Western and Vedic charts in a SINGLE request to share geocoding
            const res = await fetch('/api/astrology', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    time: fmtTime,
                    city: birthCity,
                    state: birthState,
                    country: birthCountry,
                    system: 'all' // Request both systems at once
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to calculate charts');
            }

            const { western, vedic } = data;

            if (!western || !vedic) {
                throw new Error('Incomplete data received from server');
            }

            console.log('🔍 Western chart system:', western.meta?.system);
            console.log('🔍 Vedic chart system:', vedic.meta?.system);

            setWesternData(western);
            setVedicData(vedic);
            setChartSystem('western'); // Default to Western view
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Toggle between cached chart data
    const handleSystemChange = (newSystem: 'western' | 'vedic') => {
        if (newSystem === chartSystem) return;
        setChartSystem(newSystem);
    };

    // Get currently displayed chart data
    const currentChartData = chartSystem === 'western' ? westernData : vedicData;

    const getChartSignatures = () => {
        if (!currentChartData?.points) return null;

        const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
        const modes = { Cardinal: 0, Fixed: 0, Mutable: 0 };

        const ELEMENT_MAP: any = {
            Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
            Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
            Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
            Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
        };

        const MODE_MAP: any = {
            Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
            Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
            Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
        };

        Object.values(currentChartData.points).forEach((p: any) => {
            if (!p.sign) return;
            const el = ELEMENT_MAP[p.sign];
            const mod = MODE_MAP[p.sign];
            if (el) elements[el as keyof typeof elements]++;
            if (mod) modes[mod as keyof typeof modes]++;
        });

        return { elements, modes };
    };

    const signatures = getChartSignatures();

    const handleViewDetails = () => {
        if (!westernData) return;

        const monthNum = new Date(`${dobMonth} 1`).getMonth() + 1;
        const fmtMonth = monthNum.toString().padStart(2, '0');
        const fmtDay = dobDay.toString().padStart(2, '0');
        const dateStr = `${dobYear}-${fmtMonth}-${fmtDay}`;

        let hour = parseInt(birthHour, 10);
        if (birthPeriod === 'PM' && hour < 12) hour += 12;
        if (birthPeriod === 'AM' && hour === 12) hour = 0;
        const fmtTime = `${hour.toString().padStart(2, '0')}:${birthMinute.toString().padStart(2, '0')}`;

        const tempReading = {
            id: 'temp_reading',
            _isLocal: true, // Special flag for the Explore page
            profile_name: profileName.trim() || 'My Preview Chart',
            date_of_birth: dateStr,
            time_of_birth: fmtTime,
            latitude: westernData.meta.location.lat,
            longitude: westernData.meta.location.lon,
            chart_data: {
                ...westernData,
                user_metadata: {
                    settings: { orbStrictness: 'standard', viewPerspective }
                }
            },
            vedic_data: vedicData
        };

        // Save to LocalStorage so explore page can pick it up
        localStorage.setItem('temp_astrology_reading', JSON.stringify(tempReading));
        router.push('/reading/astrology/result');
    };



    const handleSave = async () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        if (!westernData && !vedicData) return;

        setIsSaving(true);
        const supabase = createClient();

        try {
            const profile = await getUserProfile(supabase as any);

            // Common Metadata
            const monthNum = new Date(`${dobMonth} 1`).getMonth() + 1;
            const fmtMonth = monthNum.toString().padStart(2, '0');
            const fmtDay = dobDay.toString().padStart(2, '0');
            const dateStr = `${dobYear}-${fmtMonth}-${fmtDay}`;

            let hour = parseInt(birthHour, 10);
            if (birthPeriod === 'PM' && hour < 12) hour += 12;
            if (birthPeriod === 'AM' && hour === 12) hour = 0;
            const fmtTime = `${hour.toString().padStart(2, '0')}:${birthMinute.toString().padStart(2, '0')}`;

            // Helper to save a single chart
            const saveOne = async (data: any, sys: 'western' | 'vedic') => {
                if (!data) return false;

                const payload = {
                    unique_id: profile?.unique_id,
                    date_of_birth: dateStr,
                    time_of_birth: fmtTime,
                    birth_city: birthCity,
                    birth_state: birthState,
                    birth_country: birthCountry,
                    latitude: data.meta.location.lat,
                    longitude: data.meta.location.lon,
                    system: sys,
                    chart_data: {
                        ...data,
                        user_metadata: {
                            profile_name: (profileName.trim() || profile?.full_name || 'My Reading') + (sys === 'vedic' ? ' (Vedic)' : ''),
                            settings: { orbStrictness: 'standard', viewPerspective }
                        }
                    }
                };
                return await saveAstrologyReading(supabase as any, payload);
            };

            // Save Both Concurrently
            const results = await Promise.all([
                westernData ? saveOne(westernData, 'western') : Promise.resolve(true),
                vedicData ? saveOne(vedicData, 'vedic') : Promise.resolve(true)
            ]);

            if (results.every(r => r)) {
                toast({ title: "Success", description: "Astrology charts (Western & Vedic) saved to your profile!" });
            } else {
                toast({ title: "Warning", description: "Some charts may not have enabled saving.", variant: "default" });
            }
        } catch (err) {
            console.error('Save error:', err);
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">
                        Astrology Reading
                    </h1>
                    <p className="text-gray-400 text-lg font-light">
                        Enter your birth details to reveal your astrological chart.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Date of Birth Dropdown */}
                    <div className="space-y-3">
                        <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                            Date of Birth *
                        </label>
                        <DateDropdown
                            month={dobMonth}
                            day={dobDay}
                            year={dobYear}
                            onMonthChange={(value) => {
                                setDobMonth(value);
                                setError('');
                            }}
                            onDayChange={(value) => {
                                setDobDay(value);
                                setError('');
                            }}
                            onYearChange={(value) => {
                                setDobYear(value);
                                setError('');
                            }}
                        />
                    </div>

                    {/* Time of Birth */}
                    <div className="space-y-3">
                        <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                            Time of Birth *
                        </label>
                        <TimeDropdown
                            hour={birthHour}
                            minute={birthMinute}
                            period={birthPeriod}
                            onHourChange={(value) => {
                                setBirthHour(value);
                                setError('');
                            }}
                            onMinuteChange={(value) => {
                                setBirthMinute(value);
                                setError('');
                            }}
                            onPeriodChange={(value) => {
                                setBirthPeriod(value);
                                setError('');
                            }}
                        />
                        <p className="text-xs text-gray-500">
                            Precise time helps calculate your Rising sign and House positions accurately.
                        </p>
                        {birthHour === '12' && birthPeriod === 'AM' && (
                            <p className="text-xs text-yellow-400 font-medium animate-pulse">
                                Note: 12 AM is Midnight (Start of the day)
                            </p>
                        )}
                        {birthHour === '12' && birthPeriod === 'PM' && (
                            <p className="text-xs text-emerald-400 font-medium animate-pulse">
                                Note: 12 PM is Noon (Lunch time)
                            </p>
                        )}
                    </div>

                    {/* Place of Birth */}
                    <div className="space-y-3">
                        <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                            Place of Birth *
                        </label>
                        <PlaceDropdown
                            country={birthCountry}
                            state={birthState}
                            city={birthCity}
                            onCountryChange={(value) => {
                                setBirthCountry(value);
                                setBirthState(''); // Reset state/city
                                setBirthCity('');
                                setError('');
                            }}
                            onStateChange={(value) => {
                                setBirthState(value);
                                setBirthCity(''); // Reset city
                                setError('');
                            }}
                            onCityChange={(value) => {
                                setBirthCity(value);
                                setError('');
                            }}
                        />
                    </div>

                    {/* Profile Name (Optional) */}
                    <div className="space-y-3">
                        <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                            Profile Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="e.g. My Chart, Partner, Friend"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Privacy Notice */}
                    <div className="text-center mt-6 mb-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                            Your information is never stored without consent
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={`
                w-full py-5 text-xl font-medium tracking-wider transition-all duration-300
                ${isFormValid && !loading
                                    ? 'bg-white text-black hover:bg-gray-200 cursor-pointer hover:scale-105'
                                    : 'bg-white/10 text-gray-600 cursor-not-allowed'
                                }
              `}
                        >
                            {loading ? 'Calculating...' : 'Generate Chart'}
                        </button>
                    </div>
                </form>

                {/* Results Preview */}
                {currentChartData && (
                    <div className="mt-16 space-y-12 animate-fade-in-up">
                        {/* Header Section */}
                        <div className="text-center pb-8 border-b border-white/10">
                            <h2 className="text-3xl font-extralight tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200">
                                Celestial Blueprint
                            </h2>
                            <p className="text-white/60 font-light tracking-wide">{currentChartData.meta.location.address}</p>

                            <div className="flex justify-center gap-4 mt-4 text-xs tracking-widest uppercase text-white/40">
                                <span>{currentChartData.meta.local_time.split(' ')[0]}</span>
                            </div>


                        </div>

                        {/* Chart Signatures (Breakdown) */}
                        {signatures && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
                                {/* Elements */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/30 mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                        Elemental Distribution
                                    </h4>
                                    <div className="space-y-5">
                                        {Object.entries(signatures.elements).map(([el, count]) => {
                                            const colors: any = { Fire: 'bg-rose-500', Earth: 'bg-emerald-500', Air: 'bg-amber-400', Water: 'bg-blue-500' };
                                            const total = Object.values(signatures.elements).reduce((a, b) => a + b, 0);
                                            return (
                                                <div key={el} className="space-y-2">
                                                    <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/50">
                                                        <span>{el}</span>
                                                        <span className="font-mono text-white/30">{count}</span>
                                                    </div>
                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(count / total) * 100}%` }}
                                                            className={`h-full ${colors[el]} shadow-[0_0_15px_rgba(255,255,255,0.05)]`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Modalities */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/30 mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                        Mode Signatures
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(signatures.modes).map(([mode, count]) => {
                                            const styles: any = {
                                                Cardinal: 'border-purple-500/30 bg-purple-500/5 text-purple-200',
                                                Fixed: 'border-white/10 bg-white/[0.02] text-white/80',
                                                Mutable: 'border-white/5 bg-transparent text-white/40'
                                            };
                                            return (
                                                <div key={mode} className={`flex justify-between items-center px-5 py-3 border ${styles[mode]} rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}>
                                                    <span className="text-[10px] uppercase tracking-widest font-medium">{mode}</span>
                                                    <span className="text-base font-light font-mono opacity-80">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Section */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up sm:pl-8">
                            {/* View Full Details Button */}
                            <button
                                onClick={handleViewDetails}
                                className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 text-center text-base font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-full"
                            >
                                View Full Details
                            </button>

                            <a
                                href="https://discord.gg/mG2pezRw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 text-center text-base font-medium hover:bg-indigo-500 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.3)] rounded-full"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Join Discord Community
                            </a>

                            {user ? (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 text-center text-base font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed rounded-full"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save to Profile
                                        </>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href="/signin"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 text-center text-base font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 rounded-full"
                                >
                                    <User className="h-4 w-4" />
                                    Sign In to Save
                                </Link>
                            )}
                        </div>

                        {/* Footer Note */}
                        <div className="mt-16 text-center text-xs text-gray-600 transition-all duration-500 hover:text-gray-500">
                            <p>This reading is for entertainment purposes only and is not saved.</p>
                            <p className="mt-1">Sign in to save your permanent astrological profile.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
