// app/account/page.tsx - FIXED VERSION
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUserWithReading } from '@/utils/supabase/numera-queries';
import { getAstrologyReadings, saveAstrologyReading } from '@/utils/supabase/astrology-queries';
import { AstrologyReading } from '@/types_astrology';
import Link from 'next/link';
import { LogOut, User, Mail, Calendar, BookOpen, Edit, Star, Settings, Check } from 'lucide-react';

export default function AccountPage() {
  const [profile, setProfile] = useState<any>(null);
  const [reading, setReading] = useState<any>(null);
  const [astrologyReading, setAstrologyReading] = useState<AstrologyReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const data = await getUserWithReading(supabase as any);

        console.log('Loaded data:', data); // Debug log

        if (!data.profile) {
          setError('No profile found');
          setLoading(false);
          return;
        }

        setProfile(data.profile);
        setReading(data.reading);

        // Load Astrology Data
        const astroReadings = await getAstrologyReadings(supabase as any);
        if (astroReadings && astroReadings.length > 0) {
          setAstrologyReading(astroReadings[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading account data:', err);
        setError('Failed to load account data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleToggleDeepView = async () => {
    if (!astrologyReading) return;

    const currentSettings = astrologyReading.chart_data?.user_metadata?.settings || {};
    // Also check top-level settings if they exist
    const topLevelSettings = (astrologyReading as any).settings || {};

    // Determine current state (prioritize existing true/false values)
    const currentState = currentSettings.showExtraPoints ?? topLevelSettings.showExtraPoints ?? true;
    const newState = !currentState;

    const updatedReading: any = {
      ...astrologyReading,
      // Update top-level settings to ensure priority
      settings: {
        ...topLevelSettings,
        showExtraPoints: newState
      },
      chart_data: {
        ...astrologyReading.chart_data,
        user_metadata: {
          ...astrologyReading.chart_data.user_metadata,
          settings: {
            ...currentSettings,
            showExtraPoints: newState
          }
        }
      }
    };

    // Optimistic Update
    setAstrologyReading(updatedReading);

    try {
      const supabase = createClient();
      await saveAstrologyReading(supabase as any, updatedReading);
    } catch (err) {
      console.error("Failed to save setting", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-16 w-16 animate-spin rounded-full border-8 border-white border-t-transparent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <p className="mb-4 text-2xl">{error || 'Not signed in'}</p>
        <p className="mb-8 text-gray-400">Please sign in to view your account</p>
        <Link href="/signin" className="text-xl underline hover:text-gray-300">Sign in →</Link>
      </div>
    );
  }

  const hasReading = !!reading && reading.status === 'completed';

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-light tracking-tight mb-4">Account</h1>
          <p className="text-gray-500">Manage your profile</p>
        </div>

        {/* Profile Information */}
        <div className="space-y-8 border border-white/20 bg-white/5 p-6 md:p-10 mb-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-none border-4 border-white bg-white/10">
              <User className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">Display Name</p>
              <p className="text-2xl font-light">
                {profile.first_name && profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile.full_name
                    ? profile.full_name
                    : profile.email?.split('@')[0] || 'Anonymous'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-none border-4 border-white bg-white/10">
              <Mail className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">Email</p>
              <p className="text-xl font-light">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-none border-4 border-white bg-white/10">
              <Calendar className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">Member Since</p>
              <p className="text-xl font-light">
                {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </div>

        {/* Saved Reading Section */}
        <div className="border border-white/20 bg-white/5 p-6 md:p-10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              <h2 className="text-3xl font-light">Your Numerology Reading</h2>
            </div>
            {hasReading && !profile.is_business_account && (
              <Link
                href="/reading"
                className="flex items-center gap-2 px-4 py-2 border border-white/40 text-white hover:bg-white hover:text-black transition-all text-sm font-medium tracking-wider"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            )}
          </div>

          {hasReading ? (
            <div className="space-y-6">
              {/* Name Display */}
              <div className="pb-4 border-b border-white/10">
                <p className="text-gray-400 text-sm mb-2">Full Name</p>
                <p className="text-2xl font-light">{reading.full_name_entered}</p>
              </div>

              {/* Core Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <NumberDisplay
                  label="Life Path"
                  number={reading.life_path_number}
                  rawNumber={reading.calculations?.rawValues?.lifePathRaw}
                  isPrimary={true}
                />
                <NumberDisplay
                  label="Expression"
                  number={reading.expression_number}
                  rawNumber={reading.calculations?.rawValues?.expressionRaw}
                />
                <NumberDisplay
                  label="Soul Urge"
                  number={reading.soul_urge_number}
                  rawNumber={reading.calculations?.rawValues?.soulUrgeRaw}
                />
                <NumberDisplay
                  label="Personality"
                  number={reading.personality_number}
                  rawNumber={reading.calculations?.rawValues?.personalityRaw}
                />
                <NumberDisplay
                  label="Birthday"
                  number={reading.birthday_number}
                  rawNumber={reading.calculations?.rawValues?.birthdayRaw}
                />
                <NumberDisplay
                  label="Maturity"
                  number={reading.maturity_number}
                  rawNumber={reading.calculations?.rawValues?.maturityRaw}
                />
              </div>

              {/* View Full Reading Button */}
              <div className="pt-6 border-t border-white/10">
                <Link
                  href="/explore"
                  className="block w-full py-4 text-center bg-white text-black hover:bg-gray-200 transition-all text-lg font-medium"
                >
                  View Full Reading & Insights
                </Link>
              </div>

              <div className="text-xs text-gray-600 text-center">
                Last updated: {new Date(reading.last_updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6 opacity-20">
                <BookOpen className="h-24 w-24 mx-auto" />
              </div>
              <h3 className="text-2xl font-light mb-4">No Reading Saved Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Complete a numerology reading to unlock insights about your life path, personality, and destiny.
              </p>
              <Link
                href="/reading"
                className="inline-block bg-white text-black px-8 py-4 text-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Create Your Reading
              </Link>
            </div>
          )}
        </div>

        {/* Saved Astrology Section */}
        <div className="border border-white/20 bg-white/5 p-6 md:p-10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8" />
              <h2 className="text-3xl font-light">Your Astrology Reading</h2>
            </div>
            {astrologyReading && (
              <Link
                href="/reading/astrology"
                className="flex items-center gap-2 px-4 py-2 border border-white/40 text-white hover:bg-white hover:text-black transition-all text-sm font-medium tracking-wider"
              >
                <Edit className="h-4 w-4" />
                New Chart
              </Link>
            )}
          </div>

          {astrologyReading ? (
            <div className="space-y-6">
              <div className="pb-4 border-b border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Birth Details</p>
                  <p className="text-xl font-light">
                    {(() => {
                      const [year, month, day] = astrologyReading.date_of_birth.split('-').map(Number);
                      return new Date(year, month - 1, day).toLocaleDateString();
                    })()} @ {astrologyReading.time_of_birth}
                  </p>
                  <p className="text-gray-500 text-sm">{astrologyReading.birth_city}, {astrologyReading.birth_country}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs uppercase px-2 py-1 rounded border ${astrologyReading.system === 'vedic' ? 'border-blue-500 text-blue-400' : 'border-purple-500 text-purple-400'}`}>
                    {astrologyReading.system}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 text-center">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Sun</h4>
                  <p className="text-lg font-medium">{astrologyReading.chart_data.points.Sun?.sign || '—'}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 text-center">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Moon</h4>
                  <p className="text-lg font-medium">{astrologyReading.chart_data.points.Moon?.sign || '—'}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 text-center">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Ascendant</h4>
                  <p className="text-lg font-medium">{astrologyReading.chart_data.angles.Ascendant?.sign || '—'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link
                  href="/explore/astrology"
                  className="block w-full py-4 text-center bg-white text-black hover:bg-gray-200 transition-all text-lg font-medium"
                >
                  View Full Chart & Analysis
                </Link>
              </div>

              <div className="text-xs text-gray-600 text-center">
                Last updated: {new Date(astrologyReading.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6 opacity-20">
                <Star className="h-24 w-24 mx-auto" />
              </div>
              <h3 className="text-2xl font-light mb-4">No Chart Saved Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Map the stars at your birth to discover your celestial blueprint.
              </p>
              <Link
                href="/reading/astrology"
                className="inline-block bg-white text-black px-8 py-4 text-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Create Your Chart
              </Link>
            </div>
          )}
        </div>

        {/* App Preferences Section */}
        {astrologyReading && (
          <div className="border border-white/20 bg-white/5 p-10 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="h-8 w-8" />
              <h2 className="text-3xl font-light">App Preferences</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <h3 className="text-lg font-medium">Deep View Mode</h3>
                  <p className="text-sm text-gray-400">Show extra chart points by default (Nodes, Chiron, etc)</p>
                </div>
                <button
                  onClick={handleToggleDeepView}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${astrologyReading.chart_data?.user_metadata?.settings?.showExtraPoints !== false ? 'bg-purple-600 justify-end' : 'bg-zinc-700 justify-start'}`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Business Account Note */}
        {profile.is_business_account && (
          <div className="bg-blue-500/10 border border-blue-500/30 p-6 mb-8">
            <p className="text-blue-300 text-sm">
              <strong>Business Account:</strong> Your numerology reading is managed by your organization and cannot be edited directly.
              {hasReading && ' You can view your reading but changes must be made through your administrator.'}
            </p>
          </div>
        )}

        {/* Sign Out */}
        <div className="flex justify-center">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-8 py-4 border border-white/40 text-white hover:bg-white hover:text-black transition-all text-lg font-medium tracking-wider"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        <div className="mt-16 text-center text-xs uppercase tracking-widest text-gray-600">
          Eternal • Unfiltered
        </div>
      </div>
    </main>
  );
}

interface NumberDisplayProps {
  label: string;
  number: number | null;
  rawNumber?: number;
  isPrimary?: boolean;
}

function NumberDisplay({ label, number, rawNumber, isPrimary = false }: NumberDisplayProps) {
  const displayValue = rawNumber && rawNumber !== number ? `${rawNumber}/${number}` : number;
  return (
    <div className={`
      text-center py-4 px-3 bg-white/5 border transition-all hover:bg-white/10
      ${isPrimary ? 'border-white/40' : 'border-white/20'}
    `}>
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">{label}</p>
      <p className="text-4xl font-bold">{displayValue || '—'}</p>
    </div>
  );
}