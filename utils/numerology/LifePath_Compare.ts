// utils/numerology/LifePath_Compare.ts - FIXED VERSION

// Import the calculator
import {
  calculateAllNumbers,
  NumerologyCalculation,
} from './calculator';

// Import the enhanced traits
import {
  lifePathTraitProfiles,
  LifePathTraits,
  calculateCompatibilityScore,
  getCategoryScore,
  interpretScore,
} from './life-path-traits-enhanced';

/**
 * Interface for a person's numerology profile
 */
export interface PersonProfile {
  name: string;
  calculation: NumerologyCalculation;
  traits: LifePathTraits;
}

/**
 * Interface for relationship options
 */
export type RelationshipType = 'family' | 'friend' | 'romantic' | 'professional' | 'general';

/**
 * Weights for different relationship types
 * Each category's importance (0-1) for similarity scoring
 */
const relationshipWeights: Record<RelationshipType, Record<string, number>> = {
  family: {
    emotional_nature: 0.25,
    social_relational: 0.25,
    values_motivations: 0.20,
    conflict_profile: 0.15,
    attachment_profile: 0.15,
  },
  friend: {
    social_relational: 0.30,
    communication_style: 0.25,
    cognitive_style: 0.20,
    emotional_nature: 0.15,
    conflict_profile: 0.10,
  },
  romantic: {
    emotional_nature: 0.30,
    attachment_profile: 0.25,
    social_relational: 0.20,
    communication_style: 0.15,
    conflict_profile: 0.10,
  },
  professional: {
    work_style: 0.30,
    core_identity: 0.25,
    communication_style: 0.20,
    cognitive_style: 0.15,
    conflict_profile: 0.10,
  },
  general: {
    // Equal weights
    core_identity: 0.125,
    work_style: 0.125,
    communication_style: 0.125,
    emotional_nature: 0.125,
    values_motivations: 0.125,
    social_relational: 0.125,
    cognitive_style: 0.125,
    conflict_profile: 0.125 / 2,
    attachment_profile: 0.125 / 2,
  },
};

/**
 * Calculate detailed similarity score between two profiles, adjusted for relationship type
 */
function calculateWeightedSimilarity(
  profile1: LifePathTraits,
  profile2: LifePathTraits,
  relationshipType: RelationshipType
): { overall: number; breakdown: Record<string, number> } {
  const weights = relationshipWeights[relationshipType];
  const categories = Object.keys(weights);
  const breakdown: Record<string, number> = {};

  let weightedSum = 0;
  let totalWeight = 0;

  for (const category of categories) {
    let simScore: number;
    if (category === 'conflict_profile' || category === 'attachment_profile' || category === 'stress_response') {
      // For non-numeric categories, use a simple similarity metric
      if (category === 'conflict_profile') {
        simScore = profile1.conflict_profile.primary_style.approach === profile2.conflict_profile.primary_style.approach ? 80 : 40;
      } else if (category === 'attachment_profile') {
        simScore = profile1.attachment_profile.primary_style === profile2.attachment_profile.primary_style ? 80 : 40;
      } else {
        simScore = 100 - Math.abs(profile1.stress_response.stress_threshold - profile2.stress_response.stress_threshold) / 2 -
          Math.abs(profile1.stress_response.recovery_speed - profile2.stress_response.recovery_speed) / 2;
      }
    } else {
      const score1 = getCategoryScore(profile1, category as any);
      const score2 = getCategoryScore(profile2, category as any);
      simScore = 100 - Math.abs(score1 - score2);
    }

    breakdown[category] = simScore;
    weightedSum += simScore * weights[category];
    totalWeight += weights[category];
  }

  const overall = Math.round(weightedSum / totalWeight);
  return { overall, breakdown };
}

/**
 * Find key differences between two profiles
 */
function findKeyDifferences(
  profile1: LifePathTraits,
  profile2: LifePathTraits,
  threshold: number = 20
): string[] {
  const differences: string[] = [];

  // Helper to compare sub-objects
  function compareCategory(category: string, obj1: Record<string, number>, obj2: Record<string, number>) {
    for (const key in obj1) {
      const diff = Math.abs(obj1[key] - obj2[key]);
      if (diff >= threshold) {
        differences.push(
          `${category} - ${key}: Person1 (${interpretScore(obj1[key])}: ${obj1[key]}) vs Person2 (${interpretScore(obj2[key])}: ${obj2[key]}) - Difference: ${diff}`
        );
      }
    }
  }

  compareCategory('Core Identity', profile1.core_identity as any, profile2.core_identity as any);
  compareCategory('Work Style', profile1.work_style as any, profile2.work_style as any);
  compareCategory('Communication Style', profile1.communication_style as any, profile2.communication_style as any);
  compareCategory('Emotional Nature', profile1.emotional_nature as any, profile2.emotional_nature as any);
  compareCategory('Values & Motivations', profile1.values_motivations as any, profile2.values_motivations as any);
  compareCategory('Social & Relational', profile1.social_relational as any, profile2.social_relational as any);
  compareCategory('Cognitive Style', profile1.cognitive_style as any, profile2.cognitive_style as any);

  // Conflict and Attachment
  if (profile1.conflict_profile.primary_style.approach !== profile2.conflict_profile.primary_style.approach) {
    differences.push(
      `Conflict Style: Person1 (${profile1.conflict_profile.primary_style.approach}) vs Person2 (${profile2.conflict_profile.primary_style.approach})`
    );
  }
  if (profile1.attachment_profile.primary_style !== profile2.attachment_profile.primary_style) {
    differences.push(
      `Attachment Style: Person1 (${profile1.attachment_profile.primary_style}) vs Person2 (${profile2.attachment_profile.primary_style})`
    );
  }

  return differences;
}

/**
 * Get profile for a person
 */
export function getPersonProfile(
  firstName: string,
  lastName: string,
  dob: string,
  middleName: string = ''
): PersonProfile {
  const calculation = calculateAllNumbers(firstName, middleName, lastName, dob);
  const lifePathNumber = calculation.lifePathNumber;
  const traits = lifePathTraitProfiles[lifePathNumber];

  if (!traits) {
    throw new Error(`No traits found for Life Path ${lifePathNumber}`);
  }

  return {
    name: `${firstName} ${middleName} ${lastName}`.trim(),
    calculation,
    traits,
  };
}

/**
 * Comprehensive comparison function
 */
export function compareProfiles(
  persons: PersonProfile[],
  relationshipType: RelationshipType
): any[] {
  if (persons.length < 2) {
    throw new Error('Need at least two persons to compare');
  }

  const results: any[] = [];

  // Pairwise comparisons
  for (let i = 0; i < persons.length; i++) {
    for (let j = i + 1; j < persons.length; j++) {
      const p1 = persons[i];
      const p2 = persons[j];

      const baseCompat = calculateCompatibilityScore(p1.traits.meta.life_path_number, p2.traits.meta.life_path_number);
      const weightedSim = calculateWeightedSimilarity(p1.traits, p2.traits, relationshipType);
      const differences = findKeyDifferences(p1.traits, p2.traits);

      results.push({
        pair: `${p1.name} (LP ${p1.calculation.lifePathNumber}) vs ${p2.name} (LP ${p2.calculation.lifePathNumber})`,
        base_compatibility: baseCompat,
        weighted_similarity: weightedSim.overall,
        similarity_breakdown: weightedSim.breakdown,
        key_differences: differences,
        challenges: [...p1.traits.challenges, ...p2.traits.challenges],
      });
    }
  }

  // If more than 2, add group average similarity
  if (persons.length > 2) {
    let groupSim = 0;
    results.forEach((res) => (groupSim += res.weighted_similarity));
    groupSim /= results.length;

    results.push({
      group_average_similarity: Math.round(groupSim),
    });
  }

  return results;
}