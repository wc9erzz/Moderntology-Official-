// utils/numerology/pinnacle-meanings.ts

export interface PinnacleMeaning {
  title: string;
  description: string;
  opportunities: string[];
  challenges: string[];
  advice: string;
}

export const pinnacleMeaningsByStage: {
  [stage in 'first' | 'second' | 'third' | 'fourth']: {
    [num: number]: PinnacleMeaning
  }
} = {
  first: {
    1: {
      title: "Seed of Independence",
      description: "An early life focused on developing self-reliance. You may have felt different or lonely, forcing you to find strength within.",
      opportunities: ["Assert your identity", "Overcome early obstacles", "Take independent initiative"],
      challenges: ["Stubbornness", "Isolation", "Fear of failure"],
      advice: "Trust your own ideas even as a young person. The strength you build now is your foundation."
    },
    2: {
      title: "Early Harmony",
      description: "A sensitive and intuitive childhood. You were likely the peacemaker, learning the value of cooperation and diplomacy early on.",
      opportunities: ["Develop social sensitivity", "Patience", "Working with others"],
      challenges: ["Oversensitivity", "Over-dependence", "Suppressed feelings"],
      advice: "Your sensitivity is a gift, not a weakness. Learn to balance your needs with others'."
    },
    3: {
      title: "Young Creative",
      description: "A social and self-expressive early period. You likely sought outlets through art, performance, or storytelling to find your voice.",
      opportunities: ["Artistic development", "Social popularity", "Joyous learning"],
      challenges: ["Scattered focus", "Superficiality", "Difficulty committing"],
      advice: "Try many things, but find one creative spark to focus on as you grow."
    },
    4: {
      title: "Foundation of Effort",
      description: "A serious early life requiring discipline. You likely learned the value of hard work through schooling or early family responsibilities.",
      opportunities: ["Building core skills", "Learning organization", "Material realism"],
      challenges: ["Rigidity", "Missing out on fun", "Feeling limited"],
      advice: "The discipline you learn now will make everything easier later. Stay flexible."
    },
    5: {
      title: "Winds of Change",
      description: "An unorthodox and active youth. Frequent moves or variety in experiences taught you rapid adaptability and resourcefulness.",
      opportunities: ["Broad perspective", "Learning many skills", "Versatility"],
      challenges: ["Restlessness", "Impulsiveness", "Lack of grounding"],
      advice: "Embrace the variety, but learn which experiences are worth keeping."
    },
    6: {
      title: "Youth of Responsibility",
      description: "Early life centered on family duty. You likely felt a strong bond to home and took on caretaking roles from a young age.",
      opportunities: ["Learning empathy", "Creating harmony", "Parental bonding"],
      challenges: ["Early burdens", "Interference", "Sacrificing self-exploration"],
      advice: "Nurturing others is your nature, but remember to nurture your own dreams too."
    },
    7: {
      title: "Inward Foundation",
      description: "A quiet, introverted, and studious childhood. You potentially felt like an outsider, preferring books and reflection to loud social noise.",
      opportunities: ["Deep reflection", "Technical focus", "Internal discovery"],
      challenges: ["Social isolation", "Skepticism", "Feeling misunderstood"],
      advice: "Your inner world is vast. Use this time to build your unique wisdom."
    },
    8: {
      title: "Seed of Achievement",
      description: "Early life where the material world and success were highlighted. You likely felt a drive to prove your worth through effort and results.",
      opportunities: ["Executive development", "Organizational power", "Efficiency"],
      challenges: ["Materialistic focus", "Suppressed play", "Competitive stress"],
      advice: "Ambition is good, but value the process as much as the outcome."
    },
    9: {
      title: "Global Compassion",
      description: "A youth marked by deep empathy and emotional intensity. You were likely wise beyond your years, feeling the hurts of the world deeply.",
      opportunities: ["Humanitarian awareness", "Universal thinking", "Tolerance"],
      challenges: ["Emotional overwhelm", "Difficulty letting go", "Feeling responsible for all"],
      advice: "You are here to help, but you cannot fix everything at once. Start with kindness."
    },
    11: {
      title: "The Visionary Spark",
      description: "An early life defined by intense nervous energy and flashes of advanced insight. You likely felt 'too sensitive' for the world, as you were learning to filter high-frequency intuition. This period is about recognizing your unique spiritual frequency.",
      opportunities: ["Intuitive discovery", "Psychic development", "Artistic inspiration"],
      challenges: ["High-strung nerves", "Feeling misunderstood", "Sensory overwhelm"],
      advice: "Stay grounded. Your body is the antenna for your soul; keep it strong and calm to process your insights."
    },
    22: {
      title: "The Potential Architect",
      description: "An early life often marked by demanding circumstances that force you to develop immense discipline. You feel a drive to build something of significance even before you fully understand your purpose. This stage builds your foundation of practical mastery.",
      opportunities: ["Extreme discipline", "Strategic thinking", "Developing technical mastery"],
      challenges: ["Heavy responsibility", "Material stress", "Early fear of failure"],
      advice: "Build small things well first. The integrity of your early foundation determines the height and stability of your future legacy."
    },
    33: {
      title: "The Awakened Youth",
      description: "A childhood marked by profound empathy and an innate sense of responsibility for others. You likely felt like an 'old soul,' often putting others' needs before your own and acting as a natural peacekeeper.",
      opportunities: ["Developing early empathy", "High emotional intelligence", "Finding spiritual purpose young"],
      challenges: ["Carrying others' burdens", "Self-neglect", "Emotional overwhelm"],
      advice: "Your sensitivity is a lighthouse. Learn to protect your own light so you can properly guide others without burning out."
    }
  },
  second: {
    1: {
      title: "Productive Initiative",
      description: "A mid-life period of career breakthroughs. You are now in a position to lead and pioneer new developments based on your unique vision.",
      opportunities: ["Starting a business", "Leadership roles", "Self-advancement"],
      challenges: ["Aggression", "Loneliness at the top", "Ego conflicts"],
      advice: "Lead by example. Your originality is your greatest competitive advantage."
    },
    2: {
      title: "Season of Partnership",
      description: "A time of building through cooperation. Success in this period comes through successful marriage, business partnerships, and diplomacy.",
      opportunities: ["Strong unions", "Diplomatic success", "Mediator roles"],
      challenges: ["Passive-aggression", "Fear of independence", "Indecision"],
      advice: "Work with others. Two heads are better than one in this chapter of your life."
    },
    3: {
      title: "Public Expression",
      description: "A highly social and creatively successful period. You are meant to be 'out there', expressing your ideas and gaining recognition.",
      opportunities: ["Public speaking", "Artistic recognition", "Social expansion"],
      challenges: ["Scattering resources", "Superficiality", "Lack of follow-through"],
      advice: "Your charm is powerful. Use it to build something substantial, not just enjoyable."
    },
    4: {
      title: "The Great Builder",
      description: "The peak period for material construction. You are laying down the heavy stones of your career, home, and financial security.",
      opportunities: ["Real estate", "Management", "Financial stability"],
      challenges: ["Overwork", "Health neglecting", "Stubborn rigidity"],
      advice: "Work hard, but build systems that eventually work for you."
    },
    5: {
      title: "Era of Expansion",
      description: "A mid-life shift toward variety. You may find yourself changing careers, traveling extensively, or exploring unorthodox lifestyles.",
      opportunities: ["Travel", "Networking", "Progressive ideas"],
      challenges: ["Instability", "Loss of focus", "Avoiding responsibility"],
      advice: "Embrace the freedom, but keep one foot anchored in your values."
    },
    6: {
      title: "Home and Community",
      description: "The classic family and service years. Your focus is on raising children, caring for elders, and community responsibility.",
      opportunities: ["Counseling", "Nurturing home", "Civic leadership"],
      challenges: ["Family friction", "Sacrifice", "Interference"],
      advice: "Find joy in service, but set boundaries so you don't lose yourself."
    },
    7: {
      title: "Specialized Wisdom",
      description: "A period of professional refinement and teaching. You are becoming a specialist or an authority in your chosen field.",
      opportunities: ["Research", "Teaching", "Internal mastery"],
      challenges: ["Cynicism", "Social withdrawal", "Over-analysis"],
      advice: "Share what you've learned. Isolation is a trap, wisdom is a bridge."
    },
    8: {
      title: "Material Mastery",
      description: "The peak of material power and status. This is the time to consolidate your influence and manage large projects or finances.",
      opportunities: ["Accumulating wealth", "Executive power", "Efficiency"],
      challenges: ["Arrogance", "Material obsession", "Burnout"],
      advice: "Power is a tool for good. Use your success to empower others too."
    },
    9: {
      title: "Humanitarian Reach",
      description: "A time of broadening your influence to serve the greater good. You are moving beyond personal gain toward selfless contribution.",
      opportunities: ["Charity leadership", "Global projects", "Letting go"],
      challenges: ["Emotional fatigue", "Universal grief", "Loss of personal identity"],
      advice: "Your service is your legacy. Trust that the universe supports your generosity."
    },
    11: {
      title: "The Illuminated Leader",
      description: "A mid-life chapter where your intuition becomes a powerful tool for breakthrough innovation. You inspire others through your unique vision and your ability to see possibilities that others miss. You are meant to lead through illumination.",
      opportunities: ["Public recognition", "Inventive thinking", "Spiritual teaching"],
      challenges: ["Public pressure", "Sensitive burnout", "Idealism vs Reality"],
      advice: "Your vision is a lighthouse. Focus it clearly, and don't let the fog of others' doubt or your own sensitivity dim your light."
    },
    22: {
      title: "The Master Manifestor",
      description: "The peak years for turning grand, idealistic visions into tangible, large-scale structures. You have the unique ability to manage complex projects that benefit society, often bridging the gap between spiritual ideals and material reality.",
      opportunities: ["Systemic innovation", "Global business impact", "Manifesting visionary goals"],
      challenges: ["Overwhelming scale", "Greed vs Idealism", "Physical burnout"],
      advice: "The bigger the project, the more you need a team. Lead through shared vision and organization, not just your own will."
    },
    33: {
      title: "The Master Counselor",
      description: "A peak period for using your nurturing gifts in a public or professional capacity. You lead not through force, but through an overwhelming sense of compassion and selfless service to something larger than yourself.",
      opportunities: ["Uplifting communities", "Creative healing", "Leading through unconditional love"],
      challenges: ["Universal responsibility", "Ignoring personal life", "Emotional exhaustion"],
      advice: "Service is your joy, but remember that the server also needs to be fed. Balance your selfless giving with self-care."
    }
  },
  third: {
    // Sharing Productivity themes with Second but with more emphasis on Harvest
    1: {
      title: "Harvest of Independence",
      description: "As you mature, your independence takes on a refined quality. You are a pioneer who has now proven their worth.",
      opportunities: ["Mentoring others", "Self-made success", "New ventures"],
      challenges: ["Inflexibility", "Loneliness", "Ego"],
      advice: "Use your pioneering spirit to inspire the next generation."
    },
    2: {
      title: "Diplomatic Harvest",
      description: "Your lifelong skills in cooperation are now yielding deep, meaningful partnerships and a peaceful domestic life.",
      opportunities: ["Refined partnerships", "Arbitration", "Quiet success"],
      challenges: ["Oversensitivity", "Avoidance", "Dependence"],
      advice: "Patience has been your ally; now enjoy the harmony you've built."
    },
    3: {
      title: "Creative Maturity",
      description: "Your creative expression is now focused and meaningful. You have found your true voice and are using it to inspire others.",
      opportunities: ["Mastery in arts", "Engaging storytelling", "Social joy"],
      challenges: ["Wasteful energy", "Superficiality", "Impatience"],
      advice: "Focus your joy. Your words and art have more weight now."
    },
    4: {
      title: "Legacy Builder",
      description: "You are the anchor for others. Your hard-earned stability and order are now the foundation upon which your family or business stands.",
      opportunities: ["Passing on traditions", "Reliability", "Structure"],
      challenges: ["Rigidity", "Stubbornness", "Routine fatigue"],
      advice: "Stability is a gift. Ensure your structures are built to last beyond you."
    },
    5: {
      title: "Freedom of Experience",
      description: "You have the freedom to follow your curiosities. This is the 'second youth' where you can travel and explore with more wisdom.",
      opportunities: ["Exploration", "Variety", "Renewed energy"],
      challenges: ["Restlessness", "Lack of direction", "Risk-taking"],
      advice: "Adventure is the spice of life, and you finally have the seasoning to enjoy it."
    },
    6: {
      title: "Community Anchor",
      description: "You are the heart of your community or extended family. Your wisdom in nurturing is deeply sought after by many.",
      opportunities: ["Healing", "Nurturing legacy", "Social duty"],
      challenges: ["Over-burdening", "Interfering", "Emotional drain"],
      advice: "Your love is a resource; manage it wisely so you remain strong for those who need you."
    },
    7: {
      title: "Spiritual Harvest",
      description: "A deep period of understanding. You are beginning to integrate all your life experiences into a cohesive spiritual philosophy.",
      opportunities: ["Specialized wisdom", "Writing", "Consulting"],
      challenges: ["Cynicism", "Isolation", "Perfectionism"],
      advice: "The truth you've sought is within. Share the light you've found."
    },
    8: {
      title: "Practical Power",
      description: "You have mastered the material world. You now use power with more ease and efficiency, often as a high-level advisor.",
      opportunities: ["Philanthropy", "Strategic success", "Authority"],
      challenges: ["Greed", "Arrogance", "Loss of heart"],
      advice: "Use your mastery to build systems that heal and help. True power is service."
    },
    9: {
      title: "Universal Harvest",
      description: "A selfless period of giving back. You sense the completion of major cycles and find fulfillment in universal service.",
      opportunities: ["Teaching", "Global awareness", "Kindness"],
      challenges: ["Emotional exhaustion", "Regret", "Over-sensitivity"],
      advice: "Release what is done. Your generosity is your greatest treasure."
    },
    11: {
      title: "The Sage Messenger",
      description: "You have refined your lifelong sensitivity into profound wisdom. This is the period for delivering your 'message' to the world, providing guidance to those who seek a higher perspective or soul-level understanding.",
      opportunities: ["Delivering high truths", "Soul-level mentorship", "Philosophical influence"],
      challenges: ["Nervous tension", "Social withdrawal", "Impatience with the mundane"],
      advice: "Share what you have seen. Your insights have the unique power to transform lives and provide clarity to those in darkness."
    },
    22: {
      title: "The World Architect",
      description: "Your focus shifts toward the lasting impact and sustainability of what you have built. You are finalizing systems or structures that will serve humanity well into the future, acting as a high-level advisor and legacy builder.",
      opportunities: ["Establishing lasting institutions", "Philanthropic legacy", "High-level strategic advising"],
      challenges: ["Inflexibility", "Routine fatigue", "Pressure to sustain your work"],
      advice: "Ensure your structures are adaptable. True master builders create things that can continue to grow and serve without them."
    },
    33: {
      title: "The Universal Healer",
      description: "Your lifelong skills in compassion are now applied to a broader, perhaps global, canvas. You find deepest fulfillment in healing collective wounds and teaching the transformative power of unconditional love.",
      opportunities: ["Broad-scale philanthropy", "Spiritual mentorship", "Harmonizing large groups"],
      challenges: ["Grief for the world", "Detachment from self", "Extreme emotional sensitivity"],
      advice: "You are a bridge for the divine energy. Let the love flow through you to the world, rather than trying to carry it all yourself."
    }
  },
  fourth: {
    1: {
      title: "Legacy of Self",
      description: "A final chapter of total independence. You remain self-sufficient and active, serving as a role model of individual strength.",
      opportunities: ["Pioneering for elders", "Unique hobbies", "Vibrant autonomy"],
      challenges: ["Self-centeredness", "Isolation", "Stubbornness"],
      advice: "Your independence is your legacy. Stay active and keep your own counsel."
    },
    2: {
      title: "Wise Peacemaker",
      description: "A peaceful and harmonious final pinnacle. You enjoy the quiet beauty of relationships and provide a calm presence for your family.",
      opportunities: ["Gentle mentorship", "Close companionship", "Inner peace"],
      challenges: ["Oversensitivity", "Dependence", "Dwellling on the past"],
      advice: "Harmony is your reward. Enjoy the quiet moments of companionship."
    },
    3: {
      title: "Cheerful Sage",
      description: "An old age filled with joy and creativity. You are the 'wise child' who keeps the spirit of the family young and lighthearted.",
      opportunities: ["Storytelling", "Artistic hobbies", "Social warmth"],
      challenges: ["Scattered focus", "Escapism", "Lack of seriousness"],
      advice: "Your joy is infectious. Keep the world bright with your creative spirit."
    },
    4: {
      title: "The Solid Anchor",
      description: "A final chapter of order and security. You provide the bedrock of stability for your descendants and maintain a well-ordered life.",
      opportunities: ["Organization", "Financial wisdom", "Legacy structures"],
      challenges: ["Rigidity", "Routine obsession", "Over-correction"],
      advice: "You have built well. Now trust your foundations to hold firm."
    },
    5: {
      title: "Ageless Adventurer",
      description: "A lively and unorthodox late life. You refuse to slow down, potentially choosing to travel, learn, or live differently than expected.",
      opportunities: ["Variety", "Freedom", "Mental agility"],
      challenges: ["Restlessness", "Instability", "Non-conformity"],
      advice: "Freedom is yours. Explore the world with the eyes of a child and the mind of a sage."
    },
    6: {
      title: "The Nurturing Elder",
      description: "The most domestic and rewarding final pinnacle. You are the patriarch or matriarch, finding ultimate fulfillment in your family.",
      opportunities: ["Grandparenting", "Mentorship", "Healing home"],
      challenges: ["Worry", "Interference", "Self-sacrifice"],
      advice: "Your love is your greatest legacy. Simply being present is your greatest service."
    },
    7: {
      title: "The Philosopher",
      description: "A final period of deep introspection and spiritual peace. You spend your time in study, reflection, and internal expansion.",
      opportunities: ["Spiritual mastery", "Inner peace", "Writing"],
      challenges: ["Isolation", "Skepticism", "Withdrawal"],
      advice: "Solitude is your sanctuary. The wisdom you've found is your gift to the world."
    },
    8: {
      title: "Generous Authority",
      description: "A chapter of material influence used for good. You advise, manage foundations, or use your wealth and status to benefit others.",
      opportunities: ["Board roles", "Philanthropy", "Strategic legacy"],
      challenges: ["Arrogance", "Materialism", "Control issues"],
      advice: "True success is measured by the lives you've improved. Leave the world better than you found it."
    },
    9: {
      title: "The Humanitarian Spirit",
      description: "A final pinnacle of universal love. You have surpassed personal concerns and live for the benefit of all humanity.",
      opportunities: ["Global kindness", "Teaching", "Transcendence"],
      challenges: ["Grief for the world", "Exhaustion", "Letting go"],
      advice: "You are one with all. Your universal love is the highest form of legacy."
    },
    11: {
      title: "The Divine Conduit",
      description: "A final pinnacle focused on total spiritual integration. You live as a source of pure inspiration, bridging the gap between the material and spiritual worlds for all who cross your path.",
      opportunities: ["Spiritual legacy", "Intuitive mastery", "Peace through celestial perspective"],
      challenges: ["Feeling out of time", "Sensitivity to environment", "Maintaining physical grounding"],
      advice: "Simply be the bridge. Your existence is a powerful message that the spiritual realm is real, near, and accessible."
    },
    22: {
      title: "The Legacy Guardian",
      description: "A final chapter dedicated to ensuring your life's work is protected and continues to thrive for future generations. You use your material and spiritual mastery to benefit the long-term well-being of humanity.",
      opportunities: ["Philanthropic foundations", "Generational impact", "Material and spiritual peace"],
      challenges: ["Control issues", "Obsession with legacy", "Material attachment"],
      advice: "You have built well and served faithfully. Now trust the future and the people you've mentored to carry your vision forward."
    },
    33: {
      title: "The Embodiment of Love",
      description: "A final chapter of pure spiritual influence and enlightenment. Your presence alone serves as a masterclass in unconditional love, leaving an eternal emotional and spiritual legacy for the world.",
      opportunities: ["Spiritual transmission", "Absolute inner peace", "Universal guidance through presence"],
      challenges: ["Physical frailty", "Cosmic loneliness", "Extreme sensitivity to earthly discord"],
      advice: "You have returned to the essence of all things. Simply being present in your love is the greatest gift you can now offer."
    }
  }
};

/**
 * Get pinnacle meaning by number and stage
 */
export function getPinnacleMeaning(
  number: number,
  stage: 'first' | 'second' | 'third' | 'fourth' = 'first'
): PinnacleMeaning | null {
  const stageData = pinnacleMeaningsByStage[stage];
  if (!stageData) return null;

  return stageData[number] || null;
}

/**
 * Get pinnacle cycle description based on which cycle it is
 */
export function getPinnacleCycleDescription(cycle: 'first' | 'second' | 'third' | 'fourth'): string {
  const descriptions = {
    first: "The Foundation Years - This pinnacle shapes your childhood and early adulthood, focusing on establishing your character and selfhood.",
    second: "The Productivity Years - A time of building your career, relationships, and place in the world through active effort.",
    third: "The Harvest Years - Reaping what you've sown, this period focuses on maturing your goals and sharing your experience.",
    fourth: "The Wisdom Years - This final pinnacle focuses on spiritual integration, legacy, and finding your ultimate life purpose."
  };

  return descriptions[cycle];
}