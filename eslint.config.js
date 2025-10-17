// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const importNewlines = require('eslint-plugin-import-newlines');

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: {
      'import-newlines': importNewlines
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "import-newlines/enforce": [
        "error",
        {
          "items": 0
        }
      ],
      "indent": ["error", 2],
      "@typescript-eslint/no-explicit-any": ["warn"],
      "@angular-eslint/prefer-standalone": ["off"],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
