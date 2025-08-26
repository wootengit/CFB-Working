import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#000000',      // body
          1: '#0B0B0B',            // surface-1
          2: '#111111',            // surface-2 (cards/nav)
          3: '#161616',            // hover/pressed
        },
        text: {
          DEFAULT: '#F5F5F5',
          sub: '#D0D0D0',
          muted: '#A6A6A6',
        },
        border: {
          subtle: '#1F1F1F',
          strong: '#2A2A2A',
        },
        accent: {
          // keep neutral-first; use team color only as ring/border later
          blue: '#3B82F6',
          green: '#22C55E',
          red: '#EF4444',
          amber: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto'],
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      boxShadow: {
        soft: '0 1px 0 0 #1F1F1F', // subtle divider shadow
      },
    }
  },
  plugins: [
    function({ addUtilities }: any) {
      addUtilities({
        '.tabular-nums': { fontVariantNumeric: 'tabular-nums' },
      })
    }
  ]
} satisfies Config