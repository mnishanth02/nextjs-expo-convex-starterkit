/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify content paths for Tailwind to scan
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],

  // Add NativeWind preset
  presets: [require("nativewind/preset")],

  // Enable dark mode support
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // Align with design system
        primary: {
          50: "#E6F4FE",
          100: "#CCE9FD",
          200: "#99D3FB",
          300: "#66BDF9",
          400: "#33A7F7",
          500: "#0A7EFF",
          600: "#0066CC",
          700: "#004D99",
          800: "#003366",
          900: "#002B55",
        },
        secondary: {
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#D4D4D4",
          300: "#A3A3A3",
          400: "#737373",
          500: "#6B7280",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#1F2937",
        },
      },
      fontFamily: {
        // Match existing font setup
        regular: ["System"],
        medium: ["System"],
        semibold: ["System"],
        bold: ["System"],
      },
    },
  },

  plugins: [],
}
