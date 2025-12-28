'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users } from 'lucide-react';

export function Community() {
    return (
        <section className="relative py-48 overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-indigo-900/10 pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center max-w-4xl mx-auto"
                >
                    <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-indigo-500/10 p-4 ring-1 ring-indigo-500/20">
                        <Users className="h-8 w-8 text-indigo-400" />
                    </div>

                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                        Join the Collective
                    </h2>

                    <p className="mb-8 text-lg text-zinc-400 max-w-2xl leading-relaxed">
                        Connect with like-minded individuals, share your journey, and get direct updates from the team. Our community is a safe space for modern seekers.
                    </p>

                    <a
                        href="https://discord.gg/mG2pezRw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 text-sm font-medium text-white transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        <MessageCircle className="h-4 w-4 transition-transform group-hover:rotate-12" />
                        Join Discord Community
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
