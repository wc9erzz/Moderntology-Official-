import React from 'react';
import { TrendingUp, TrendingDown, Minus, Heart, GitCompare, Sparkles } from 'lucide-react';

interface CompatibilityReadingDisplayProps {
    reading: {
        base_compatibility: number;
        weighted_similarity: number;
        similarity_breakdown: Record<string, number>;
        key_differences: string[];
        challenges: string[];
    };
    person1Name: string;
    person2Name: string;
    person1LifePath: number;
    person2LifePath: number;
}

export default function CompatibilityReadingDisplay({
    reading,
    person1Name,
    person2Name,
    person1LifePath,
    person2LifePath,
}: CompatibilityReadingDisplayProps) {
    return (
        <div className="animate-fade-in-up">
            {/* Compatibility Score Header */}
            <div className="text-center mb-12">
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
                    <div className="bg-white/5 border border-purple-500/50 p-8">
                        <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Base Compatibility</h3>
                        <div className="text-6xl font-bold mb-2">{reading.base_compatibility}%</div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                                style={{ width: `${reading.base_compatibility}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Life Path {person1LifePath} & {person2LifePath}</p>
                    </div>
                    <div className="bg-white/5 border border-pink-500/50 p-8">
                        <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Weighted Similarity</h3>
                        <div className="text-6xl font-bold mb-2">{reading.weighted_similarity}%</div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-pink-500 to-pink-600"
                                style={{ width: `${reading.weighted_similarity}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Detailed Trait Analysis</p>
                    </div>
                </div>

                <p className="text-gray-400 text-lg">
                    {reading.weighted_similarity >= 80 ? 'Excellent Match' :
                        reading.weighted_similarity >= 60 ? 'Good Compatibility' :
                            reading.weighted_similarity >= 40 ? 'Moderate Compatibility' :
                                'Challenging Match'}
                </p>
            </div>

            {/* Similarity Breakdown */}
            <div className="mb-12">
                <h2 className="text-3xl font-light mb-6 text-center">Category Breakdown</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(reading.similarity_breakdown).map(([category, score]) => (
                        <div key={category} className="bg-white/5 border border-white/20 p-6">
                            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2 capitalize">
                                {category.replace(/_/g, ' ')}
                            </h3>
                            <div className="text-3xl font-bold mb-2">{Math.round(score)}%</div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Differences */}
            {reading.key_differences && reading.key_differences.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-3xl font-light mb-6 text-center">Key Differences to Navigate</h2>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-8">
                        <ul className="space-y-3">
                            {reading.key_differences.map((diff, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-3">
                                    <span className="text-yellow-400 mt-1">⚠</span>
                                    <span>{diff}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Combined Challenges */}
            {reading.challenges && reading.challenges.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-3xl font-light mb-6 text-center">Combined Growth Areas</h2>
                    <div className="bg-white/5 border border-white/20 p-8">
                        <p className="text-gray-400 mb-6">
                            Understanding both people's challenges helps navigate the relationship with compassion
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[...new Set(reading.challenges)].map((challenge, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-3 text-sm">
                                    {challenge}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
