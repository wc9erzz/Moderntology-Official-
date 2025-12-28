// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Add the Minecraft font here so Tailwind can use it with class names
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        minecraft: ['Minecraft', 'sans-serif'], // ← now you can use font-minecraft
      },
      colors: {
        cosmic: {
          dark: '#050511',
          'cosmic-dark': '#050505',
          'cosmic-cyan': '#00F0FF',
          'cosmic-magenta': '#FF003C',
          'cosmic-gold': '#FFD700',
          'cosmic-silver': '#E5E4E2',
          'cosmic-purple': '#8A2BE2', // Blue Violet
        }
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};