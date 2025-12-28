// app/compare/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DateDropdown } from '@/components/ui/DateDropdown';
import { calculateAllNumbers, isValidDate } from '@/utils/numerology/calculator';
import { getNumberMeaning } from '@/utils/numerology/meanings';
import { getCompatibilityRating, getAspectAdvice } from '@/utils/numerology/compatibility-data';
import { createClient } from '@/utils/supabase/client';
import { getUserWithReading } from '@/utils/supabase/numera-queries';
import { useToast } from '@/components/ui/Toasts/use-toast';
import {
  Heart,
  Sparkles,
  Brain,
  Smile,
  GitCompare,
  TrendingUp,
  TrendingDown,
  Zap,
  Layers,
  Info,
  AlertTriangle,
  Minus,
  Loader2,
  ArrowLeft
} from 'lucide-react';

interface ComparisonResults {
  synergyScore: number;
  aspects: {
    lifePath: { score: number };
    soulUrge: { score: number };
    expression: { score: number };
    personality: { score: number };
  };
  strongest: { name: string; score: number };
  weakest: { name: string; score: number };
  challenges: string[];
  person1Numbers: {
    lifePathNumber: number;
    lifePathRaw: number;
    expressionNumber: number;
    expressionRaw: number;
    soulUrgeNumber: number;
    soulUrgeRaw: number;
    personalityNumber: number;
    personalityRaw: number;
  };
  person2Numbers: {
    lifePathNumber: number;
    lifePathRaw: number;
    expressionNumber: number;
    expressionRaw: number;
    soulUrgeNumber: number;
    soulUrgeRaw: number;
    personalityNumber: number;
    personalityRaw: number;
  };
}

interface PersonProfile {
  name: string;
  traits: {
    lifePath: {
      core_identity: Record<string, number>;
      emotional_nature: Record<string, number>;
      communication_style: Record<string, number>;
    };
  };
}

const relationshipOptions = [
  { value: 'general', label: 'General Compatibility' },
  { value: 'romantic', label: 'Romantic Partnership' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'family', label: 'Family' }
];

export default function ComparePage() {
  const router = useRouter();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [person1Data, setPerson1Data] = useState<any>(null);

  const [firstName1, setFirstName1] = useState('');
  const [middleName1, setMiddleName1] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [dobMonth1, setDobMonth1] = useState('');
  const [dobDay1, setDobDay1] = useState('');
  const [dobYear1, setDobYear1] = useState('');

  const [firstName2, setFirstName2] = useState('');
  const [middleName2, setMiddleName2] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [dobMonth2, setDobMonth2] = useState('');
  const [dobDay2, setDobDay2] = useState('');
  const [dobYear2, setDobYear2] = useState('');

  const [relationshipType, setRelationshipType] = useState('general');

  const [calculating, setCalculating] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResults | null>(null);
  const [person1Profile, setPerson1Profile] = useState<PersonProfile | null>(null);
  const [person2Profile, setPerson2Profile] = useState<PersonProfile | null>(null);
  const [showDetailedTraits, setShowDetailedTraits] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = Math.random() > 0.7 ? '#8A2BE2' : '#E5E4E2';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 1.5;
          const directionY = forceDirectionY * force * 1.5;

          this.x += directionX;
          this.y += directionY;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.shadowBlur = 2;
        ctx!.shadowColor = this.color;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.floor((canvas!.width * canvas!.height) / 40000);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx!.beginPath();
            const opacity = 1 - distance / 80;
            ctx!.strokeStyle = `rgba(229, 228, 226, ${opacity * 0.15})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
        particles[a].update();
        particles[a].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top - 1; // Offset slightly above the mouse
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const supabase = createClient();
        const userWithReading = await getUserWithReading(supabase as any);

        if (!userWithReading || !userWithReading.reading) {
          toast({
            title: "Profile Required",
            description: "You need to have a saved numerology profile to use the compare feature. Redirecting...",
            variant: "destructive"
          });
          setTimeout(() => {
            router.push('/reading');
          }, 2000);
          return;
        }

        const reading = userWithReading.reading;
        setHasProfile(true);
        setPerson1Data(reading);

        if (reading.date_of_birth_encrypted) {
          const dobString = typeof reading.date_of_birth_encrypted === 'string'
            ? reading.date_of_birth_encrypted
            : reading.date_of_birth_encrypted.toString();

          const dobParts = dobString.split('/');
          if (dobParts.length === 3) {
            setDobMonth1(dobParts[0]);
            setDobDay1(dobParts[1]);
            setDobYear1(dobParts[2]);
          }
        }

        setFirstName1(reading.first_name_entered || '');
        setMiddleName1(reading.middle_name_entered || '');
        setLastName1(reading.last_name_entered || '');

      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router, toast]);

  const dob1 = dobMonth1 && dobDay1 && dobYear1 ? `${dobMonth1}/${dobDay1}/${dobYear1}` : '';
  const dob2 = dobMonth2 && dobDay2 && dobYear2 ? `${dobMonth2}/${dobDay2}/${dobYear2}` : '';

  const isFormValid =
    firstName2.trim().length >= 1 &&
    lastName2.trim().length >= 1 &&
    dobMonth2 !== '' &&
    dobDay2 !== '' &&
    dobYear2 !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidDate(dob2)) {
      toast({
        title: "Invalid Date",
        description: "Please enter a valid date for Person 2",
        variant: "destructive"
      });
      return;
    }

    setCalculating(true);

    try {
      const person1Results = person1Data?.calculations || calculateAllNumbers(
        firstName1.trim(),
        middleName1.trim(),
        lastName1.trim(),
        dob1
      );

      const person2Results = calculateAllNumbers(
        firstName2.trim(),
        middleName2.trim(),
        lastName2.trim(),
        dob2
      );

      const lifePathScore = calculateCompatibilityScore(
        person1Results.lifePathNumber,
        person2Results.lifePathNumber
      );
      const soulUrgeScore = calculateCompatibilityScore(
        person1Results.soulUrgeNumber,
        person2Results.soulUrgeNumber
      );
      const expressionScore = calculateCompatibilityScore(
        person1Results.expressionNumber,
        person2Results.expressionNumber
      );
      const personalityScore = calculateCompatibilityScore(
        person1Results.personalityNumber,
        person2Results.personalityNumber
      );

      const synergyScore = Math.round(
        (lifePathScore * 0.35 + soulUrgeScore * 0.30 + expressionScore * 0.20 + personalityScore * 0.15)
      );

      const aspects = [
        { name: 'Life Path', score: lifePathScore },
        { name: 'Soul Urge', score: soulUrgeScore },
        { name: 'Expression', score: expressionScore },
        { name: 'Personality', score: personalityScore }
      ];
      const strongest = aspects.reduce((max, aspect) => aspect.score > max.score ? aspect : max);
      const weakest = aspects.reduce((min, aspect) => aspect.score < min.score ? aspect : min);

      const challenges: string[] = [];
      if (lifePathScore < 60) challenges.push('Different life directions may require compromise');
      if (soulUrgeScore < 60) challenges.push('Emotional needs may not naturally align');
      if (expressionScore < 60) challenges.push('Different approaches to achieving goals');
      if (personalityScore < 60) challenges.push('Contrasting social styles and first impressions');

      setComparisonResults({
        synergyScore,
        aspects: {
          lifePath: { score: lifePathScore },
          soulUrge: { score: soulUrgeScore },
          expression: { score: expressionScore },
          personality: { score: personalityScore }
        },
        strongest,
        weakest,
        challenges,
        person1Numbers: {
          lifePathNumber: person1Results.lifePathNumber,
          lifePathRaw: person1Results.lifePathRaw || person1Results.lifePathNumber,
          expressionNumber: person1Results.expressionNumber,
          expressionRaw: person1Results.expressionRaw || person1Results.expressionNumber,
          soulUrgeNumber: person1Results.soulUrgeNumber,
          soulUrgeRaw: person1Results.soulUrgeRaw || person1Results.soulUrgeNumber,
          personalityNumber: person1Results.personalityNumber,
          personalityRaw: person1Results.personalityRaw || person1Results.personalityNumber
        },
        person2Numbers: {
          lifePathNumber: person2Results.lifePathNumber,
          lifePathRaw: person2Results.lifePathRaw,
          expressionNumber: person2Results.expressionNumber,
          expressionRaw: person2Results.expressionRaw,
          soulUrgeNumber: person2Results.soulUrgeNumber,
          soulUrgeRaw: person2Results.soulUrgeRaw,
          personalityNumber: person2Results.personalityNumber,
          personalityRaw: person2Results.personalityRaw
        }
      });

      setPerson1Profile({
        name: `${firstName1} ${lastName1}`,
        traits: {
          lifePath: {
            core_identity: { independence: 75, creativity: 60, leadership: 80 },
            emotional_nature: { sensitivity: 70, passion: 65, stability: 55 },
            communication_style: { directness: 85, expressiveness: 70, listening: 60 }
          }
        }
      });

      setPerson2Profile({
        name: `${firstName2} ${lastName2}`,
        traits: {
          lifePath: {
            core_identity: { independence: 65, creativity: 80, leadership: 70 },
            emotional_nature: { sensitivity: 80, passion: 75, stability: 65 },
            communication_style: { directness: 70, expressiveness: 85, listening: 75 }
          }
        }
      });

      setTimeout(() => {
        setCalculating(false);
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "An error occurred while analyzing compatibility",
        variant: "destructive"
      });
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setComparisonResults(null);
    setPerson1Profile(null);
    setPerson2Profile(null);
    setShowDetailedTraits(false);
    setFirstName2('');
    setMiddleName2('');
    setLastName2('');
    setDobMonth2('');
    setDobDay2('');
    setDobYear2('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function calculateCompatibilityScore(num1: number, num2: number): number {
    const diff = Math.abs(num1 - num2);
    if (diff === 0) return 100;
    if (diff === 1 || diff === 8) return 85;
    if (diff === 2 || diff === 7) return 75;
    if (diff === 3 || diff === 6) return 65;
    if (diff === 4 || diff === 5) return 55;
    return 50;
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-black text-white flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-60"
          style={{ zIndex: 0 }}
        />
        <div className="text-center relative" style={{ zIndex: 1 }}>
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (!hasProfile) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-black text-white flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-60"
          style={{ zIndex: 0 }}
        />
        <div className="text-center max-w-md px-6 relative" style={{ zIndex: 1 }}>
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-light mb-4">Profile Required</h1>
          <p className="text-gray-400 mb-6">
            You need to have a saved numerology profile to use the compare feature.
          </p>
          <p className="text-sm text-gray-500">Redirecting to reading page...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-black text-white">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full opacity-60"
        style={{ zIndex: 0 }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-16" style={{ zIndex: 1 }}>
        {/* Back Arrow */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Library</span>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">
            {comparisonResults ? 'Synergy Analysis' : 'Compare Compatibility'}
          </h1>
          <p className="text-gray-400 text-lg font-light">
            {comparisonResults
              ? 'Discover the dynamics between two numerology profiles'
              : 'Enter their information to analyze compatibility with your profile'}
          </p>
        </div>

        {!comparisonResults ? (
          <>
            <div className="mb-8">
              <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium mb-3">
                Relationship Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {relationshipOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRelationshipType(option.value)}
                    className={`px-4 py-3 text-sm font-medium transition-all ${relationshipType === option.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 p-8 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-purple-400">Your Profile</h2>
                  <span className="text-xs uppercase tracking-wider text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                    Saved Data
                  </span>
                </div>
                <div className="space-y-6 opacity-75">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName1}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={middleName1}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName1}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/20 p-8 rounded-lg">
                <h2 className="text-2xl font-light mb-6 text-pink-400">Their Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={firstName2}
                        onChange={(e) => setFirstName2(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={middleName2}
                        onChange={(e) => setMiddleName2(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={lastName2}
                        onChange={(e) => setLastName2(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium mb-2">
                      Date of Birth *
                    </label>
                    <DateDropdown
                      month={dobMonth2}
                      day={dobDay2}
                      year={dobYear2}
                      onMonthChange={setDobMonth2}
                      onDayChange={setDobDay2}
                      onYearChange={setDobYear2}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || calculating}
                className={`w-full py-4 text-lg font-medium transition-all duration-300 ${isFormValid && !calculating
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105 shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 text-gray-600 cursor-not-allowed'
                  }`}
              >
                {calculating ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing Synergy...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <GitCompare className="w-5 h-5" />
                    Analyze Synergy
                  </span>
                )}
              </button>
            </form>
          </>
        ) : (
          <div id="results" className="animate-fade-in-up">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                  {relationshipOptions.find(opt => opt.value === relationshipType)?.label} Synergy
                </div>
              </div>

              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-20 rounded-full"></div>
                <div className="relative bg-black/50 border border-white/10 p-12 rounded-full w-64 h-64 flex flex-col items-center justify-center backdrop-blur-sm">
                  <div className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    {comparisonResults.synergyScore}%
                  </div>
                  <div className="text-gray-400 mt-2 font-light uppercase tracking-widest text-sm">Total Synergy</div>
                </div>
              </div>

              <p className="text-gray-300 text-xl mt-8 font-light">
                {comparisonResults.synergyScore >= 85 ? '🌟 An Extraordinary Match' :
                  comparisonResults.synergyScore >= 70 ? '✨ Highly Compatible' :
                    comparisonResults.synergyScore >= 50 ? '🤝 Balanced Connection' :
                      '⚡ Growth-Oriented Match'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 border border-green-500/30 p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-24 h-24" />
                </div>
                <h3 className="text-sm uppercase tracking-wider text-green-400 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Strongest Link
                </h3>
                <div className="text-2xl font-semibold mb-1">{comparisonResults.strongest.name}</div>
                <div className="text-4xl font-bold text-white mb-2">{comparisonResults.strongest.score}%</div>
                <p className="text-sm text-gray-400">
                  Your natural flow is in your {comparisonResults.strongest.name.toLowerCase()} connection.
                </p>
              </div>

              <div className="bg-white/5 border border-yellow-500/30 p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingDown className="w-24 h-24" />
                </div>
                <h3 className="text-sm uppercase tracking-wider text-yellow-400 mb-2 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> Growth Area
                </h3>
                <div className="text-2xl font-semibold mb-1">{comparisonResults.weakest.name}</div>
                <div className="text-4xl font-bold text-white mb-2">{comparisonResults.weakest.score}%</div>
                <p className="text-sm text-gray-400">
                  You may experience friction in your {comparisonResults.weakest.name.toLowerCase()} dynamic.
                </p>
              </div>

              <div className="bg-white/5 border border-white/20 p-6 rounded-lg">
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> The Numbers
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">You</div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span>LP</span>
                      <span>{comparisonResults.person1Numbers.lifePathRaw !== comparisonResults.person1Numbers.lifePathNumber ? `${comparisonResults.person1Numbers.lifePathRaw}/${comparisonResults.person1Numbers.lifePathNumber}` : comparisonResults.person1Numbers.lifePathNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1 mt-1">
                      <span>Exp</span>
                      <span>{comparisonResults.person1Numbers.expressionRaw !== comparisonResults.person1Numbers.expressionNumber ? `${comparisonResults.person1Numbers.expressionRaw}/${comparisonResults.person1Numbers.expressionNumber}` : comparisonResults.person1Numbers.expressionNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1 mt-1">
                      <span>Soul</span>
                      <span>{comparisonResults.person1Numbers.soulUrgeRaw !== comparisonResults.person1Numbers.soulUrgeNumber ? `${comparisonResults.person1Numbers.soulUrgeRaw}/${comparisonResults.person1Numbers.soulUrgeNumber}` : comparisonResults.person1Numbers.soulUrgeNumber}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Pers</span>
                      <span>{comparisonResults.person1Numbers.personalityRaw !== comparisonResults.person1Numbers.personalityNumber ? `${comparisonResults.person1Numbers.personalityRaw}/${comparisonResults.person1Numbers.personalityNumber}` : comparisonResults.person1Numbers.personalityNumber}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Them</div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span>LP</span>
                      <span>{comparisonResults.person2Numbers.lifePathRaw !== comparisonResults.person2Numbers.lifePathNumber ? `${comparisonResults.person2Numbers.lifePathRaw}/${comparisonResults.person2Numbers.lifePathNumber}` : comparisonResults.person2Numbers.lifePathNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1 mt-1">
                      <span>Exp</span>
                      <span>{comparisonResults.person2Numbers.expressionRaw !== comparisonResults.person2Numbers.expressionNumber ? `${comparisonResults.person2Numbers.expressionRaw}/${comparisonResults.person2Numbers.expressionNumber}` : comparisonResults.person2Numbers.expressionNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1 mt-1">
                      <span>Soul</span>
                      <span>{comparisonResults.person2Numbers.soulUrgeRaw !== comparisonResults.person2Numbers.soulUrgeNumber ? `${comparisonResults.person2Numbers.soulUrgeRaw}/${comparisonResults.person2Numbers.soulUrgeNumber}` : comparisonResults.person2Numbers.soulUrgeNumber}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Pers</span>
                      <span>{comparisonResults.person2Numbers.personalityRaw !== comparisonResults.person2Numbers.personalityNumber ? `${comparisonResults.person2Numbers.personalityRaw}/${comparisonResults.person2Numbers.personalityNumber}` : comparisonResults.person2Numbers.personalityNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-light mb-8 text-center">Detailed Aspect Analysis</h2>
              <div className="space-y-6">
                <AspectCard
                  title="Life Path Compatibility"
                  score={comparisonResults.aspects.lifePath.score}
                  description="Compatibility in life purpose, direction, and core values."
                  icon={Heart}
                  color="purple"
                  num1={comparisonResults.person1Numbers.lifePathNumber}
                  num2={comparisonResults.person2Numbers.lifePathNumber}
                  aspect="lifePath"
                />
                <AspectCard
                  title="Soul Urge Compatibility"
                  score={comparisonResults.aspects.soulUrge.score}
                  description="Emotional resonance, inner desires, and what truly motivates you."
                  icon={Sparkles}
                  color="pink"
                  num1={comparisonResults.person1Numbers.soulUrgeNumber}
                  num2={comparisonResults.person2Numbers.soulUrgeNumber}
                  aspect="soulUrge"
                />
                <AspectCard
                  title="Expression Compatibility"
                  score={comparisonResults.aspects.expression.score}
                  description="How you act, your natural talents, and how you achieve goals together."
                  icon={Brain}
                  color="blue"
                  num1={comparisonResults.person1Numbers.expressionNumber}
                  num2={comparisonResults.person2Numbers.expressionNumber}
                  aspect="expression"
                />
                <AspectCard
                  title="Personality Compatibility"
                  score={comparisonResults.aspects.personality.score}
                  description="First impressions, social style, and outer behavior."
                  icon={Smile}
                  color="green"
                  num1={comparisonResults.person1Numbers.personalityNumber}
                  num2={comparisonResults.person2Numbers.personalityNumber}
                  aspect="personality"
                />
              </div>
            </div>

            {comparisonResults.challenges && comparisonResults.challenges.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-light mb-6 text-center">Shared Growth Areas</h2>
                <div className="bg-white/5 border border-white/20 p-8 rounded-lg">
                  <p className="text-gray-400 mb-6 text-center">
                    Awareness of these potential friction points allows you to navigate them with compassion.
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {comparisonResults.challenges.map((challenge: string, idx: number) => (
                      <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded text-sm flex items-start gap-3">
                        <div className="mt-1 text-purple-400">•</div>
                        {challenge}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <button
                onClick={() => setShowDetailedTraits(!showDetailedTraits)}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white transition-all text-lg font-medium flex items-center gap-2 mx-auto rounded-full"
              >
                <GitCompare className="w-5 h-5" />
                {showDetailedTraits ? 'Hide' : 'Show'} Full Trait Breakdown
              </button>
            </div>

            {showDetailedTraits && person1Profile && person2Profile && (
              <div className="space-y-12 animate-fade-in-up">
                <div className="text-center text-gray-400 mb-4">
                  Comparing Life Path Traits (Primary Influence)
                </div>
                <TraitComparisonSection
                  title="Core Identity"
                  person1Name={person1Profile.name}
                  person2Name={person2Profile.name}
                  traits1={person1Profile.traits.lifePath.core_identity}
                  traits2={person2Profile.traits.lifePath.core_identity}
                />
                <TraitComparisonSection
                  title="Emotional Nature"
                  person1Name={person1Profile.name}
                  person2Name={person2Profile.name}
                  traits1={person1Profile.traits.lifePath.emotional_nature}
                  traits2={person2Profile.traits.lifePath.emotional_nature}
                />
                <TraitComparisonSection
                  title="Communication Style"
                  person1Name={person1Profile.name}
                  person2Name={person2Profile.name}
                  traits1={person1Profile.traits.lifePath.communication_style}
                  traits2={person2Profile.traits.lifePath.communication_style}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <button
                onClick={handleReset}
                className="px-8 py-4 border border-white/20 text-white hover:bg-white/10 transition-all text-lg font-medium rounded-lg"
              >
                Compare with Someone Else
              </button>
              <Link
                href="/explore"
                className="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all text-lg font-medium text-center rounded-lg"
              >
                Library
              </Link>
            </div>
          </div>
        )
        }
      </div >

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </main >
  );
}

function AspectCard({ title, score, description, icon: Icon, color, num1, num2, aspect }: any) {
  const rating = getCompatibilityRating(num1, num2);
  const advice = getAspectAdvice(num1, num2, aspect || 'lifePath');

  const isChallenging = rating === 'Challenging';
  const isNatural = rating === 'Natural Match';

  const getColorClass = (c: string) => {
    if (isChallenging) return 'text-yellow-400 border-yellow-500/30 from-yellow-500/10';

    switch (c) {
      case 'purple': return 'text-purple-400 border-purple-500/30 from-purple-500/10';
      case 'pink': return 'text-pink-400 border-pink-500/30 from-pink-500/10';
      case 'blue': return 'text-blue-400 border-blue-500/30 from-blue-500/10';
      case 'green': return 'text-green-400 border-green-500/30 from-green-500/10';
      default: return 'text-gray-400 border-gray-500/30 from-gray-500/10';
    }
  };

  const colorClasses = getColorClass(color);

  return (
    <div className={`bg-gradient-to-r ${colorClasses} to-transparent border p-6 rounded-lg group hover:border-opacity-100 transition-all`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full bg-black/30 ${isChallenging ? 'text-yellow-400' : colorClasses.split(' ')[0]}`}>
              {isChallenging ? <AlertTriangle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-light">{title}</h3>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="font-semibold">{num1}</span>
                <span className="text-gray-500">vs</span>
                <span className="font-semibold">{num2}</span>
                <span className="mx-2 text-gray-600">|</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${isNatural ? 'bg-green-500/20 text-green-300' :
                  isChallenging ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                  {rating}
                </span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg mb-4 ${isChallenging ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-black/20'}`}>
            <h4 className={`text-sm uppercase tracking-wider mb-2 flex items-center gap-2 ${isChallenging ? 'text-yellow-400' : 'text-gray-400'}`}>
              {isChallenging ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              {isChallenging ? 'Growth Opportunity' : 'What this means for you'}
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {advice}
            </p>
          </div>

          <p className="text-sm text-gray-400 italic">
            {description}
          </p>
        </div>

        <div className="md:w-48 flex flex-col justify-center text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <div className="text-4xl font-bold mb-2">{score}%</div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full bg-current ${isChallenging ? 'text-yellow-400' : colorClasses.split(' ')[0]}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Compatibility</div>
        </div>
      </div>
    </div>
  );
}

interface TraitComparisonSectionProps {
  title: string;
  person1Name: string;
  person2Name: string;
  traits1: Record<string, number>;
  traits2: Record<string, number>;
}

function TraitComparisonSection({ title, person1Name, person2Name, traits1, traits2 }: TraitComparisonSectionProps) {
  return (
    <div className="bg-white/5 border border-white/20 p-8 rounded-lg">
      <h3 className="text-2xl font-light mb-6">{title}</h3>
      <div className="space-y-4">
        {Object.keys(traits1).map((key) => {
          const value1 = traits1[key];
          const value2 = traits2[key];
          const diff = Math.abs(value1 - value2);

          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  {diff > 30 ? (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  ) : diff > 15 ? (
                    <Minus className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  )}
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {diff} diff
                  </span>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-purple-500/50"
                  style={{ width: `${value1}%` }}
                  title={`${person1Name}: ${value1}`}
                />
                <div
                  className="h-full bg-pink-500/50 -ml-1 mix-blend-screen"
                  style={{ width: `${value2}%` }}
                  title={`${person2Name}: ${value2}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
