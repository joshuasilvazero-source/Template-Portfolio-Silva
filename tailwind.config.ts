/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00ffff',
        'neon-purple': '#ff00ff',
        'neon-green': '#00ff00',
        'neon-red': '#ff0080',
        'cyber-dark': '#0a0e27',
        'cyber-darker': '#1a1f3a',
      },
      fontFamily: {
        mono: ['Space Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(255, 0, 255, 0.5)',
        'neon-green': '0 0 20px rgba(0, 255, 0, 0.5)',
        'neon-red': '0 0 20px rgba(255, 0, 128, 0.5)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.8)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        glow: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
