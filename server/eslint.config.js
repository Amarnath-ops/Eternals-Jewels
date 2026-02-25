import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["src/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest, // Just in case they use jest
        process: "readonly",
        console: "readonly",
      },
    },

    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
