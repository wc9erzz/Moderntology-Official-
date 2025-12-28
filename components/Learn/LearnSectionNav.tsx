'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LearnSectionNavProps {
    className?: string;
}

export function LearnSectionNav({ className }: LearnSectionNavProps) {
    const pathname = usePathname();
    const isNumerology = pathname?.includes('/explore/numerology');
    const isAstrology = pathname?.includes('/explore/astrology');

    return (
        <div className={`flex justify-center mb-8 ${className || ''}`}>
            <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-sm">
                <Link
                    href="/explore/numerology"
                    className={`
            px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${isNumerology
                            ? 'bg-white/10 text-white shadow-lg shadow-purple-500/10 border border-white/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
          `}
                >
                    Numerology
                </Link>
                <Link
                    href="/explore/astrology"
                    className={`
            px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${isAstrology
                            ? 'bg-white/10 text-white shadow-lg shadow-blue-500/10 border border-white/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
          `}
                >
                    Astrology
                </Link>
            </div>
        </div>
    );
}
