// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist', 'storybook-static']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    globals: globals.browser,
  },
}, {
  // Los iconos vienen de lucide-react; un <svg> a mano reintroduce el dibujo propio (R37).
  files: ['src/**/*.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-syntax': ['error', {
      selector: "JSXOpeningElement[name.name='svg']",
      message: 'Usa un icono de lucide-react (o createLucideIcon) en lugar de un <svg> a mano.',
    }],
  },
}, ...storybook.configs["flat/recommended"]])
