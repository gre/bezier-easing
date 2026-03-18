import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        console: "readonly",
        Float32Array: "readonly",
        Math: "readonly",
        module: "readonly",
        require: "readonly",
        document: "readonly",
        process: "readonly",
      },
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  },
];
