# 画面コンポーネント実装ガイド（page → client mount）

このドキュメントは、`page.tsx` からクライアントコンポーネントをマウントするまでの
実装アーキテクチャ、ディレクトリ構成、各ファイルの責務をまとめたものです。
新しい画面実装時に迷わないための手順と判断基準を提供します。

---

## 1. 画面実装の全体フロー

```
app/(group)/.../page.tsx
  → features/<domain>/components/server/<PageTemplate>
      → (SSR / prefetch)
      → HydrationBoundary
          → features/<domain>/components/client/<Widget>
              → <Widget>Container
                  → hooks/query|mutation
                      → external/handler (server action)
```

- **page.tsx は薄く**: ルーティングの入口として、テンプレート呼び出しと
  `params` / `searchParams` の解釈だけを行う。
- **Server Template が SSR を担当**: 初期データ取得や TanStack Query の
  prefetch を実行し、必要に応じて `HydrationBoundary` でクライアントをマウントする。
- **Client は Container → Presenter**: 状態取得と副作用は Container、
  表示は Presenter に分離する。

---

## 2. ディレクトリ構成例（画面に関わる範囲）

```
src/
├── app/
│   └── (authenticated)/requests/[requestId]/page.tsx
├── features/
│   └── requests/
│       ├── components/
│       │   ├── server/
│       │   │   └── RequestDetailPageTemplate/
│       │   │       ├── RequestDetailPageTemplate.tsx
│       │   │       └── index.ts
│       │   └── client/
│       │       └── RequestDetail/
│       │           ├── RequestDetail.tsx
│       │           ├── RequestDetailContainer.tsx
│       │           ├── RequestDetailPresenter.tsx
│       │           ├── useRequestDetail.ts
│       │           └── index.ts
│       ├── hooks/
│       │   └── query/
│       │       └── useRequestDetailQuery.ts
│       ├── queries/
│       │   ├── keys.ts
│       │   └── requestList.helpers.ts
│       └── types/
│           └── index.ts
└── shared/
    └── providers/
        └── QueryProvider/
```

---

## 3. 各ファイルの責務

### app/（ページ）

- `frontend/src/app/(group)/.../page.tsx`
  - ルーティングの入口。
  - `PageProps<'/path'>` を使って `params` / `searchParams` を取得。
  - 画面テンプレート（Server Component）を呼ぶだけにする。

### features/\*\*/components/server（テンプレート）

- `<PageTemplate>.tsx`
  - Server Component。
  - 初期データ取得、TanStack Query の `prefetchQuery` を担当。
  - `HydrationBoundary` でクライアントコンポーネントをマウントする。

### features/\*\*/components/client（UI）

- `<Widget>.tsx`
  - `'use client'` を付けた入口。Container を再 export するだけ。
- `<Widget>Container.tsx`
  - hooks を束ね、Presenter へ props を渡す。
- `<Widget>Presenter.tsx`
  - JSX のみ。副作用やデータ取得は持たない。
- `use<Widget>.ts`
  - query / mutation を組み合わせて UI 向けに整形する。

### features/\*\*/hooks / queries

- `hooks/query/useXQuery.ts`
  - `useQuery` を利用して Server Actions を呼び出す。
- `queries/keys.ts`
  - TanStack Query の key を集中管理。
- `queries/*.helpers.ts`
  - DTO から UI 用の型へマッピング。
  - `ensure*Response` でエラーを正規化。

### shared/providers

- `frontend/src/shared/providers/QueryProvider/QueryProvider.tsx`
  - クライアント側で QueryClient を保持する Provider。
  - Root Layout で常時マウントされる。

---

## 4. Server → Client のマウント方式

### 4-1. TanStack Query を使う場合（基本形）

- Server Template で `prefetchQuery` を実行。
- `HydrationBoundary` でクライアントコンポーネントを囲む。
- クライアントでは `useQuery` が即座に Hydration されたデータを利用。

例:

```
getQueryClient()
  → prefetchQuery(...)
  → <HydrationBoundary> <RequestList /> </HydrationBoundary>
```

### 4-2. クライアントを使わない場合

- 小さなダッシュボードなど、インタラクションが不要な画面は
  Server Template で完結させる。
- `use client` は付けず、純粋な Server Component で描画する。

---

## 5. 新規画面の実装手順（迷わないための手順）

1. **ルートグループを決める**
   - `(guest)` / `(authenticated)` / `(neutral)` から選択。
2. **`page.tsx` を作る**
   - `params` / `searchParams` を読み取り、テンプレートへ渡すだけ。
3. **Server Template を作る**
   - `features/<domain>/components/server/<PageTemplate>` に作成。
   - SSR で必要な prefetch / 整形を実施。
4. **Client UI を作る（必要な場合）**
   - `components/client/<Widget>/` に Container / Presenter / hook を作成。
5. **Query / Helper を用意**
   - `hooks/query` / `queries/*.helpers.ts` に追加。
