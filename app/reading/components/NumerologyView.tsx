'use client';

import { useState, useEffect } from 'react';
import { User, Save, Loader2, ArrowLeft, MessageCircle } from 'lucide-react';
import { DateDropdown } from '@/components/ui/DateDropdown';

import { calculateAllNumbers, isValidDate } from '@/utils/numerology/calculator';
import {
    getNumberMeaning,
    getBirthdayNumberMeaning,
    getMaturityNumberMeaning
} from '@/utils/numerology/meanings';
import { getPinnacleMeaning, getPinnacleCycleDescription } from '@/utils/numerology/pinnacle-meanings';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { saveReading, getUserProfile } from '@/utils/supabase/numera-queries';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toasts/use-toast';


interface NumerologyViewProps {
    user: any;
    initialResults?: any;
}

export function NumerologyView({ user, initialResults }: NumerologyViewProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dobMonth, setDobMonth] = useState('');
    const [dobDay, setDobDay] = useState('');
    const [dobYear, setDobYear] = useState('');
    const [error, setError] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [showResults, setShowResults] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDetailedAll, setShowDetailedAll] = useState(false);
    const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

    useEffect(() => {
        if (initialResults && !hasLoadedInitial) {
            setResults(initialResults);
            setShowResults(true);
            setFirstName(initialResults.firstName || '');
            setMiddleName(initialResults.middleName || '');
            setLastName(initialResults.lastName || '');

            if (initialResults.dob) {
                const [m, d, y] = initialResults.dob.split('/');
                setDobMonth(m || '');
                setDobDay(d || '');
                setDobYear(y || '');
            }
            setHasLoadedInitial(true);
        }
    }, [initialResults, hasLoadedInitial]);

    // Load saved form data on mount
    useEffect(() => {
        const saved = localStorage.getItem('numerology_form_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.firstName) setFirstName(data.firstName);
                if (data.middleName) setMiddleName(data.middleName);
                if (data.lastName) setLastName(data.lastName);
                if (data.dobMonth) setDobMonth(data.dobMonth);
                if (data.dobDay) setDobDay(data.dobDay);
                if (data.dobYear) setDobYear(data.dobYear);
            } catch (e) {
                console.error('Failed to load saved form data', e);
            }
        }
    }, []);

    // Save form data on change
    useEffect(() => {
        const data = {
            firstName, middleName, lastName,
            dobMonth, dobDay, dobYear
        };
        localStorage.setItem('numerology_form_data', JSON.stringify(data));
    }, [firstName, middleName, lastName, dobMonth, dobDay, dobYear]);


    const dob = dobMonth && dobDay && dobYear ? `${dobMonth}/${dobDay}/${dobYear}` : '';

    const isFormValid =
        firstName.trim().length >= 1 &&
        lastName.trim().length >= 1 &&
        dobMonth !== '' &&
        dobDay !== '' &&
        dobYear !== '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate names
        if (!firstName.trim() || !lastName.trim()) {
            setError('Please enter at least your first and last name');
            return;
        }

        // Validate name characters
        const nameRegex = /^[a-zA-Z\s\-\'\.]+$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || (middleName && !nameRegex.test(middleName))) {
            setError('Names can only contain letters, spaces, hyphens, apostrophes, and periods');
            return;
        }

        // Validate date
        if (!isValidDate(dob)) {
            setError('Please enter a valid date in MM/DD/YYYY format');
            return;
        }

        try {
            setIsCalculating(true);

            // Calculate all numbers including pinnacle cycles
            const calculatedResults = calculateAllNumbers(
                firstName.trim(),
                middleName.trim(),
                lastName.trim(),
                dob
            );

            setResults({
                ...calculatedResults,
                firstName: firstName.trim(),
                middleName: middleName.trim(),
                lastName: lastName.trim(),
                dob: dob
            });

            // Smooth scroll to results after a brief delay
            setTimeout(() => {
                setShowResults(true);
                setIsCalculating(false);
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }, 800);

        } catch (err) {
            console.error('Calculation error:', err);
            setError('An error occurred while calculating your numbers. Please check your input and try again.');
            setIsCalculating(false);
        }
    };

    const handleNewReading = () => {
        setResults(null);
        setShowResults(false);
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setDobMonth('');
        setDobDay('');
        setDobYear('');
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async () => {
        if (!user) {
            router.push('/signin');
            return;
        }

        if (!results) return;

        setIsSaving(true);
        const supabase = createClient();

        try {
            // Get user profile to get unique_id
            const profile = await getUserProfile(supabase as any);
            if (!profile) {
                toast({ title: "Error", description: "Could not find user profile.", variant: "destructive" });
                setIsSaving(false);
                return;
            }

            const readingData = {
                firstName: results.firstName,
                middleName: results.middleName,
                lastName: results.lastName,
                fullName: `${results.firstName} ${results.middleName ? results.middleName + ' ' : ''}${results.lastName}`.trim(),
                dateOfBirthEncrypted: results.dob,
                lifePathNumber: results.lifePathNumber,
                lifePathRaw: results.lifePathRaw,
                expressionNumber: results.expressionNumber,
                expressionRaw: results.expressionRaw,
                soulUrgeNumber: results.soulUrgeNumber,
                soulUrgeRaw: results.soulUrgeRaw,
                personalityNumber: results.personalityNumber,
                personalityRaw: results.personalityRaw,
                birthdayNumber: results.birthdayNumber,
                birthdayRaw: results.birthdayRaw,
                maturityNumber: results.maturityNumber,
                maturityRaw: results.maturityRaw,
                calculations: {
                    personalYearNumber: results.personalYearNumber,
                    currentAge: results.currentAge,
                    pinnacleCycles: results.pinnacleCycles
                }
            };

            const saved = await saveReading(supabase as any, profile.unique_id, readingData);

            if (saved) {
                toast({ title: "Success", description: "Reading saved to your profile!" });
            } else {
                toast({ title: "Error", description: "Failed to save reading.", variant: "destructive" });
            }
        } catch (err) {
            console.error('Save error:', err);
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const fullName = results ? `${results.firstName}${results.middleName ? ' ' + results.middleName : ''} ${results.lastName}` : '';


    // Determine current pinnacle
    let currentPinnacle: 'first' | 'second' | 'third' | 'fourth' = 'first';
    let currentPinnacleData = null;
    let yearsRemaining = 0;

    if (results?.pinnacleCycles && results?.currentAge) {
        const cycles = results.pinnacleCycles;
        const age = results.currentAge;

        if (age <= cycles.first.endAge) {
            currentPinnacle = 'first';
            currentPinnacleData = cycles.first;
            yearsRemaining = cycles.first.endAge - age;
        } else if (age <= cycles.second.endAge) {
            currentPinnacle = 'second';
            currentPinnacleData = cycles.second;
            yearsRemaining = cycles.second.endAge - age;
        } else if (age <= cycles.third.endAge) {
            currentPinnacle = 'third';
            currentPinnacleData = cycles.third;
            yearsRemaining = cycles.third.endAge - age;
        } else {
            currentPinnacle = 'fourth';
            currentPinnacleData = cycles.fourth;
            yearsRemaining = -1;
        }
    }

    return (
        <div className="relative" style={{ zIndex: 1 }}>
            {/* Form Section */}
            <div className="flex items-center justify-center px-6 pt-24 pb-8 md:pt-32">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">
                            {results ? 'Your Reading' : 'Numerology Analysis'}
                        </h1>
                        <p className="text-gray-400 text-lg font-light">
                            {results
                                ? 'Your personalized numerology reading is below'
                                : 'Enter your full name and date of birth to reveal your core numbers and pinnacle cycles.'
                            }
                        </p>

                    </div>

                    {!results && (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* First Name Input */}
                            <div className="space-y-3">
                                <label htmlFor="firstName" className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                                    First Name *
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="First name"
                                    className="w-full px-6 py-5 bg-white/5 border border-white/20 rounded-none text-xl font-light text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition-colors"
                                    autoFocus
                                    required
                                />
                            </div>

                            {/* Middle Name Input (Optional) */}
                            <div className="space-y-3">
                                <label htmlFor="middleName" className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                                    Middle Name (Optional)
                                </label>
                                <input
                                    id="middleName"
                                    type="text"
                                    value={middleName}
                                    onChange={(e) => {
                                        setMiddleName(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Middle name"
                                    className="w-full px-6 py-5 bg-white/5 border border-white/20 rounded-none text-xl font-light text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition-colors"
                                />
                            </div>

                            {/* Last Name Input */}
                            <div className="space-y-3">
                                <label htmlFor="lastName" className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                                    Last Name *
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Last name"
                                    className="w-full px-6 py-5 bg-white/5 border border-white/20 rounded-none text-xl font-light text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition-colors"
                                    required
                                />
                            </div>

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

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={!isFormValid || isCalculating}
                                    className={`
                    w-full py-5 text-xl font-medium tracking-wider transition-all duration-300
                    ${isFormValid && !isCalculating
                                            ? 'bg-white text-black hover:bg-gray-200 cursor-pointer hover:scale-105'
                                            : 'bg-white/10 text-gray-600 cursor-not-allowed'
                                        }
                  `}
                                >
                                    {isCalculating ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                                            Calculating...
                                        </span>
                                    ) : isFormValid ? 'Reveal My Numbers' : 'Complete Required Fields'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Footer hint */}
                    {!results && (
                        <div className="mt-16 text-center">
                            <p className="text-xs uppercase tracking-widest text-gray-600">
                                Your information is never stored without consent
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {showResults && results && (
                <div
                    id="results-section"
                    className="max-w-6xl mx-auto px-6 py-16 opacity-0 animate-fade-in-up"
                >
                    {/* Name Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-4">
                        <div className="text-left">
                            <p className="text-3xl text-gray-300 font-light mb-2">{fullName}</p>
                            <div className="flex items-center gap-4 text-gray-500">
                                <span>Age: {results.currentAge}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDetailedAll(!showDetailedAll)}
                                className="w-[180px] flex items-center justify-center px-4 py-2 bg-white/5 border border-white/20 hover:bg-white/10 transition-all text-xs uppercase tracking-widest text-gray-400 hover:text-white"
                            >
                                {showDetailedAll ? 'Hide Detailed' : 'Show Detailed'}
                            </button>
                        </div>
                    </div>

                    {/* Core Numbers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        <NumberCard
                            title="Life Path"
                            number={results.lifePathNumber}
                            rawNumber={results.lifePathRaw}
                            meaning={getNumberMeaning(results.lifePathNumber, 'lifePath')}
                            isPrimary={true}
                            delay={0}
                            showDetailed={showDetailedAll}
                        />

                        <NumberCard
                            title="Expression"
                            number={results.expressionNumber}
                            rawNumber={results.expressionRaw}
                            meaning={getNumberMeaning(results.expressionNumber, 'expression')}
                            delay={100}
                            showDetailed={showDetailedAll}
                        />

                        <NumberCard
                            title="Soul Urge"
                            number={results.soulUrgeNumber}
                            rawNumber={results.soulUrgeRaw}
                            meaning={getNumberMeaning(results.soulUrgeNumber, 'soulUrge')}
                            delay={200}
                            showDetailed={showDetailedAll}
                        />

                        <NumberCard
                            title="Personality"
                            number={results.personalityNumber}
                            rawNumber={results.personalityRaw}
                            meaning={getNumberMeaning(results.personalityNumber, 'personality')}
                            delay={300}
                            showDetailed={showDetailedAll}
                        />

                        <NumberCard
                            title="Birthday"
                            number={results.birthdayNumber}
                            rawNumber={results.birthdayRaw}
                            meaning={getBirthdayNumberMeaning(results.birthdayNumber, 'reading')}
                            delay={400}
                            showDetailed={showDetailedAll}
                        />

                        <NumberCard
                            title="Maturity"
                            number={results.maturityNumber}
                            rawNumber={results.maturityRaw}
                            meaning={getMaturityNumberMeaning(results.maturityNumber, 'reading')}
                            delay={500}
                            showDetailed={showDetailedAll}
                        />
                    </div>

                    {/* Personal Year */}
                    <div className="bg-white/5 border border-white/20 p-8 mb-16 transition-all duration-500 hover:bg-white/10 hover:border-white/30 hover:shadow-2xl animate-fade-in-up">
                        <div className="text-center">
                            <h2 className="text-3xl font-light mb-4 transition-all duration-300">Personal Year Number</h2>
                            <div className="text-6xl font-bold mb-4 transition-transform duration-500 hover:scale-110">{results.personalYearNumber}</div>
                            <p className="text-gray-400 max-w-2xl mx-auto transition-all duration-300">
                                This is your personal year number for {new Date().getFullYear()}. It influences the energies and opportunities available to you this year.
                            </p>
                        </div>
                    </div>





                    {/* Pinnacle Cycles Section */}
                    {results.pinnacleCycles && (
                        <div className="mb-16 animate-fade-in-up">
                            <h2 className="text-4xl font-light mb-8 text-center transition-all duration-500">Pinnacle Cycles</h2>
                            <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto transition-all duration-500 delay-100">
                                Your life is divided into four major periods called Pinnacles. Each pinnacle represents a distinct chapter of your life journey,
                                with its own lessons, opportunities, and experiences.
                            </p>

                            {/* All Pinnacle Cycles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PinnacleCycleCard
                                    title="First Pinnacle"
                                    subtitle={`Age 0 - ${results.pinnacleCycles.first.endAge}`}
                                    pinnacle={results.pinnacleCycles.first}
                                    meaning={getPinnacleMeaning(results.pinnacleCycles.first.number, 'first')}
                                    stageDescription={getPinnacleCycleDescription('first')}
                                    isCurrent={currentPinnacle === 'first'}
                                    delay={0}
                                    showDetailed={showDetailedAll}
                                />
                                <PinnacleCycleCard
                                    title="Second Pinnacle"
                                    subtitle={`Age ${results.pinnacleCycles.second.startAge} - ${results.pinnacleCycles.second.endAge}`}
                                    pinnacle={results.pinnacleCycles.second}
                                    meaning={getPinnacleMeaning(results.pinnacleCycles.second.number, 'second')}
                                    stageDescription={getPinnacleCycleDescription('second')}
                                    isCurrent={currentPinnacle === 'second'}
                                    delay={100}
                                    showDetailed={showDetailedAll}
                                />
                                <PinnacleCycleCard
                                    title="Third Pinnacle"
                                    subtitle={`Age ${results.pinnacleCycles.third.startAge} - ${results.pinnacleCycles.third.endAge}`}
                                    pinnacle={results.pinnacleCycles.third}
                                    meaning={getPinnacleMeaning(results.pinnacleCycles.third.number, 'third')}
                                    stageDescription={getPinnacleCycleDescription('third')}
                                    isCurrent={currentPinnacle === 'third'}
                                    delay={200}
                                    showDetailed={showDetailedAll}
                                />
                                <PinnacleCycleCard
                                    title="Fourth Pinnacle"
                                    subtitle={`Age ${results.pinnacleCycles.fourth.startAge} - Rest of Life`}
                                    pinnacle={results.pinnacleCycles.fourth}
                                    meaning={getPinnacleMeaning(results.pinnacleCycles.fourth.number, 'fourth')}
                                    stageDescription={getPinnacleCycleDescription('fourth')}
                                    isCurrent={currentPinnacle === 'fourth'}
                                    delay={300}
                                    showDetailed={showDetailedAll}
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up sm:pl-8">
                        <button
                            onClick={handleNewReading}
                            className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 text-center text-base font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105 rounded-full"
                        >
                            Try Another
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
                        <p className="mt-1">Sign in to save your permanent numerology profile.</p>
                    </div>
                </div>
            )
            }
        </div >
    );
}

interface NumberCardProps {
    title: string;
    number: number;
    rawNumber?: number;
    meaning: any;
    isPrimary?: boolean;
    delay?: number;
    showDetailed: boolean;
}

function NumberCard({ title, number, rawNumber, meaning, isPrimary = false, delay = 0, showDetailed }: NumberCardProps) {
    if (!meaning) return null;

    const hasDetailedValue = rawNumber && rawNumber !== number;

    return (
        <div
            className={`
        bg-white/5 border p-6 transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-2xl
        ${isPrimary ? 'border-white/40 md:col-span-2 lg:col-span-1 hover:border-white/60' : 'border-white/20 hover:border-white/40'}
        opacity-0 animate-fade-in-up
      `}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="text-center mb-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2 transition-colors duration-300">{title}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                    {showDetailed && hasDetailedValue && (
                        <span className="text-4xl font-light text-gray-500 animate-fade-in">{rawNumber}/</span>
                    )}
                    <div className="text-6xl font-bold transition-transform duration-500 hover:scale-110">{number}</div>
                </div>
                <h4 className="text-xl font-light text-gray-300 transition-colors duration-300">{meaning.title}</h4>
            </div>

            <div className="space-y-4">
                <p className="text-sm text-gray-400 leading-relaxed transition-colors duration-300">
                    {meaning.description}
                </p>

                {meaning.traits && meaning.traits.length > 0 && (
                    <div>
                        <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2 transition-colors duration-300">Key Traits</h5>
                        <div className="flex flex-wrap gap-2">
                            {meaning.traits.map((trait: string, index: number) => (
                                <span
                                    key={index}
                                    className="text-xs bg-white/10 px-2 py-1 text-gray-300 transition-all duration-300 hover:bg-white/20 hover:scale-105"
                                >
                                    {trait}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {meaning.challenges && meaning.challenges.length > 0 && (
                    <div>
                        <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2 transition-colors duration-300">Challenges</h5>
                        <ul className="text-xs text-gray-400 space-y-1">
                            {meaning.challenges.map((challenge: string, index: number) => (
                                <li key={index} className="transition-colors duration-300 hover:text-gray-300">• {challenge}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function PinnacleCycleCard({ title, subtitle, pinnacle, meaning, stageDescription, isCurrent, delay = 0, showDetailed }: any) {
    if (!pinnacle || !meaning) return null;

    const hasDetailedValue = pinnacle.raw && pinnacle.raw !== pinnacle.number;

    return (
        <div
            className={`
                relative p-8 border transition-all duration-500 animate-fade-in-up group
                ${isCurrent
                    ? 'bg-gradient-to-br from-purple-500/15 to-blue-500/15 border-purple-500/40 shadow-2xl shadow-purple-500/10 scale-[1.02] z-10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
            `}
            style={{ animationDelay: `${delay}ms` }}
        >
            {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-full shadow-lg">
                    Current Chapter
                </div>
            )}

            <div className="flex flex-col gap-6">
                {/* Header Info */}
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className={`text-xl font-light tracking-wide ${isCurrent ? 'text-purple-200' : 'text-gray-200'}`}>
                            {title}
                        </h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Number & Stage Description */}
                <div className="flex items-center gap-6 py-4 border-y border-white/5">
                    <div className="flex flex-col items-center justify-center min-w-[70px]">
                        <div className="flex items-center gap-1">
                            {showDetailed && hasDetailedValue && (
                                <span className={`text-xl font-light ${isCurrent ? 'text-purple-400/50' : 'text-gray-500'}`}>
                                    {pinnacle.raw}/
                                </span>
                            )}
                            <span className={`text-5xl font-bold ${isCurrent ? 'text-white' : 'text-gray-100'}`}>
                                {pinnacle.number}
                            </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Number</span>
                    </div>

                    <div className="border-l border-white/10 pl-6">
                        <p className={`text-xs leading-relaxed italic ${isCurrent ? 'text-purple-200/60' : 'text-gray-400'}`}>
                            {stageDescription}
                        </p>
                    </div>
                </div>

                {/* Sub-meaning */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`h-px flex-1 ${isCurrent ? 'bg-purple-500/30' : 'bg-white/10'}`} />
                        <h5 className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isCurrent ? 'text-purple-300' : 'text-gray-500'}`}>
                            {meaning.title}
                        </h5>
                        <div className={`h-px flex-1 ${isCurrent ? 'bg-purple-500/30' : 'bg-white/10'}`} />
                    </div>

                    <p className={`text-sm leading-relaxed ${isCurrent ? 'text-gray-200' : 'text-gray-400'}`}>
                        {meaning.description}
                    </p>

                    {/* Shared Pinnacle Themes */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {meaning.opportunities && (
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">Opportunities</span>
                                <ul className="space-y-1">
                                    {meaning.opportunities.slice(0, 2).map((item: string, i: number) => (
                                        <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5 leading-tight">
                                            <span className="mt-1 h-1 w-1 rounded-full bg-purple-500/50 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {meaning.challenges && (
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">Challenges</span>
                                <ul className="space-y-1">
                                    {meaning.challenges.slice(0, 2).map((item: string, i: number) => (
                                        <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5 leading-tight">
                                            <span className="mt-1 h-1 w-1 rounded-full bg-blue-500/50 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PinnacleCard({ number, raw, meaning, isCurrent, showDetailed }: any) {
    if (!meaning) return null;

    const hasDetailedValue = raw && raw !== number;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
                <div className="flex items-baseline gap-2 mb-3">
                    <h4 className="text-sm uppercase tracking-wider text-gray-500">Number</h4>
                    <div className="flex items-center gap-1 font-bold">
                        {showDetailed && hasDetailedValue && (
                            <span className="text-gray-400 animate-fade-in">{raw}/</span>
                        )}
                        <span>{number}</span>
                    </div>
                </div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Key Themes</h4>
                <p className="text-gray-300 leading-relaxed">{meaning.description}</p>
            </div>

            <div>
                {meaning.opportunities && meaning.opportunities.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Opportunities</h4>
                        <div className="flex flex-wrap gap-2">
                            {meaning.opportunities.map((trait: string, index: number) => (
                                <span key={index} className="text-sm bg-white/5 border border-white/10 px-3 py-1 text-gray-300">
                                    {trait}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {meaning.challenges && meaning.challenges.length > 0 && (
                    <div>
                        <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Challenges to Master</h4>
                        <ul className="space-y-2">
                            {meaning.challenges.map((challenge: string, index: number) => (
                                <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                                    <span className="mt-1.5 h-1 w-1 rounded-full bg-purple-500 flex-shrink-0" />
                                    {challenge}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
