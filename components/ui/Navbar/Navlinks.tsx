// components/ui/Navbar/Navlinks.tsx - CLEAN NUMERA VERSION
'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getUserWithReading } from '@/utils/supabase/numera-queries';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { getRedirectMethod, getAuthTypes } from '@/utils/auth-helpers/settings';
import { UserWithReading } from '@/types_numera';
import { ChevronDown, Home, BookOpen, User as UserIcon, LogOut, LogIn, Menu, X, Sparkles, LayoutDashboard, Star, FileText, Info } from 'lucide-react';
import s from './Navbar.module.css';

export default function Navlinks() {
  const nextRouter = useRouter();
  const router = getRedirectMethod() === 'client' ? nextRouter : null;
  const pathname = usePathname();
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();

  const [userWithReading, setUserWithReading] = useState<UserWithReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNavData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { profile, reading } = await getUserWithReading(supabase as any);
          if (profile) {
            setUserWithReading({
              ...profile,
              reading: reading || null
            } as UserWithReading);
          }
        }
      } catch (error) {
        console.error('Error loading nav data:', error);
        setUserWithReading(null);
      } finally {
        setLoading(false);
      }
    };

    loadNavData();

    const supabase = createClient();
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUserWithReading(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          loadNavData();
        }
      }
    );

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUserWithReading(null);
      await handleRequest(e, SignOut, router);
    } catch (error) {
      console.error('Sign out error:', error);
      setUserWithReading(null);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const searchParams = useSearchParams();

  const getSignInPath = () => {
    const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    const nextParam = new URLSearchParams({ next: currentPath }).toString();

    if (allowOauth && !allowEmail && !allowPassword) {
      return `/signin/oauth_signin?${nextParam}`;
    }
    return `/signin?${nextParam}`;
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const hasReading = userWithReading?.reading?.status === 'completed';

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center justify-between py-3 md:py-4">
        {/* Left Side - Profile Dropdown (Desktop) or Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Profile Dropdown - ONLY WHEN SIGNED IN */}
          {userWithReading && (
            <div className="relative hidden md:block">
              <button
                onClick={() => toggleDropdown('profile')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded ${activeDropdown === 'profile' || isActive('/account') || isActive('/dashboard')
                  ? 'text-white bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'profile' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-black border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm text-white font-medium truncate">
                      {userWithReading.first_name
                        ? `${userWithReading.first_name} ${userWithReading.last_name || ''}`
                        : userWithReading.email
                      }
                    </p>
                  </div>

                  <Link
                    href="/"
                    onClick={() => setActiveDropdown(null)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive('/') && pathname === '/'
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>

                  {hasReading && (
                    <>
                      <Link
                        href="/explore/numerology"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive('/explore/numerology')
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <BookOpen className="h-4 w-4" />
                        Numerology
                      </Link>
                      <Link
                        href="/explore/astrology"
                        onClick={() => setActiveDropdown(null)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive('/explore/astrology')
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <Star className="h-4 w-4" />
                        Astrology
                      </Link>
                    </>
                  )}

                  {userWithReading.is_business_account && (
                    <Link
                      href="/dashboard"
                      onClick={() => setActiveDropdown(null)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive('/dashboard')
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}

                  <div className="border-t border-white/10">
                    <Link
                      href="/about"
                      onClick={() => setActiveDropdown(null)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive('/about')
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <Info className="h-4 w-4" />
                      About
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setActiveDropdown(null)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive('/account')
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <UserIcon className="h-4 w-4" />
                      Manage
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Updates Link (Desktop only) - Always visible */}
          <Link
            href="/updates"
            className={`hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded ${isActive('/updates')
              ? 'text-white bg-white/10'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            <FileText className="h-4 w-4" />
            Updates
          </Link>
        </div>

        {/* Center - Brand */}
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className={s.brand}>
            Moderntology
          </h1>
        </Link>

        {/* Right Side - Reading Link & Sign In/Out */}
        <div className="flex items-center gap-2">
          {/* Reading Link (Desktop only) */}
          <Link
            href="/reading"
            className={`hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded ${isActive('/reading')
              ? 'text-white bg-white/10'
              : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            <Sparkles className="h-4 w-4" />
            Hub
          </Link>



          {userWithReading ? (
            /* Sign Out Button (Desktop) */
            <form onSubmit={handleSignOut} className="hidden md:block">
              <input type="hidden" name="pathName" value={pathname} />
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 rounded hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          ) : (
            <Link
              href={getSignInPath()}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 text-xs md:text-sm font-medium text-[#09090b] bg-white hover:bg-gray-200 transition-all duration-300 rounded shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-sm z-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-black border-r border-white/20 shadow-2xl h-full w-80 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h1 className={s.brand}>
                Moderntology
              </h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="py-4 px-4 space-y-2">
              {/* User info (if signed in) */}
              {userWithReading && (
                <div className="px-4 py-3 mb-2 bg-white/5 rounded">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                  <p className="text-sm text-white font-medium">
                    {userWithReading.first_name
                      ? `${userWithReading.first_name} ${userWithReading.last_name || ''}`
                      : userWithReading.email
                    }
                  </p>
                </div>
              )}

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${isActive('/') && pathname === '/'
                  ? 'text-white bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              <Link
                href="/reading"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${isActive('/reading')
                  ? 'text-white bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Sparkles className="h-4 w-4" />
                Hub
              </Link>

              <Link
                href="/updates"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${isActive('/updates')
                  ? 'text-white bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                <FileText className="h-4 w-4" />
                Updates
              </Link>

              {hasReading && (
                <>
                  <Link
                    href="/explore/numerology"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${isActive('/explore/numerology')
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Numerology
                  </Link>
                  <Link
                    href="/explore/astrology"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${isActive('/explore/astrology')
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Star className="h-4 w-4" />
                    Astrology
                  </Link>
                </>
              )}



              {userWithReading?.is_business_account && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${isActive('/dashboard')
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}

              {userWithReading && (
                <>
                  <div className="pt-2 pb-1 px-4 mt-4 border-t border-white/10">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile</p>
                  </div>

                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${isActive('/about')
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Info className="h-4 w-4" />
                    About
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${isActive('/account')
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    Manage
                  </Link>

                  <div className="pt-4 mt-2 border-t border-white/10">
                    <form onSubmit={(e) => { handleSignOut(e); setMobileMenuOpen(false); }}>
                      <input type="hidden" name="pathName" value={pathname} />
                      <button
                        type="submit"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black">
              <p className="text-xs text-center text-gray-600 uppercase tracking-widest">
                Moderntology • v∞
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}