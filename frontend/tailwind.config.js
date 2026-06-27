/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        serif: ['Georgia', 'serif'],
      },
      colors: {
        // Gold accent — headlines, CTAs, highlights
        gold: {
          300: '#e8d5a3',
          400: '#d4b565',
          500: '#c9a84c',
          600: '#b8923a',
          700: '#9a7a2f',
        },
        // Deep forest green backgrounds
        forest: {
          950: '#060d09',
          900: '#0b1610',
          800: '#0f1d14',
          700: '#121f18',
          600: '#162619',
          500: '#1a2e22',
          400: '#24402e',
          300: '#2e5239',
        },
        // Cream/warm text
        cream: {
          50:  '#faf8f2',
          100: '#f5f0e4',
          200: '#ede5d0',
          300: '#d4cdb8',
          400: '#b0a898',
          500: '#8a8a80',
          600: '#666660',
        },
        // Aliases for design system
        canvas:  '#0b1610',
        overlay: '#0f1d14',
        border:  '#1a2e22',
        borderMuted: '#243a2a',
      },
    },
  },
  plugins: [],
}
