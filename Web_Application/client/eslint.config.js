import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/**
 * ESLint configuration
 */
export default tseslint.config(
  // Ignoring build artifacts and generated files
  {
    ignores: ["dist", "build", "node_modules", "*.config.js"],
  },

  // Main configuration for TypeScript and React files
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],

    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      // React Hooks rules for proper hook usage
      ...reactHooks.configs.recommended.rules,

      // React Refresh for development hot reloading
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Code Quality Rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-const": "error",

      // Security and Best Practices
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",

      // Code Style and Consistency
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",

      // Import/Export Rules
      "no-duplicate-imports": "error",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],

      // Error Prevention
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "no-dupe-keys": "error",
      "no-empty": "error",
      "valid-typeof": "error",
    },
  },

  // Specific rules for test files
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },

  // Configuration files (less strict)
  {
    files: ["*.config.{js,ts}", "vite.config.{js,ts}"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-console": "off",
    },
  }
);
