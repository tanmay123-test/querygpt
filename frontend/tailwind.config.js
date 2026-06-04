/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#0f172a',
        primary: '#2563EB',
        page: '#f8fafc',
        label: '#475569',
        heading: '#0f172a',
        subtext: '#64748b',
        'input-bg': '#f1f5f9',
        'input-border': '#e2e8f0',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
