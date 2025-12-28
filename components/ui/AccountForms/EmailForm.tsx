'use client';

import Button from '@/components/ui/Button';
import { updateEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(userEmail || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (value === userEmail) {
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="space-y-4">
          <div className="relative">
            <label 
              htmlFor="newEmail"
              className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                isFocused || value
                  ? 'text-xs text-pink-400 -translate-y-6 bg-zinc-900 px-2'
                  : 'text-zinc-400 top-3'
              }`}
            >
              Email Address
            </label>
            <input
              id="newEmail"
              name="newEmail"
              type="email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              maxLength={64}
            />
            <div className="mt-1 text-xs text-zinc-500">
              We will email you to verify the change
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="slim"
              type="submit"
              loading={isSubmitting}
              disabled={value === userEmail || !value.trim()}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Email
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
