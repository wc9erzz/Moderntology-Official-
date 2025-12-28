'use client';

import { motion } from 'framer-motion';

export function Philosophy() {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="container relative z-10 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-sm font-bold tracking-[0.2em] text-indigo-400 uppercase mb-8">
                        Universal Insight
                    </h2>

                    <h3 className="text-3xl md:text-5xl font-medium text-white leading-tight mb-8">
                        Wisdom that works for you, <br className="hidden md:block" />
                        no matter where you start.
                    </h3>

                    <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium">
                        Whether you seek the psychological depth of Western astrology, the precise timing of Vedic charts, or the hidden patterns of Numerology, clarity should be accessible to everyone.
                        <br /><br />
                        Our platform empowers your unique journey with professional-grade tools designed to provide value regardless of your preferred path.
                    </p>

                    <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
}