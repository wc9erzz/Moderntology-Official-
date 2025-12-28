'use client';

import Link from 'next/link';
import { BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModeToggleProps {
    currentMode: 'reading' | 'explore';
}

export function ModeToggle({ currentMode }: ModeToggleProps) {
    return (
        <div className="flex justify-center mb-10 relative z-20">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur-md shadow-2xl">

                {/* Reading Button */}
                <Link
                    href="/reading"
                    className={`
                        relative px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-colors duration-300 w-36 justify-center
                        ${currentMode === 'reading' ? 'text-white' : 'text-gray-400 hover:text-white'}
                    `}
                >
                    {currentMode === 'reading' && (
                        <motion.div
                            layoutId="active-mode-pill"
                            className="absolute inset-0 rounded-full bg-purple-500/20 shadow-purple-500/10 border border-white/5 shadow-inner"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        <BookOpen className={`w-4 h-4 ${currentMode === 'reading' ? 'text-purple-300' : 'opacity-50'}`} />
                        <span>New</span>
                    </span>
                </Link>

                {/* Explore Button */}
                <Link
                    href="/explore"
                    className={`
                        relative px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-colors duration-300 w-36 justify-center
                        ${currentMode === 'explore' ? 'text-white' : 'text-gray-400 hover:text-white'}
                    `}
                >
                    {currentMode === 'explore' && (
                        <motion.div
                            layoutId="active-mode-pill"
                            className="absolute inset-0 rounded-full bg-blue-500/20 shadow-blue-500/10 border border-white/5 shadow-inner"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        <GraduationCap className={`w-4 h-4 ${currentMode === 'explore' ? 'text-blue-300' : 'opacity-50'}`} />
                        <span>Profile</span>
                    </span>
                </Link>

            </div>
        </div>
    );
}
