'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function Hero() {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setIsSignedIn(!!user);
        };

        checkAuth();

        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsSignedIn(!!session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen py-32 overflow-hidden text-white selection:bg-indigo-500/30">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="container relative z-10 px-4 md:px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mx-auto max-w-5xl text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl leading-[1.1]"
                >
                    <span className="inline-block pt-2 pb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500">
                        Bridging Spirituality
                    </span>
                    <span className="inline-block pt-2 pb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
                        & Society
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mx-auto mt-8 max-w-2xl text-lg text-zinc-400 md:text-xl leading-relaxed"
                >
                    The convergence of ancient wisdom and modern data. Unlock exclusive insights with our unified ideology tool designed for clarity.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-10 flex flex-col gap-4 items-center"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/reading"
                            className="group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition-all hover:bg-zinc-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                        >
                            Start Journey
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/50 px-8 text-sm font-medium text-zinc-300 backdrop-blur transition-all hover:bg-zinc-900 hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        >
                            About
                        </Link>
                        {isSignedIn && (
                            <Link
                                href="/explore"
                                className="group inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-rose-600 px-8 text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-rose-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                            >
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div >
        </section >
    );
}
