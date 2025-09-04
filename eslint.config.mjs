import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    plugins: ['prettier'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',

      // Code quality rules (not formatting)
      'prefer-arrow-callback': ['error'],
      'prefer-template': ['error'],

      // Additional useful rules
      'no-console': 'warn', // Warn on console.log
      'no-var': 'error', // Disallow var, use let/const
      'prefer-const': 'error', // Prefer const when possible
      'no-unused-vars': [
        'warn',
        {
          vars: 'all', // Check all variables
          args: 'after-used', // Only warn for unused arguments after the last used one
          argsIgnorePattern: '^_', // Ignore arguments prefixed with "_"
          ignoreRestSiblings: true,
        },
      ], // Error on unused variables
      eqeqeq: ['error', 'always'], // Require === and !==
      curly: ['error', 'all'], // Require curly braces

      // React/JSX specific rules (already included via next/core-web-vitals)
      // 'import/order': [
      //   'warning',
      //   { groups: ['builtin', 'external', 'internal'] },
      // ],
      'import/no-unresolved': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
