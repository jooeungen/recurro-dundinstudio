import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8EEFF',
          100: '#D1DDFF',
          200: '#A3BBFF',
          300: '#7599FF',
          400: '#4777FF',
          500: '#1c48d4', // Main brand color (blue)
          600: '#163AA9',
          700: '#112B7F',
          800: '#0B1D54',
          900: '#060E2A',
        },
        accent: {
          50: '#F9E5FF',
          100: '#F3CBFF',
          200: '#E797FF',
          300: '#DB63FF',
          400: '#CF2FFF',
          500: '#b800fe', // Secondary accent (purple)
          600: '#9300CB',
          700: '#6E0098',
          800: '#4A0065',
          900: '#250033',
        },
      },
      fontFamily: {
        serif: ['var(--font-crimson)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
