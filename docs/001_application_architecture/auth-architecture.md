# 認証アーキテクチャ（AuthenticatedLayoutWrapper / redirect.server / session.server）

このドキュメントは、認証周りの責務分離と実装フローをまとめたものです。
他アプリケーションでも同様の構成を再現できるよう、
ディレクトリ構成、各ファイルの責務、データフローを整理します。

---

## 1. 目的と設計方針

- **認証チェックはサーバー側で完結させる**（`server-only`）
- **App Router のレイアウトでガード**し、ページ単位での繰り返しを避ける
- **セッション取得は 1 か所に集約**し、認証判定の入口を共通化する

---

## 2. ディレクトリ構成

```
frontend/src/
├── app/
│   └── (authenticated)/
│       └── layout.tsx
├── shared/
│   └── components/
│       └── layout/
│           └── server/
│               └── AuthenticatedLayoutWrapper/
│                   ├── AuthenticatedLayoutWrapper.tsx
│                   └── index.ts
└── features/
    └── auth/
        └── servers/
            ├── session.server.ts
            └── redirect.server.ts
```

---

## 3. 各ファイルの責務

### `frontend/src/features/auth/servers/session.server.ts`

- **セッション取得の単一入口**
- `getServerSession(authOptions)` を呼び出すだけに限定
- 他レイヤーは必ず `getSessionServer()` を通して認証状態を確認する

### `frontend/src/features/auth/servers/redirect.server.ts`

- **認証状態に応じたリダイレクト制御**
- `isAuthenticatedServer()` でセッション存在チェック
- `requireAuthServer()`
  - 未認証なら `/login` にリダイレクト
- `redirectIfAuthenticatedServer()`
  - 認証済みなら `/dashboard` にリダイレクト

### `frontend/src/shared/components/layout/server/AuthenticatedLayoutWrapper/AuthenticatedLayoutWrapper.tsx`

- **認証済みレイアウトのガード**
- `requireAuthServer()` を呼び出し、未認証なら即リダイレクト
- 認証済みの場合のみ、共通 UI（Header/Sidebar）を描画
- `HydrationBoundary` を使い、クライアント側の Query を同期

### `frontend/src/app/(authenticated)/layout.tsx`

- **ルートグループ単位で認証を強制**
- `AuthenticatedLayoutWrapper` を通して画面を描画
- ここでガードすることで、配下の page は個別に認証処理を持たない

---

## 4. データフロー（認証チェック）

```
app/(authenticated)/layout.tsx
  → AuthenticatedLayoutWrapper (server)
      → requireAuthServer()
          → getSessionServer()
              → getServerSession(authOptions)
```

- **最上位の layout が認証の境界**になる
- 画面側は認証済み前提で実装できる

---

## 5. 他プロジェクトでの再利用ポイント

- **`session.server.ts` は薄く保つ**
  - 認証ライブラリ（NextAuth 以外）に差し替える場合はここだけ変更
- **`redirect.server.ts` でガード方針を統一**
  - `requireAuthServer` と `redirectIfAuthenticatedServer` の 2 本立ては
    ほとんどのアプリで再利用可能
- **layout で認証を強制**
  - ルートグループ単位でガードすることで、ページ単位の実装負担を削減

---

## 6. 実装例の参照先

- `frontend/src/app/(authenticated)/layout.tsx`
- `frontend/src/shared/components/layout/server/AuthenticatedLayoutWrapper/AuthenticatedLayoutWrapper.tsx`
- `frontend/src/features/auth/servers/redirect.server.ts`
- `frontend/src/features/auth/servers/session.server.ts`
