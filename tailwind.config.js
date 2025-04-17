module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#EEEEEE",
          secondary: "#EFF3EA",
          accent: "#053B50",
          border: "#2D4356",
          text: "#053B50",
        },
        dark: {
          primary: "#2D4356",
          secondary: "#1E2A3A",
          accent: "#053B50",
          border: "#053B50",
          text: "#FCF8F3",
        },
      },
    },
  },
  plugins: [],
};
