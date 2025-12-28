'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { NumerologyView } from '../../reading/components/NumerologyView';
import { getPrimaryReading } from '@/utils/supabase/numera-queries';
import Link from 'next/link';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

export default function ExploreNumerologyPage() {
    const [user, setUser] = useState<any>(null);
    const [initialResults, setInitialResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const supabase = createClient();

            // Get user
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Get primary reading
                const reading = await getPrimaryReading(supabase as any);
                if (reading) {
                    // Map database record to NumerologyView format
                    let dobString = '';
                    if (reading.date_of_birth_encrypted) {
                        try {
                            // Handle potential bytea format from Supabase
                            if (typeof reading.date_of_birth_encrypted === 'string') {
                                // If it's a hex string (common for bytea in some clients) or already a string
                                dobString = reading.date_of_birth_encrypted;
                            } else if (reading.date_of_birth_encrypted instanceof Uint8Array || Array.isArray(reading.date_of_birth_encrypted)) {
                                dobString = new TextDecoder().decode(new Uint8Array(reading.date_of_birth_encrypted));
                            }
                        } catch (e) {
                            console.error('Failed to decode DOB:', e);
                        }
                    }

                    const mappedResults = {
                        firstName: reading.first_name_entered,
                        middleName: reading.middle_name_entered,
                        lastName: reading.last_name_entered,
                        dob: dobString,
                        lifePathNumber: reading.life_path_number,
                        lifePathRaw: reading.calculations?.rawValues?.lifePathRaw,
                        expressionNumber: reading.expression_number,
                        expressionRaw: reading.calculations?.rawValues?.expressionRaw,
                        soulUrgeNumber: reading.soul_urge_number,
                        soulUrgeRaw: reading.calculations?.rawValues?.soulUrgeRaw,
                        personalityNumber: reading.personality_number,
                        personalityRaw: reading.calculations?.rawValues?.personalityRaw,
                        birthdayNumber: reading.birthday_number,
                        birthdayRaw: reading.calculations?.rawValues?.birthdayRaw,
                        maturityNumber: reading.maturity_number,
                        maturityRaw: reading.calculations?.rawValues?.maturityRaw,
                        personalYearNumber: reading.calculations?.personalYearNumber,
                        currentAge: reading.calculations?.currentAge,
                        pinnacleCycles: reading.calculations?.pinnacleCycles
                    };
                    setInitialResults(mappedResults);
                }
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    return (
        <main className="min-h-screen relative bg-[#0a0a0a] text-white">
            <ParticleBackground />
            <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">


                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white mb-4" />
                        <p className="text-white/40 animate-pulse uppercase tracking-widest text-sm">Retrieving your numbers...</p>
                    </div>
                ) : (
                    <NumerologyView user={user} initialResults={initialResults} />
                )}
            </div>
        </main>
    );
}
