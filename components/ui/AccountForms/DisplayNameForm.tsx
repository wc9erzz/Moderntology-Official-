// components/ui/AccountForms/DisplayNameForm.tsx
'use client';

import Button from '@/components/ui/Button';
import { updateDisplayName } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Security utility functions
const sanitizeDisplayName = (input: string): string => {
  // Remove any HTML tags, scripts, and dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>\"']/g, '') // Remove dangerous characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim()
    .substring(0, 50); // Limit to 50 characters
};

const validateDisplayName = (name: string): { isValid: boolean; error: string } => {
  const sanitized = sanitizeDisplayName(name);
  
  if (!sanitized || sanitized.length === 0) {
    return { isValid: false, error: 'Display name cannot be empty' };
  }
  
  if (sanitized.length < 1) {
    return { isValid: false, error: 'Display name must be at least 1 character' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: 'Display name must be 50 characters or less' };
  }
  
  // Check for only allowed characters (letters, numbers, spaces, basic punctuation)
  const allowedPattern = /^[a-zA-Z0-9\s\-_.!@#$%^&*()+={}[\]|\\:";'<>?,./`~]*$/;
  if (!allowedPattern.test(sanitized)) {
    return { isValid: false, error: 'Display name contains invalid characters' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /onload/i,
    /onerror/i,
    /onclick/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return { isValid: false, error: 'Display name contains prohibited content' };
    }
  }
  
  return { isValid: true, error: '' };
};

export default function DisplayNameForm({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(displayName);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(displayName.length);

  const handleInputChange = (newValue: string) => {
    // Sanitize input in real-time
    const sanitized = sanitizeDisplayName(newValue);
    setValue(sanitized);
    setCharCount(sanitized.length);
    
    // Validate and show errors
    const validation = validateDisplayName(sanitized);
    setError(validation.isValid ? '' : validation.error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Final validation before submission
    const validation = validateDisplayName(value);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    
    // Check if the new display name is the same as the old one
    if (value === displayName) {
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create a new FormData with the sanitized value
      const formData = new FormData();
      formData.append('displayName', value);
      
      await handleRequest(e, updateDisplayName, router);
    } catch (err) {
      setError('Failed to update display name. Please try again.');
      console.error('Display name update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = validateDisplayName(value).isValid;
  const hasChanges = value !== displayName;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <label 
              htmlFor="displayName"
              className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                isFocused || value
                  ? 'text-xs text-pink-400 -translate-y-6 bg-zinc-900 px-2'
                  : 'text-zinc-400 top-3'
              }`}
            >
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full p-3 bg-zinc-800 border rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                error 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-zinc-600 focus:ring-pink-500'
              }`}
              maxLength={50}
              autoComplete="off"
              spellCheck="false"
            />
            
            {/* Character Counter */}
            <div className="absolute right-3 top-3 text-xs text-zinc-500">
              {charCount}/50
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            {/* Help Text */}
            {!error && (
              <div className="mt-1 text-xs text-zinc-500">
                This name will appear in your welcome message. Only letters, numbers, and basic punctuation allowed.
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="slim"
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || !hasChanges || !value.trim()}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Display Name'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
