'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import TarotCardDisplay from '@/components/Tarot/TarotCardDisplay';
import { tarotDeck } from '@/utils/tarotData';
import { TarotCard } from '@/types/tarot';
import { cn } from '@/utils/cn';

// Helper component to wrap useSearchParams
function TarotResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cardsParam = searchParams.get('cards');
    const spreadType = searchParams.get('spread') || 'three-card';
    const cardIds = cardsParam ? cardsParam.split(',').map(Number) : [];

    // Find cards in data
    const selectedCards = cardIds.map(id => tarotDeck.find(c => c.id === id)).filter(Boolean) as TarotCard[];

    // Define positions based on spread
    const getPositionLabel = (index: number) => {
        if (spreadType === 'celtic-cross') {
            const labels = [
                "The Present",
                "The Challenge (Crossing)",
                "The Foundation (Below)",
                "The Past (Behind)",
                "The Crown (Potential)",
                "The Future (Before)",
                "Self / Attitude",
                "Environment / Influences",
                "Hopes & Fears",
                "Outcome"
            ];
            return labels[index] || `Card ${index + 1}`;
        }
        // Default three-card
        const labels = ["The Past", "The Present", "The Future"];
        return labels[index] || `Card ${index + 1}`;
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 p-6 font-sans text-slate-100">
            <div className="mt-10 w-full max-w-7xl">
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-light tracking-wide text-slate-200">
                            {spreadType === 'celtic-cross' ? 'Celtic Cross Reading' : 'Your Guidance'}
                        </h1>
                        <p className="mt-2 text-slate-400">
                            {spreadType === 'celtic-cross'
                                ? "A deep dive into your situation, challenges, and outcome."
                                : "Insights into your past, present, and future path."}
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push('/reading/tarot')}
                        className="border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                    >
                        New Reading
                    </Button>
                </div>

                {selectedCards.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                        No cards selected.
                    </div>
                ) : (
                    /* Cards Display Grid */
                    <div className={cn(
                        "grid gap-8 transition-all",
                        spreadType === 'celtic-cross'
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // Celtic cross needs density
                            : "grid-cols-1 md:grid-cols-3" // Standard 3-card
                    )}>
                        {selectedCards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }} // Faster stagger for many cards
                                className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-0 shadow-2xl backdrop-blur-sm transition-all hover:-translate-y-2 hover:border-indigo-500/50 hover:bg-slate-800/80"
                            >
                                {/* Header / Position */}
                                <div className="border-b border-white/5 bg-white/5 px-6 py-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                                        {getPositionLabel(index)}
                                    </span>
                                </div>

                                <div className="flex flex-col p-6">
                                    <div className="mb-6 flex justify-center">
                                        {/* Placeholder Card Art */}
                                        <div className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-lg shadow-lg">
                                            {card.imagePath && !card.imagePath.includes("placeholder") ? ( // Improved check
                                                <Image
                                                    src={card.imagePath}
                                                    alt={card.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 300px"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-slate-700">
                                                    <div className="mb-2 text-4xl opacity-50">
                                                        {card.suit === 'major' ? '🔮' :
                                                            card.suit === 'cups' ? '🏆' :
                                                                card.suit === 'swords' ? '⚔️' :
                                                                    card.suit === 'wands' ? '🪄' : '🪙'}
                                                    </div>
                                                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">{card.name}</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                                <h3 className="font-serif text-xl font-bold text-slate-100 drop-shadow-md">{card.name}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-center">
                                        <div>
                                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Meaning</h4>
                                            <p className="text-sm leading-relaxed text-slate-300 line-clamp-4 hover:line-clamp-none transition-all cursor-help">{card.meaningUpright}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TarotExplorePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-500">Loading your reading...</div>}>
            <TarotResultsContent />
        </Suspense>
    );
}
