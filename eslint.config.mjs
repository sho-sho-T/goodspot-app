import { createRequire } from 'module'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

// @ts-check

// ESM環境でCommonJS互換性を確保するための設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

// カスタムリンタールールをインポート
const localRules = require('./eslint_local_rules')

const eslintConfig = [
  // Prettier との競合を避けるための設定
  prettierConfig,

  // リントチェック対象外のディレクトリ・ファイルを指定
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

  // カスタムルールファイル自体では require を許可
  {
    files: ['eslint_local_rules/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // すべてのTypeScript/JavaScriptファイルに適用する基本ルール
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'local-rules': {
        rules: localRules,
      },
      prettier: eslintPluginPrettier,
      import: importPlugin,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // Prettierのフォーマット違反をエラーとして検出
      'prettier/prettier': 'error',

      // カスタムリンタールールを有効化
      'local-rules/use-server-check': 'error', // *.action.ts で 'use server' を必須化
      'local-rules/use-client-check': 'error', // クライアントコンポーネントに 'use client' を必須化
      'local-rules/restrict-service-imports': 'error', // services のインポートを制限
      'local-rules/require-server-only': 'error', // サーバーサイド専用ファイルで 'server-only' を必須化
      'local-rules/restrict-action-imports': 'error', // action のインポートを制限
      'local-rules/use-nextjs-helpers': 'error', // PageProps / LayoutProps の利用を促進
      'local-rules/no-external-domain-imports': 'error', // デフォルトでは無効（ディレクトリごとに制御）

      // インポート文の順序とグルーピングを統一
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'], // Node.js組み込み・外部パッケージ
            'internal', // プロジェクト内部
            ['parent', 'sibling', 'index'], // 相対パス
            'type', // 型インポート
          ],
          pathGroups: [
            // React / Next.js を最優先
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
            // features / shared / external の順序を制御
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
          'newlines-between': 'always', // グループ間に空行を挿入
          alphabetize: {
            order: 'asc', // アルファベット昇順
            caseInsensitive: true,
          },
          // Separate type imports and group them at the end
          warnOnUnassignedImports: false,
        },
      ],
      // 型インポートはトップレベルで分離
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

      // 同一モジュールからの重複インポートを防止
      'import/no-duplicates': ['error', { 'prefer-inline': false }],

      // 未使用変数を検出（_プレフィックスは除外）
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

  // features / shared / app 配下では external/domain のインポートを禁止
  {
    files: ['src/features/**', 'src/shared/**', 'src/app/**'],
    rules: {
      'local-rules/no-external-domain-imports': 'error',
    },
  },

  // external 配下では external/domain のインポートを許可
  {
    files: ['src/external/**'],
    rules: {
      'local-rules/no-external-domain-imports': 'off',
    },
  },

  // 型定義ファイルでは external/domain のインポートを許可（再エクスポート用）
  {
    files: ['src/features/**/types/**', 'src/shared/**/types/**'],
    rules: {
      'local-rules/no-external-domain-imports': 'off',
    },
  },
]

export default eslintConfig
