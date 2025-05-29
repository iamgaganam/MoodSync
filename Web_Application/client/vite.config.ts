import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  // Plugin configuration
  plugins: [
    react(), // React support with Fast Refresh
  ],

  // Testing configuration with Vitest
  test: {
    globals: true, // Enable global test functions (describe, it, expect)
    environment: "jsdom", // DOM environment for React component testing
    setupFiles: "./src/setupTests.ts", // Test setup and configuration
    css: false, // Disable CSS processing in tests for performance
  },

  // Module resolution configuration
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // Path alias in cleaner imports
    },
  },
});
