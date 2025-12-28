// components/ui/Pricing/Pricing.tsx
'use client';

import { User } from '@supabase/supabase-js';

interface Props {
  user: User | null | undefined;
  products: any[];
  subscription: any | null;
}

export default function Pricing({ user, products, subscription }: Props) {
  return (
    <section className="bg-black min-h-screen">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl mb-8">
            Pricing Plans
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Pricing integration is currently being updated. Please check back later.
          </p>
        </div>
      </div>
    </section>
  );
}
