import React from 'react';
import TarotDeck from '@/components/Tarot/TarotDeck';

export default function TarotPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
            <div className="w-full max-w-6xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-light tracking-wider text-slate-200 sm:text-6xl">
                        Tarot Reading
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-400">
                        Focus on your question and select two cards when you feel guided.
                    </p>
                </div>

                <TarotDeck />
            </div>
        </div>
    );
}
