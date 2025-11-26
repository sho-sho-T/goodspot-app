import { FlatCompat } from '@eslint/eslintrc'
import { createRequire } from 'module'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// @ts-check

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const localRules = require('./eslint_local_rules')

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  ...compat.plugins('prettier'),
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**',
      'test-runner-jest.config.js',
      '**/*.d.ts',
    ],
  },
  {
    files: ['eslint_local_rules/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      'local-rules': {
        rules: localRules,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'local-rules/use_server-check': 'error',
      'local-rules/use_client-check': 'error',
      'local-rules/restrict_service_imports': 'error',
      'local-rules/require_server_only': 'error',
      'local-rules/restrict_action_imports': 'error',
      'local-rules/use_nextjs_helpers': 'error',
      'local-rules/no_external_domain_imports': 'off',
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: 'next',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@/features/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/shared/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/external/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          // Separate type imports and group them at the end
          warnOnUnassignedImports: false,
        },
      ],
      // Additional rule to separate type imports
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      // Group imports from the same module
      'import/no-duplicates': ['error', { 'prefer-inline': false }],
      // Detect unused imports
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['src/features/**', 'src/shared/**', 'src/app/**'],
    rules: {
      'local-rules/no_external_domain_imports': 'error',
    },
  },
  {
    files: ['src/external/**'],
    rules: {
      'local-rules/no_external_domain_imports': 'off',
    },
  },
  {
    files: ['src/features/**/types/**', 'src/shared/**/types/**'],
    rules: {
      'local-rules/no_external_domain_imports': 'off',
    },
  },
]

export default eslintConfig
