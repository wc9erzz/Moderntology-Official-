// components/ui/Card/Card.tsx
import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-xl hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 overflow-hidden">
      <div className="px-6 py-6">
        <h3 className="mb-2 text-2xl font-semibold text-white">{title}</h3>
        {description && <p className="text-zinc-300 mb-4">{description}</p>}
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-zinc-700 bg-zinc-800/50 text-zinc-400">
          {footer}
        </div>
      )}
    </div>
  );
}
