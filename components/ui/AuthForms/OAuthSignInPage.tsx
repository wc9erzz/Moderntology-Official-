// components/ui/AuthForms/OAuthSignInPage.tsx
'use client';

import { useEffect } from 'react';
import OauthSignIn from './OauthSignIn';

export default function OAuthSignInPage() {
  useEffect(() => {
    // Mouse tracking for glow effect when not in auto-glow cycle
    let mouseX = 0;
    let mouseY = 0;
    let isAutoGlowing = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isAutoGlowing) {
        updateCardGlow();
      }
    };

    const updateCardGlow = () => {
      const card = document.getElementById('signin-card');
      const button = document.querySelector('#oauth-button-wrapper button');
      
      if (!card || !button) return;
      
      const buttonRect = button.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
      
      // Calculate distance from mouse to button center
      const distance = Math.sqrt(
        Math.pow(mouseX - buttonCenterX, 2) + 
        Math.pow(mouseY - buttonCenterY, 2)
      );
      
      // Max distance for effect (in pixels)
      const maxDistance = 300;
      
      // Calculate intensity (closer = stronger)
      const intensity = Math.max(0, 1 - (distance / maxDistance));
      
      // Apply glow based on intensity
      const glowSize = 20 + (intensity * 40); // 20px to 60px
      const glowOpacity = 0.2 + (intensity * 0.6); // 0.2 to 0.8
      
      card.style.boxShadow = `0 0 ${glowSize}px rgba(59, 130, 246, ${glowOpacity})`;
      card.style.borderColor = `rgba(59, 130, 246, ${0.5 + intensity * 0.5})`;
    };

    // Auto-glow cycle: 5 seconds glow, 2 seconds rest
    const startAutoGlowCycle = () => {
      const card = document.getElementById('signin-card');
      if (!card) return;

      const cycle = () => {
        // Glow phase - 5 seconds
        isAutoGlowing = true;
        card.classList.add('auto-glow');
        
        setTimeout(() => {
          // Rest phase - 2 seconds
          card.classList.remove('auto-glow');
          isAutoGlowing = false;
          
          // Start next cycle after rest
          setTimeout(cycle, 2000);
        }, 5000);
      };

      cycle();
    };

    document.addEventListener('mousemove', handleMouseMove);
    startAutoGlowCycle();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes auto-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            border-color: rgba(59, 130, 246, 0.6);
          }
          50% {
            box-shadow: 0 0 60px rgba(59, 130, 246, 0.8);
            border-color: rgba(59, 130, 246, 1);
          }
        }

        .auto-glow {
          animation: auto-glow-pulse 5s ease-in-out;
        }

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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>

      <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Static subtle background - no animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5"></div>
        
        {/* Main content */}
        <div className="relative z-10 w-full max-w-md px-6" id="signin-container">
          {/* Trust header section */}
          <div className="text-center mb-8 opacity-0 animate-fade-in-up">
            {/* Security badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm mb-6 backdrop-blur-sm animate-float">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Encrypted & Secure</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3">
              Secure, Sign On.
            </h1>
            <p className="text-zinc-400 text-lg">
              Safe, fast access to your account
            </p>
          </div>

          {/* Sign-in card with blue border */}
          <div id="signin-card" className="bg-zinc-900/80 backdrop-blur-xl border-2 border-blue-500 rounded-2xl p-8 shadow-2xl shadow-blue-500/20 opacity-0 animate-fade-in-up animation-delay-200 transition-all duration-300">
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mb-6 pb-6 border-b border-zinc-700">
              <div className="flex items-center gap-2 text-sm text-zinc-400 group cursor-default">
                <svg className="w-5 h-5 text-green-400 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="transition-colors duration-300 group-hover:text-zinc-200">Verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400 group cursor-default">
                <svg className="w-5 h-5 text-green-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="transition-colors duration-300 group-hover:text-zinc-200">SSL Encrypted</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
              <p className="text-zinc-400">Continue with your Google account</p>
            </div>
            
            <div id="oauth-button-wrapper">
              <OauthSignIn />
            </div>

            {/* Additional trust footer */}
            <div className="mt-6 pt-6 border-t border-zinc-700 text-center">
              <p className="text-xs text-zinc-500">
                Protected by industry-standard encryption
              </p>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="mt-6 text-center opacity-0 animate-fade-in-up animation-delay-600">
            <p className="text-sm text-zinc-500">
              By signing in, you agree to our{' '}
              <a href="/legal/terms" className="text-blue-400 hover:text-blue-300 transition-colors">Terms</a>
              {' '}and{' '}
              <a href="/legal/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
