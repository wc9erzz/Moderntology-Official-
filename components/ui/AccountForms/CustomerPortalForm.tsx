'use client';

interface Props {
  subscription: any | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-transparent border border-zinc-600 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">
          Billing Portal
        </h3>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          Billing management is currently unavailable as we update our systems.
        </p>
      </div>
    </div>
  );
}
