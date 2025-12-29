'use client';

import { motion } from 'framer-motion';
import { Sparkles, Moon, Binary, Sun } from 'lucide-react';

const systems = [
    {
        title: "Western Astrology",
        subtitle: "Tropical Zodiac",
        description: "Psychological portraits and seasonal alignments focused on your personal evolution and solar identity.",
        icon: Sun,
        gradient: "from-orange-500/20 via-amber-500/5 to-transparent",
        border: "group-hover:border-orange-500/30",
        iconColor: "text-orange-400"
    },
    {
        title: "Vedic Astrology",
        subtitle: "Sidereal System",
        description: "Ancient precision using the actual constellations. Comprehensive Dashas and Nakshatra analysis.",
        icon: Moon,
        gradient: "from-indigo-500/20 via-blue-500/5 to-transparent",
        border: "group-hover:border-indigo-500/30",
        iconColor: "text-indigo-400"
    },
    {
        title: "Numerology",
        subtitle: "Pythagorean & Chaldean",
        description: "The mathematical blueprint of your life path, revealing the hidden patterns in names and dates.",
        icon: Binary,
        gradient: "from-emerald-500/20 via-teal-500/5 to-transparent",
        border: "group-hover:border-emerald-500/30",
        iconColor: "text-emerald-400"
    }
];

export function Systems() {
    return (
        <section className="relative py-24 border-t border-white/5 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs text-zinc-400 mb-6">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Comprehensive Analysis</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                        Three Systems. <span className="text-zinc-500">One Truth.</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-zinc-400">
                        We don&apos;t choose sides. We synthesize data from the world&apos;s most enduring systems to provide a complete 360° view of your cosmic blueprint.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {systems.map((sys, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/20 p-8 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/40 ${sys.border}`}
                        >
                            {/* Hover Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${sys.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 ${sys.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <sys.icon className="h-6 w-6" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">{sys.title}</h3>
                                <p className="text-xs font-medium text-indigo-400 mb-4 uppercase tracking-wider">{sys.subtitle}</p>

                                <p className="text-zinc-400 leading-relaxed text-sm flex-grow">
                                    {sys.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
