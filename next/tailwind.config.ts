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
      h1: ['85px', { lineHeight: '102px' }],
      h2: ['48px', { lineHeight: '58px' }],
      h3: ['22px', { lineHeight: '26px' }],
      h4: ['20px', { lineHeight: '22px' }],
      p1: ['14px', { lineHeight: '18px' }],
      p2: ['11px', { lineHeight: '18px' }],
    },
  },
},
} satisfies Config;
