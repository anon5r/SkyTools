import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'cache/**',
    ],
  },
  // ...compat.extends(
  //   // 'plugin:nuxt/recommended',
  //   'eslint:recommended',
  //   'plugin:vue/vue3-essential',
  //   '@vue/eslint-config-prettier'
  // ),
  {
    languageOptions: {
      parserOptions: {
        parser: (await import('@typescript-eslint/parser')).default,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: {
      vue: (await import('eslint-plugin-vue')).default,
      prettier: (await import('eslint-plugin-prettier')).default,
      'unused-imports': (await import('eslint-plugin-unused-imports')).default,
    },
    rules: {
      'import/prefer-default-export': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
]
