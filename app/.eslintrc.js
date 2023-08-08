module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
  },
  extends: [
    'plugin:vue/base',
    'plugin:nuxt/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'vue', 'prettier'],
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/quotes': ['error', 'double'],
  },
  ignorePatterns: ['node_modules', '.nuxt', 'dist'],
}
