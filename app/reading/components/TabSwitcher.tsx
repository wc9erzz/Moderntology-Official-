'use client';

interface TabSwitcherProps {
    activeTab: 'numerology' | 'astrology';
    onTabChange: (tab: 'numerology' | 'astrology') => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
    return (
        <div className="flex justify-center mb-8 relative z-10">
            <div className="bg-white/5 border border-white/10 p-1 rounded-full flex">
                <button
                    onClick={() => onTabChange('numerology')}
                    className={`
            px-8 py-3 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-300
            ${activeTab === 'numerology'
                            ? 'bg-white text-black shadow-lg scale-105'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
          `}
                >
                    Numerology
                </button>
                <button
                    onClick={() => onTabChange('astrology')}
                    className={`
            px-8 py-3 rounded-full text-sm uppercase tracking-wider font-medium transition-all duration-300
            ${activeTab === 'astrology'
                            ? 'bg-white text-black shadow-lg scale-105'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
          `}
                >
                    Astrology
                </button>
            </div>
        </div>
    );
}
