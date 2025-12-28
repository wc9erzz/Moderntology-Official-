'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { majorArcana, tarotDeck } from '@/utils/tarotData'; // Import real data
import { TarotCard } from '@/types/tarot';

export default function TarotDeck() {
    const router = useRouter();
    const [spreadType, setSpreadType] = useState<'three-card' | 'celtic-cross' | null>(null);
    const [isSpread, setIsSpread] = useState(false);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [deck, setDeck] = useState<TarotCard[]>([]);

    const MAX_SELECTION = spreadType === 'celtic-cross' ? 10 : 3;

    // Shuffle deck on mount and take a subset for display (enough to pick from)
    useEffect(() => {
        const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
        // For visual flair, let's show 15 cards to pick from, ensuring we have enough uniqueness
        // In a real shuffling of 78, we can just show the top 15.
        setDeck(shuffled.slice(0, 15));
    }, []);

    const handleCardClick = (cardId: number) => {
        if (!isSpread) {
            setIsSpread(true);
            return;
        }

        if (selectedCards.includes(cardId)) {
            setSelectedCards(selectedCards.filter((id) => id !== cardId));
        } else {
            if (selectedCards.length < MAX_SELECTION) {
                setSelectedCards([...selectedCards, cardId]);
            }
        }
    };

    const handleContinue = () => {
        if (selectedCards.length === MAX_SELECTION) {
            const query = selectedCards.join(',');
            router.push(`/explore/tarot?cards=${query}&spread=${spreadType}`);
        }
    };

    if (!spreadType) {
        return (
            <div className="flex w-full flex-col items-center justify-center space-y-8 py-20 animate-in fade-in duration-700">
                <h2 className="text-3xl font-light text-slate-200">Choose Your Path</h2>
                <div className="flex flex-col gap-6 md:flex-row">
                    <button
                        onClick={() => setSpreadType('three-card')}
                        className="group relative flex h-64 w-64 flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 p-6 transition-all hover:border-indigo-500 hover:bg-slate-800"
                    >
                        <div className="mb-4 text-4xl">✨</div>
                        <h3 className="mb-2 text-xl font-medium text-slate-100">Standard Reading</h3>
                        <p className="text-center text-sm text-slate-400">Past, Present, and Future. A classic spread for clarity and direction.</p>
                        <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/0 transition-all group-hover:ring-indigo-500/50" />
                    </button>

                    <button
                        onClick={() => setSpreadType('celtic-cross')}
                        className="group relative flex h-64 w-64 flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 p-6 transition-all hover:border-purple-500 hover:bg-slate-800"
                    >
                        <div className="mb-4 text-4xl">🔮</div>
                        <h3 className="mb-2 text-xl font-medium text-slate-100">Celtic Cross</h3>
                        <p className="text-center text-sm text-slate-400">The Expert Spread. 10 cards revealing deep insights, challenges, and outcomes.</p>
                        <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-500/0 transition-all group-hover:ring-purple-500/50" />
                    </button>
                </div>
            </div>
        );
    }

    if (deck.length === 0) return null;

    return (
        <div className="flex w-full flex-col items-center">
            {/* Deck View */}
            <div className="relative flex h-[800px] w-full items-center justify-center overflow-hidden">
                <AnimatePresence>
                    {deck.map((card, index) => {
                        const isSelected = selectedCards.includes(card.id);
                        const totalCards = deck.length;

                        // --- Fan Calculations ---
                        // Spread over 120 degrees (-60 to +60)
                        const spreadAngle = 90;
                        const angleStep = spreadAngle / (totalCards - 1);
                        const rotation = index * angleStep - (spreadAngle / 2);

                        // Calculate X/Y for the fan arc
                        // Radius of the arc
                        const radius = 600;
                        const radian = (rotation * Math.PI) / 180;

                        // Stacked state: slight random rotation, all roughly centered
                        const stackRotation = (index % 5) * 2 - 4;

                        // Target transforms
                        const x = isSpread ? Math.sin(radian) * radius * 0.6 : index * 0.5; // Scale X to tighten width
                        const y = isSpread ? (Math.cos(radian) * radius * 0.2) - radius * 0.2 + 100 : 0; // Flatten arc

                        return (
                            <motion.div
                                key={card.id}
                                layoutId={`card-${card.id}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    x: isSpread ? x : 0,
                                    y: isSelected ? -100 : (isSpread ? y : 0),
                                    rotate: isSpread ? rotation : stackRotation,
                                    scale: isSelected ? 1.1 : 1,
                                    zIndex: isSelected ? 100 : index,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 20,
                                    mass: 1
                                }}
                                whileHover={{
                                    y: isSpread ? (isSelected ? -110 : y - 30) : -10,
                                    scale: 1.15,
                                    zIndex: 200,
                                    transition: { duration: 0.2 }
                                }}
                                onClick={() => handleCardClick(card.id)}
                                className={cn(
                                    "absolute h-64 w-40 cursor-pointer rounded-lg border border-slate-700 bg-slate-900 shadow-xl transition-colors md:h-80 md:w-52 md:rounded-xl md:border-2 origin-bottom",
                                    !isSpread && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                                    isSelected && (spreadType === 'celtic-cross' ? "border-purple-500 ring-4 ring-purple-500/50 shadow-purple-900/50" : "border-indigo-500 ring-4 ring-indigo-500/50 shadow-indigo-900/50"),
                                    !isSelected && "hover:border-indigo-400/80"
                                )}
                                style={{
                                    transformOrigin: "center 150%", // Pivot from below the card for a fanning effect
                                }}
                            >
                                <div className="h-full w-full overflow-hidden rounded-[8px] bg-slate-950 md:rounded-[10px]">
                                    <div className="h-full w-full bg-[url('/tarot-back.png')] bg-cover bg-center" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                        <div className={cn("rounded-full border-2 p-3 transition-colors",
                                            isSelected ? (spreadType === 'celtic-cross' ? "border-purple-500 bg-purple-500/20" : "border-indigo-500 bg-indigo-500/20")
                                                : "border-indigo-500/30")}>
                                            <span className="text-3xl filter drop-shadow-lg md:text-4xl">
                                                {spreadType === 'celtic-cross' ? '🔮' : '✨'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedCards.length === MAX_SELECTION && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-10 z-50"
                    >
                        <Button
                            onClick={handleContinue}
                            className={cn(
                                "scale-110 px-10 py-4 text-xl font-bold text-white shadow-2xl transition-all hover:scale-125",
                                spreadType === 'celtic-cross'
                                    ? "bg-purple-600 shadow-purple-900/50 hover:bg-purple-500"
                                    : "bg-indigo-600 shadow-indigo-900/50 hover:bg-indigo-500"
                            )}
                        >
                            Reveal Your {spreadType === 'celtic-cross' ? 'Truth' : 'Fate'}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isSpread && (
                <p className="mt-4 animate-pulse text-lg text-slate-400">Tap the deck to begin your reading</p>
            )}
            {isSpread && selectedCards.length < MAX_SELECTION && (
                <p className="mt-4 text-lg font-light text-slate-400">
                    Select <span className={cn("font-bold", spreadType === 'celtic-cross' ? "text-purple-400" : "text-indigo-400")}>
                        {MAX_SELECTION - selectedCards.length}
                    </span> more cards.
                </p>
            )}
        </div>
    );
}
