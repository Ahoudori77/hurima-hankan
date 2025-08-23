module.exports = {
  root: true,
  env: { es2022: true, node: true, browser: true },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  ignorePatterns: ["dist", "*.config.*", "**/*.d.ts"],
  rules: {
    "import/order": ["warn", { "newlines-between": "always", "alphabetize": { "order": "asc" } }]
  }
};