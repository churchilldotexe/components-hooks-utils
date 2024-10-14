import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint, { parser } from "typescript-eslint";
import react from "@eslint-react/eslint-plugin";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        parser: parser,
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: process.cwd(),
      },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ...react.configs["recommended-type-checked"], // <-- Requires type information
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@eslint-react/no-leaked-conditional-rendering": "error", // <-- Requires type information
    },
  }
);
