// eslint.config.js (ESLint v9+)
import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";


export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node
      }
    }
  },

  {
    files: ["**/*.test.js", "**/test/**/*.js", "**/__tests__/**/*.js"],
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-conditional-expect": "error",
      "jest/no-identical-title": "error"
    }
  }
];
