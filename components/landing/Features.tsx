'use client';

import { motion } from 'framer-motion';
import { Target, Globe, Sparkles, Zap } from 'lucide-react';

const features = [
    {
        icon: Target,
        title: "99.9% Position Accuracy",
        description: "Most apps approximate. We don't. We pull raw astronomical data from NASA's JPL Ephemeris to ensure your planetary degrees are precise to the second.",
        color: "bg-blue-500/10",
        iconColor: "text-blue-400",
        colSpan: "md:col-span-1"
    },
    {
        icon: Globe,
        title: "Unified Ideology Engine",
        description: "Our proprietary algorithm translates Sidereal and Tropical languages into one clear voice, resolving contradictions automatically.",
        color: "bg-purple-500/10",
        iconColor: "text-purple-400",
        colSpan: "md:col-span-1"
    },
    {
        icon: Sparkles,
        title: "The Insight Hub",
        description: "A dashboard that actually makes sense. Track daily transits, dasha periods, and personal year cycles in a single view without needing a degree in astrology to interpret the data.",
        color: "bg-amber-500/10",
        iconColor: "text-amber-400",
        colSpan: "md:col-span-2"
    }
];

export function Features() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">

                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Built for Precision</h2>
                    <p className="text-zinc-400">The technical foundation behind the spiritual insight.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`${feature.colSpan} group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-all duration-500`}
                        >
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className={`mb-6 inline-flex p-3 rounded-xl ${feature.color} ${feature.iconColor} ring-1 ring-white/5`}>
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                                    <span className="mr-2">Learn technical details</span>
                                    <Zap className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
