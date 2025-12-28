// app/signin/page.tsx
import { redirect } from 'next/navigation';
import { getDefaultSignInView, getAuthTypes } from '@/utils/auth-helpers/settings';
import { cookies } from 'next/headers';

export default function SignIn() {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  
  // If OAuth is the only method, redirect directly to oauth_signin
  if (allowOauth && !allowEmail && !allowPassword) {
    return redirect('/signin/oauth_signin');
  }
  
  const preferredSignInView =
    cookies().get('preferredSignInView')?.value || null;
  const defaultView = getDefaultSignInView(preferredSignInView);

  return redirect(`/signin/${defaultView}`);
}
