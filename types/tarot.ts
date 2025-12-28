export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
    id: number;
    name: string;
    suit: TarotSuit;
    meaningUpright: string;
    meaningReversed: string;
    symbolism: string;
    keywords: string[];
    imagePath?: string; // For the generated image
}
