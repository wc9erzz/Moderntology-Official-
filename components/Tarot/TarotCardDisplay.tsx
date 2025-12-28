
import React from 'react';
import { motion } from 'framer-motion';
import { TarotCard } from '@/types/tarot';
import { cn } from '@/utils/cn';

interface TarotCardDisplayProps {
    card: TarotCard;
    index: number;
    showDelay?: number;
}

export default function TarotCardDisplay({ card, index, showDelay = 0 }: TarotCardDisplayProps) {
    // Helper to get suit icon
    const getSuitIcon = (suit: string) => {
        switch (suit.toLowerCase()) {
            case 'cups': return '🏆';
            case 'swords': return '⚔️';
            case 'wands': return '🪄';
            case 'pentacles': return '🪙';
            default: return '🔮';
        }
    };

    // Helper to get pip count (simple parsing of name or id)
    // Major arcana don't use pips in this logic usually, but we fall back to 1
    const getPipCount = () => {
        if (card.suit === 'major') return 1;

        const firstWord = card.name.split(' ')[0].toLowerCase();
        const map: { [key: string]: number } = {
            'ace': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'page': 1, 'knight': 1, 'queen': 1, 'king': 1 // Courts usually single figure
        };
        return map[firstWord] || 1;
    };

    const pipCount = getPipCount();
    const suitIcon = getSuitIcon(card.suit);

    return (
        <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-2xl border-2 border-indigo-500/20 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] bg-slate-900">
            {card.imagePath && !card.imagePath.includes("placeholder") ? (
                <img
                    src={card.imagePath}
                    alt={card.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            ) : (
                /* Dynamic Fallback: Pip Layout */
                // If it's a court card or Ace, we center a big one. 
                // If it's 2-10, we try to grid them.
                <div className="flex h-full w-full flex-col items-center justify-between p-6 text-slate-700">
                    <div className="w-full text-center text-xs font-bold uppercase tracking-widest opacity-50">{card.name}</div>

                    <div className={cn(
                        "flex flex-wrap items-center justify-center gap-4 py-4",
                        pipCount > 6 ? "gap-2" : "gap-4"
                    )}>
                        {Array.from({ length: pipCount }).map((_, i) => (
                            <motion.span
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: showDelay + (i * 0.05) }}
                                className={cn(
                                    "opacity-80 drop-shadow-lg",
                                    pipCount === 1 ? "text-8xl" : "text-4xl"
                                )}
                            >
                                {suitIcon}
                            </motion.span>
                        ))}
                    </div>

                    <div className="w-full text-center text-xs font-bold uppercase tracking-widest opacity-50">{card.suit}</div>

                    {/* Decorative Corner Borders */}
                    <div className="absolute top-2 left-2 h-4 w-4 border-l-2 border-t-2 border-indigo-500/30" />
                    <div className="absolute top-2 right-2 h-4 w-4 border-r-2 border-t-2 border-indigo-500/30" />
                    <div className="absolute bottom-2 left-2 h-4 w-4 border-l-2 border-b-2 border-indigo-500/30" />
                    <div className="absolute bottom-2 right-2 h-4 w-4 border-r-2 border-b-2 border-indigo-500/30" />
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <h3 className="font-serif text-xl font-bold text-slate-100 drop-shadow-md">{card.name}</h3>
            </div>
        </div>
    );
}
