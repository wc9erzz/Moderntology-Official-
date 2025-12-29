'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function CTA() {
    return (
        <section className="relative py-48 overflow-hidden border-t border-white/5">
            <div className="container relative z-10 px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center"
                >


                    <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl text-white">
                        Ready to see current transits?
                    </h2>
                    <p className="mb-10 text-zinc-400 max-w-xl mx-auto text-lg">
                        Experience the tool that&apos;s changing how we interpret modern spirituality.
                    </p>
                    <Link
                        href="/reading"
                        className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-medium text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        Enter the App
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
