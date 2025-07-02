// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig({
  // <–– Tell ESLint which files this config applies to
  files: ["**/*.{js,mjs,cjs,jsx}"],

  languageOptions: {
    globals: globals.browser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: { jsx: true },
      jsxRuntime: "automatic",
    },
  },

  plugins: {
    js,
    react: pluginReact,
  },

  settings: {
    react: { version: "detect" },
  },

  rules: {
    // JS recommended rules
    ...js.configs.recommended.rules,
    // React recommended rules
    ...pluginReact.configs.flat.recommended.rules,
    // Turn off needing React in scope
    "react/react-in-jsx-scope": "off",
    // If you’re not using prop‑types
    "react/prop-types": "off",
  },
});
