/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        accent: '#7c3aed',
        'accent-hover': '#6d28d9',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        border: '#27272a',
        muted: '#71717a',
        surface: '#18181b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 4px 20px rgba(124, 58, 237, 0.15)',
        'glow-lg': '0 12px 40px rgba(124, 58, 237, 0.15)',
      },
    },
  },
  plugins: [],
}
