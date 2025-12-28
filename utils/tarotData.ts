import { TarotCard } from '@/types/tarot';

export const tarotDeck: TarotCard[] = [
    // --- MAJOR ARCANA (0-21) ---
    {
        id: 0,
        name: "The Fool",
        suit: "major",
        meaningUpright: "The Fool represents the raw potential of the universe before manifestation. It is the spirit of innocence, curiosity, and the leap of faith required to begin any great journey. You are standing at a precipice, unburdened by past experiences or future fears. This card encourages you to trust in the universe and embrace the unknown with an open heart. It is not about foolishness, but about the wisdom of not knowing, allowing you to be shaped by the journey ahead.",
        meaningReversed: "When reversed, The Fool warns of recklessness or naivety. You may be acting without considering the consequences, or conversely, you may be paralyzed by fear of the unknown, refusing to take a necessary leap. It calls for a check on your impulses: are you being spontaneous, or are you being careless? Ground your spirit before you fly.",
        symbolism: "The figure stands at the edge of a cliff, gazing upward rather than down, signifying trust in the divine. The white rose represents purity and freedom from lower desires. The small dog snapping at his heels symbolizes the instincts of self-preservation or the warnings of the material world, which he blithely ignores. The sun shines brightly, illuminating the clarity of his spirit.",
        keywords: ["New Beginnings", "Leap of Faith", "Innocence", "Potential", "Spontaneity"],
        imagePath: "/tarot/major/0_the_fool.png",
    },
    {
        id: 1,
        name: "The Magician",
        suit: "major",
        meaningUpright: "The Magician is the bridge between the spiritual and the physical. He represents the power of manifestation—the ability to take a thought or idea and make it real. You have all the tools you need at your disposal; nothing is missing. It is a card of action, concentration, and the conscious direction of will. You are the conduit for magic; realize that your reality is malleable and shaped by your intent.",
        meaningReversed: "Reversed, The Magician suggests disconnected power or manipulation. You may have the skills but lack the will, or you may be using your influence for selfish or deceptive ends. It can also indicate creative blocks, where the energy is available but cannot find its way into form. Realign your intentions with your higher purpose.",
        symbolism: "One hand points to the sky (receiving power) and the other points to the earth (grounding it), embodying 'As above, so below'. On the table are the four elemental tools: the Cup (emotions), Pentacle (earth/body), Sword (intellect), and Wand (will). The infinity symbol above his head denotes the infinite nature of energy and spirit.",
        keywords: ["Manifestation", "Willpower", "Resourcefulness", "Action", "Skill"],
        imagePath: "/tarot/major/1_the_magician.png"
    },
    {
        id: 2,
        name: "The High Priestess",
        suit: "major",
        meaningUpright: "The High Priestess sits at the gate of the subconscious. She is the guardian of secrets, intuition, and the mysteries that cannot be explained by logic. This card calls you to look inward, to trust your gut feelings and dreams. It is a time of passivity and receptivity, allowing the answer to emerge from the silence rather than forcing it through action. She represents the divine feminine wisdom that knows without needing to speak.",
        meaningReversed: "Reversed, this card suggests you are ignoring your inner voice or surface-level distractions are drowning out your intuition. It may indicate hidden agendas or secrets that are causing confusion. You might be relying too heavily on external validation or logic when the answer lies in your feelings. Reconnect with the silence within.",
        symbolism: "She sits between the black pillar (Boaz - negation) and white pillar (Jachin - beginning), symbolizing the duality she balances. The veil behind her is decorated with pomegranates, representing fertility and the abundance of the subconscious. The crescent moon at her feet shows her dominion over intuition and cycles.",
        keywords: ["Intuition", "Mystery", "Subconscious", "Inner Voice", "Divine Feminine"],
        imagePath: "/tarot/major/2_the_high_priestess.png"
    },
    {
        id: 3,
        name: "The Empress",
        suit: "major",
        meaningUpright: "The Empress is the archetype of the Mother—abundant, nurturing, and fertile. She represents the creative force of nature itself. This card is a sign of growth, prosperity, and the birthing of new ideas or relationships. It invites you to connect with your senses, enjoy the beauty around you, and nurture your creations. It is a time of harvesting what you have sown and finding grounding in the natural world.",
        meaningReversed: "When reversed, The Empress can signal creative blockage or smothering behavior. You may be neglecting your own needs while over-caring for others, or you may feel disconnected from nature and your own body. It can also suggest dependence or a lack of growth in a project. Return to self-care and ground yourself in simple pleasures.",
        symbolism: "She sits on a cushioned throne in a lush forest, signifying comfort and connection to the earth. The shield with the symbol of Venus represents love and beauty. The field of ripening wheat depicts abundance and the fruition of effort. The crown of twelve stars links her to the zodiac and the cycles of the year.",
        keywords: ["Fertility", "Abundance", "Nature", "Creativity", "Nurturing"],
        imagePath: "/tarot/major/3_the_empress.png"
    },
    {
        id: 4,
        name: "The Emperor",
        suit: "major",
        meaningUpright: "The Emperor represents the structure and stability that allows life to flourish. He is the father archetype: protective, authoritative, and disciplined. This card calls for logic, order, and the establishment of rules or boundaries. It is time to step into your power, take charge of the situation, and lead with a steady hand. Success comes through organization and playing by the rules you help create.",
        meaningReversed: "Reversed, The Emperor acts as a tyrant or a weak leader. It indicates an abuse of power, excessive control, or rigidity that stifles growth. Alternatively, it can show a lack of discipline and structure, where chaos reigns because no boundaries are set. Assess where you are being too hard on yourself or others, or where you need to stand up and take control.",
        symbolism: "He sits on a rigid stone throne adorned with rams (Aries, the sign of authority and war). He holds the Ankh (life) and the Orb (dominion), showing he rules over the material world. The barren mountains behind him suggest that his power is built on resilience and unyielding strength, not softness.",
        keywords: ["Authority", "Structure", "Discipline", "Leadership", "Stability"],
        imagePath: "/tarot/major/4_the_emperor.png"
    },
    {
        id: 5,
        name: "The Hierophant",
        suit: "major",
        meaningUpright: "The Hierophant bridges the gap between the divine and humanity through tradition and education. He represents established institutions, shared belief systems, and the wisdom passed down through generations. This card suggests following a conventional path, seeking mentorship, or finding comfort in ritual and community. It is about learning the rules before you can break them.",
        meaningReversed: "Reversed, The Hierophant creates a rebel. It signifies a break from tradition, challenging the status quo, or feeling restricted by societal or religious norms. You may be seeking your own personal truth rather than accepting what has been taught. It is a call to question authority and find spiritual freedom outside of established structures.",
        symbolism: "He wears the triple crown of the Pope and holds a sceptre with three crosses, representing power over the physical, emotional, and spiritual worlds. The keys at his feet represent the unlocking of sacred knowledge, but only to those who follow the path. The two acolytes represent the transmission of wisdom.",
        keywords: ["Tradition", "Mentorship", "Conformity", "Spiritual Wisdom", "Institutions"],
        imagePath: "/tarot/major/5_the_hierophant.png"
    },
    {
        id: 6,
        name: "The Lovers",
        suit: "major",
        meaningUpright: "The Lovers is a card of union, but its deeper meaning is about choice. It represents the harmony of opposites and the integration of the self. While it often speaks to romantic relationships, it also signifies a crossroads where a choice must be made based on your highest values. It is about alignment—head and heart working together in perfect unison.",
        meaningReversed: "Reversed, The Lovers suggests disharmony or misalignment. You may be torn between two paths or feelings, leading to inner conflict. In relationships, it can indicate a disconnect or a choice made for the wrong reasons. It calls for you to re-evaluate what you truly value and whether your current commitments reflect that.",
        symbolism: "The figures of Adam and Eve stand naked (vulnerable and truthful) in Eden. The angel Raphael (healing) blesses them. Behind Eve is the Tree of Knowledge with the serpent (temptation/choice), and behind Adam is the Tree of Life (passion). It represents the dualities of life that must be united by love.",
        keywords: ["Love", "Harmony", "Choices", "Alignment", "Values"],
        imagePath: "/tarot/major/6_the_lovers.png"
    },
    {
        id: 7,
        name: "The Chariot",
        suit: "major",
        meaningUpright: "The Chariot carries the energy of triumphant willpower. It is about overcoming obstacles through sheer focus, discipline, and determination. You are in the driver's seat, holding together opposing forces to move forward. Success is assured, but not without effort; you must maintain control and not let your emotions or distractions derail your path.",
        meaningReversed: "Reversed, the Chariot suggests a loss of control. The opposing forces may be pulling you apart, or you may be driving aggressively towards a goal without direction (running the wheels off). It can indicate giving up or feeling powerless in the face of conflict. It is a sign to pause, re-center, and regain the reins of your life.",
        symbolism: "The warrior stands in a stone chariot, protected by armor but driven by will alone (no reins). The black and white sphinxes represent duality (logic vs. emotion, positive vs. negative) that he must compel to move in the same direction. The canopy of stars shows his connection to celestial guidance.",
        keywords: ["Determination", "Willpower", "Victory", "Control", "Action"],
        imagePath: "/tarot/major/7_the_chariot.png"
    },
    {
        id: 8,
        name: "Strength",
        suit: "major",
        meaningUpright: "Strength in Tarot is not brute force; it is the fortitude of the heart. It represents courage, compassion, and the ability to tame your inner beasts through gentleness rather than aggression. You have the inner reserves to endure challenges with grace. It is the power of quiet confidence and the ability to influence others through patience.",
        meaningReversed: "Reversed, Strength indicates you are succumbing to fear or self-doubt. You may feel weak or overwhelmed by your emotions. It can also suggest you are trying to force a situation out of insecurity rather than trusting your inner power. Reconnect with your core confidence; you are stronger than you think.",
        symbolism: "A woman calmly closes (or opens) the mouth of a lion. She creates a bridge between civilized humanity and animalistic instinct. The infinity symbol above her head shows her enlightened state—she understands that spirits are eternal. Her white robe symbolizes the purity of her intent.",
        keywords: ["Courage", "Compassion", "Inner Strength", "Patience", "Influence"],
        imagePath: "/tarot/major/8_strength.png"
    },
    {
        id: 9,
        name: "The Hermit",
        suit: "major",
        meaningUpright: "The Hermit is the seeker of the soul. He corresponds to a time of withdrawal from the noise of the world to find the truth within. It is not loneliness, but necessary solitude. You are being called to look inward for answers that the outside world cannot provide. It is a period of introspection, guidance, and finding your own light.",
        meaningReversed: "Reversed, isolation has become detrimental. You may be withdrawing out of fear or cutting yourself off from necessary support. It can also indicate becoming lost in your own thoughts, analyzing to the point of paralysis ('navel-gazing'). It suggests it is time to take the wisdom you have found and return to the community.",
        symbolism: "An old man stands on a snowy peak (height of spiritual attainment). He holds a lantern housing a six-pointed star, the Seal of Solomon, representing wisdom. He looks down to guide others, but his path is solitary. The grey cloak represents invisibility and blending into the background.",
        keywords: ["Introspection", "Solitude", "Guidance", "Inner Truth", "Wisdom"],
        imagePath: "/tarot/major/9_the_hermit.png"
    },
    {
        id: 10,
        name: "Wheel of Fortune",
        suit: "major",
        meaningUpright: "The Wheel represents the cyclical nature of existence. What goes up must come down. It is a card of destiny, turning points, and karma. You are entering a new cycle; user this phase with the understanding that change is inevitable. Embrace the unknown, for luck is currently on your side, but remember that the wheel is always turning.",
        meaningReversed: "Reversed, the Wheel suggests resistance to change or a run of bad luck. You may feel like the universe is working against you, or you are trying to cling to a phase that has ended. It serves as a reminder that this too shall pass. Stop resisting the flow; acceptance is the key to breaking the cycle of misfortune.",
        symbolism: "The large wheel is inscribed with Hebrew letters (YHVH - the divine name) and T-A-R-O. It floats in the sky, supported by the four fixed signs of the zodiac (Angel/Aquarius, Eagle/Scorpio, Lion/Leo, Bull/Taurus), representing stability amidst change. The sphinx atop suggests wisdom is needed to solve the riddle of life.",
        keywords: ["Karma", "Cycles", "Destiny", "Turning Point", "Change"],
        imagePath: "/tarot/major/10_wheel_of_fortune.png"
    },
    {
        id: 11,
        name: "Justice",
        suit: "major",
        meaningUpright: "Justice is the card of cause and effect. It is the cold, clear truth that cuts through deception. Decisions made now will have long-term consequences, so act with integrity. It represents fairness, legal matters, and the need to weigh your options carefully. If you have acted honorably, you have nothing to fear; Justice restores balance.",
        meaningReversed: "Reversed, Justice suggests unfairness, dishonesty, or the refusal to take accountability. You may feel you are being treated unjustly, or perhaps you are the one trying to dodge the consequences of your actions. It warns against bias and judging others too harshly. The truth will eventually come out, so it is better to align with it now.",
        symbolism: "A figure sits between two pillars, holding a sword in the right hand (swift logic/action) and scales in the left (impartiality/balance). The purple veil signifies spiritual purpose. A square clasp on the cloak represents the order of law protecting the chaos of the world.",
        keywords: ["Fairness", "Truth", "Accountability", "Law", "Balance"],
        imagePath: "/tarot/major/11_justice.png"
    },
    {
        id: 12,
        name: "The Hanged Man",
        suit: "major",
        meaningUpright: "The Hanged Man represents the art of surrender. He is suspended, seemingly helpless, but his expression is serene. This card calls for a pause, a sacrifice of the ego, or a total reversal of your perspective. You cannot force your way through the current situation; you must let go and see things from a new angle. Enlightenment comes through suspension of action.",
        meaningReversed: "Reversed, it indicates stalling, resistance, or useless sacrifice. You may be stuck in a limbo of your own making because you refuse to let go or change your mind. It can also mean you are martyring yourself for no good reason. It is time to get down from the tree and take action, or accept that the sacrifice is not working.",
        symbolism: "A man hangs by one foot from a T-shaped cross (the Tau). His legs form a '4' (structure) and his arms a '3' (divinity). He has a halo of light, showing that this inversion has brought him spiritual insight. He is not suffering; he is meditating.",
        keywords: ["Surrender", "New Perspective", "Pause", "Sacrifice", "Waiting"],
        imagePath: "/tarot/major/12_the_hanged_man.png"
    },
    {
        id: 13,
        name: "Death",
        suit: "major",
        meaningUpright: "Death is rarely physical; it is the card of profound transformation. It signifies the absolute end of a cycle, a relationship, or a version of yourself. This clearing away is necessary for new life to emerge. Do not fear the reaper; he brings the liberation of the soul from outgrown structures. Embrace the transition with the knowledge that morning follows the darkest night.",
        meaningReversed: "Reversed, Death suggests you are fighting the inevitable. You are clinging to the past or a decaying situation out of fear of the unknown. This resistance only makes the transition more painful. It effectively says “change is happening, whether you like it or not”—the reversed card asks you to stop dragging your feet.",
        symbolism: "A skeleton in black armor rides a white horse (purity of intent). A king (ego) has fallen, while a child (innocence) looks up without fear. In the background, a sun rises between two towers, promising immortality and a new beginning after the darkness.",
        keywords: ["Endings", "Transformation", "Transition", "Rebirth", "Release"],
        imagePath: "/tarot/major/13_death.png"
    },
    {
        id: 14,
        name: "Temperance",
        suit: "major",
        meaningUpright: "Temperance is the alchemist of the Tarot. It asks for moderation, patience, and the blending of opposites to create a third, better path. You are being called to find the middle ground and avoid extremes. It represents health, healing, and the flow of life force. By staying calm and balanced, you can achieve a state of grace and higher purpose.",
        meaningReversed: "Reversed, Temperance warns of imbalance and excess. You may be overindulging, acting hastily, or creating disharmony in your life via extreme choices. It can suggest a clash of interests or a chemical imbalance. You are mixing the wrong ingredients. Step back, pour out the bad water, and try to find your equilibrium again.",
        symbolism: "A winged angel stands with one foot on rocks (earth/material) and one in the water (subconscious/emotion). They pour water between two cups, defying gravity, symbolizing the magical synthesis of life. The triangle in the square on the chest represents spirit contained within matter.",
        keywords: ["Balance", "Moderation", "Patience", "Alchemy", "Harmony"],
        imagePath: "/tarot/major/14_temperance.png"
    },
    {
        id: 15,
        name: "The Devil",
        suit: "major",
        meaningUpright: "The Devil represents the shadow side of the material world: addiction, attachment, and sexuality. It reveals where you feel trapped or restricted, but the chains are often of your own making. It is a card of obsession and primal instincts. It asks you to confront your demons and understand that you hold the key to your own liberation.",
        meaningReversed: "Reversed, The Devil is a powerful omen of breaking free. You are releasing old addictions, severing toxic ties, or waking up from a period of ignorance. The light is returning. It can also warn of repression—trying to hide your dark side completely rather than understanding it. But primarily, it is the card of the chains falling off.",
        symbolism: "A creature (half-man, half-goat) sits on a black cube. Two humans (male and female) are chained to it, but the chains are loose enough to be slipped off. They have grown horns and tails, showing they are becoming like their captor the longer they stay. It represents voluntary servitude to base desires.",
        keywords: ["Addiction", "Materialism", "Shadow Self", "Bondage", "Restriction"],
        imagePath: "/tarot/major/15_the_devil.png"
    },
    {
        id: 16,
        name: "The Tower",
        suit: "major",
        meaningUpright: "The Tower is the card of sudden, unavoidable change. It is the lightning bolt that destroys false foundations. While often chaotic and frightening, this destruction is necessary to reveal the truth. Structures built on lies or ego must fall. It is a moment of revelation that clears the ground for something stronger to be built.",
        meaningReversed: "Reversed, The Tower suggests a disaster averted or change delayed. You might be holding together a crumbling situation out of fear. While the explosion is less violent, the pressure is still building. It can also represent a personal, internal upheaval rather than an external one—a quiet shattering of your worldview.",
        symbolism: "A lightning bolt strikes the top of a stone tower, knocking off a gold crown (material authority). Two figures fall from the flames, representing the casting down of the ego. The lightning is the divine spark that destroys ignorance. It is rude awakening, but it liberates those trapped inside.",
        keywords: ["Sudden Change", "Chaos", "Revelation", "Awakening", "Destruction"],
        imagePath: "/tarot/major/16_the_tower.png"
    },
    {
        id: 17,
        name: "The Star",
        suit: "major",
        meaningUpright: "After the destruction of the Tower comes the peace of The Star. It is the card of hope, renewal, and divine inspiration. You are being guided by the universe. This is a time of healing, serenity, and restoring your faith in the future. You are connected to the cosmos, and your creative waters are flowing freely. Wish upon it.",
        meaningReversed: "Reversed, The Star indicates a loss of faith or hope. You may be feeling discouraged or disconnected from your purpose. You might be cynical, refusing to see the light at the end of the tunnel. It calls for you to nurture yourself and find small ways to believe again. You are blocking the flow of blessings with your own despair.",
        symbolism: "A naked woman (truth/vulnerability) kneels by a pool. She pours one jug onto the dry earth (nourishing the physical) and one into the pool (returning to the source). Seven small stars surround a large central star (Polaris/guidance). An ibis bird in the tree represents the mind taking flight.",
        keywords: ["Hope", "Renewal", "Inspiration", "Serenity", "Spirituality"],
        imagePath: "/tarot/major/17_the_star.png"
    },
    {
        id: 18,
        name: "The Moon",
        suit: "major",
        meaningUpright: "The Moon is the realm of illusion, dreams, and the subconscious. Things are not what they seem. You may be navigating a landscape of fear or uncertainty, where shadows play tricks on your mind. It calls for you to trust your intuition over your eyes. It is a time of deep psychic ability, but also of confusion. Pay attention to your dreams.",
        meaningReversed: "Reversed, The Moon indicates that secrets are being revealed or illusions dispelled. You are waking up from a confusing period and seeing things clearly again. It can also suggest repression of intuition or fear blocking your psychic senses. The night is ending, and the confusing shadows are retreating before the dawn.",
        symbolism: "A crayfish crawls out of the water (primordial consciousness) onto a path. A dog (tame) and a wolf (wild) howl at the moon, representing the duality of our nature. The moon itself has a face, sleeping yet watching. The path leads between two towers into the unknown mountains.",
        keywords: ["Illusion", "Fear", "Subconscious", "Dreams", "intuition"],
        imagePath: "/tarot/major/18_the_moon.png"
    },
    {
        id: 19,
        name: "The Sun",
        suit: "major",
        meaningUpright: "The Sun is the most positive card in the deck. It represents absolute success, joy, and vitality. The shadows of the Moon have vanished, leaving only clarity and warmth. It is a time of confidence, energy, and the celebration of life. Everything you touch turns to gold right now. Embrace your inner child and let your light shine.",
        meaningReversed: "Reversed, The Sun is still positive, but the joy may be dampened or delayed. You might be struggling to see the bright side, or you are forcing positivity when you don't feel it. It can also indicate a temporary cloud blocking the light—success is still there, but you might have to work a bit harder to feel the warmth. Inner child work may be needed.",
        symbolism: "A large, glorious sun faces us directly. Below, a naked child rides a white horse, arms spread wide in joy. The wall behind represents the safety of the garden, but the child has moved beyond it. Four sunflowers represent the four elements flourishing under the light.",
        keywords: ["Joy", "Success", "Vitality", "Positivity", "Celebration"],
        imagePath: "/tarot/major/19_the_sun.png"
    },
    {
        id: 20,
        name: "Judgement",
        suit: "major",
        meaningUpright: "Judgement is the card of awakening and absolution. It is the cosmic wake-up call. You are being called to a higher purpose or asked to make a definitive decision that changes your life's trajectory. It represents letting go of past guilts and rising up to be your true self. The past is forgiven; a new era begins.",
        meaningReversed: "Reversed, Judgement suggests self-doubt and the refusal to hear the call. You may be clinging to past mistakes or fearing the judgement of others. It indicates stagnation—you know you need to change, but you are hitting the snooze button. Stop punishing yourself and accept the invitation to rise.",
        symbolism: "The Archangel Gabriel blows a golden trumpet. Below, gray figures (men, women, children) rise from their coffins in a wasteland. Their arms are outstretched, ready to receive the divine and start their new lives. They are stripped of their worldly identities.",
        keywords: ["Rebirth", "Absolution", "Calling", "Awakening", "Decision"],
        imagePath: "/tarot/major/20_judgement.png"
    },
    {
        id: 21,
        name: "The World",
        suit: "major",
        meaningUpright: "The World is the final card of the Major Arcana, representing completion and wholeness. The journey of the Fool is finished. You have achieved your goal and integrated all the lessons along the way. It signifies success, travel, and a sense of belonging in the universe. You are exactly where you are meant to be. The cycle is complete.",
        meaningReversed: "Reversed, The World suggests a lack of closure. You are so close to the finish line but something is holding you back. It can indicate taking shortcuts that leave you feeling unfulfilled, or a refusal to move on to the next chapter. You need to tie up loose ends before you can truly celebrate your achievement.",
        symbolism: "A woman dances in the center of a green laurel wreath (victory), holding two batons (balance/evolution). She is surrounded by the four figures of the fixed zodiac (Man, Eagle, Bull, Lion) in the corners, showing that she acts with the support of the entire cosmos. She has mastered the elements.",
        keywords: ["Completion", "Wholeness", "Achievement", "Travel", "Fulfillment"],
        imagePath: "/tarot/major/21_the_world.png"
    },

    // --- SUIT OF WANDS (Fire / Action) ---
    {
        id: 22,
        name: "Ace of Wands",
        suit: "wands",
        meaningUpright: "A burst of creative energy, inspiration, and new opportunities. The urge to act.",
        meaningReversed: "Delays, lack of motivation, weighed down by burdens, creativity blocked.",
        symbolism: "A hand holding a sprouting wand, symbolizing growth and potential. A castle in the background offers a destination.",
        keywords: ["Inspiration", "New Beginnings", "Potential", "Creativity"]
    },
    {
        id: 23,
        name: "Two of Wands",
        suit: "wands",
        meaningUpright: "Planning for the future, making decisions, leaving comfort zones.",
        meaningReversed: "Fear of change, playing it safe, bad planning.",
        symbolism: "A man holding a globe stands on a castle wall, looking out at the world. He holds a second wand, deciding whether to stay or go.",
        keywords: ["Planning", "Decisions", "Discovery", "Future"]
    },
    {
        id: 24,
        name: "Three of Wands",
        suit: "wands",
        meaningUpright: "Expansion, foresight, overseas opportunities, waiting for results.",
        meaningReversed: "Obstacles, delays, frustration, lack of foresight.",
        symbolism: "A figure stands on a cliff back turned, watching ships cross the sea. Three wands are planted firmly in the ground.",
        keywords: ["Expansion", "Foresight", "Overseas", "Waiting"]
    },
    {
        id: 25,
        name: "Four of Wands",
        suit: "wands",
        meaningUpright: "Celebration, harmony, marriage, homecoming, community.",
        meaningReversed: "Minor conflict, lack of support, feeling unwelcome.",
        symbolism: "A couple holds flowers under a canopy held up by four wands. A castle is in the background, signifying safety.",
        keywords: ["Celebration", "Homecoming", "Harmony", "Community"]
    },
    {
        id: 26,
        name: "Five of Wands",
        suit: "wands",
        meaningUpright: "Conflict, competition, tension, diversity of opinion.",
        meaningReversed: "Avoiding conflict, respecting differences, making peace.",
        symbolism: "Five men brandish wands at each other in a chaotic manner. No one is hurt, but there is no order.",
        keywords: ["Conflict", "Competition", "Tension", "Chaos"]
    },
    {
        id: 27,
        name: "Six of Wands",
        suit: "wands",
        meaningUpright: "Victory, success, public recognition, confidence.",
        meaningReversed: "Egotism, fall from grace, lack of recognition.",
        symbolism: "A man rides a white horse wearing a victory wreath. The crowd cheers him on. He carries a wand with a wreath.",
        keywords: ["Victory", "Success", "Recognition", "Pride"]
    },
    {
        id: 28,
        name: "Seven of Wands",
        suit: "wands",
        meaningUpright: "Challenge, competition, perseverance, defense.",
        meaningReversed: "Giving up, feeling overwhelmed, losing confidence.",
        symbolism: "A man stands on a hill defending himself against six wands rising from below.",
        keywords: ["Defense", "Perseverance", "Challenge", "Stand Ground"]
    },
    {
        id: 29,
        name: "Eight of Wands",
        suit: "wands",
        meaningUpright: "Speed, action, air travel, movement, swift changes.",
        meaningReversed: "Delays, frustration, slowing down, panic.",
        symbolism: "Eight wands fly through the air at speed, crossing a landscape. Nothing blocks their path.",
        keywords: ["Speed", "Action", "Movement", "Travel"]
    },
    {
        id: 30,
        name: "Nine of Wands",
        suit: "wands",
        meaningUpright: "Resilience, grit, last stand, persistence, test of faith.",
        meaningReversed: "Exhaustion, fatigue, reaching the limit, paranoia.",
        symbolism: "A wounded man leans on a wand, looking over his shoulder. Eight other wands form a fence behind him.",
        keywords: ["Resilience", "Grit", "Persistence", "Fatigue"]
    },
    {
        id: 31,
        name: "Ten of Wands",
        suit: "wands",
        meaningUpright: "Burden, extra responsibility, hard work, completion.",
        meaningReversed: "Collapse, inability to delegate, releasing burdens.",
        symbolism: "A man struggles to carry ten heavy wands towards a town. His back is bent under the weight.",
        keywords: ["Burden", "Responsibility", "Hard Work", "Stress"]
    },
    {
        id: 32,
        name: "Page of Wands",
        suit: "wands",
        meaningUpright: "Exploration, excitement, freedom, a messenger of inspiration.",
        meaningReversed: "Setbacks to new ideas, pessimism, lack of direction.",
        symbolism: "A young man holds a wand, looking at the sprouting leaves. He stands in a desert, ready for adventure.",
        keywords: ["Exploration", "Excitement", "Discovery", "Free Spirit"]
    },
    {
        id: 33,
        name: "Knight of Wands",
        suit: "wands",
        meaningUpright: "Action, adventure, fearlessness, impulsiveness.",
        meaningReversed: "Anger, impulsiveness, recklessness, scattered energy.",
        symbolism: "A knight charges across the desert on a rearing horse. His tunic is decorated with salamanders (fire).",
        keywords: ["Action", "Adventure", "Impulsiveness", "Passion"]
    },
    {
        id: 34,
        name: "Queen of Wands",
        suit: "wands",
        meaningUpright: "Courage, confidence, independence, social butterfly, determination.",
        meaningReversed: "Self-respect, self-confidence, introversion, re-establishing sense of self.",
        symbolism: "A queen sits on a throne decorated with lions. She holds a sunflower (vitality) and a wand.",
        keywords: ["Courage", "Confidence", "Independence", "Vitality"]
    },
    {
        id: 35,
        name: "King of Wands",
        suit: "wands",
        meaningUpright: "Natural-born leader, vision, entrepreneur, honor.",
        meaningReversed: "Impulsiveness, haste, ruthless, high expectations.",
        symbolism: "A king sits on a throne, holding a blossoming wand. A salamander is at his feet. He looks towards the horizon.",
        keywords: ["Leadership", "Vision", "Entrepreneur", "Honor"]
    },

    // --- SUIT OF CUPS (Water / Emotion) ---
    {
        id: 36,
        name: "Ace of Cups",
        suit: "cups",
        meaningUpright: "Love, new relationships, compassion, creativity.",
        meaningReversed: "Self-love, intuition, repressed emotions.",
        symbolism: "A hand holds a cup overflowing with five streams of water. A dove descends with a wafer.",
        keywords: ["Love", "New Feelings", "Intuition", "Spirituality"]
    },
    {
        id: 37,
        name: "Two of Cups",
        suit: "cups",
        meaningUpright: "Unified love, partnership, mutual attraction.",
        meaningReversed: "Self-love, break-ups, disharmony, distrust.",
        symbolism: "A man and a woman exchange cups. The Caduceus of Hermes floats above them.",
        keywords: ["Partnership", "Unity", "Love", "Connection"]
    },
    {
        id: 38,
        name: "Three of Cups",
        suit: "cups",
        meaningUpright: "Celebration, friendship, creativity, collaborations.",
        meaningReversed: "Independence, alone time, gossiping, stifled creativity.",
        symbolism: "Three women dance in a circle, raising their cups in a toast.",
        keywords: ["Friendship", "Community", "Celebration", "Joy"]
    },
    {
        id: 39,
        name: "Four of Cups",
        suit: "cups",
        meaningUpright: "Meditation, contemplation, apathy, re-evaluation.",
        meaningReversed: "Retreat, withdrawal, checking in for alignment.",
        symbolism: "A young man sits under a tree, arms crossed. He ignores a cup being offered by a hand from a cloud.",
        keywords: ["Apathy", "Contemplation", "Disconnected", "Boredom"]
    },
    {
        id: 40,
        name: "Five of Cups",
        suit: "cups",
        meaningUpright: "Loss, grief, self-pity, regret, focusing on the negative.",
        meaningReversed: "Acceptance, moving on, finding peace.",
        symbolism: "A figure in a black cloak looks down at three spilled cups. Two standing cups are behind him.",
        keywords: ["Loss", "Grief", "Regret", "Disappointment"]
    },
    {
        id: 41,
        name: "Six of Cups",
        suit: "cups",
        meaningUpright: "Nostalgia, childhood memories, innocence, joy.",
        meaningReversed: "Living in the past, forgiveness, lacking playfulness.",
        symbolism: "Two children stand in a garden. One offers a cup filled with flowers to the other.",
        keywords: ["Nostalgia", "Childhood", "Memories", "Innocence"]
    },
    {
        id: 42,
        name: "Seven of Cups",
        suit: "cups",
        meaningUpright: "Choices, fantasy, illusion, wishful thinking.",
        meaningReversed: "Alignment, personal values, overwhelming choices.",
        symbolism: "A figure stands before seven cups filled with strange gifts (snake, dragon, jewels, etc.) floating in clouds.",
        keywords: ["Choices", "Fantasy", "Illusion", "Dreams"]
    },
    {
        id: 43,
        name: "Eight of Cups",
        suit: "cups",
        meaningUpright: "Walking away, disillusionment, leaving behind, withdrawal.",
        meaningReversed: "Avoidance, fear of change, fear of loss.",
        symbolism: "A figure walks away from eight stacked cups, heading into the mountains under a moon.",
        keywords: ["Walking Away", "Disillusionment", "Leaving", "Searching"]
    },
    {
        id: 44,
        name: "Nine of Cups",
        suit: "cups",
        meaningUpright: "Contentment, satisfaction, gratitude, wish come true.",
        meaningReversed: "Inner happiness, materialism, dissatisfaction.",
        symbolism: "A well-fed man sits contentedly before nine cups arranged in an arch.",
        keywords: ["Contentment", "Satisfaction", "Gratitude", "Wishes"]
    },
    {
        id: 45,
        name: "Ten of Cups",
        suit: "cups",
        meaningUpright: "Divine love, blissful relationships, harmony, alignment.",
        meaningReversed: "Disconnection, misaligned values, struggling relationships.",
        symbolism: "A couple stands with arms raised, children dancing nearby. A rainbow of ten cups arches overhead.",
        keywords: ["Harmony", "Marriage", "Happiness", "Alignment"]
    },
    {
        id: 46,
        name: "Page of Cups",
        suit: "cups",
        meaningUpright: "Creative opportunities, intuitive messages, curiosity.",
        meaningReversed: "New ideas, doubting intuition, creative blocks.",
        symbolism: "A youth stands by the sea holding a cup with a fish popping out.",
        keywords: ["Creativity", "Intuition", "Curiosity", "Message"]
    },
    {
        id: 47,
        name: "Knight of Cups",
        suit: "cups",
        meaningUpright: "Creativity, romance, charm, imagination, beauty.",
        meaningReversed: "Overactive imagination, unrealistic, jealous, moody.",
        symbolism: "A knight rides a slow-moving white horse. He holds a cup as if offering a gift.",
        keywords: ["Romance", "Charm", "Imagination", "Beauty"]
    },
    {
        id: 48,
        name: "Queen of Cups",
        suit: "cups",
        meaningUpright: "Compassionate, caring, emotionally stable, intuitive.",
        meaningReversed: "Inner feelings, self-care, self-love, co-dependency.",
        symbolism: "A queen sits on a throne by the sea. She holds a beautiful cup, staring into it intently.",
        keywords: ["Compassion", "Caring", "Intuition", "Emotional Stability"]
    },
    {
        id: 49,
        name: "King of Cups",
        suit: "cups",
        meaningUpright: "Emotionally balanced, compassionate, diplomatic.",
        meaningReversed: "Self-compassion, inner feelings, moodiness.",
        symbolism: "A king sits on a throne floating on the sea. He holds a cup and a sceptre.",
        keywords: ["Emotional Balance", "Compassion", "Diplomacy", "Control"]
    },

    // --- SUIT OF SWORDS (Air / Intellect) ---
    {
        id: 50,
        name: "Ace of Swords",
        suit: "swords",
        meaningUpright: "Breakthroughs, new ideas, mental clarity, success.",
        meaningReversed: "Inner clarity, re-thinking an idea, clouded judgement.",
        symbolism: "A hand coming out of a cloud holds a sword, encircled by a crown.",
        keywords: ["Breakthrough", "Clarity", "New Ideas", "Truth"]
    },
    {
        id: 51,
        name: "Two of Swords",
        suit: "swords",
        meaningUpright: "Difficult decisions, weighing options, an impasse, avoidance.",
        meaningReversed: "Indecision, confusion, information overload.",
        symbolism: "A blindfolded woman holds two swords crossed over her chest. She sits before a calm sea.",
        keywords: ["Indecision", "Stalemate", "Balance", "Blocked"]
    },
    {
        id: 52,
        name: "Three of Swords",
        suit: "swords",
        meaningUpright: "Heartbreak, emotional pain, sorrow, grief, hurt.",
        meaningReversed: "Negative self-talk, releasing pain, optimism.",
        symbolism: "A heart is pierced by three swords. Rain falls in the background.",
        keywords: ["Heartbreak", "Grief", "Sorrow", "Pain"]
    },
    {
        id: 53,
        name: "Four of Swords",
        suit: "swords",
        meaningUpright: "Rest, relaxation, meditation, contemplation, recuperation.",
        meaningReversed: "Exhaustion, burn-out, deep contemplation.",
        symbolism: "A knight lies on a tomb, hands in prayer. Three swords hang above him, one lies beneath.",
        keywords: ["Rest", "Recuperation", "Meditation", "Pause"]
    },
    {
        id: 54,
        name: "Five of Swords",
        suit: "swords",
        meaningUpright: "Conflict, disagreements, competition, defeat, winning at all costs.",
        meaningReversed: "Reconciliation, making amends, past resentment.",
        symbolism: "A man smiles smugly as two others walk away defeated. He collects their swords.",
        keywords: ["Conflict", "Defeat", "Betrayal", "Win at all costs"]
    },
    {
        id: 55,
        name: "Six of Swords",
        suit: "swords",
        meaningUpright: "Transition, change, rite of passage, releasing baggage.",
        meaningReversed: "Personal transition, resistance to change.",
        symbolism: "A woman and child are rowed across a body of water. Six swords stand in the boat.",
        keywords: ["Transition", "Moving On", "Travel", "Change"]
    },
    {
        id: 56,
        name: "Seven of Swords",
        suit: "swords",
        meaningUpright: "Betrayal, deception, getting away with something, stealth.",
        meaningReversed: "Mental challenges, breaking free, impostor syndrome.",
        symbolism: "A man sneaks away from a camp carrying five swords. He looks back at the two he left.",
        keywords: ["Deception", "Stealth", "Betrayal", "Trickery"]
    },
    {
        id: 57,
        name: "Eight of Swords",
        suit: "swords",
        meaningUpright: "Negative self-talk, incarceration, self-imposed restriction.",
        meaningReversed: "Self-acceptance, new perspectives, freedom.",
        symbolism: "A woman is bound and blindfolded, surrounded by eight swords.",
        keywords: ["Restriction", "Trapped", "Fear", "Anxiety"]
    },
    {
        id: 58,
        name: "Nine of Swords",
        suit: "swords",
        meaningUpright: "Anxiety, worry, fear, depression, nightmares.",
        meaningReversed: "Inner turmoil, deep-seated fears, release.",
        symbolism: "A person sits up in bed, head in hands. Nine swords hang on the wall behind them.",
        keywords: ["Anxiety", "Worry", "Fear", "Nightmares"]
    },
    {
        id: 59,
        name: "Ten of Swords",
        suit: "swords",
        meaningUpright: "Painful endings, deep wounds, betrayal, loss, crisis.",
        meaningReversed: "Recovery, regeneration, resisting an inevitable end.",
        symbolism: "A man lies dead with ten swords in his back. The sky is black, but a dawn breaks.",
        keywords: ["Ruin", "Failure", "Bitterness", "Rock Bottom"]
    },
    {
        id: 60,
        name: "Page of Swords",
        suit: "swords",
        meaningUpright: "New ideas, curiosity, thirst for knowledge, new ways of communicating.",
        meaningReversed: "Self-expression, all talk and no action.",
        symbolism: "A young man holds a sword, looking ready for battle. Clouds and wind blow around him.",
        keywords: ["Curiosity", "Ideas", "Communication", "Truth"]
    },
    {
        id: 61,
        name: "Knight of Swords",
        suit: "swords",
        meaningUpright: "Action, impulsiveness, speed, ambition, seized by an idea.",
        meaningReversed: "Unfocused, impulsive, burn-out.",
        symbolism: "A knight charges forward on a horse, sword raised high. The wind is fierce.",
        keywords: ["Action", "Speed", "Ambition", "Impulsive"]
    },
    {
        id: 62,
        name: "Queen of Swords",
        suit: "swords",
        meaningUpright: "Independent, unbiased judgement, clear boundaries, direct communication.",
        meaningReversed: "Overly-emotional, easily influenced, bitchy.",
        symbolism: "A queen sits on a throne, holding a sword upright. She looks to the side with a stern expression.",
        keywords: ["Independence", "Perception", "Clear Minded", "Boundaries"]
    },
    {
        id: 63,
        name: "King of Swords",
        suit: "swords",
        meaningUpright: "Mental clarity, intellectual power, authority, truth.",
        meaningReversed: "Quiet power, inner truth, misuse of power.",
        symbolism: "A king sits on a throne holding a sword. He looks straight ahead, exuding authority.",
        keywords: ["Intellect", "Authority", "Truth", "Clarity"]
    },

    // --- SUIT OF PENTACLES (Earth / Material) ---
    {
        id: 64,
        name: "Ace of Pentacles",
        suit: "pentacles",
        meaningUpright: "A new financial or career opportunity, manifestation, abundance.",
        meaningReversed: "Lost opportunity, lack of planning and foresight.",
        symbolism: "A hand from a cloud holds a gold coin. Beneath is a lush garden.",
        keywords: ["Opportunity", "Prosperity", "New Venture", "Abundance"]
    },
    {
        id: 65,
        name: "Two of Pentacles",
        suit: "pentacles",
        meaningUpright: "Multiple priorities, time management, adaptability, balance.",
        meaningReversed: "Over-committed, disorganization, reprioritizing.",
        symbolism: "A young man juggles two pentacles. Behind him, ships ride high waves.",
        keywords: ["Balance", "Adaptability", "Juggling", "Priorities"]
    },
    {
        id: 66,
        name: "Three of Pentacles",
        suit: "pentacles",
        meaningUpright: "Teamwork, collaboration, learning, implementation.",
        meaningReversed: "Disharmony, misalignment, working alone.",
        symbolism: "A sculptor works on a church, consulting with two monks/architects.",
        keywords: ["Teamwork", "Collaboration", "Skill", "Quality"]
    },
    {
        id: 67,
        name: "Four of Pentacles",
        suit: "pentacles",
        meaningUpright: "Saving money, security, conservatism, scarcity, control.",
        meaningReversed: "Over-spending, greed, self-protection.",
        symbolism: "A man clutches four pentacles tight—one on head, one on chest, two under feet.",
        keywords: ["Security", "Greed", "Possession", "Control"]
    },
    {
        id: 68,
        name: "Five of Pentacles",
        suit: "pentacles",
        meaningUpright: "Financial loss, poverty, lack mindset, isolation, worry.",
        meaningReversed: "Recovery from financial loss, spiritual poverty.",
        symbolism: "Two beggars walk in the snow past a lit church window.",
        keywords: ["Poverty", "Loss", "Isolation", "Insecurity"]
    },
    {
        id: 69,
        name: "Six of Pentacles",
        suit: "pentacles",
        meaningUpright: "Giving, receiving, sharing wealth, generosity, charity.",
        meaningReversed: "Self-care, unpaid debts, one-sided charity.",
        symbolism: "A merchant weighs coins in a scale and gives to beggars.",
        keywords: ["Generosity", "Charity", "Giving", "Sharing"]
    },
    {
        id: 70,
        name: "Seven of Pentacles",
        suit: "pentacles",
        meaningUpright: "Long-term view, sustainable results, perseverance, investment.",
        meaningReversed: "Lack of long-term vision, limited success.",
        symbolism: "A man leans on his hoe, gazing at seven pentacles growing on a bush.",
        keywords: ["Patience", "Investment", "Sustainability", "Growth"]
    },
    {
        id: 71,
        name: "Eight of Pentacles",
        suit: "pentacles",
        meaningUpright: "Apprenticeship, repetitive tasks, mastery, skill development.",
        meaningReversed: "Self-development, perfectionism, misdirected activity.",
        symbolism: "A young man intently hammers a pentacle. Seven others hang on the wall.",
        keywords: ["Apprenticeship", "Mastery", "Skill", "Detail"]
    },
    {
        id: 72,
        name: "Nine of Pentacles",
        suit: "pentacles",
        meaningUpright: "Abundance, luxury, self-sufficiency, financial independence.",
        meaningReversed: "Self-worth, over-investment in work, hustling.",
        symbolism: "A woman stands in a vineyard with a falcon. She wears rich robes.",
        keywords: ["Luxury", "Independence", "Self-sufficiency", "Reward"]
    },
    {
        id: 73,
        name: "Ten of Pentacles",
        suit: "pentacles",
        meaningUpright: "Wealth, financial security, family, long-term success.",
        meaningReversed: "The dark side of wealth, financial failure, loss.",
        symbolism: "An old man sits in an archway with his family and dogs. Ten pentacles are superimposed.",
        keywords: ["Wealth", "Legacy", "Family", "Inheritance"]
    },
    {
        id: 74,
        name: "Page of Pentacles",
        suit: "pentacles",
        meaningUpright: "Manifestation, financial opportunity, skill development.",
        meaningReversed: "Lack of progress, procrastination, learn from failure.",
        symbolism: "A young man holds a pentacle up, examining it closely.",
        keywords: ["Manifestation", "Opportunity", "Study", "New Venture"]
    },
    {
        id: 75,
        name: "Knight of Pentacles",
        suit: "pentacles",
        meaningUpright: "Hard work, productivity, routine, conservatism.",
        meaningReversed: "Self-discipline, boredom, feeling stuck.",
        symbolism: "A knight sits on a stopped black horse, looking at a pentacle.",
        keywords: ["Efficiency", "Routine", "Conservatism", "Hard Work"]
    },
    {
        id: 76,
        name: "Queen of Pentacles",
        suit: "pentacles",
        meaningUpright: "Nurturing, practical, providing financially, a working parent.",
        meaningReversed: "Financial independence, self-care, work-home conflict.",
        symbolism: "A queen sits on a throne amidst nature. She holds a pentacle and looks at it with care.",
        keywords: ["Nurturing", "Practicality", "Provider", "Security"]
    },
    {
        id: 77,
        name: "King of Pentacles",
        suit: "pentacles",
        meaningUpright: "Wealth, business, leadership, security, discipline, abundance.",
        meaningReversed: "Financially inept, obsessed with wealth and status, stubborn.",
        symbolism: "A king sits on a throne decorated with bulls. He holds a scepter and a coin. Vines grow around him.",
        keywords: ["Wealth", "Business", "Leadership", "Security"]
    }
];

// Re-export majorArcana for backward compatibility (subset)
export const majorArcana = tarotDeck.slice(0, 22);
