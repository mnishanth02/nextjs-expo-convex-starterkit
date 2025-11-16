/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          0: "#FFFFFF",
          50: "#E5F1FF",
          100: "#CCE3FF",
          200: "#99C7FF",
          300: "#66AAFF",
          400: "#338EFF",
          500: "#0A7EFF",
          600: "#0065CC",
          700: "#004C99",
          800: "#003266",
          900: "#001933",
          950: "#000D1A",
        },
        secondary: {
          0: "#FFFFFF",
          50: "#F5F5F5",
          100: "#EBEBEB",
          200: "#D6D6D6",
          300: "#C2C2C2",
          400: "#ADADAD",
          500: "#999999",
          600: "#7A7A7A",
          700: "#5C5C5C",
          800: "#3D3D3D",
          900: "#1F1F1F",
          950: "#0F0F0F",
        },
      },
    },
  },
  plugins: [require("@gluestack-ui/nativewind-utils/tailwind-plugin")],
}
