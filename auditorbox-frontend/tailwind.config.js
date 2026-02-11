/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'inflo-blue': '#005EB8',
        'inflo-teal': '#009688',
        'canvas-bg': '#F3F5F7',
        'paper-white': '#FFFFFF',
        'inflo-border': '#E2E8F0',
        'inflo-text-main': '#1E293B',
        'inflo-text-muted': '#64748B',
        'inflo-text-muted': '#64748B',
        'sidebar-bg': '#FFFFFF',
        'background-dark': '#020617', // Slate 950
        'surface-darker': '#0F172A',  // Slate 900
        primary: {
          DEFAULT: '#005EB8', // Map primary to inflo-blue for backward compat
          dark: '#004c94',
          light: '#337ec6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'canvas': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'paper': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
