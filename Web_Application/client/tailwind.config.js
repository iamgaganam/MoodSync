const flowbite = require("flowbite/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      // Add any customizations here
      colors: {
        customBlue: "#1D4ED8", // Example of adding a custom color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Example of adding a custom font
      },
    },
  },
  plugins: [
    flowbite, // Flowbite plugin
    require("@tailwindcss/typography"), // Example of additional plugin
    require("@tailwindcss/forms"), // Example of additional plugin
  ],
};
