const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable dark mode via 'class' strategy
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0f172a", // Slate 900
          surface: "#1e293b", // Slate 800
          text: "#f8fafc", // Slate 50
          muted: "#94a3b8", // Slate 400
          border: "#334155", // Slate 700
        }
      }
    },
  },
  plugins: [],
});
