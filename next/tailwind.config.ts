import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'h1': ['32px', { lineHeight: '102px', letterSpacing: '0' }],
        'h2': ['24px', { lineHeight: '58px', letterSpacing: '0' }],
        'h3': ['20px', { lineHeight: '26px', letterSpacing: '0' }],
        'h4': ['18px', { lineHeight: '22px', letterSpacing: '0' }],
        'p': ['16px', { lineHeight: '18px', letterSpacing: '0' }],
        'p2': ['14px', { lineHeight: '18px', letterSpacing: '0' }],
        'lg:h1': ['85px', { lineHeight: '102px', letterSpacing: '0' }],
        'lg:h2': ['48px', { lineHeight: '58px', letterSpacing: '0' }],
        'lg:h3': ['22px', { lineHeight: '26px', letterSpacing: '0' }],
        'lg:h4': ['20px', { lineHeight: '22px', letterSpacing: '0' }],
        'lg:p': ['16px', { lineHeight: '18px', letterSpacing: '0' }],
        'lg:p2': ['14px', { lineHeight: '18px', letterSpacing: '0' }],
      },
      fontFamily: {
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        // Primary colors
        'primary-1': '#1B8599',
        'primary-2': '#0F4F5B',
        'primary-3': '#0A3B44',
        
        // Secondary colors
        'secondary-1': '#F4F4F4',
        'secondary-2': '#4F1F2F',
        
        // Neutral colors
        'neutral-1': '#F4F4F4',
        'neutral-2': '#4F4F4F',
        'neutral-3': '#424242',
        'neutral-4': '#2E2E2E',

        // System colors
        'success': '#88BF7A',
        'alert': '#F1A56F',
        'error': '#EA8787',
      },
    },
  },
} satisfies Config;
