// tailwind.config.js
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        screens: {
          'short': { raw: '(max-height: 800px)' },
          'mediumh': { raw: '(min-height: 801px) and (max-height: 1200px)' },
          'tall': { raw: '(min-height: 1201px) and (max-height: 1800px)' },
          'xhtall': { raw: '(min-height: 1801px)' }, // مخصوص مانیتور 43" عمودی
        },
      },
    },
    plugins: [],
  }