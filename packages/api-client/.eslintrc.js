module.exports = {
  extends: ["@config/eslint"],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
