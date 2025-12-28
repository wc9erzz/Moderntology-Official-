import { Hero } from '@/components/landing/Hero';
import { Philosophy } from '@/components/landing/Philosophy';
import { Systems } from '@/components/landing/Systems';
import { Features } from '@/components/landing/Features';
import { Community } from '@/components/landing/Community';
import { CTA } from '@/components/landing/CTA';
import { AnimatedBackground } from '@/components/landing/AnimatedBackground';

export default function LandingPage() {
    return (
        <main className="relative flex min-h-screen flex-col bg-black text-white">
            <AnimatedBackground />
            <div className="relative z-10">
                <Hero />
                <Philosophy />
                <Systems />
                <Features />
                <Community />
                <CTA />
            </div>
        </main>
    );
}
