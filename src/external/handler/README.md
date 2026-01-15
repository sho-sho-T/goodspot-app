# Handler README（汎用テンプレート）

## 目的

`handler/<domain>` は UI からの入口となる Server Actions を提供します。
入力検証・認可・サービス呼び出し・DTO 変換をこの層に集約します。

このREADMEは特定ドメインに依存しない形で、Handler 層の責務を整理したものです。

## ファイル構成と役割

### `command.action.ts`

- **Server Actions の公開入口**: `'use server'` を付けた関数を定義。
- **ロジック委譲**: `command.server.ts` を呼び出す薄いラッパーにする。
- **型の再公開**: 入力/レスポンス型を再 export して利用側を簡潔にする。

### `command.server.ts`

- **実処理の本体**: 認証/認可、Zod 検証、サービス呼び出しを担当。
- **エラーハンドリング**: `ZodError` を共通処理し、ユーザー向けのメッセージに整形。

### `query.action.ts`

- **参照系の Server Actions**: 一覧/取得などの呼び出し入口を提供。

### `query.server.ts`

- **参照系の実処理**: 認可・入力正規化・Service/Repository 呼び出しを行う。

### `shared.ts`

- **サービスの組み立て**: Repository/Service の wiring を共通化する。
- **DTO 変換**: ドメインエンティティを UI 用 DTO に変換する関数を配置する。

## 実装方針（参考）

- **Server Actions は薄く**: `*.action.ts` は呼び出しのみに専念する。
- **`*.server.ts` に責務集中**: 認証・検証・サービス連携をまとめる。
- **DTO を唯一の入力契約にする**: Handler で `schema.parse` してから処理する。
- **ドメインは DTO へ変換**: UI にエンティティを直接返さない。

## 他モジュールとの関係（参考）

- DTO は `@/external/dto/<domain>` を利用して入力・レスポンス型を統一する。
- サービスは `@/external/service/<domain>` を利用する。
