import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['var(--font-geist-sans)'],
            mono: ['var(--font-geist-mono)'],
          },
          borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
          },
          keyframes: {
            'bounce-subtle': {
              '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
              '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
            },
          },
          animation: {
            'bounce-subtle': 'bounce-subtle 2s infinite',
          },
        },
      },
  plugins: [require('tailwindcss-animate')],
}

export default config
