import { reduceToSingleDigit } from './calculator';

export interface NumberMeaning {
  title: string;
  description: string;
  traits: string[];
  challenges: string[];
}

export const lifePathMeanings: { [key: number]: NumberMeaning } = {
  1: {
    title: "The Individualist",
    description: "Your path is one of discovering your own strength. You are here to learn independence, stand on your own two feet, and lead by example.",
    traits: ["Self-reliance", "Ambition", "Willpower", "Originality", "Courage"],
    challenges: ["Overcoming self-doubt", "Learning to lead without dominating", "Loneliness"]
  },
  2: {
    title: "The Mediator",
    description: "Your path is learning the fine art of cooperation. You are here to understand the power of partnership, patience, and detail.",
    traits: ["Diplomacy", "Patience", "Sensitivity", "Teamwork", "Intuition"],
    challenges: ["Learning to say no", "Avoiding over-sensitivity", "Finding balance"]
  },
  3: {
    title: "The Artist",
    description: "Your path is about finding your voice. You are here to learn the joy of authentic self-expression and to uplift others with your creativity.",
    traits: ["Creativity", "Optimism", "Verbal skill", "Joy", "Imagination"],
    challenges: ["Overcoming superficiality", "Dealing with criticism", "Focusing energy"]
  },
  4: {
    title: "The Architect",
    description: "Your path is about building a secure reality. You are here to learn the value of hard work, discipline, and creating things that last.",
    traits: ["Discipline", "Focus", "Dependability", "Structure", "Loyalty"],
    challenges: ["Overcoming rigidity", "Accepting change", "Avoiding workaholism"]
  },
  5: {
    title: "The Traveler",
    description: "Your path is one of embracing change. You are here to learn the true meaning of freedom and to experience the variety of the physical world.",
    traits: ["Adaptability", "Curiosity", "Resilience", "Sensuality", "Fearlessness"],
    challenges: ["Learning commitment", "Focusing scattered energy", "Avoiding excess"]
  },
  6: {
    title: "The Nurturer",
    description: "Your path is learning the balance of responsibility. You are here to care for family and community without losing yourself in the process.",
    traits: ["Service", "Domesticity", "Grace", "Healing", "Protection"],
    challenges: ["Avoiding martyrdom", "Letting go of perfectionism", "Meddling"]
  },
  7: {
    title: "The Sage",
    description: "Your path is the search for truth. You are here to analyze, study, and uncover the deeper spiritual mysteries of life through introspection.",
    traits: ["Analysis", "Intuition", "Logic", "Spirituality", "Solitude"],
    challenges: ["Overcoming isolation", "Trusting others", "Sharing feelings"]
  },
  8: {
    title: "The Powerhouse",
    description: "Your path is mastering the material world. You are here to learn how to use power, money, and authority for the greater good.",
    traits: ["Authority", "Management", "Financial skill", "Determination", "Vision"],
    challenges: ["Overcoming materialism", "Balancing ego", "Using power wisely"]
  },
  9: {
    title: "The Humanitarian",
    description: "Your path is one of letting go and universal love. You are here to serve humanity and learn the lesson of selfless giving.",
    traits: ["Universal view", "Compassion", "Generosity", "Tolerance", "Wisdom"],
    challenges: ["Learning detachment", "Overcoming emotional drama", "Self-sacrifice"]
  },
  11: {
    title: "The Visionary (Master)",
    description: "Your path is to be a spiritual messenger. You are here to walk a fine line between the material and spiritual worlds, bringing illumination to others.",
    traits: ["High intuition", "Spiritual insight", "Inspiration", "Charisma", "Idealism"],
    challenges: ["Grounding nervous energy", "Trusting intuition", "Practical application"]
  },
  22: {
    title: "The Master Builder (Master)",
    description: "Your path is to manifest high ideals. You are here to learn how to turn your biggest dreams into practical reality for the benefit of all.",
    traits: ["Practical genius", "Large-scale vision", "Manifestation", "Leadership", "Impact"],
    challenges: ["Handling pressure", "Overcoming fear of failure", "Staying grounded"]
  },
  33: {
    title: "The Master Healer (Master)",
    description: "Your path is the ultimate service of love. You are here to master the lesson of unconditional love and to heal the hearts of others.",
    traits: ["Devotion", "Spiritual counseling", "Altruism", "Nurturing", "Cosmic love"],
    challenges: ["Setting boundaries", "Emotional overwhelm", "Burden of the world"]
  },
  44: {
    title: "The Master Catalyst (Master)",
    description: "Your path is to restructure the foundations of life. You are here to bring spiritual order to material chaos.",
    traits: ["Mental power", "Discipline", "Control", "Strategic vision", "Reform"],
    challenges: ["Managing intensity", "Stress", "Destructive tendencies"]
  }
};

export const expressionMeanings: { [key: number]: NumberMeaning } = {
  1: {
    title: "The Pioneer",
    description: "Your destiny is to lead and innovate. You possess a natural ability to take initiative, stand on your own, and blaze new trails where others haven't gone before.",
    traits: ["Initiative", "Independence", "Innovation", "Courage", "Determination"],
    challenges: ["Domineering behavior", "Impatience with details", "Going it alone too often"]
  },
  2: {
    title: "The Harmonizer",
    description: "Your talent lies in diplomacy and details. You are destined to work with others, mediating conflicts and bringing harmony to disparate groups.",
    traits: ["Diplomacy", "Intuition", "Detail-oriented", "Supportive", "Mediator"],
    challenges: ["Oversensitivity", "Shyness", "Getting lost in others' needs"]
  },
  3: {
    title: "The Communicator",
    description: "You are gifted with the power of expression. Your destiny involves inspiring others through words, art, or performance, bringing joy and optimism.",
    traits: ["Artistic expression", "Wit", "Optimism", "Charisma", "Social ease"],
    challenges: ["Scattered focus", "Exaggeration", "Mood swings"]
  },
  4: {
    title: "The Builder",
    description: "Your strength is in system and order. You are here to build lasting foundations, organize chaos, and manage complex tasks with practical efficiency.",
    traits: ["Organization", "Reliability", "Management", "Discipline", "Practicality"],
    challenges: ["Rigidity", "Stubbornness", "Lack of imagination"]
  },
  5: {
    title: "The Catalyst",
    description: "You are a natural agent of change. Your destiny is to show others the value of freedom and adaptability, thriving in dynamic and unpredictable environments.",
    traits: ["Versatility", "Adaptability", "Promotion", "Salesmanship", "Curiosity"],
    challenges: ["Restlessness", "Impulsiveness", "Inconsistency"]
  },
  6: {
    title: "The Caretaker",
    description: "You possess a gift for nurturing and protection. Your destiny is to serve family and community, balancing responsibility with love.",
    traits: ["Nurturing", "Counseling", "Responsibility", "Harmony", "Justice"],
    challenges: ["Interference", "Perfectionism", "Self-righteousness"]
  },
  7: {
    title: "The Investigator",
    description: "Your talent lies in analysis and spiritual seeking. You are here to uncover hidden truths, specialize in a field, and share deep wisdom.",
    traits: ["Analysis", "Research", "Intuition", "Specialization", "Wisdom"],
    challenges: ["Skepticism", "Isolation", "Emotional distance"]
  },
  8: {
    title: "The Executive",
    description: "You are gifted with business acumen and authority. Your destiny involves mastering the material world, leading organizations, and achieving large-scale success.",
    traits: ["Management", "Efficiency", "Authority", "Financial skill", "Judgment"],
    challenges: ["Materialism", "Workaholism", "Intolerance"]
  },
  9: {
    title: "The Philanthropist",
    description: "Your talents are creative and universal. You are destined to serve humanity, using your broad understanding to inspire and hea on a large scale.",
    traits: ["Compassion", "Artistic genius", "Generosity", "Global view", "Tolerance"],
    challenges: ["Impracticality", "Moodiness", "Difficulty letting go"]
  },
  11: {
    title: "The Illuminator",
    description: "You possess highly charged intuition and vision. Your destiny is to be a bridge between the spiritual and material, inspiring others with your insights.",
    traits: ["Visionary", "Intuitive", "Inspiring", "Spiritual leader", "Innovative"],
    challenges: ["Nervous tension", "Impracticality", "Lack of grounding"]
  },
  22: {
    title: "The Master Architect",
    description: "You have the rare ability to turn high ideals into concrete reality. Your destiny is to build large-scale ventures that benefit humanity.",
    traits: ["Master builder", "Practical genius", "Global influence", "Organization", "Power"],
    challenges: ["Overwhelm", "Self-pressure", "Rigidity"]
  },
  33: {
    title: "The Master Teacher",
    description: "Your talent is unconditional love and service. You are here to heal and uplift others through your compassionate guidance.",
    traits: ["Compassionate service", "Healing", "Nurturing", "Cosmic parent", "Teacher"],
    challenges: ["Emotional burden", "Martyrdom", "Over-responsibility"]
  },
  44: {
    title: "The Master Alchemist",
    description: "You possess the capacity to transform systems and people. Your destiny is to bring spiritual order to material chaos efficiently.",
    traits: ["Transformation", "System building", "Mental discipline", "Control", "Reform"],
    challenges: ["Extreme stress", "Power struggles", "Isolation"]
  }
};

export const soulUrgeMeanings: { [key: number]: NumberMeaning } = {
  1: {
    title: "Desire for Primacy",
    description: "At your core, you long to be the best and to stand alone. You crave the freedom to follow your own convictions without restriction.",
    traits: ["Inner will", "Need for independence", "Drive to win", "Individualism"],
    challenges: ["Fear of being overlooked", "Ego-centric desires", "Loneliness"]
  },
  2: {
    title: "Desire for Intimacy",
    description: "Your heart yearns for love, understanding, and companionship. You need to feel connected and appreciated by those around you.",
    traits: ["Need for love", "Desire for peace", "Emotional connection", "Sensitivity"],
    challenges: ["Fear of rejection", "Over-dependence", "Easily hurt"]
  },
  3: {
    title: "Desire for Self-Expression",
    description: "Your soul wants to be heard and seen. You have a deep inner need to create, perform, and bring smiles to others.",
    traits: ["Artistic impulse", "Need for attention", "Social joy", "Playfulness"],
    challenges: ["Fear of being ignored", "Scattered emotions", "Superficiality"]
  },
  4: {
    title: "Desire for Order",
    description: "You crave stability and predictability. Your inner peace comes from knowing that everything is organized and your future is secure.",
    traits: ["Need for security", "Love of systems", "Practical nature", "Loyalty"],
    challenges: ["Fear of chaos", "Resistance to change", "Rigidity"]
  },
  5: {
    title: "Desire for Adventure",
    description: "Your soul is restless and craves freedom above all else. You need variety, travel, and new experiences to feel alive.",
    traits: ["Wanderlust", "Need for freedom", "Curiosity", "Sensual appetite"],
    challenges: ["Fear of boredom", "Commitment issues", "Impatience"]
  },
  6: {
    title: "Desire to Nurture",
    description: "Your heart's desire is to care for others and create a happy home. You need to feel needed and to be the anchor for your family.",
    traits: ["Protective instinct", "Need to serve", "Domestic love", "Harmony seeking"],
    challenges: ["Fear of discord", "Over-involvement", "Self-neglect"]
  },
  7: {
    title: "Desire for Truth",
    description: "You crave solitude and understanding. Your soul is satisfied only when you are learning, analyzing, or connecting with the spiritual.",
    traits: ["Thirst for knowledge", "Need for privacy", "Spiritual hunger", "Introspection"],
    challenges: ["Fear of exposure", "Loneliness", "Detachment"]
  },
  8: {
    title: "Desire for Power",
    description: "You are driven by a need to achieve and control your destiny. Financial freedom and authority are deep emotional needs for you.",
    traits: ["Ambition", "Need for status", "Drive for success", "Material goals"],
    challenges: ["Fear of poverty", "Control freaks", "Neglecting spirit"]
  },
  9: {
    title: "Desire for Universal Love",
    description: "Your soul longs to heal the world. You are motivated by compassion and a deep wish to make a positive impact on humanity.",
    traits: ["Idealism", "Global concern", "Selflessness", "Romantic heart"],
    challenges: ["Fear of cruelty", "Disillusionment", "Emotional exhaustion"]
  },
  11: {
    title: "Desire for Illumination",
    description: "You crave spiritual higher consciousness. Your soul wants to bring light to the world and desires deep spiritual connection.",
    traits: ["Spiritual longing", "Intuitive flow", "Need to inspire", "Idealism"],
    challenges: ["Nervous anxiety", "Feeling different", "Unrealistic dreams"]
  },
  22: {
    title: "Desire for Great Achievement",
    description: "Your heart is set on building something monumental. You aren't satisfied with small goals; you crave global impact.",
    traits: ["Grand ambition", "Need to build", "Practical vision", "Legacy focus"],
    challenges: ["Fear of failure", "Overwhelming pressure", "Work addiction"]
  },
  33: {
    title: "Desire to Heal",
    description: "Your soul wants to be a cosmic parent to all. You have an overwhelming need to love, protect, and guide humanity.",
    traits: ["Compassionate love", "Need to heal", "Self-sacrifice", "Service"],
    challenges: ["Burden of others", "Neglecting self", "Martyrdom"]
  },
  44: {
    title: "Desire for Transformation",
    description: "Your deepest urge is to restructure the world for the better. You crave to be the force that turns chaos into order on a spiritual level.",
    traits: ["Transformative drive", "Need for control", "Systemic vision", "Healing power"],
    challenges: ["Intense pressure", "Inability to relax", "Isolation"]
  }
};

export const personalityMeanings: { [key: number]: NumberMeaning } = {
  1: {
    title: "The Stand-Out",
    description: "You project an image of independence and capability. People are instinctively drawn to your confident demeanor, often seeing you as a natural leader before you even speak.",
    traits: ["Confident posture", "Unique style", "Direct eye contact", "Assertive vibe"],
    challenges: ["Appearing arrogant", "Intimidating others", "Seeming unapproachable"]
  },
  2: {
    title: "The Peacemaker",
    description: "You appear gentle, approachable, and unassuming. Others feel instantly comfortable around you, sensing your listening ear and willingness to cooperate.",
    traits: ["Modest appearance", "Soft-spoken", "Attentive listener", "Graceful"],
    challenges: ["Looking timid", "Fading into the background", "Appearing indecisive"]
  },
  3: {
    title: "The Life of the Party",
    description: "You project a fun, artistic, and engaging persona. People expect you to be the source of entertainment and joy, often seeing you as brighter and happier than you may feel inside.",
    traits: ["Smiling", "Fashionable/Colorful", "Talkative", "Charming"],
    challenges: ["Dressing for attention", "Appearing superficial", "Talking over others"]
  },
  4: {
    title: "The Rock",
    description: "You present an image of solidity and reliability. Others see you as the person to count on, projecting a serious, no-nonsense attitude that commands respect.",
    traits: ["Neat appearance", "Serious demeanor", "Practical clothing", "Grounded vibe"],
    challenges: ["Looking rigid", "Appearing boring", "Seeming predictable"]
  },
  5: {
    title: "The Spark",
    description: "You have a magnetic, energetic presence that screams variety. People see you as interesting, trendy, and full of life, often anticipating that you'll do something unexpected.",
    traits: ["Trendy style", "Quick movements", "Sparkling eyes", "Witty banter"],
    challenges: ["Appearing restless", "Looking unreliable", "Nervous energy"]
  },
  6: {
    title: "The Guardian",
    description: "You project warmth, protection, and responsibility. Others see you as a mother or father figure, someone they can turn to for advice and comfort.",
    traits: ["Warm smile", "Comfortable style", "Protective vibe", "Inviting"],
    challenges: ["Looking interfered", "Appearing self-righteous", "Dressing dowdy"]
  },
  7: {
    title: "The Enigma",
    description: "You have a mysterious, intellectual air. People are intrigued by your silence and fierce observation, often feeling you know more than you're saying.",
    traits: ["Observant eyes", "Distinctive style", "Quiet demeanor", "Elegant"],
    challenges: ["Appearing aloof", "Looking skeptical", "Seeming unapproachable"]
  },
  8: {
    title: "The Boss",
    description: "You project strength, authority, and success. People naturally defer to you, sensing your power and competence in the material world.",
    traits: ["Expensive taste", "Strong posture", "Authoritative voice", "Polished"],
    challenges: ["Looking flashy", "Appearing domineering", "Intimidating style"]
  },
  9: {
    title: "The Noble",
    description: "You possess an aristocratic, generous presence. Others see you as broad-minded and influential, someone with a 'larger than life' quality.",
    traits: ["Charismatic", "Generous spirit", "Artistic flair", "Warm presence"],
    challenges: ["Looking aloof", "Appearing dreamy", "Seeming disconnected"]
  },
  11: {
    title: "The Lightning Rod",
    description: "You have an electric, inspiring presence. People sense a different vibration from you, often feeling uplifted or charged just by being in your vicinity.",
    traits: ["Intense gaze", "Unconventional style", "Nervous energy", "Charisma"],
    challenges: ["Appearing high-strung", "Looking spaced out", "Intimidating intensity"]
  },
  22: {
    title: "The Master",
    description: "You project an image of immense competence and solidity. People feel safe putting big responsibilities in your hands, sensing you can handle anything.",
    traits: ["Solid presence", "Competent vibe", "Steady gaze", "Practical power"],
    challenges: ["Looking heavy", "Appearing rigid", "Seeming overly serious"]
  },
  33: {
    title: "The Nurturer",
    description: "You appear as a loving, healing force. People are drawn to your warmth and often feel you are there to take care of them instinctively.",
    traits: ["Glowing presence", "Kindly eyes", "Soft authority", "Magnetic"],
    challenges: ["Appearing smothered", "looking like a martyr", "Self-neglect"]
  },
  44: {
    title: "The Transformer",
    description: "You project a powerful, grounded intensity that suggests deep change. Others see you as a stable force capable of handling the most difficult crises.",
    traits: ["Intense presence", "Grounded power", "Healing vibe", "Authority"],
    challenges: ["Looking intimidating", "Appearing unapproachable", "Heavy energy"]
  }
};

// UPDATED: Function with default parameter for backwards compatibility
export function getNumberMeaning(
  number: number,
  type: 'lifePath' | 'expression' | 'soulUrge' | 'personality' = 'lifePath'
): NumberMeaning | null {
  const reduced = reduceToSingleDigit(number);
  const meanings = {
    lifePath: lifePathMeanings,
    expression: expressionMeanings,
    soulUrge: soulUrgeMeanings,
    personality: personalityMeanings
  };

  return meanings[type][reduced] || null;
}

// NEW: Simple helper functions for each type
export function getLifePathMeaning(number: number): NumberMeaning | null {
  return lifePathMeanings[number] || null;
}

export function getExpressionMeaning(number: number): NumberMeaning | null {
  return expressionMeanings[number] || null;
}

export function getSoulUrgeMeaning(number: number): NumberMeaning | null {
  return soulUrgeMeanings[number] || null;
}

export function getPersonalityMeaning(number: number): NumberMeaning | null {
  return personalityMeanings[number] || null;
}

export const birthdayMeaningsExplore: { [key: number]: NumberMeaning } = {
  1: {
    title: "The Self-Starter",
    description: "You're independent and creative, bringing fresh ideas to the table.",
    traits: ["Leader", "Creative", "Independent", "Ambitious"],
    challenges: ["Stubbornness", "Impatience"]
  },
  2: {
    title: "The Peacemaker",
    description: "You have a gift for diplomacy and making others feel heard.",
    traits: ["Diplomatic", "Sensitive", "Warm", "Intuitive"],
    challenges: ["Oversensitivity", "Dependency"]
  },
  3: {
    title: "The Artist",
    description: "You are expressive and sociable, born to entertain and inspire.",
    traits: ["Creative", "Social", "Optimistic", "Expressive"],
    challenges: ["Scattered focus", "Exaggeration"]
  },
  4: {
    title: "The Worker",
    description: "You are disciplined and practical, building solid foundations.",
    traits: ["Practical", "Hardworking", "Reliable", "Honest"],
    challenges: ["Rigidity", "Stubbornness"]
  },
  5: {
    title: "The Adventurer",
    description: "You love freedom and change, adaptable to any situation.",
    traits: ["Versatile", "Adventurous", "Charismatic", "Curious"],
    challenges: ["Restlessness", "Impulsiveness"]
  },
  6: {
    title: "The Nurturer",
    description: "You are responsible and caring, focusing on family and community.",
    traits: ["Loving", "Responsible", "Protective", "Balanced"],
    challenges: ["Meddling", "Self-sacrifice"]
  },
  7: {
    title: "The Analyst",
    description: "You are a thinker and a seeker of deeper truths.",
    traits: ["Analytical", "Introspective", "Intellectual", "Spiritual"],
    challenges: ["Isolation", "Skepticism"]
  },
  8: {
    title: "The Executive",
    description: "You have a knack for business and material success.",
    traits: ["Ambitious", "Efficient", "Organized", "Strong"],
    challenges: ["Materialism", "Workaholism"]
  },
  9: {
    title: "The Humanitarian",
    description: "You are broad-minded and compassionate, serving the greater good.",
    traits: ["Compassionate", "Generous", "Artist", "Idealistic"],
    challenges: ["Moodiness", "Detachmnent"]
  },
  10: {
    title: "The Pioneer",
    description: "You have immense energy and the drive to succeed independently.",
    traits: ["Energetic", "Independent", "Determined", "Creative"],
    challenges: ["Dominance", "Impatience"]
  },
  11: {
    title: "The Visionary",
    description: "You are intuitive and inspiring, often seeing what others miss.",
    traits: ["Intuitive", "Idealistic", "Inspiring", "Sensitive"],
    challenges: ["Nervous tension", "High expectations"]
  },
  12: {
    title: "The Creator",
    description: "You combine artistic flair with logical thinking.",
    traits: ["Expressive", "Imaginative", "Communicative", "Joyful"],
    challenges: ["Sensitivity", "Scattered"]
  },
  13: {
    title: "The Builder",
    description: "You are hard-working and tackle challenges with practicality.",
    traits: ["Disciplined", "Practical", "Honest", "Grounding"],
    challenges: ["Rigidity", "Frustration"]
  },
  14: {
    title: "The Traveler",
    description: "You need excitement and change, learning adaptability through experience.",
    traits: ["Versatile", "Adaptable", "Charismatic", "Witty"],
    challenges: ["Impulsiveness", "Restlessness"]
  },
  15: {
    title: "The Caregiver",
    description: "You are nurturing and artistic, devoted to home and family.",
    traits: ["Loving", "Artistic", "Generous", "Supportive"],
    challenges: ["Sensitivity", "Interference"]
  },
  16: {
    title: "The Philosopher",
    description: "You look beneath the surface to find the core truth.",
    traits: ["Analytical", "Introspective", "Spiritual", "Intuitive"],
    challenges: ["Isolation", "Aloofness"]
  },
  17: {
    title: "The Manager",
    description: "You have strong business sense and the ability to handle large projects.",
    traits: ["Ambitious", "Efficient", "Organized", "Leader"],
    challenges: ["Critical", "Materialistic"]
  },
  18: {
    title: "The Leader",
    description: "You are meant to lead and serve for a broad cause.",
    traits: ["Capable", "Humanitarian", "Determined", "Wise"],
    challenges: ["Tolerance", "Balance"]
  },
  19: {
    title: "The Individualist",
    description: "You are determined to stand on your own two feet.",
    traits: ["Independent", "Original", "Courageous", "Pioneering"],
    challenges: ["Obstinacy", "Isolation"]
  },
  20: {
    title: "The Partner",
    description: "You thrive on cooperation and building relationships.",
    traits: ["Gentle", "Intuitive", "Supportive", "Diplomatic"],
    challenges: ["Oversensitivity", "Dependency"]
  },
  21: {
    title: "The Socialite",
    description: "You are charming and creative, successful in dealing with people.",
    traits: ["Creative", "Social", "Optimistic", "Engaging"],
    challenges: ["Nervousness", "Scattered"]
  },
  22: {
    title: "The Master Builder",
    description: "You have the vision and practical skills to manifest big dreams.",
    traits: ["Visionary", "Practical", "Intuitive", "Powerful"],
    challenges: ["Nervous tension", "Overwhelm"]
  },
  23: {
    title: "The Networker",
    description: "You love new experiences and connecting with diverse people.",
    traits: ["Versatile", "Intelligent", "Communicative", "Free-spirited"],
    challenges: ["Restlessness", "Inconsistency"]
  },
  24: {
    title: "The Guardian",
    description: "You are energetic and responsible, often the anchor of your family.",
    traits: ["Responsible", "Loving", "Loyal", "Practical"],
    challenges: ["Stubbornness", "Worry"]
  },
  25: {
    title: "The Teacher",
    description: "You have a brilliant mind and interest in scientific or spiritual subjects.",
    traits: ["Analytical", "Intuitive", "Perceptive", "Private"],
    challenges: ["Isolation", "Secretiveness"]
  },
  26: {
    title: "The Strategist",
    description: "You are ambitious and pragmatic, good at getting things done.",
    traits: ["Ambitious", "Direct", "Organized", "Efficient"],
    challenges: ["Workaholism", "Aggression"]
  },
  27: {
    title: "The Counselor",
    description: "You are a natural leader with a compassionate overview.",
    traits: ["Wise", "Compassionate", "Analytical", "Broad-minded"],
    challenges: ["Sensitivity", "Detachment"]
  },
  28: {
    title: "The Trailblazer",
    description: "You are independent and ambitious, with strong leadership skills.",
    traits: ["Leadership", "Willpower", "Original", "Bold"],
    challenges: ["Dominance", "Impatience"]
  },
  29: {
    title: "The Intuitive",
    description: "You have powerful spiritual insights and creative potential.",
    traits: ["Intuitive", "Visionary", "Inspiring", "Mystical"],
    challenges: ["Mood swings", "Nervous tension"]
  },
  30: {
    title: "The Performer",
    description: "You are imaginative and love to express yourself artistically.",
    traits: ["Creative", "Social", "Charismatic", "Friendly"],
    challenges: ["Scattered focus", "Superficiality"]
  },
  31: {
    title: "The Planner",
    description: "You are grounded and practical, with a love for structure.",
    traits: ["Organized", "Practical", "Reliable", "Hardworking"],
    challenges: ["Rigidity", "Overworking"]
  }
};

export const birthdayMeaningsReading: { [key: number]: NumberMeaning } = {
  1: {
    title: "Determined Leader",
    description: "Born on the 1st, you possess strong leadership qualities and a drive for independence. You prefer to be in charge and innovate rather than follow.",
    traits: ["Leadership", "Independence", "Originality", "Willpower", "Innovation"],
    challenges: ["Domineering behavior", "Impatience", "Stubbornness"]
  },
  2: {
    title: "Sensitive Diplomat",
    description: "Born on the 2nd, you are a natural peacemaker. You thrive in partnerships and have a gift for understanding others' emotions.",
    traits: ["Diplomacy", "Sensitivity", "Intuition", "Cooperation", "Grace"],
    challenges: ["Oversensitivity", "Shyness", "Dependency"]
  },
  3: {
    title: "Expressive Artist",
    description: "Born on the 3rd, you have a zest for life and a talent for communication. Your creativity shines in everything you do.",
    traits: ["Creativity", "Optimism", "Communication", "Social skill", "Joy"],
    challenges: ["Focus issues", "Exaggeration", "Emotional highs/lows"]
  },
  4: {
    title: "Practical Builder",
    description: "Born on the 4th, you value order and stability. You are the rock for others, hardworking and trustworthy.",
    traits: ["Discipline", "Reliability", "Organization", "Loyalty", "Practicality"],
    challenges: ["Rigidity", "Unwillingness to change", "Seriousness"]
  },
  5: {
    title: "Free Spirit",
    description: "Born on the 5th, you crave variety and freedom. You are adaptable and love exploring the world and meeting new people.",
    traits: ["Versatility", "Adaptability", "Curiosity", "Social magnetism", "Adventure"],
    challenges: ["Restlessness", "Impulsiveness", "Inconsistency"]
  },
  6: {
    title: "Responsible Caregiver",
    description: "Born on the 6th, family and community are your priorities. You have a nurturing spirit and seek to create harmony.",
    traits: ["Nurturing", "Responsibility", "Compassion", "Justice", "Domesticity"],
    challenges: ["Self-righteousness", "Meddling", "Worry"]
  },
  7: {
    title: "Analytical Seeker",
    description: "Born on the 7th, you have a sharp mind and a thirst for knowledge. You prefer depth over surface-level interactions.",
    traits: ["Analysis", "Introspection", "Wisdom", "Perfectionism", "Research"],
    challenges: ["Skepticism", "Social withdrawal", "Overthinking"]
  },
  8: {
    title: "Ambitious Achiever",
    description: "Born on the 8th, you have a talent for business and handling money. You are driven to succeed and lead.",
    traits: ["Ambition", "Efficiency", "Management", "Judgment", "Power"],
    challenges: ["Materialism", "Dominance", "Work-life balance"]
  },
  9: {
    title: "Compassionate Humanist",
    description: "Born on the 9th, you have a broad view of the world. You are compassionate and want to make a difference.",
    traits: ["Compassion", "Generosity", "Idealism", "Tolerance", "Broad perspective"],
    challenges: ["Emotional detachment", "Moodiness", "Impracticality"]
  },
  10: {
    title: "Independent High-Flyer",
    description: "Born on the 10th, you start cycles with energy and determination. You are capable of great things when you trust yourself.",
    traits: ["Independence", "Energy", "Leadership", "Certainty", "Innovation"],
    challenges: ["Arrogance", "Impatience", "Loneliness"]
  },
  11: {
    title: "Intuitive Illuminator",
    description: "Born on the 11th, you are highly intuitive and sensitive. You can inspire others with your vision and insight.",
    traits: ["Intuition", "Inspiration", "Idealism", "Sensitivity", "Creativity"],
    challenges: ["Nervous energy", "Self-doubt", "Impractical expectations"]
  },
  12: {
    title: "Creative Expresser",
    description: "Born on the 12th, you combine the creativity of the 3 with the leadership of the 1 and cooperation of the 2.",
    traits: ["Artistic", "Communicative", "Social", "Optimistic", "Enthusiastic"],
    challenges: ["Scattered energy", "Over-emotionalism", "Superficiality"]
  },
  13: {
    title: "Hardworking Transformer",
    description: "Born on the 13th, you are here to build on solid ground. You may face obstacles but have the strength to overcome them.",
    traits: ["Determination", "Practicality", "Organization", "Truthfulness", "Problem-solving"],
    challenges: ["Rigidity", "Resentment", "Control issues"]
  },
  14: {
    title: "Versatile Free-Spirit",
    description: "Born on the 14th, you live life to the fullest. You learn through change and must manage your freedom wisely.",
    traits: ["Adaptability", "Communication", "Wit", "Resourcefulness", "Enthusiasm"],
    challenges: ["Impulsiveness", "Restlessness", "Overindulgence"]
  },
  15: {
    title: "Nurturing Artist",
    description: "Born on the 15th, you are attached to home and family but also have a gift for the arts.",
    traits: ["Nurturing", "Artistic ability", "Generosity", "Teaching", "Support"],
    challenges: ["Possessiveness", "Stubbornness", "Meddling"]
  },
  16: {
    title: "Introspective Philosopher",
    description: "Born on the 16th, you have a mind that penetrates the surface. You seek spiritual truth, often through solitude.",
    traits: ["Analysis", "Wisdom", "Intuition", "Research", "Independence"],
    challenges: ["Isolation", "Aloofness", "Difficulty connecting"]
  },
  17: {
    title: "Executive Planner",
    description: "Born on the 17th, you have a strong business head tailored with good judgment. You can manage big projects efficiently.",
    traits: ["Management", "Efficiency", "Ambition", "Foresight", "Strength"],
    challenges: ["Status-seeking", "Critical nature", "Materialism"]
  },
  18: {
    title: "Humanitarian Leader",
    description: "Born on the 18th, you are capable of leading for the benefit of many. You have a broad and varying life experience.",
    traits: ["Leadership", "Service", "Tolerance", "Efficiency", "Global awareness"],
    challenges: ["Emotional balance", "Tolerance", "Letting go"]
  },
  19: {
    title: "Independent Pioneer",
    description: "Born on the 19th, you are determined to struggle for your independence. You learn from experience and lead by example.",
    traits: ["Willpower", "Independence", "Creativity", "Courage", "Progress"],
    challenges: ["Stubbornness", "Isolation", "Ego battles"]
  },
  20: {
    title: "Sensitive Partner",
    description: "Born on the 20th, you are highly sensitive and cooperative. You work best in a supportive environment.",
    traits: ["Tact", "Support", "Intuition", "Diplomacy", "Harmony"],
    challenges: ["Oversensitivity", "Timidity", "Indecision"]
  },
  21: {
    title: "Charming Creative",
    description: "Born on the 21st, you have a magnetic personality. You are creative and socially gifted, often the life of the party.",
    traits: ["Charisma", "Creativity", "Inspiration", "Communication", "Optimism"],
    challenges: ["Scattered focus", "Nervousness", "Dependence on approval"]
  },
  22: {
    title: "Master Manifestor",
    description: "Born on the 22nd, you have the potential to build something enormous. You combine vision with practical execution.",
    traits: ["Visionary", "Practicality", "Leadership", "Determination", "Construction"],
    challenges: ["Nervous tension", "Overdoing it", "Rigidity"]
  },
  23: {
    title: "Adaptable Communicator",
    description: "Born on the 23rd, you love life and its changes. You are a quick thinker who adapts easily to new people and places.",
    traits: ["Versatility", "Quick wit", "Freedom loving", "Adventure", "Charm"],
    challenges: ["Restlessness", "Avoidance of duty", "Impatience"]
  },
  24: {
    title: "Family Guardian",
    description: "Born on the 24th, you are responsible and devoted. You work hard to create security for your loved ones.",
    traits: ["Responsibility", "Nurturing", "Harmony", "Loyalty", "Practicality"],
    challenges: ["Stubbornness", "Argumentative", "Worry"]
  },
  25: {
    title: "Analytical Guide",
    description: "Born on the 25th, you have a good mind for investigation. You interest lies in the unseen or scientific aspects of life.",
    traits: ["Analysis", "Intuition", "Perfectionism", "Logic", "Depth"],
    challenges: ["Criticism", "Secretiveness", "Over-analysis"]
  },
  26: {
    title: "Practical Diplomat",
    description: "Born on the 26th, you are ambitious and capable. You can work well with others to achieve tangible results.",
    traits: ["Ambition", "Diplomacy", "Efficiency", "Organization", "Family pride"],
    challenges: ["Exacting nature", "Showing off", "Materialism"]
  },
  27: {
    title: "Compassionate Intellectual",
    description: "Born on the 27th, you combine a sharp mind with a humanitarian outlook. You care about the world and justice.",
    traits: ["Broad-mindedness", "Analysis", "Humanitarianism", "Tolerance", "Insight"],
    challenges: ["Distance", "Nervous tension", "Unpredictability"]
  },
  28: {
    title: "Ambitious Leader",
    description: "Born on the 28th, you are a natural leader with a drive for success. You value your independence and achievement.",
    traits: ["Leadership", "Determination", "Willpower", "Originality", "Action"],
    challenges: ["Aggression", "Loss of sensitivity", "Pride"]
  },
  29: {
    title: "Spiritual Visionary",
    description: "Born on the 29th, you are highly intuitive and spiritual. You inspire others but must maintain your emotional balance.",
    traits: ["Intuition", "Idealism", "Spirituality", "Vision", "Inspiration"],
    challenges: ["Emotional extremes", "Nervousness", "Dreaminess"]
  },
  30: {
    title: "Creative Socialite",
    description: "Born on the 30th, you are artistic and verbal. You need to express yourself to feel fulfilled.",
    traits: ["Creativity", "Expression", "Social ease", "Imagination", "Friendliness"],
    challenges: ["Scattered energy", "Impatience", "Superficiality"]
  },
  31: {
    title: "Organized Builder",
    description: "Born on the 31st, you are a practical worker with creative ideas. You build methodically toward your goals.",
    traits: ["Organization", "Reliability", "Originality", "Hard work", "Stability"],
    challenges: ["Rigidity", "Over-seriousness", "Frustration"]
  }
};

export function getBirthdayNumberMeaning(
  day: number,
  type: 'explore' | 'reading' = 'explore'
): NumberMeaning {
  const reduced = reduceToSingleDigit(day);
  // Always use reading meanings for consistency as requested
  return birthdayMeaningsReading[reduced] || {
    title: "Unique Individual",
    description: "You possess a unique combination of traits.",
    traits: ["Unique"],
    challenges: []
  };
}

export const maturityMeaningsExplore: { [key: number]: NumberMeaning } = {
  1: {
    title: "The Independent Leader",
    description: "Your ultimate goal is to stand on your own feet and lead others.",
    traits: ["Independent", "Pioneering", "Courageous", "Focused"],
    challenges: ["Isolation", "Ego"]
  },
  2: {
    title: "The Peacemaker",
    description: "You will find fulfillment in cooperation and diplomacy.",
    traits: ["Diplomatic", "Supportive", "Intuitive", "Gentle"],
    challenges: ["Sensitivity", "Dependency"]
  },
  3: {
    title: "The Joyful Creator",
    description: "Your destiny is to express yourself and bring happiness to the world.",
    traits: ["Creative", "Expressive", "Optimistic", "Enthusiastic"],
    challenges: ["Scatteredness", "Superficiality"]
  },
  4: {
    title: "The Master Builder",
    description: "You strive for stability, order, and lasting achievement.",
    traits: ["Practical", "Disciplined", "Organized", "Steadfast"],
    challenges: ["Rigidity", "Workaholism"]
  },
  5: {
    title: "The Freedom Seeker",
    description: "Life teaches you to embrace change and freedom.",
    traits: ["Versatile", "Adaptable", "Free-spirited", "Curious"],
    challenges: ["Restlessness", "Impulsiveness"]
  },
  6: {
    title: "The Cosmic Parent",
    description: "You are destined to serve, nurture, and protect your community.",
    traits: ["Nurturing", "Responsible", "Loving", "Protective"],
    challenges: ["Burden", "Meddling"]
  },
  7: {
    title: "The Wise Sage",
    description: "You will find peace in introspection, study, and spiritual truth.",
    traits: ["Wise", "Analytical", "Introspective", "Spiritual"],
    challenges: ["Loneliness", "Skepticism"]
  },
  8: {
    title: "The Powerful Executive",
    description: "You are moving toward material mastery and authority.",
    traits: ["Powerful", "Ambitious", "Efficient", "Successful"],
    challenges: ["Materialism", "Stress"]
  },
  9: {
    title: "The Universal Lover",
    description: "You are here to give back to the world with compassion.",
    traits: ["Compassionate", "Generous", "Broad-minded", "Selfless"],
    challenges: ["Emotionalism", "Detachment"]
  },
  11: {
    title: "The Inspiring Visionary",
    description: "Your path leads to spiritual illumination and inspiring others.",
    traits: ["Inspiring", "Intuitive", "Idealistic", "Visionary"],
    challenges: ["Nervousness", "Impracticality"]
  },
  22: {
    title: "The Master Builder",
    description: "You have the potential to achieve great things for humanity.",
    traits: ["Powerful", "Visionary", "Practical", "Expert"],
    challenges: ["Overwhelm", "Intensity"]
  },
  33: {
    title: "The Master Teacher",
    description: "You are destined to teach and heal with unconditional love.",
    traits: ["Healing", "Loving", "Teaching", "Uplifting"],
    challenges: ["Martyrdom", "Responsibility"]
  },
  44: {
    title: "The Master Healer",
    description: "You will create systems that bring healing to many.",
    traits: ["Transformative", "Powerful", "Systematic", "Healing"],
    challenges: ["Exhaustion", "Pressure"]
  }
};

export const maturityMeaningsReading: { [key: number]: NumberMeaning } = {
  1: {
    title: "Developing Independence",
    description: "As you mature, you will find yourself becoming more independent and driven. You will be called to take charge of your life and perhaps lead others.",
    traits: ["Self-reliance", "Leadership", "Starting new things", "Originality", "Courage"],
    challenges: ["Accepting help", "Listening to others", "Patience"]
  },
  2: {
    title: "Finding Harmony",
    description: "Later in life, your focus shifts to relationships and peace. You will find satisfaction in working with others and creating harmony.",
    traits: ["Cooperation", "Diplomacy", "Patience", "Detail-oriented", "Music/Rhythm"],
    challenges: ["Being too passive", "Oversensitivity", "Indecision"]
  },
  3: {
    title: "Expressing Joy",
    description: "Your maturity brings a desire to create and communicate. You will feel a need to express your inner self and enjoy life's pleasures.",
    traits: ["Artistic expression", "Optimism", "Socializing", "Writing/Speaking", "Humor"],
    challenges: ["Scattered energies", "Exaggeration", "Managing moods"]
  },
  4: {
    title: "Building Security",
    description: "As you grow older, you will value stability and order more. You will work to build a secure foundation for yourself and your loved ones.",
    traits: ["Organization", "Hard work", "Methodical approach", "Loyalty", "Construction"],
    challenges: ["Being too rigid", "Fear of change", "Missing the big picture"]
  },
  5: {
    title: "Embracing Freedom",
    description: "Maturity brings a sense of adventure. You will likely seek more freedom and variety, shaking off old restrictions.",
    traits: ["Adaptability", "Travel", "New experiences", "Promotion", "Communication"],
    challenges: ["Restlessness", "Lack of focus", "Impulsiveness"]
  },
  6: {
    title: "Serving Community",
    description: "Your later years will be focused on home, family, and service. You will find joy in taking responsibility for the well-being of others.",
    traits: ["Responsibility", "Nurturing", "Community service", "Domestic arts", "Counseling"],
    challenges: ["Over-giving", "Interfering", "Perfectionism"]
  },
  7: {
    title: "Seeking Truth",
    description: "You will move toward introspection and spiritual discovery. A desire for solitude and study will grow as you seek life's deeper meanings.",
    traits: ["Analysis", "Meditation", "Specialization", "Research", "Quietude"],
    challenges: ["Withdrawal", "Skepticism", "Difficulty sharing feelings"]
  },
  8: {
    title: "Achieving Mastery",
    description: "As you mature, you will come into your own power. Opportunities for management, business, and material success will arise.",
    traits: ["Business acumen", "Authority", "Resource management", "Achievement", "Balance"],
    challenges: ["Materialism", "Workaholism", "Dominating others"]
  },
  9: {
    title: "Universal Compassion",
    description: "Your maturity is marked by a broadening of your horizons. You will feel a pull to help others and contribute to the greater good.",
    traits: ["Philanthropy", "the Arts", "Tolerance", "Forgiveness", "Global view"],
    challenges: ["Emotional drains", "Disappointment in others", "Impracticality"]
  },
  11: {
    title: "Spiritual Illumination",
    description: "You will grow into a role of spiritual leadership or inspiration. Your intuition will heighten, guiding you to light the way for others.",
    traits: ["Intuition", "Inspiration", "Idealism", "Psychic awareness", "Innovation"],
    challenges: ["Nervous tension", "High expectations", "Grounding"]
  },
  22: {
    title: "Manifesting Vision",
    description: "Your maturity brings the ability to make your large-scale dreams a reality. You will have the power to build for the benefit of all.",
    traits: ["Large undertakings", "Practical idealism", "International influence", "Mastery", "Structure"],
    challenges: ["Overwhelming pressure", "Burnout", "Rigidity"]
  },
  33: {
    title: "Selfless Service",
    description: "You will be called to a high level of service and nurturing. Your presence will be healing to those around you.",
    traits: ["Compassionate service", "Healing", "Counseling", "Unconditional love", "Teacher"],
    challenges: ["Martyrdom", "Emotional burden", "Neglecting self"]
  },
  44: {
    title: "Transformative Power",
    description: "Your later life involves creating structures that heal and transform society. You merge spiritual wisdom with material mastery.",
    traits: ["System creation", "Deep healing", "Sustainable building", "Resilience", "Ethical power"],
    challenges: ["Extreme stress", "Physical exhaustion", "Walking the path alone"]
  }
};

export function getMaturityNumberMeaning(
  number: number,
  type: 'explore' | 'reading' = 'explore'
): NumberMeaning {
  const reduced = reduceToSingleDigit(number);
  // Always use reading meanings for consistency as requested
  return maturityMeaningsReading[reduced] || {
    title: "Unique Path",
    description: "Your maturity brings unique opportunities.",
    traits: ["Unique"],
    challenges: []
  };
}