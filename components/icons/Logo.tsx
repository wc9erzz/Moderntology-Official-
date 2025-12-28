const Logo = ({ ...props }) => (
  <svg
    width="36"
    height="32"
    viewBox="0 0 36 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    
    {/* Clean hexagonal outline only */}
    <path d="M18 4 L26 9 L26 19 L18 24 L10 19 L10 9 Z" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" />
  </svg>
);

export default Logo;
