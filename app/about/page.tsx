'use client';

import { motion } from 'framer-motion';
import { Sparkles, Target, Users, Zap, MessageCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#1a0a1a] via-[#0a0a1a] to-black text-white">
            <div className="container mx-auto px-4 py-24 md:py-32 max-w-4xl">
                {/* Mission Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="h-6 w-6 text-indigo-400" />
                        <h2 className="text-2xl font-bold">Our Mission</h2>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-lg">
                        Welcome, to what I would like to formally introduce as the upbringing. My mission is simple, bridge the gap between spirituality and modern society. I want to build a community that not only thrives, but forum new ideas. Welcome to the new world!
                    </p>
                </motion.section>

                {/* Values/Pillars Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold mb-8">Our Approach</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <Target className="h-8 w-8 text-blue-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">Precision</h3>
                            <p className="text-zinc-400 text-sm">
                                While most apps are using approximate data, our tool provides true data. We achieve 99.9% position accuracy, ensuring every calculation reflects astronomical reality—not estimations.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <Zap className="h-8 w-8 text-purple-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">Innovation</h3>
                            <p className="text-zinc-400 text-sm">
                                We synthesize Western Astrology, Vedic Astrology, and Numerology into a unified system. Our proprietary algorithm translates these different methodologies into one clear, cohesive narrative.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <Users className="h-8 w-8 text-rose-400 mb-4" />
                            <h3 className="text-lg font-bold mb-2">Community</h3>
                            <p className="text-zinc-400 text-sm">
                                This platform is community-driven. We listen to our users, evolve based on feedback, and foster a space where modern seekers can connect, share, and grow together.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Story Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                    <div className="space-y-4 text-zinc-300 leading-relaxed">
                        <p>
                            Moderntology is the work of a solo developer with a simple vision: make an impact on the world by bridging the gap between ancient spiritual wisdom and modern society.
                        </p>
                        <p>
                            What started as a personal project to synthesize different spiritual systems has evolved into a platform for seekers who refuse to choose between tradition and innovation. This is built with passion, one line of code at a time, for a community that values both precision and meaning.
                        </p>
                    </div>
                </motion.section>

                {/* Call to Action Buttons */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col gap-4 sm:flex-row sm:justify-center"
                >
                    <a
                        href="https://discord.gg/mG2pezRw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 text-sm font-medium text-white transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        <MessageCircle className="h-4 w-4 transition-transform group-hover:rotate-12" />
                        Join Discord Community
                    </a>
                    <a
                        href="/reading"
                        className="group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition-all hover:bg-zinc-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                    >
                        Start Journey
                    </a>
                </motion.section>
            </div>
        </main>
    );
}
