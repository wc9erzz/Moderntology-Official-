// app/compatibility/page.tsx - UPDATED WITH NEW CALCULATOR
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUserWithReading } from '@/utils/supabase/numera-queries';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calculateLifePathCompatibility } from '@/utils/numerology/compatibility-calculator';
import { calculateAllNumbers, isValidDate, isValidName } from '@/utils/numerology/calculator';
import { ArrowLeft, Heart, Users, Home, Calendar } from 'lucide-react';
import CompatibilityReadingDisplay from '@/components/compatibility/CompatibilityReadingDisplay';

export default function CompatibilityPage() {
  const router = useRouter();
  const [userWithReading, setUserWithReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Form state
  const [person2FirstName, setPerson2FirstName] = useState('');
  const [person2MiddleName, setPerson2MiddleName] = useState('');
  const [person2LastName, setPerson2LastName] = useState('');
  const [person2Dob, setPerson2Dob] = useState('');
  const [context, setContext] = useState<'friendship' | 'romance' | 'family'>('friendship');
  const [error, setError] = useState('');

  // Results state
  const [compatibilityReading, setCompatibilityReading] = useState<any>(null);
  const [person1Name, setPerson1Name] = useState('');
  const [person2Name, setPerson2Name] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/signin');
        return;
      }

      const userData = await getUserWithReading(supabase as any);

      if (!userData?.reading || userData.reading.status !== 'completed') {
        router.push('/reading');
        return;
      }

      setUserWithReading(userData);
      setLoading(false);
    };

    loadUserData();
  }, [router]);

  // Auto-format DOB
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
    setPerson2Dob(value.slice(0, 10));
    setError('');
  };

  const isFormValid =
    person2FirstName.trim().length >= 1 &&
    person2LastName.trim().length >= 1 &&
    /^\d{2}\/\d{2}\/\d{4}$/.test(person2Dob);

  const handleCompare = () => {
    setError('');

    // Validate
    if (!isValidName(person2FirstName, person2LastName)) {
      setError('Please enter valid names (letters only)');
      return;
    }

    if (!isValidDate(person2Dob)) {
      setError('Please enter a valid date in MM/DD/YYYY format');
      return;
    }

    setCalculating(true);

    try {
      const reading = userWithReading.reading;

      // Get person 1 life path
      const person1LifePath = reading.life_path_number;
      const person1FullName = `${reading.first_name_entered} ${reading.last_name_entered}`;

      // Calculate person 2's numbers
      const person2Calcs = calculateAllNumbers(
        person2FirstName.trim(),
        person2MiddleName.trim(),
        person2LastName.trim(),
        person2Dob
      );

      const person2LifePath = person2Calcs.lifePathNumber;
      const person2FullName = `${person2FirstName.trim()} ${person2LastName.trim()}`;

      // Calculate compatibility using new system
      const result = calculateLifePathCompatibility(person1LifePath, person2LifePath);

      setCompatibilityReading(result);
      setPerson1Name(person1FullName);
      setPerson2Name(person2FullName);
      setCalculating(false);

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      console.error('Comparison error:', err);
      setError('An error occurred while analyzing compatibility. Please try again.');
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setPerson2FirstName('');
    setPerson2MiddleName('');
    setPerson2LastName('');
    setPerson2Dob('');
    setCompatibilityReading(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-16 w-16 animate-spin rounded-full border-8 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      {/* Background texture */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 animate-subtle-drift" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Your Reading
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">
            Life Path Compatibility
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Discover how your Life Path numbers interact with another person
          </p>
        </div>

        {!compatibilityReading ? (
          /* Input Form */
          <div className="max-w-2xl mx-auto">
            {/* Your Info Display */}
            <div className="bg-white/5 border border-white/20 p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-400" />
                Your Life Path
              </h2>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Life Path Number</p>
                  <p className="text-6xl font-bold">{userWithReading.reading.life_path_number}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {userWithReading.reading.first_name_entered} {userWithReading.reading.last_name_entered}
                  </p>
                </div>
              </div>
            </div>

            {/* Person 2 Form */}
            <div className="bg-white/5 border border-white/20 p-8">
              <h2 className="text-2xl font-semibold mb-6">Compare With</h2>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={person2FirstName}
                    onChange={(e) => {
                      setPerson2FirstName(e.target.value);
                      setError('');
                    }}
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                    Middle Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={person2MiddleName}
                    onChange={(e) => {
                      setPerson2MiddleName(e.target.value);
                      setError('');
                    }}
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter middle name"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={person2LastName}
                    onChange={(e) => {
                      setPerson2LastName(e.target.value);
                      setError('');
                    }}
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition-colors"
                    placeholder="Enter last name"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm uppercase tracking-wider text-gray-400 font-medium">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={person2Dob}
                      onChange={handleDobChange}
                      placeholder="MM/DD/YYYY"
                      maxLength={10}
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition-colors pr-14"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Example: 03/15/1990</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleCompare}
                  disabled={!isFormValid || calculating}
                  className={`w-full py-4 text-lg font-medium transition-all duration-300 ${isFormValid && !calculating
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105'
                    : 'bg-white/10 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  {calculating ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      Calculating...
                    </span>
                  ) : 'Analyze Compatibility'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Results Display */
          <div id="results">
            <CompatibilityReadingDisplay
              reading={compatibilityReading}
              person1Name={person1Name}
              person2Name={person2Name}
              person1LifePath={userWithReading.reading.life_path_number}
              person2LifePath={compatibilityReading.person2LifePath || 0}
            />

            <div className="flex gap-4 justify-center mt-12">
              <button
                onClick={handleReset}
                className="px-8 py-4 border border-white/20 text-white hover:bg-white/10 transition-all"
              >
                Compare with Someone Else
              </button>
              <Link
                href="/explore"
                className="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all"
              >
                Back to Your Reading
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes subtle-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
        }
        .animate-subtle-drift {
          animation: subtle-drift 60s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}