/**
 * Enhanced Life Path Traits System
 * Scale: 1-100 for all numerical ratings
 * - 1-20: Very Low
 * - 21-40: Low
 * - 41-60: Moderate
 * - 61-80: High
 * - 81-100: Very High
 */

export interface ConflictStyle {
  approach: 'compete' | 'accommodate' | 'avoid' | 'collaborate' | 'compromise';
  intensity: number; // 1-100
}

export interface ConflictProfile {
  primary_style: ConflictStyle;
  secondary_style?: ConflictStyle;
  conflict_frequency: number; // 1-100
  conflict_avoidance: number; // 1-100
  recovery_speed: number; // 1-100
  holding_grudges: number; // 1-100
}

export interface AttachmentProfile {
  primary_style: 'secure' | 'anxious' | 'avoidant' | 'fearful-avoidant' | 'mixed';
  secure_score: number; // 1-100
  anxious_score: number; // 1-100
  avoidant_score: number; // 1-100
}

export interface StressResponse {
  stress_threshold: number; // 1-100: How much stress they can handle
  recovery_speed: number; // 1-100: How quickly they bounce back
}

export interface CoreIdentity {
  leadership: number; // 1-100
  independence: number; // 1-100
  collaboration: number; // 1-100
  authenticity_drive: number; // 1-100
  self_confidence: number; // 1-100
  individuality: number; // 1-100
}

export interface WorkStyle {
  initiative: number; // 1-100
  structure: number; // 1-100
  flexibility: number; // 1-100
  pace: number; // 1-100
  focus: number; // 1-100
  endurance: number; // 1-100
  practicality: number; // 1-100
  decisiveness: number; // 1-100
  risk_tolerance: number; // 1-100
  perfectionism: number; // 1-100
  multitasking: number; // 1-100
  delegation: number; // 1-100
}

export interface CommunicationStyle {
  directness: number; // 1-100
  expressiveness: number; // 1-100
  listening: number; // 1-100
  assertiveness: number; // 1-100
  verbal_processing: number; // 1-100
  communication_frequency: number; // 1-100
  depth_preference: number; // 1-100
  conflict_communication: number; // 1-100
}

export interface EmotionalNature {
  emotional_depth: number; // 1-100
  sensitivity: number; // 1-100
  empathy: number; // 1-100
  emotional_expression: number; // 1-100
  emotional_control: number; // 1-100
  emotional_awareness: number; // 1-100
  emotional_volatility: number; // 1-100
  resilience: number; // 1-100
  optimism: number; // 1-100
  emotional_intensity: number; // 1-100
}

export interface ValuesAndMotivations {
  achievement_drive: number; // 1-100
  innovation: number; // 1-100
  tradition: number; // 1-100
  service_orientation: number; // 1-100
  freedom_need: number; // 1-100
  security_need: number; // 1-100
  perfection_drive: number; // 1-100
  recognition_need: number; // 1-100
  meaning_seeking: number; // 1-100
  material_drive: number; // 1-100
  spiritual_orientation: number; // 1-100
  intellectual_curiosity: number; // 1-100
}

export interface SocialRelational {
  social_energy: number; // 1-100
  trust_openness: number; // 1-100
  boundaries: number; // 1-100
  nurturing: number; // 1-100
  intimacy_comfort: number; // 1-100
  personal_space_need: number; // 1-100
  social_adaptability: number; // 1-100
  vulnerability_comfort: number; // 1-100
  loyalty: number; // 1-100
  forgiveness: number; // 1-100
}

export interface CognitiveStyle {
  analytical_thinking: number; // 1-100
  intuitive_thinking: number; // 1-100
  abstract_thinking: number; // 1-100
  creative_thinking: number; // 1-100
  systematic_thinking: number; // 1-100
  critical_thinking: number; // 1-100
  open_mindedness: number; // 1-100
  attention_to_detail: number; // 1-100
}

export interface LifePathTraits {
  core_identity: CoreIdentity;
  work_style: WorkStyle;
  communication_style: CommunicationStyle;
  emotional_nature: EmotionalNature;
  values_motivations: ValuesAndMotivations;
  social_relational: SocialRelational;
  cognitive_style: CognitiveStyle;
  conflict_profile: ConflictProfile;
  attachment_profile: AttachmentProfile;
  stress_response: StressResponse;
  compatibility_factors: {
    needs_similar_energy_level: boolean;
    needs_independence_respected: boolean;
    needs_emotional_depth: boolean;
    needs_stability: boolean;
    needs_excitement: boolean;
    works_well_with: number[];
    challenges_with: number[];
  };
  challenges: string[];  // Added for balance and growth areas
  meta: {
    life_path_number: number;
    archetype_name: string;
    core_motto: string;
  };
}

export const lifePathTraitProfiles: Record<number, LifePathTraits> = {
  1: {
    core_identity: {
      leadership: 95,
      independence: 98,
      collaboration: 35,
      authenticity_drive: 85,
      self_confidence: 88,
      individuality: 92,
    },
    work_style: {
      initiative: 98,
      structure: 55,
      flexibility: 70,
      pace: 92,
      focus: 80,
      endurance: 85,
      practicality: 68,
      decisiveness: 90,
      risk_tolerance: 82,
      perfectionism: 70,
      multitasking: 75,
      delegation: 50,
    },
    communication_style: {
      directness: 92,
      expressiveness: 78,
      listening: 45,
      assertiveness: 98,
      verbal_processing: 70,
      communication_frequency: 60,
      depth_preference: 65,
      conflict_communication: 95,
    },
    emotional_nature: {
      emotional_depth: 50,
      sensitivity: 38,
      empathy: 48,
      emotional_expression: 58,
      emotional_control: 75,
      emotional_awareness: 60,
      emotional_volatility: 55,
      resilience: 85,
      optimism: 78,
      emotional_intensity: 60,
    },
    values_motivations: {
      achievement_drive: 98,
      innovation: 92,
      tradition: 28,
      service_orientation: 40,
      freedom_need: 98,
      security_need: 45,
      perfection_drive: 72,
      recognition_need: 75,
      meaning_seeking: 65,
      material_drive: 70,
      spiritual_orientation: 45,
      intellectual_curiosity: 72,
    },
    social_relational: {
      social_energy: 72,
      trust_openness: 55,
      boundaries: 82,
      nurturing: 30,
      intimacy_comfort: 55,
      personal_space_need: 70,
      social_adaptability: 60,
      vulnerability_comfort: 35,
      loyalty: 75,
      forgiveness: 60,
    },
    cognitive_style: {
      analytical_thinking: 78,
      intuitive_thinking: 75,
      abstract_thinking: 70,
      creative_thinking: 85,
      systematic_thinking: 65,
      critical_thinking: 80,
      open_mindedness: 65,
      attention_to_detail: 70,
    },
    conflict_profile: {
      primary_style: { approach: 'compete', intensity: 90 },
      secondary_style: { approach: 'collaborate', intensity: 60 },
      conflict_frequency: 70,
      conflict_avoidance: 15,
      recovery_speed: 75,
      holding_grudges: 55,
    },
    attachment_profile: {
      primary_style: 'mixed',
      secure_score: 60,
      anxious_score: 30,
      avoidant_score: 65,
    },
    stress_response: {
      stress_threshold: 75,
      recovery_speed: 70,
    },
    compatibility_factors: {
      needs_similar_energy_level: true,
      needs_independence_respected: true,
      needs_emotional_depth: false,
      needs_stability: false,
      needs_excitement: true,
      works_well_with: [3, 5, 9, 22],
      challenges_with: [2, 4, 6],
    },
    challenges: ['Stubbornness', 'Ego issues', 'Difficulty delegating', 'Risk of isolation', 'Impatience'],
    meta: {
      life_path_number: 1,
      archetype_name: 'THE LEADER',
      core_motto: 'I must lead my own way',
    },
  },

  2: {
    core_identity: {
      leadership: 38,
      independence: 28,
      collaboration: 95,
      authenticity_drive: 60,
      self_confidence: 55,
      individuality: 35,
    },
    work_style: {
      initiative: 48,
      structure: 68,
      flexibility: 82,
      pace: 52,
      focus: 78,
      endurance: 72,
      practicality: 70,
      decisiveness: 40,
      risk_tolerance: 30,
      perfectionism: 65,
      multitasking: 70,
      delegation: 75,
    },
    communication_style: {
      directness: 28,
      expressiveness: 58,
      listening: 98,
      assertiveness: 30,
      verbal_processing: 45,
      communication_frequency: 75,
      depth_preference: 85,
      conflict_communication: 25,
    },
    emotional_nature: {
      emotional_depth: 92,
      sensitivity: 98,
      empathy: 98,
      emotional_expression: 70,
      emotional_control: 48,
      emotional_awareness: 95,
      emotional_volatility: 65,
      resilience: 60,
      optimism: 65,
      emotional_intensity: 85,
    },
    values_motivations: {
      achievement_drive: 58,
      innovation: 50,
      tradition: 72,
      service_orientation: 90,
      freedom_need: 38,
      security_need: 85,
      perfection_drive: 62,
      recognition_need: 50,
      meaning_seeking: 80,
      material_drive: 40,
      spiritual_orientation: 75,
      intellectual_curiosity: 65,
    },
    social_relational: {
      social_energy: 60,
      trust_openness: 82,
      boundaries: 35,
      nurturing: 85,
      intimacy_comfort: 90,
      personal_space_need: 40,
      social_adaptability: 88,
      vulnerability_comfort: 75,
      loyalty: 95,
      forgiveness: 92,
    },
    cognitive_style: {
      analytical_thinking: 65,
      intuitive_thinking: 90,
      abstract_thinking: 70,
      creative_thinking: 75,
      systematic_thinking: 70,
      critical_thinking: 60,
      open_mindedness: 85,
      attention_to_detail: 80,
    },
    conflict_profile: {
      primary_style: { approach: 'avoid', intensity: 85 },
      secondary_style: { approach: 'accommodate', intensity: 70 },
      conflict_frequency: 25,
      conflict_avoidance: 95,
      recovery_speed: 45,
      holding_grudges: 60,
    },
    attachment_profile: {
      primary_style: 'anxious',
      secure_score: 50,
      anxious_score: 85,
      avoidant_score: 20,
    },
    stress_response: {
      stress_threshold: 50,
      recovery_speed: 55,
    },
    compatibility_factors: {
      needs_similar_energy_level: false,
      needs_independence_respected: false,
      needs_emotional_depth: true,
      needs_stability: true,
      needs_excitement: false,
      works_well_with: [4, 6, 8, 9],
      challenges_with: [1, 5, 7],
    },
    challenges: ['Indecisiveness', 'People-pleasing', 'Suppressed emotions', 'Dependency', 'Over-sensitivity'],
    meta: {
      life_path_number: 2,
      archetype_name: 'THE PEACEMAKER',
      core_motto: 'I need harmony above all',
    },
  },

  3: {
    core_identity: {
      leadership: 62,
      independence: 72,
      collaboration: 80,
      authenticity_drive: 92,
      self_confidence: 75,
      individuality: 88,
    },
    work_style: {
      initiative: 78,
      structure: 38,
      flexibility: 92,
      pace: 82,
      focus: 45,
      endurance: 58,
      practicality: 48,
      decisiveness: 65,
      risk_tolerance: 75,
      perfectionism: 50,
      multitasking: 85,
      delegation: 70,
    },
    communication_style: {
      directness: 68,
      expressiveness: 98,
      listening: 68,
      assertiveness: 72,
      verbal_processing: 95,
      communication_frequency: 90,
      depth_preference: 60,
      conflict_communication: 80,
    },
    emotional_nature: {
      emotional_depth: 72,
      sensitivity: 70,
      empathy: 78,
      emotional_expression: 98,
      emotional_control: 45,
      emotional_awareness: 75,
      emotional_volatility: 70,
      resilience: 75,
      optimism: 90,
      emotional_intensity: 80,
    },
    values_motivations: {
      achievement_drive: 70,
      innovation: 90,
      tradition: 35,
      service_orientation: 68,
      freedom_need: 85,
      security_need: 45,
      perfection_drive: 48,
      recognition_need: 85,
      meaning_seeking: 72,
      material_drive: 55,
      spiritual_orientation: 60,
      intellectual_curiosity: 75,
    },
    social_relational: {
      social_energy: 98,
      trust_openness: 75,
      boundaries: 55,
      nurturing: 62,
      intimacy_comfort: 70,
      personal_space_need: 35,
      social_adaptability: 90,
      vulnerability_comfort: 65,
      loyalty: 70,
      forgiveness: 85,
    },
    cognitive_style: {
      analytical_thinking: 55,
      intuitive_thinking: 85,
      abstract_thinking: 80,
      creative_thinking: 98,
      systematic_thinking: 40,
      critical_thinking: 60,
      open_mindedness: 90,
      attention_to_detail: 45,
    },
    conflict_profile: {
      primary_style: { approach: 'compromise', intensity: 75 },
      secondary_style: { approach: 'avoid', intensity: 60 },
      conflict_frequency: 55,
      conflict_avoidance: 50,
      recovery_speed: 80,
      holding_grudges: 30,
    },
    attachment_profile: {
      primary_style: 'secure',
      secure_score: 70,
      anxious_score: 50,
      avoidant_score: 30,
    },
    stress_response: {
      stress_threshold: 60,
      recovery_speed: 75,
    },
    compatibility_factors: {
      needs_similar_energy_level: true,
      needs_independence_respected: true,
      needs_emotional_depth: false,
      needs_stability: false,
      needs_excitement: true,
      works_well_with: [1, 5, 6, 9],
      challenges_with: [4, 7, 8],
    },
    challenges: ['Scattered energy', 'Superficiality', 'Emotional volatility', 'Avoidance of depth', 'Over-optimism'],
    meta: {
      life_path_number: 3,
      archetype_name: 'THE CREATIVE',
      core_motto: 'I express therefore I am',
    },
  },

  4: {
    core_identity: {
      leadership: 72,
      independence: 70,
      collaboration: 68,
      authenticity_drive: 75,
      self_confidence: 78,
      individuality: 60,
    },
    work_style: {
      initiative: 72,
      structure: 98,
      flexibility: 28,
      pace: 62,
      focus: 98,
      endurance: 98,
      practicality: 98,
      decisiveness: 75,
      risk_tolerance: 30,
      perfectionism: 92,
      multitasking: 45,
      delegation: 55,
    },
    communication_style: {
      directness: 82,
      expressiveness: 48,
      listening: 72,
      assertiveness: 70,
      verbal_processing: 40,
      communication_frequency: 60,
      depth_preference: 70,
      conflict_communication: 85,
    },
    emotional_nature: {
      emotional_depth: 52,
      sensitivity: 48,
      empathy: 62,
      emotional_expression: 38,
      emotional_control: 92,
      emotional_awareness: 65,
      emotional_volatility: 30,
      resilience: 88,
      optimism: 60,
      emotional_intensity: 50,
    },
    values_motivations: {
      achievement_drive: 90,
      innovation: 48,
      tradition: 92,
      service_orientation: 72,
      freedom_need: 45,
      security_need: 98,
      perfection_drive: 92,
      recognition_need: 60,
      meaning_seeking: 70,
      material_drive: 75,
      spiritual_orientation: 55,
      intellectual_curiosity: 70,
    },
    social_relational: {
      social_energy: 48,
      trust_openness: 55,
      boundaries: 90,
      nurturing: 60,
      intimacy_comfort: 60,
      personal_space_need: 65,
      social_adaptability: 50,
      vulnerability_comfort: 40,
      loyalty: 95,
      forgiveness: 65,
    },
    cognitive_style: {
      analytical_thinking: 90,
      intuitive_thinking: 45,
      abstract_thinking: 50,
      creative_thinking: 55,
      systematic_thinking: 98,
      critical_thinking: 85,
      open_mindedness: 50,
      attention_to_detail: 98,
    },
    conflict_profile: {
      primary_style: { approach: 'collaborate', intensity: 80 },
      secondary_style: { approach: 'compete', intensity: 65 },
      conflict_frequency: 60,
      conflict_avoidance: 35,
      recovery_speed: 55,
      holding_grudges: 75,
    },
    attachment_profile: {
      primary_style: 'secure',
      secure_score: 75,
      anxious_score: 35,
      avoidant_score: 45,
    },
    stress_response: {
      stress_threshold: 70,
      recovery_speed: 60,
    },
    compatibility_factors: {
      needs_similar_energy_level: false,
      needs_independence_respected: true,
      needs_emotional_depth: false,
      needs_stability: true,
      needs_excitement: false,
      works_well_with: [2, 6, 8, 22],
      challenges_with: [3, 5, 7],
    },
    challenges: ['Rigidity', 'Workaholism', 'Resistance to change', 'Emotional repression', 'Pessimism'],
    meta: {
      life_path_number: 4,
      archetype_name: 'THE BUILDER',
      core_motto: 'Order creates success',
    },
  },

  5: {
    core_identity: {
      leadership: 65,
      independence: 92,
      collaboration: 62,
      authenticity_drive: 88,
      self_confidence: 80,
      individuality: 90,
    },
    work_style: {
      initiative: 90,
      structure: 28,
      flexibility: 98,
      pace: 98,
      focus: 38,
      endurance: 62,
      practicality: 52,
      decisiveness: 75,
      risk_tolerance: 95,
      perfectionism: 35,
      multitasking: 95,
      delegation: 70,
    },
    communication_style: {
      directness: 80,
      expressiveness: 88,
      listening: 60,
      assertiveness: 82,
      verbal_processing: 85,
      communication_frequency: 75,
      depth_preference: 55,
      conflict_communication: 70,
    },
    emotional_nature: {
      emotional_depth: 62,
      sensitivity: 58,
      empathy: 68,
      emotional_expression: 78,
      emotional_control: 60,
      emotional_awareness: 70,
      emotional_volatility: 70,
      resilience: 78,
      optimism: 85,
      emotional_intensity: 75,
    },
    values_motivations: {
      achievement_drive: 72,
      innovation: 92,
      tradition: 18,
      service_orientation: 50,
      freedom_need: 98,
      security_need: 25,
      perfection_drive: 38,
      recognition_need: 70,
      meaning_seeking: 65,
      material_drive: 60,
      spiritual_orientation: 55,
      intellectual_curiosity: 90,
    },
    social_relational: {
      social_energy: 90,
      trust_openness: 72,
      boundaries: 70,
      nurturing: 48,
      intimacy_comfort: 60,
      personal_space_need: 75,
      social_adaptability: 95,
      vulnerability_comfort: 55,
      loyalty: 60,
      forgiveness: 80,
    },
    cognitive_style: {
      analytical_thinking: 70,
      intuitive_thinking: 85,
      abstract_thinking: 80,
      creative_thinking: 88,
      systematic_thinking: 30,
      critical_thinking: 75,
      open_mindedness: 98,
      attention_to_detail: 40,
    },
    conflict_profile: {
      primary_style: { approach: 'avoid', intensity: 75 },
      secondary_style: { approach: 'compete', intensity: 60 },
      conflict_frequency: 55,
      conflict_avoidance: 70,
      recovery_speed: 85,
      holding_grudges: 35,
    },
    attachment_profile: {
      primary_style: 'avoidant',
      secure_score: 55,
      anxious_score: 25,
      avoidant_score: 80,
    },
    stress_response: {
      stress_threshold: 55,
      recovery_speed: 80,
    },
    compatibility_factors: {
      needs_similar_energy_level: true,
      needs_independence_respected: true,
      needs_emotional_depth: false,
      needs_stability: false,
      needs_excitement: true,
      works_well_with: [1, 3, 7, 9],
      challenges_with: [2, 4, 6],
    },
    challenges: ['Restlessness', 'Impulsivity', 'Commitment issues', 'Sensation-seeking', 'Lack of focus'],
    meta: {
      life_path_number: 5,
      archetype_name: 'THE FREEDOM SEEKER',
      core_motto: 'Change is life',
    },
  },

  6: {
    core_identity: {
      leadership: 70,
      independence: 50,
      collaboration: 88,
      authenticity_drive: 72,
      self_confidence: 68,
      individuality: 55,
    },
    work_style: {
      initiative: 72,
      structure: 78,
      flexibility: 62,
      pace: 62,
      focus: 80,
      endurance: 82,
      practicality: 82,
      decisiveness: 65,
      risk_tolerance: 45,
      perfectionism: 85,
      multitasking: 80,
      delegation: 40,
    },
    communication_style: {
      directness: 60,
      expressiveness: 72,
      listening: 92,
      assertiveness: 58,
      verbal_processing: 70,
      communication_frequency: 85,
      depth_preference: 80,
      conflict_communication: 65,
    },
    emotional_nature: {
      emotional_depth: 90,
      sensitivity: 92,
      empathy: 98,
      emotional_expression: 82,
      emotional_control: 62,
      emotional_awareness: 88,
      emotional_volatility: 65,
      resilience: 70,
      optimism: 72,
      emotional_intensity: 85,
    },
    values_motivations: {
      achievement_drive: 72,
      innovation: 60,
      tradition: 82,
      service_orientation: 98,
      freedom_need: 48,
      security_need: 82,
      perfection_drive: 85,
      recognition_need: 55,
      meaning_seeking: 85,
      material_drive: 50,
      spiritual_orientation: 75,
      intellectual_curiosity: 68,
    },
    social_relational: {
      social_energy: 72,
      trust_openness: 80,
      boundaries: 42,
      nurturing: 98,
      intimacy_comfort: 85,
      personal_space_need: 40,
      social_adaptability: 78,
      vulnerability_comfort: 70,
      loyalty: 95,
      forgiveness: 88,
    },
    cognitive_style: {
      analytical_thinking: 70,
      intuitive_thinking: 82,
      abstract_thinking: 65,
      creative_thinking: 75,
      systematic_thinking: 75,
      critical_thinking: 68,
      open_mindedness: 75,
      attention_to_detail: 85,
    },
    conflict_profile: {
      primary_style: { approach: 'accommodate', intensity: 85 },
      secondary_style: { approach: 'collaborate', intensity: 70 },
      conflict_frequency: 50,
      conflict_avoidance: 55,
      recovery_speed: 60,
      holding_grudges: 55,
    },
    attachment_profile: {
      primary_style: 'anxious',
      secure_score: 60,
      anxious_score: 75,
      avoidant_score: 25,
    },
    stress_response: {
      stress_threshold: 60,
      recovery_speed: 55,
    },
    compatibility_factors: {
      needs_similar_energy_level: false,
      needs_independence_respected: false,
      needs_emotional_depth: true,
      needs_stability: true,
      needs_excitement: false,
      works_well_with: [2, 3, 9, 11],
      challenges_with: [1, 5, 8],
    },
    challenges: ['Over-responsibility', 'Perfectionism', 'Guilt-tripping', 'Boundary issues', 'Martyrdom'],
    meta: {
      life_path_number: 6,
      archetype_name: 'THE NURTURER',
      core_motto: 'I am responsible for others',
    },
  },

  7: {
    core_identity: {
      leadership: 52,
      independence: 92,
      collaboration: 38,
      authenticity_drive: 90,
      self_confidence: 72,
      individuality: 95,
    },
    work_style: {
      initiative: 62,
      structure: 72,
      flexibility: 62,
      pace: 52,
      focus: 98,
      endurance: 75,
      practicality: 62,
      decisiveness: 60,
      risk_tolerance: 55,
      perfectionism: 85,
      multitasking: 35,
      delegation: 45,
    },
    communication_style: {
      directness: 70,
      expressiveness: 38,
      listening: 82,
      assertiveness: 52,
      verbal_processing: 25,
      communication_frequency: 30,
      depth_preference: 95,
      conflict_communication: 40,
    },
    emotional_nature: {
      emotional_depth: 98,
      sensitivity: 82,
      empathy: 70,
      emotional_expression: 28,
      emotional_control: 92,
      emotional_awareness: 95,
      emotional_volatility: 35,
      resilience: 75,
      optimism: 55,
      emotional_intensity: 88,
    },
    values_motivations: {
      achievement_drive: 62,
      innovation: 82,
      tradition: 50,
      service_orientation: 58,
      freedom_need: 85,
      security_need: 60,
      perfection_drive: 85,
      recognition_need: 40,
      meaning_seeking: 98,
      material_drive: 35,
      spiritual_orientation: 90,
      intellectual_curiosity: 98,
    },
    social_relational: {
      social_energy: 28,
      trust_openness: 35,
      boundaries: 98,
      nurturing: 48,
      intimacy_comfort: 45,
      personal_space_need: 95,
      social_adaptability: 40,
      vulnerability_comfort: 30,
      loyalty: 85,
      forgiveness: 70,
    },
    cognitive_style: {
      analytical_thinking: 98,
      intuitive_thinking: 88,
      abstract_thinking: 95,
      creative_thinking: 80,
      systematic_thinking: 85,
      critical_thinking: 98,
      open_mindedness: 75,
      attention_to_detail: 92,
    },
    conflict_profile: {
      primary_style: { approach: 'avoid', intensity: 90 },
      secondary_style: { approach: 'compete', intensity: 55 },
      conflict_frequency: 35,
      conflict_avoidance: 90,
      recovery_speed: 50,
      holding_grudges: 70,
    },
    attachment_profile: {
      primary_style: 'avoidant',
      secure_score: 50,
      anxious_score: 20,
      avoidant_score: 85,
    },
    stress_response: {
      stress_threshold: 60,
      recovery_speed: 50,
    },
    compatibility_factors: {
      needs_similar_energy_level: false,
      needs_independence_respected: true,
      needs_emotional_depth: true,
      needs_stability: true,
      needs_excitement: false,
      works_well_with: [4, 5, 9, 11],
      challenges_with: [2, 3, 6],
    },
    challenges: ['Isolation', 'Skepticism', 'Emotional detachment', 'Over-analysis', 'Cynicism'],
    meta: {
      life_path_number: 7,
      archetype_name: 'THE SEEKER',
      core_motto: 'Understanding is everything',
    },
  },

  8: {
    core_identity: {
      leadership: 98,
      independence: 85,
      collaboration: 62,
      authenticity_drive: 80,
      self_confidence: 90,
      individuality: 82,
    },
    work_style: {
      initiative: 98,
      structure: 92,
      flexibility: 62,
      pace: 92,
      focus: 92,
      endurance: 95,
      practicality: 95,
      decisiveness: 95,
      risk_tolerance: 75,
      perfectionism: 82,
      multitasking: 85,
      delegation: 88,
    },
    communication_style: {
      directness: 98,
      expressiveness: 70,
      listening: 58,
      assertiveness: 98,
      verbal_processing: 65,
      communication_frequency: 70,
      depth_preference: 65,
      conflict_communication: 95,
    },
    emotional_nature: {
      emotional_depth: 62,
      sensitivity: 48,
      empathy: 60,
      emotional_expression: 50,
      emotional_control: 92,
      emotional_awareness: 70,
      emotional_volatility: 45,
      resilience: 95,
      optimism: 75,
      emotional_intensity: 70,
    },
    values_motivations: {
      achievement_drive: 98,
      innovation: 75,
      tradition: 70,
      service_orientation: 52,
      freedom_need: 72,
      security_need: 72,
      perfection_drive: 82,
      recognition_need: 85,
      meaning_seeking: 70,
      material_drive: 95,
      spiritual_orientation: 50,
      intellectual_curiosity: 75,
    },
    social_relational: {
      social_energy: 72,
      trust_openness: 48,
      boundaries: 92,
      nurturing: 38,
      intimacy_comfort: 55,
      personal_space_need: 65,
      social_adaptability: 70,
      vulnerability_comfort: 35,
      loyalty: 80,
      forgiveness: 60,
    },
    cognitive_style: {
      analytical_thinking: 92,
      intuitive_thinking: 75,
      abstract_thinking: 70,
      creative_thinking: 75,
      systematic_thinking: 90,
      critical_thinking: 88,
      open_mindedness: 60,
      attention_to_detail: 85,
    },
    conflict_profile: {
      primary_style: { approach: 'compete', intensity: 95 },
      secondary_style: { approach: 'collaborate', intensity: 70 },
      conflict_frequency: 75,
      conflict_avoidance: 20,
      recovery_speed: 70,
      holding_grudges: 80,
    },
    attachment_profile: {
      primary_style: 'mixed',
      secure_score: 65,
      anxious_score: 35,
      avoidant_score: 60,
    },
    stress_response: {
      stress_threshold: 80,
      recovery_speed: 75,
    },
    compatibility_factors: {
      needs_similar_energy_level: true,
      needs_independence_respected: true,
      needs_emotional_depth: false,
      needs_stability: false,
      needs_excitement: true,
      works_well_with: [1, 4, 22],
      challenges_with: [2, 6, 9],
    },
    challenges: ['Power struggles', 'Materialism', 'Work-life imbalance', 'Intimidation', 'Control issues'],
    meta: {
      life_path_number: 8,
      archetype_name: 'THE POWERHOUSE',
      core_motto: 'Success is my destiny',
    },
  },

  9: {
    core_identity: {
      leadership: 72,
      independence: 72,
      collaboration: 82,
      authenticity_drive: 85,
      self_confidence: 70,
      individuality: 75,
    },
    work_style: {
      initiative: 72,
      structure: 52,
      flexibility: 88,
      pace: 70,
      focus: 72,
      endurance: 75,
      practicality: 62,
      decisiveness: 60,
      risk_tolerance: 65,
      perfectionism: 72,
      multitasking: 78,
      delegation: 75,
    },
    communication_style: {
      directness: 62,
      expressiveness: 80,
      listening: 92,
      assertiveness: 62,
      verbal_processing: 75,
      communication_frequency: 75,
      depth_preference: 90,
      conflict_communication: 70,
    },
    emotional_nature: {
      emotional_depth: 98,
      sensitivity: 92,
      empathy: 98,
      emotional_expression: 82,
      emotional_control: 62,
      emotional_awareness: 95,
      emotional_volatility: 70,
      resilience: 72,
      optimism: 75,
      emotional_intensity: 90,
    },
    values_motivations: {
      achievement_drive: 72,
      innovation: 82,
      tradition: 62,
      service_orientation: 98,
      freedom_need: 72,
      security_need: 48,
      perfection_drive: 72,
      recognition_need: 50,
      meaning_seeking: 98,
      material_drive: 35,
      spiritual_orientation: 92,
      intellectual_curiosity: 85,
    },
    social_relational: {
      social_energy: 82,
      trust_openness: 88,
      boundaries: 55,
      nurturing: 92,
      intimacy_comfort: 80,
      personal_space_need: 60,
      social_adaptability: 90,
      vulnerability_comfort: 75,
      loyalty: 85,
      forgiveness: 95,
    },
    cognitive_style: {
      analytical_thinking: 75,
      intuitive_thinking: 92,
      abstract_thinking: 90,
      creative_thinking: 88,
      systematic_thinking: 60,
      critical_thinking: 80,
      open_mindedness: 98,
      attention_to_detail: 65,
    },
    conflict_profile: {
      primary_style: { approach: 'accommodate', intensity: 80 },
      secondary_style: { approach: 'collaborate', intensity: 75 },
      conflict_frequency: 45,
      conflict_avoidance: 60,
      recovery_speed: 65,
      holding_grudges: 25,
    },
    attachment_profile: {
      primary_style: 'secure',
      secure_score: 70,
      anxious_score: 55,
      avoidant_score: 30,
    },
    stress_response: {
      stress_threshold: 55,
      recovery_speed: 60,
    },
    compatibility_factors: {
      needs_similar_energy_level: false,
      needs_independence_respected: true,
      needs_emotional_depth: true,
      needs_stability: false,
      needs_excitement: false,
      works_well_with: [3, 6, 7, 11, 33],
      challenges_with: [1, 4, 8],
    },
    challenges: ['Letting go issues', 'Idealism overload', 'Emotional overwhelm', 'Self-sacrifice', 'Completion anxiety'],
    meta: {
      life_path_number: 9,
      archetype_name: 'THE HUMANITARIAN',
      core_motto: 'I serve the greater good',
    },
  },

  11: {
    core_identity: {
      leadership: 80,
      independence: 72,
      collaboration: 75,
      authenticity_drive: 92,
      self_confidence: 65,
      individuality: 88,
    },
    work_style: {
      initiative: 78,
      structure: 52,
      flexibility: 82,
      pace: 72,
      focus: 82,
      endurance: 62,
      practicality: 48,
      decisiveness: 60,
      risk_tolerance: 60,
      perfectionism: 92,
      multitasking: 65,
      delegation: 60,
    },
    communication_style: {
      directness: 62,
      expressiveness: 72,
      listening: 98,
      assertiveness: 58,
      verbal_processing: 70,
      communication_frequency: 65,
      depth_preference: 98,
      conflict_communication: 50,
    },
    emotional_nature: {
      emotional_depth: 98,
      sensitivity: 98,
      empathy: 98,
      emotional_expression: 72,
      emotional_control: 48,
      emotional_awareness: 98,
      emotional_volatility: 75,
      resilience: 60,
      optimism: 70,
      emotional_intensity: 95,
    },
    values_motivations: {
      achievement_drive: 82,
      innovation: 98,
      tradition: 38,
      service_orientation: 92,
      freedom_need: 72,
      security_need: 50,
      perfection_drive: 92,
      recognition_need: 60,
      meaning_seeking: 98,
      material_drive: 30,
      spiritual_orientation: 98,
      intellectual_curiosity: 92,
    },
    social_relational: {
      social_energy: 62,
      trust_openness: 72,
      boundaries: 62,
      nurturing: 75,
      intimacy_comfort: 75,
      personal_space_need: 70,
      social_adaptability: 75,
      vulnerability_comfort: 65,
      loyalty: 88,
      forgiveness: 88,
    },
    cognitive_style: {
      analytical_thinking: 82,
      intuitive_thinking: 98,
      abstract_thinking: 95,
      creative_thinking: 92,
      systematic_thinking: 65,
      critical_thinking: 85,
      open_mindedness: 95,
      attention_to_detail: 80,
    },
    conflict_profile: {
      primary_style: { approach: 'avoid', intensity: 85 },
      secondary_style: { approach: 'collaborate', intensity: 70 },
      conflict_frequency: 35,
      conflict_avoidance: 85,
      recovery_speed: 50,
      holding_grudges: 40,
    },
    attachment_profile: {
      primary_style: 'anxious',
      secure_score: 55,
      anxious_score: 75,
      avoidant_score: 40,
    },
    stress_response: {
      stress_threshold: 45,
      recovery_speed: 50,
    },
    compatibility_factors: {
      needs_similar_energy_level: false,
      needs_independence_respected: true,
      needs_emotional_depth: true,
      needs_stability: true,
      needs_excitement: false,
      works_well_with: [2, 6, 7, 9, 22, 33],
      challenges_with: [1, 5, 8],
    },
    challenges: ['Nervous energy', 'Idealism vs reality', 'Over-sensitivity', 'Inspiration overload', 'Self-doubt'],
    meta: {
      life_path_number: 11,
      archetype_name: 'THE ILLUMINATOR',
      core_motto: 'I channel higher wisdom',
    },
  },

  22: {
    core_identity: {
      leadership: 95,
      independence: 82,
      collaboration: 85,
      authenticity_drive: 88,
      self_confidence: 88,
      individuality: 80,
    },
    work_style: {
      initiative: 95,
      structure: 98,
      flexibility: 72,
      pace: 85,
      focus: 98,
      endurance: 92,
      practicality: 98,
      decisiveness: 92,
      risk_tolerance: 75,
      perfectionism: 98,
      multitasking: 88,
      delegation: 85,
    },
    communication_style: {
      directness: 82,
      expressiveness: 72,
      listening: 82,
      assertiveness: 88,
      verbal_processing: 70,
      communication_frequency: 75,
      depth_preference: 85,
      conflict_communication: 90,
    },
    emotional_nature: {
      emotional_depth: 82,
      sensitivity: 72,
      empathy: 82,
      emotional_expression: 62,
      emotional_control: 85,
      emotional_awareness: 85,
      emotional_volatility: 50,
      resilience: 88,
      optimism: 78,
      emotional_intensity: 75,
    },
    values_motivations: {
      achievement_drive: 98,
      innovation: 92,
      tradition: 70,
      service_orientation: 85,
      freedom_need: 72,
      security_need: 72,
      perfection_drive: 98,
      recognition_need: 75,
      meaning_seeking: 92,
      material_drive: 75,
      spiritual_orientation: 80,
      intellectual_curiosity: 88,
    },
    social_relational: {
      social_energy: 72,
      trust_openness: 62,
      boundaries: 82,
      nurturing: 70,
      intimacy_comfort: 70,
      personal_space_need: 68,
      social_adaptability: 80,
      vulnerability_comfort: 60,
      loyalty: 92,
      forgiveness: 75,
    },
    cognitive_style: {
      analytical_thinking: 95,
      intuitive_thinking: 88,
      abstract_thinking: 85,
      creative_thinking: 90,
      systematic_thinking: 98,
      critical_thinking: 90,
      open_mindedness: 75,
      attention_to_detail: 95,
    },
    conflict_profile: {
      primary_style: { approach: 'collaborate', intensity: 85 },
      secondary_style: { approach: 'compete', intensity: 75 },
      conflict_frequency: 65,
      conflict_avoidance: 25,
      recovery_speed: 70,
      holding_grudges: 65,
    },
    attachment_profile: {
      primary_style: 'secure',
      secure_score: 75,
      anxious_score: 40,
      avoidant_score: 45,
    },
    stress_response: {
      stress_threshold: 75,
      recovery_speed: 65,
    },
    compatibility_factors: {
      needs_similar_energy_level: true,
      needs_independence_respected: true,
      needs_emotional_depth: false,
      needs_stability: true,
      needs_excitement: true,
      works_well_with: [1, 4, 8, 11],
      challenges_with: [2, 3, 5],
    },
    challenges: ['Overwhelm from vision', 'Practical vs ideal', 'High pressure', 'Fear of failure', 'Intense expectations'],
    meta: {
      life_path_number: 22,
      archetype_name: 'THE MASTER BUILDER',
      core_motto: 'I manifest the impossible',
    },
  },

  33: {
    core_identity: {
      leadership: 82,
      independence: 62,
      collaboration: 92,
      authenticity_drive: 90,
      self_confidence: 72,
      individuality: 75,
    },
    work_style: {
      initiative: 78,
      structure: 72,
      flexibility: 85,
      pace: 72,
      focus: 80,
      endurance: 75,
      practicality: 70,
      decisiveness: 68,
      risk_tolerance: 60,
      perfectionism: 92,
      multitasking: 82,
      delegation: 70,
    },
    communication_style: {
      directness: 72,
      expressiveness: 85,
      listening: 98,
      assertiveness: 72,
      verbal_processing: 80,
      communication_frequency: 88,
      depth_preference: 95,
      conflict_communication: 70,
    },
    emotional_nature: {
      emotional_depth: 98,
      sensitivity: 98,
      empathy: 98,
      emotional_expression: 92,
      emotional_control: 60,
      emotional_awareness: 98,
      emotional_volatility: 70,
      resilience: 65,
      optimism: 80,
      emotional_intensity: 95,
    },
    values_motivations: {
      achievement_drive: 82,
      innovation: 85,
      tradition: 72,
      service_orientation: 98,
      freedom_need: 62,
      security_need: 62,
      perfection_drive: 92,
      recognition_need: 50,
      meaning_seeking: 98,
      material_drive: 35,
      spiritual_orientation: 95,
      intellectual_curiosity: 85,
    },
    social_relational: {
      social_energy: 82,
      trust_openness: 88,
      boundaries: 48,
      nurturing: 98,
      intimacy_comfort: 88,
      personal_space_need: 55,
      social_adaptability: 88,
      vulnerability_comfort: 80,
      loyalty: 95,
      forgiveness: 98,
    },
    cognitive_style: {
      analytical_thinking: 78,
      intuitive_thinking: 95,
      abstract_thinking: 88,
      creative_thinking: 90,
      systematic_thinking: 72,
      critical_thinking: 80,
      open_mindedness: 98,
      attention_to_detail: 85,
    },
    conflict_profile: {
      primary_style: { approach: 'accommodate', intensity: 90 },
      secondary_style: { approach: 'collaborate', intensity: 75 },
      conflict_frequency: 40,
      conflict_avoidance: 65,
      recovery_speed: 55,
      holding_grudges: 15,
    },
    attachment_profile: {
      primary_style: 'anxious',
      secure_score: 60,
      anxious_score: 80,
      avoidant_score: 20,
    },
    stress_response: {
      stress_threshold: 50,
      recovery_speed: 50,
    },
    compatibility_factors: {
      needs_similar_energy_level: false,
      needs_independence_respected: false,
      needs_emotional_depth: true,
      needs_stability: true,
      needs_excitement: false,
      works_well_with: [6, 9, 11],
      challenges_with: [1, 5, 8],
    },
    challenges: ['Martyrdom', 'Emotional burnout', 'Boundary setting', 'Over-giving', 'Self-neglect'],
    meta: {
      life_path_number: 33,
      archetype_name: 'THE MASTER TEACHER',
      core_motto: 'I uplift through love',
    },
  },
};

/**
 * HELPER FUNCTIONS
 */

export function interpretScore(score: number): string {
  if (score >= 81) return 'Very High';
  if (score >= 61) return 'High';
  if (score >= 41) return 'Moderate';
  if (score >= 21) return 'Low';
  return 'Very Low';
}

export function calculateCompatibilityScore(path1: number, path2: number): number {
  const profile1 = lifePathTraitProfiles[path1];
  const profile2 = lifePathTraitProfiles[path2];

  if (!profile1 || !profile2) return 0;

  const p1Compat = profile1.compatibility_factors;
  const p2Compat = profile2.compatibility_factors;

  let baseScore = 50;

  if (p1Compat.works_well_with.includes(path2)) baseScore += 20;
  if (p2Compat.works_well_with.includes(path1)) baseScore += 20;
  if (p1Compat.challenges_with.includes(path2)) baseScore -= 20;
  if (p2Compat.challenges_with.includes(path1)) baseScore -= 20;

  const traitDifferences = [
    Math.abs(profile1.core_identity.independence - profile2.core_identity.independence),
    Math.abs(profile1.work_style.pace - profile2.work_style.pace),
    Math.abs(profile1.emotional_nature.emotional_expression - profile2.emotional_nature.emotional_expression),
    Math.abs(profile1.social_relational.social_energy - profile2.social_relational.social_energy),
    Math.abs(profile1.values_motivations.freedom_need - profile2.values_motivations.freedom_need),
  ];

  const avgDifference = traitDifferences.reduce((a, b) => a + b, 0) / traitDifferences.length;
  const traitScore = 100 - avgDifference;

  const finalScore = (baseScore * 0.6) + (traitScore * 0.4);

  return Math.round(Math.max(0, Math.min(100, finalScore)));
}

export function getCategoryScore(
  profile: LifePathTraits,
  category: 'core_identity' | 'work_style' | 'communication_style' | 'emotional_nature' | 'values_motivations' | 'social_relational' | 'cognitive_style'
): number {
  const categoryObj = profile[category] as unknown as Record<string, number>;
  const values = Object.values(categoryObj);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}



// Re-export the same profiles for other numbers for now
// In the future, these can be customized for each specific aspect
export const expressionTraitProfiles = lifePathTraitProfiles;
export const soulUrgeTraitProfiles = lifePathTraitProfiles;
export const personalityTraitProfiles = lifePathTraitProfiles;

export function getTraitProfile(
  number: number,
  type: 'lifePath' | 'expression' | 'soulUrge' | 'personality' = 'lifePath'
): LifePathTraits | null {
  // Currently all use the same base profiles, but this structure allows for future differentiation
  const profiles = {
    lifePath: lifePathTraitProfiles,
    expression: expressionTraitProfiles,
    soulUrge: soulUrgeTraitProfiles,
    personality: personalityTraitProfiles
  };

  return profiles[type][number] || null;
}