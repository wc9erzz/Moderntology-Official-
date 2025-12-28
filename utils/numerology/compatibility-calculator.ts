import { lifePathTraitProfiles, calculateCompatibilityScore, getCategoryScore, interpretScore, LifePathTraits } from './life-path-traits-enhanced';

export interface CompatibilityResult {
    base_compatibility: number;
    weighted_similarity: number;
    similarity_breakdown: Record<string, number>;
    key_differences: string[];
    challenges: string[];
    person2LifePath: number;
}

export function calculateLifePathCompatibility(path1: number, path2: number): CompatibilityResult {
    const profile1 = lifePathTraitProfiles[path1];
    const profile2 = lifePathTraitProfiles[path2];

    if (!profile1 || !profile2) {
        throw new Error(`Traits not found for Life Path ${!profile1 ? path1 : path2}`);
    }

    const base_compatibility = calculateCompatibilityScore(path1, path2);

    // Calculate weighted similarity (using general weights for now)
    const breakdown: Record<string, number> = {};
    const categories = ['core_identity', 'work_style', 'communication_style', 'emotional_nature', 'values_motivations', 'social_relational', 'cognitive_style'];

    let totalScore = 0;

    categories.forEach(category => {
        const score1 = getCategoryScore(profile1, category as any);
        const score2 = getCategoryScore(profile2, category as any);
        const simScore = 100 - Math.abs(score1 - score2);
        breakdown[category] = simScore;
        totalScore += simScore;
    });

    // Add conflict and attachment similarity
    const conflictSim = profile1.conflict_profile.primary_style.approach === profile2.conflict_profile.primary_style.approach ? 80 : 40;
    breakdown['conflict_profile'] = conflictSim;
    totalScore += conflictSim;

    const attachmentSim = profile1.attachment_profile.primary_style === profile2.attachment_profile.primary_style ? 80 : 40;
    breakdown['attachment_profile'] = attachmentSim;
    totalScore += attachmentSim;

    const weighted_similarity = Math.round(totalScore / (categories.length + 2));

    // Find key differences
    const key_differences: string[] = [];
    const threshold = 20;

    function compareCategory(category: string, obj1: any, obj2: any) {
        const r1 = obj1 as Record<string, number>;
        const r2 = obj2 as Record<string, number>;
        for (const key in r1) {
            const diff = Math.abs(r1[key] - r2[key]);
            if (diff >= threshold) {
                key_differences.push(
                    `${category} - ${key}: Person 1 (${interpretScore(r1[key])}) vs Person 2 (${interpretScore(r2[key])})`
                );
            }
        }
    }

    compareCategory('Core Identity', profile1.core_identity, profile2.core_identity);
    compareCategory('Work Style', profile1.work_style, profile2.work_style);
    compareCategory('Communication Style', profile1.communication_style, profile2.communication_style);
    compareCategory('Emotional Nature', profile1.emotional_nature, profile2.emotional_nature);
    compareCategory('Values & Motivations', profile1.values_motivations, profile2.values_motivations);
    compareCategory('Social & Relational', profile1.social_relational, profile2.social_relational);
    compareCategory('Cognitive Style', profile1.cognitive_style, profile2.cognitive_style);

    return {
        base_compatibility,
        weighted_similarity,
        similarity_breakdown: breakdown,
        key_differences,
        challenges: [...new Set([...profile1.challenges, ...profile2.challenges])],
        person2LifePath: path2
    };
}
