'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { NumerologyView } from '../components/NumerologyView';
import Link from 'next/link';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

export default function NumerologyPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    return (
        <main className="min-h-screen relative bg-[#0a0a0a] text-white">
            <ParticleBackground />
            <div className="relative z-10 container mx-auto px-4 py-8">

                <NumerologyView user={user} />
            </div>
        </main>
    );
}
