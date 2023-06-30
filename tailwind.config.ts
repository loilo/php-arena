import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import typographyPlugin from '@tailwindcss/typography'

export default {
  content: ['./**/*.vue'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: "Poppins, Avenir, 'Avenir Next LT Pro', Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif",
        mono: "'Fragment Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
      },
      fontSize: {
        icon: '0.8rem',
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'inner-xs': 'inset 0 1px 1px 0 rgb(0 0 0 / 0.1)',
      },
      colors: {
        violet: {
          DEFAULT: '#657bcc',
          '50': '#f3f5fb',
          '100': '#e3e8f6',
          '200': '#cdd7f0',
          '300': '#abbce5',
          '400': '#839ad7',
          '500': '#657bcc',
          '600': '#5161bf',
          '700': '#4750ae',
          '800': '#3f438e',
          '900': '#363c72',
          '950': '#252646',
        },
        slate: {
          '50': '#fafbfc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '300': '#cbd5e1',
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '700': '#334155',
          '800': '#1F2A3B',
          '900': '#19212F',
          '950': '#141821',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      animation: {
        'fade-in':
          'fade-in 500ms ease-in-out var(--animation-delay, 0ms) forwards',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('disabled', '&:is(:disabled, [data-disabled])')
      addVariant('group-disabled', '.group:is(:disabled, [data-disabled]) &')
      addVariant(
        'not-disabled',
        '&:where(:not(:disabled):not([data-disabled]))',
      )
      addVariant(
        'group-not-disabled',
        '.group:where(:not(:disabled):not([data-disabled]))&',
      )
    }),
    typographyPlugin,
  ],
} satisfies Config
