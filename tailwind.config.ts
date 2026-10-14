import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EBF4FF',
          100: '#d9eaff',
          200: '#bcdaff',
          300: '#8ec2ff',
          400: '#599eff',
          500: '#2b78ff',
          600: '#0062E0',
          700: '#004EC2',
          800: '#003E99',
          900: '#0b3389',
          950: '#071e54',
        },
        navy: {
          800: '#162038',
          900: '#0B1120',
          950: '#060913',
        },
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
        },
        ticket: {
          blue: '#0062E0',
          blueDark: '#004EC2',
          blueLight: '#EBF4FF',
          paper: '#ffffff',
          cream: '#ffffff',
          navy: '#0B1120',
          amber: '#f59e0b',
        },
        verified: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 14px -2px rgba(6, 9, 19, 0.06), 0 1px 4px -1px rgba(6, 9, 19, 0.04)',
        elevated: '0 16px 40px -6px rgba(6, 9, 19, 0.12), 0 4px 14px -2px rgba(6, 9, 19, 0.05)',
        ticket: '0 20px 48px -8px rgba(0, 98, 224, 0.16), 0 4px 16px -2px rgba(11, 17, 32, 0.08)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 98, 224, 0.2)' },
          '50%': { boxShadow: '0 0 0 8px rgba(0, 98, 224, 0)' },
        },
      },
      animation: {
        'page-enter': 'pageEnter 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.2s ease-out both',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
