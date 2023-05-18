/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const themeBase = require("./themes/themeBase.json");
const themeSet = themeBase.global;

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./libs/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/*.js",
  ],
  corePlugins: {
    preflight: false,
  },
  important: "body",
  theme: {
    fontFamily: {
      nunito: ["Nunito"],
      mont: ["Montserrat"],
    },
    fontSize: {
      xs: ["12.4px", "18.6px"],
      sm: ["14px", "22.4px"],
      lg: ["18px", "27px"],
      xl: ["20px", "30px"],
      "2xl": ["24px", "36px"],
      base: ["16px", "24px"],
      cardTitle: ["16px", "24px"],
      cardDesc: ["12.4px", "18.6px"],
    },
    boxShadow: {
      sm: ["0 1px 2px 0 rgb(0 0 0 / 0.05)"],
      md: ["0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"],
      lg: [
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      ],
      xl: [
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      ],
      "2xl": ["0 25px 50px -12px rgb(0 0 0 / 0.25)"],
      inner: ["inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"],
      none: ["0 0 #0000"],
      customCard: ["0px 4px 0px #EBEDF5"],
    },
    extend: {
      colors: {
        paper: "#f0f1f5",
        primary: themeSet.Primary.Main.value,

        dark: {
          DEFAULT: "#010101",
          100: "#0a0b0e",
          200: "#16181d",
          300: "#16181d",
          500: "#0f1115",
          700: "#202125",
        },
        gray: {
          30: themeSet.gray[30].value,
          40: themeSet.gray[40].value,
          50: themeSet.gray[50].value,
          70: themeSet.gray[70].value,
          90: themeSet.gray[90].value,
          150: themeSet.gray[150].value,
          250: themeSet.gray[250].value,
          350: themeSet.gray[350].value,
          410: themeSet.gray[410].value,
          950: themeSet.gray[950].value,
        },
      },
    },
    screens: {
      ...defaultTheme.screens,
      sm: "400px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
      ha: { raw: "(hover: hover)" },
    },
  },
  variants: {
    extend: {
      boxShadow: ["dark"],
    },
  },
  //darkMode: "class",
  plugins: [require("@tailwindcss/forms"), require("tw-elements/dist/plugin")],
};
