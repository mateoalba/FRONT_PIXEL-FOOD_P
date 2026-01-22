// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Ahora puedes usar la clase 'font-pixel' en tu HTML
        pixel: ['"Press Start 2P"', 'system-ui'],
      },
    },
  },
  plugins: [],
}