// utils/numerology/compatibility-data.ts

export interface CompatibilityProfile {
    natural_matches: number[];
    compatible: number[];
    challenging: number[];
    description: string;
}

export const compatibilityData: Record<number, CompatibilityProfile> = {
    1: {
        natural_matches: [1, 3, 5],
        compatible: [7, 9],
        challenging: [2, 4, 6, 8],
        description: "As a natural leader, you thrive with independent and creative partners (3, 5) who respect your need for autonomy. You may clash with those who are too controlling (8) or require constant attention (2)."
    },
    2: {
        natural_matches: [2, 4, 8],
        compatible: [3, 6, 9],
        challenging: [1, 5, 7],
        description: "You value harmony and partnership above all. You find stability with grounded numbers (4, 8) but may struggle with the unpredictable nature of freedom-seekers (5) or the detachment of analytical types (7)."
    },
    3: {
        natural_matches: [1, 3, 5],
        compatible: [2, 6, 9],
        challenging: [4, 7, 8],
        description: "Your creative and expressive nature pairs well with other energetic and optimistic numbers (1, 5). You might find the serious and structured approach of others (4, 8) to be stifling to your joy."
    },
    4: {
        natural_matches: [2, 4, 8],
        compatible: [6, 7],
        challenging: [1, 3, 5, 9],
        description: "You seek stability and order. You build strong foundations with other practical numbers (2, 8) but often find the chaotic energy of creative or adventurous types (3, 5) to be frustrating."
    },
    5: {
        natural_matches: [1, 3, 5],
        compatible: [9],
        challenging: [2, 4, 6, 7, 8],
        description: "Freedom is your core need. You connect best with fellow adventurers (1, 3) who won't fence you in. Relationships with those seeking security or routine (4, 6) can feel restrictive."
    },
    6: {
        natural_matches: [2, 6, 9],
        compatible: [3, 4, 8],
        challenging: [1, 5, 7],
        description: "You are the nurturer and protector. You harmonize well with other caring and responsible souls (2, 9). The independent (1) or flighty (5) nature of some numbers can trigger your insecurities."
    },
    7: {
        natural_matches: [7],
        compatible: [1, 4, 5],
        challenging: [2, 3, 6, 8, 9],
        description: "You are a seeker of truth and need plenty of solitude. You are best understood by other introspective minds (7) or independent types (1, 5). Emotional demands from others (2, 6) can be draining."
    },
    8: {
        natural_matches: [2, 4, 8],
        compatible: [6],
        challenging: [1, 3, 5, 7, 9],
        description: "You are driven by success and mastery. You respect the capability of other powerhouses (8) and the support of grounded partners (2, 4). Power struggles are common with other dominant numbers (1)."
    },
    9: {
        natural_matches: [3, 6, 9],
        compatible: [1, 2, 5],
        challenging: [4, 7, 8],
        description: "You are a humanitarian with a broad view. You connect deeply with other compassionate and artistic souls (3, 6). Materialistic or overly practical viewpoints (4, 8) can feel limiting to your vision."
    },
    11: {
        natural_matches: [2, 6, 8], // Often relates to 2 traits but with higher intensity
        compatible: [1, 3, 5, 7, 9, 11, 22, 33], // Master numbers often understand each other
        challenging: [4],
        description: "As a Master Number, you have intense spiritual energy. You need a partner who understands your intuition and sensitivity. You bond well with other intuitive or supportive numbers."
    },
    22: {
        natural_matches: [4, 8], // Relates to 4 traits
        compatible: [1, 2, 3, 5, 6, 7, 9, 11, 22, 33],
        challenging: [],
        description: "You are the Master Builder. You need a partner who can support your grand visions without holding you back. You share a drive for achievement with other powerful numbers."
    },
    33: {
        natural_matches: [6, 9], // Relates to 6 traits
        compatible: [1, 2, 3, 4, 5, 7, 8, 11, 22, 33],
        challenging: [],
        description: "You are the Master Teacher. Your capacity for love and service is immense. You thrive with partners who share your compassionate worldview and desire to uplift others."
    }
};

export function getCompatibilityRating(num1: number, num2: number): 'Natural Match' | 'Compatible' | 'Challenging' | 'Neutral' {
    const profile = compatibilityData[num1];
    if (!profile) return 'Neutral';

    if (profile.natural_matches.includes(num2)) return 'Natural Match';
    if (profile.compatible.includes(num2)) return 'Compatible';
    if (profile.challenging.includes(num2)) return 'Challenging';

    return 'Compatible'; // Default to compatible if not explicitly challenging
}

export function getRelationshipAdvice(num1: number, num2: number): string {
    // Default to Life Path advice for backward compatibility
    return getAspectAdvice(num1, num2, 'lifePath');
}

export function getAspectAdvice(
    num1: number,
    num2: number,
    aspect: 'lifePath' | 'expression' | 'soulUrge' | 'personality'
): string {
    const rating = getCompatibilityRating(num1, num2);

    // Templates based on Aspect and Rating
    const templates = {
        lifePath: {
            'Natural Match': "Your life paths align beautifully. You share a similar rhythm and understanding of what's important, making it easy to move through life together with shared purpose.",
            'Compatible': "You have a solid foundation for a journey together. While your paths may differ slightly, you have enough common ground to support each other's long-term goals.",
            'Challenging': "Your life paths move in different directions, which offers a powerful opportunity for growth. You challenge each other to see the world differently, though it requires patience."
        },
        soulUrge: {
            'Natural Match': "Your hearts speak the same language. You deeply understand each other's emotional needs and inner desires without needing to explain them. A profound emotional bond.",
            'Compatible': "Your emotional needs are different but complementary. You can learn to satisfy each other's hearts by appreciating the differences in what drives you internally.",
            'Challenging': "Your inner cravings and emotional needs are quite distinct. It may take conscious effort to truly understand what makes the other person feel loved and fulfilled."
        },
        expression: {
            'Natural Match': "You work together effortlessly. Your natural talents and ways of expressing yourselves mesh well, making you a formidable team in achieving shared goals.",
            'Compatible': "Your working styles and talents are different, but they can cover each other's blind spots. You can achieve great things if you respect each other's methods.",
            'Challenging': "You have very different ways of taking action and expressing yourselves. This can lead to friction in how you get things done, but also prevents stagnation."
        },
        personality: {
            'Natural Match': "You simply 'click' socially. Your outer selves and social styles mesh perfectly, making you a couple that others likely see as a perfect pair.",
            'Compatible': "You get along well socially, though you may have different preferences for how you present yourselves to the world. You balance each other out in public settings.",
            'Challenging': "Your social styles and first impressions are quite opposite. One might be more reserved while the other is outgoing, which can be a source of balance or friction."
        }
    };

    // Fallback to 'Compatible' if rating is 'Neutral' or unknown
    const ratingKey = (rating === 'Neutral') ? 'Compatible' : rating;

    return templates[aspect][ratingKey];
}
