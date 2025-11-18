import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        // Optional darker secondary, define in theme.css if needed
        'secondary-dark': 'var(--secondary-dark)',
        accent: 'var(--accent)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        // Optional muted text, define in theme.css if needed
        'text-muted': 'var(--text-muted)',
        'bg-surface': 'var(--bg-surface)',
        'bg-soft': 'var(--bg-soft)',
        // Align with theme.css variable name used across components
        'border-subtle': 'var(--border-subtle)',
        // Optional soft border, define in theme.css if needed
        'border-soft': 'var(--border-soft)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 40px rgba(7, 48, 37, 0.12)',
        soft: '0 18px 40px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [flowbitePlugin],
};

export default config;
