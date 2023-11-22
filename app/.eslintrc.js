module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue'],
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'plugin:nuxt/recommended',
    'eslint:recommended',
    '@vue/essential',
    'prettier',
    'prettier/vue',
    'prettier/@typescript-eslint',
  ],
  plugins: ['vue', 'prettier', 'unused-imports'],
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/quotes': ['warn', 'single'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  // ignorePatterns: ['node_modules', '.nuxt', 'dist'],
}
