# External レイヤー アーキテクチャ

このドキュメントは `src/external` の構成を他プロジェクトでも再利用できるように整理したものです。目的は、**サーバー専用の統合処理・ドメインロジック・永続化を一つの境界に閉じ込める** ことです。

## 1. 目的と境界

- `external/` はサーバー専用。UI やクライアントロジックは置かない。
- `features/` からは **handler と DTO だけ** を参照する。service / repository へ直接依存しない。
- domain はフレームワーク非依存（Next.js や DB 型を持たない）。
- handler が入力検証・認可・DTO 変換の入口になる。

## 2. ディレクトリ構成

```
external/
├── client/                 # インフラ接続の低レイヤー
│   ├── db/                 # Drizzle クライアント・スキーマ・マイグレーション
│   └── gcp/                # 外部 API クライアント（gcpは例）
├── domain/                 # 純粋なドメインモデル + インターフェース
├── dto/                    # Zod スキーマ + 通信用 DTO
├── handler/                # サーバーアクション（command/query）
├── repository/             # DB 永続化（domain interface 実装）
└── service/                # アプリケーションサービス（オーケストレーション）
```

ドメインは各レイヤーで同じ粒度でディレクトリを切る。例：`invoice` ドメインなら `domain/invoice`, `dto/invoice`, `handler/invoice`, `service/invoice`, `repository/db/InvoiceRepository.ts` を用意する。

## 3. フォルダ別ファイル規約

### `domain/<domain>/`

純粋なドメインモデルとインターフェース。

- `<domain>.ts` - 集約/エンティティ（状態遷移と不変条件）
- `<domain>-id.ts` - ID の値オブジェクト
- `<domain>.repository.ts` - リポジトリ interface（DB 依存なし）
- `events/` - ドメインイベント(optional)
- `specifications/` - ビジネスルールの判定(optional)
- `index.ts` - ローカルの barrel export

### `dto/<domain>/`

ハンドラと feature が共有する入力/出力の定義。

- `<domain>.dto.ts` - UI が使うレスポンス DTO
- `<domain>.command.dto.ts` - 変更系の Zod スキーマ + 入力/レスポンス型
- `<domain>.query.dto.ts` - 取得系の Zod スキーマ + 入力/レスポンス型
- `index.ts` - barrel export

### `handler/<domain>/`

`features/` が参照する唯一の入口。command と query を分離する。

- `command.server.ts` - `import 'server-only'`。入力検証、認可、サービス呼び出し、DTO 変換。
- `query.server.ts` - 参照系。必要に応じて service / repository を利用。
- `command.action.ts` - `'use server'` の Server Actions。`*.server.ts` を呼ぶ薄いラッパー。
- `query.action.ts` - 取得系の Server Actions。
- `shared.ts` - サービス/リポジトリの wiring と DTO マッピング。
- `index.ts` - barrel export。
- `*.server.ts` - 補助的なサーバー専用モジュール（例: `handler/auth/token.server.ts`）。

### `service/<domain>/`

ユースケースやオーケストレーションを担当。

- `<Domain>Service.ts` / `<Domain>WorkflowService.ts` - 主要ロジック。
- 必要なら複数サービスに分割。
- `__tests__/` での単体テストも可。

### `repository/`

domain の repository interface を DB 用に実装する。

- `repository/db/<Domain>Repository.ts` - Prisma クエリ + ドメイン変換。
- `index.ts` - 実装の barrel export。

### `client/`

DB 接続や外部 API を扱う最下層。

- `client/db/client.ts` - DB クライアント。
- `client/db/schema/*.ts` - テーブルスキーマ。
- `client/db/migrations/` - 自動生成マイグレーション。
- `client/gcp/*` - 外部 API クライアント（gcpは例）

## 4. データフロー

```
features/*
  -> external/handler/<domain>/*.action.ts
    -> external/handler/<domain>/*.server.ts
      -> external/service/<domain>/*
        -> external/repository/db/*
          -> external/client/db/*
      -> external/dto/<domain> (入力検証 + DTO)
      -> external/domain/<domain> (ドメイン規則)
```

handler が DTO を検証し、service がユースケースを実行し、repository が DB へ反映します。

## 5. 新しいドメインを追加する手順

1. `domain/<domain>` を作る（エンティティ/ID/Repository interface/イベント）。
2. `dto/<domain>` を作る（command/query の Zod スキーマと DTO 定義）。
3. `repository/db` で interface を実装する。
4. `service/<domain>` を作る（ユースケースとオーケストレーション）。
5. `handler/<domain>` を作る（`*.server.ts` と `*.action.ts`）。
6. `features/` からは handler のみを import する。

## 6. 境界を守るためのルール

- `external/` は server-only。クライアントから参照しない。
- 入力は必ず Zod で検証する。
- 書き込みは `command`、読み取りは `query` に分離する。
- domain からインフラ依存を排除する。
- DTO の生成は handler か `shared.ts` で行う。
