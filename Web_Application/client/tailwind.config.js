const flowbite = require("flowbite/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content paths for Tailwind to scan for classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],

  theme: {
    extend: {
      // Custom color palette for MoodSync branding
      colors: {
        customBlue: "#1D4ED8",
      },

      // Typography configuration
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },

  // Plugin configuration for enhanced UI components
  plugins: [
    flowbite, // Flowbite UI components
    require("@tailwindcss/typography"), // Rich text styling
    require("@tailwindcss/forms"), // Form element styling
  ],
};
