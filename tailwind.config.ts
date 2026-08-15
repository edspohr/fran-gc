import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#121212',
          900: '#0E0E0E',
        },
        surface: {
          1: '#1B1B1B',
          2: '#232323',
        },
        cream: {
          DEFAULT: '#EDE5D6',
          muted: '#C7BFAE',
        },
        gold: {
          DEFAULT: '#AE9A79',
          hover: '#C9B78F',
        },
        wine: '#813A38',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['Oswald', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.2em',
      },
      boxShadow: {
        hairline: 'inset 0 -1px 0 0 rgba(174,154,121,0.35)',
      },
      backgroundImage: {
        grain: "url('/textures/grain.svg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
