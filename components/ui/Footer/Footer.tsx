// components/ui/Footer/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-red-500/5"></div>
      
      {/* Subtle glow lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          {/* Main Footer Content */}
          <div className="text-center space-y-8">
            
            {/* Legal Links */}
            <div className="flex justify-center items-center space-x-8">
              <Link
                href="/legal/privacy"
                className="group relative text-zinc-400 hover:text-white transition-all duration-300 text-sm font-medium"
              >
                <span className="relative z-10">Privacy Policy</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -m-2"></div>
              </Link>
              
              <div className="w-px h-4 bg-zinc-700"></div>
              
              <Link
                href="/legal/terms"
                className="group relative text-zinc-400 hover:text-white transition-all duration-300 text-sm font-medium"
              >
                <span className="relative z-10">Terms of Service</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -m-2"></div>
              </Link>
            </div>

            {/* Decorative Element */}
            <div className="flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
            </div>

            {/* Copyright */}
            <div className="text-zinc-500 text-sm">
              &copy; {new Date().getFullYear()} All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-24 bg-gradient-to-t from-pink-500/10 to-transparent blur-xl"></div>
    </footer>
  );
}
