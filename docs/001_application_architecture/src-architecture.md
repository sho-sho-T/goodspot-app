# /src アーキテクチャガイド

このドキュメントは `/src` の構成と役割を、他プロジェクトでも使える抽象度でまとめたものです。  
Next.js App Router を前提にし、**ルーティング層を薄く保ち、機能単位で分離し、インフラ層を外側に押し出す**構造を扱います。

---

## 1. 全体像（層と責務）

```
app/          : ルーティングとレイアウト（薄い）
features/     : 機能単位の UI / 画面オーケストレーション
shared/       : 横断的な UI・ユーティリティ
external/     : サーバー専用のインフラ層（DTO/Handler/Service/Repository）
middleware.ts : ルーティング前の横断処理
test/         : テスト支援
```

図: レイヤ境界（依存方向）

```
            ┌───────────────┐
            │     app/      │  ルーティング
            └───────┬───────┘
                    │
            ┌───────▼───────┐
            │   features/   │  機能スライス
            └───────┬───────┘
                    │
            ┌───────▼───────┐
            │   external/   │  インフラ層
            └───────────────┘
         ▲
         │ 横断利用
   ┌─────┴─────┐
   │  shared/  │  共通基盤
   └───────────┘
```

- `app/` は URL と機能テンプレートの接続点。ビジネスロジックは持たせない。
- `features/` は機能ごとの実装単位。UI とデータ取得の流れを完結させる。
- `shared/` はドメイン非依存の共通部品と基盤。
- `external/` は DB/外部 API などインフラのみに責務を限定。
- `middleware.ts` はリクエスト単位の横断ルールを適用。
- `test/` はユニット/統合テストの補助を提供。

---

## 2. ディレクトリ構成（トップレベル）

| パス                 | 役割                                          |
| -------------------- | --------------------------------------------- |
| `/src/app/`          | App Router のルート、レイアウト、ページ       |
| `/src/features/`     | 機能単位の UI / hooks / server templates      |
| `/src/shared/`       | 共通 UI、共通 hooks、ユーティリティ           |
| `/src/external/`     | DTO / Handler / Service / Repository / Domain |
| `/src/test/`         | テスト用ユーティリティ、モック                |
| `/src/middleware.ts` | ルート前処理（リダイレクト等）                |

---

## 3. app/（ルーティング層）

`app/` は URL と UI をつなぐ薄い層です。  
「ルートグループ」「レイアウト」「ページ」に分かれ、ページ本体は `features/` のサーバーテンプレートへ委譲します。

代表的なファイル種別:

| ファイル      | 役割                                            |
| ------------- | ----------------------------------------------- |
| `layout.tsx`  | ルート単位のレイアウト。`metadata` もここで定義 |
| `page.tsx`    | ルーティングの入口。テンプレート呼び出しのみ    |
| `route.ts`    | API Route（例: `app/api/*`）                    |
| `globals.css` | グローバル CSS                                  |
| `favicon.ico` | アプリのアイコン                                |

ルートグループ例（認証状態別に分離）:

```
app/
├── (guest)/...
├── (authenticated)/...
└── (neutral)/...
```

図: ルーティングからテンプレートへの接続

```
app/(authenticated)/requests/[id]/page.tsx
                │
                ▼
features/requests/components/server/RequestDetailPageTemplate.tsx
                │
                ▼
features/requests/components/client/RequestDetailContainer.tsx
                │
                ▼
features/requests/components/client/RequestDetailPresenter.tsx
```

---

## 4. features/（機能スライス）

機能単位（例: `auth`, `requests`）でディレクトリを分け、UI・クエリ・型・スキーマを同居させます。

### 4-1. 典型的な構成

```
features/<domain>/
├── components/
│   ├── client/
│   │   └── <Widget>/
│   │       ├── <Widget>Container.tsx   # 状態・フックの統合（Client）
│   │       ├── <Widget>Presenter.tsx   # 表示のみ（Stateless）
│   │       ├── use<Widget>.ts          # 画面内ロジック
│   │       ├── index.ts                # barrel
│   │       └── *.test.tsx              # co-located tests
│   └── server/
│       └── <Template>/
│           ├── <Template>.tsx          # Server Component の画面テンプレート
│           └── index.ts                # barrel
├── hooks/
│   ├── query/                          # TanStack Query の読み取り
│   └── mutation/                       # 更新系
├── queries/                            # query keys / fetch helpers
├── schemas/                            # Zod 等のバリデーション
└── types/                              # ドメイン型
```

図: Client Component の内部構成

```
Container (use client)
   │
   ├─ use<Widget>()  ← hooks / query / mutation
   │
   └─ Presenter (stateless)
```

### 4-2. 役割の分離

- **Container**: hooks を束ね、Presenter に props を渡す。
- **Presenter**: JSX のみ。副作用・データ取得を持たない。
- **Server template**: 初期データ取得と SSR を担当。
- **hooks/queries**: DTO を検証し、UI 向けに整形する。

---

## 5. shared/（共通基盤）

ドメインに依存しない UI やユーティリティを集約します。

代表構成:

```
shared/
├── components/
│   ├── layout/         # Header/Sidebar 等のクロム
│   └── ui/             # Button/Input などのプリミティブ
├── providers/          # Query/Auth 等の Provider
├── actions/            # 共通 server action
├── lib/                # ユーティリティ（format, query-client 等）
└── types/              # 共通型
```

---

## 6. external/（サーバー専用インフラ）

DB / 外部 API / ドメインロジックをこの層に閉じ込めます。  
`features/` から直接 `service` や `repository` を触らず、`handler` を経由します。

典型構成:

```
external/
├── dto/                # Zod + DTO 定義
├── handler/            # features から呼ばれる入口（query/command）
├── service/            # アプリケーションサービス
├── repository/         # DB 永続化
├── domain/             # エンティティ / VO / 仕様
└── client/             # DB / 外部 API クライアント
```

図: External 層の責務分離

```
handler (features から呼ばれる入口)
   │
   ├─ service (ユースケース / 集約)
   │     │
   │     └─ repository (永続化)
   │              │
   │              └─ client (DB / 外部 API)
   │
   └─ dto (入出力バリデーション)
```

ファイルの命名ルール例:

- `*.query.ts`, `*.command.ts` : 読み取り・更新の責務分離
- `*.server.ts` : server-only の入口
- `*.action.ts` : Server Action のラッパー
- `*.dto.ts` : DTO・バリデーション定義

---

## 7. test/（テスト補助）

```
test/
├── setup.ts                # テストランナー設定
├── test-utils.tsx          # 共通レンダリングヘルパー
├── server-component-utils  # Server Component のテスト補助
└── mocks/                  # Next.js 等のモック
```

ユニットテストは `features/**` 内に co-locate する方針で、  
この `test/` は共通ヘルパーに限定します。

---

## 8. よく使うファイル種別の意味

| 種別              | 意味                   |
| ----------------- | ---------------------- |
| `index.ts`        | barrel export          |
| `*.container.tsx` | フックと UI を接続     |
| `*.presenter.tsx` | 表示のみ               |
| `*.action.ts`     | Server Action          |
| `*.server.ts`     | server-only            |
| `*.dto.ts`        | DTO 定義               |
| `*.schema.ts`     | バリデーションスキーマ |
| `*.test.ts(x)`    | テスト                 |

---

## 9. 代表的なデータフロー

```
app/page.tsx
  → features/**/components/server/*
      → features/**/hooks/query
          → external/handler/** (query/command)
              → external/service/** → repository/** → client/db
```

この流れを守ることで、**UI / 機能 / インフラ**の境界が安定し、別プロジェクトにも移植しやすくなります。
