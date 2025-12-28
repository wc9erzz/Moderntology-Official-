// utils/auth-helpers/settings.ts
// Boolean toggles to determine which auth types are allowed
const allowOauth = true;
const allowEmail = false;
const allowPassword = false;

// Boolean toggle to determine whether auth interface should route through server or client
// (Currently set to false because screen sometimes flickers with server redirects)
const allowServerRedirect = false;

// Updated check - OAuth must be enabled if both email and password are disabled
if (!allowPassword && !allowEmail && !allowOauth)
  throw new Error('At least one authentication method must be enabled');

if (!allowOauth && (!allowPassword && !allowEmail))
  throw new Error('OAuth must be enabled if both email and password are disabled');

export const getAuthTypes = () => {
  return { allowOauth, allowEmail, allowPassword };
};

export const getViewTypes = () => {
  // Define the valid view types
  let viewTypes: string[] = [];
  
  // If OAuth is the only method, return a special oauth view
  if (allowOauth && !allowEmail && !allowPassword) {
    return ['oauth_signin'];
  }
  
  if (allowEmail) {
    viewTypes = [...viewTypes, 'email_signin'];
  }
  if (allowPassword) {
    viewTypes = [
      ...viewTypes,
      'password_signin',
      'forgot_password',
      'update_password',
      'signup'
    ];
  }

  return viewTypes;
};

export const getDefaultSignInView = (preferredSignInView: string | null) => {
  // If OAuth is the only method, default to oauth
  if (allowOauth && !allowEmail && !allowPassword) {
    return 'oauth_signin';
  }
  
  // Define the default sign in view
  let defaultView = allowPassword ? 'password_signin' : 'email_signin';
  if (preferredSignInView && getViewTypes().includes(preferredSignInView)) {
    defaultView = preferredSignInView;
  }

  return defaultView;
};

export const getRedirectMethod = () => {
  return allowServerRedirect ? 'server' : 'client';
};
