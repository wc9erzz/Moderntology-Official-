'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles } from 'lucide-react';

// Update this array with your actual updates
const updates = [
    {
        version: "1.0.0",
        date: "January 1st, 2025",
        title: "Initial Launch",
        description: "The beginning of our journey.",
        changes: [
            "Western Astrology Services are live",
            "Vedic Astrology Services are live",
            "Numerology Services are live"
        ]
    }
];

export default function UpdateLogPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#1a0a1a] via-[#0a0a1a] to-black text-white">
            <div className="container mx-auto px-4 pt-32 md:pt-40 pb-24 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent pb-4">
                        Update Log
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Track the evolution of Moderntology
                    </p>
                </motion.div>

                {/* Whats Coming */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-16 bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <h2 className="text-3xl font-bold mb-4">Whats Coming</h2>
                    <p className="text-zinc-300 max-w-2xl mx-auto italic">
                        &quot;Since we are just now launching, I will be montioring bugs and awaiting feedback, Let&apos;s build something together!&quot;
                    </p>
                </motion.div>

                {/* Updates Timeline */}
                <div className="space-y-8">
                    {updates.map((update, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
                        >
                            {/* Version Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 mb-4">
                                <Sparkles className="h-3 w-3" />
                                v{update.version}
                            </div>

                            {/* Title and Date */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-bold">{update.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <Calendar className="h-4 w-4" />
                                    {update.date}
                                </div>
                            </div>

                            {/* Changes List */}
                            {/* Changes List */}
                            {update.changes.length > 0 ? (
                                <ul className="space-y-3">
                                    {update.changes.map((change, changeIndex) => (
                                        <li key={changeIndex} className="flex items-start gap-3">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                                            <span className="text-zinc-300">{change}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-zinc-400 italic">No detailed breakdown for this release.</p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Empty State (when you haven't added updates yet) */}
                {updates.length === 0 && (
                    <div className="text-center py-16">
                        <Clock className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-500 text-lg">
                            Updates coming soon...
                        </p>
                    </div>
                )}

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-zinc-400 mb-4">
                        Want to stay updated on new features?
                    </p>
                    <a
                        href="https://discord.gg/mG2pezRw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-medium transition-colors"
                    >
                        Join Discord for Updates
                    </a>
                </motion.div>
            </div>
        </main>
    );
}
