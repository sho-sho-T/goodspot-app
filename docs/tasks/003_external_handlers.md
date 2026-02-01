# 003 external: DTO/Handler/Service/Repository 実装（DailyRecord集約）

status: doing

## 目的

- 外部層（external）に **ドメインモデル（DailyRecord集約）** の入出力定義・業務処理・永続化を集約し、UI/feature から直接 DB を触らない構造にする。
- `features/` は **handler と DTO のみ** を参照する（service/repository/client へは依存しない）。
- `docs/003_domain/domain_model.md` の **境界づけられたコンテキスト（記録/共有）** と **不変条件** をタスクに反映する。

## 前提（実装方針）

- 永続化は既存の `GoodThing` テーブルを利用する（`userId + date` を DailyRecord として復元）。
- 掲示板は読み取りモデルとして扱い、返却DTOには記録者情報（`userId`）を含めない（匿名性をモデルで保証）。

## 作業内容

1. `src/external/domain/daily-record` を作成し、DailyRecord 集約（+ 値オブジェクト）を用意する。
2. `src/external/dto/recording` を作成し、記録ユースケースの command/query の入力と DTO を定義する（Zod）。
3. `src/external/dto/board` を作成し、掲示板ユースケースの query 入力と DTO を定義する（Zod）。
4. `src/external/repository/db/DailyRecordRepository.ts` を実装（Prisma 経由で永続化）。
5. `src/external/service/recording/DailyRecordService.ts` を作成し、`getOrCreateDailyRecord` / `saveDailyRecord` 等を実装する。
6. `src/external/service/board/BoardQueryService.ts` を作成し、公開データのみを返す query を実装する。
7. `src/external/handler/recording` / `src/external/handler/board` を作成し、command/query を分離（`*.server.ts` と `*.action.ts`）する。
8. handler/server/repository/client に `server-only` を付ける。

## 期待するファイル構成

```
src/external/
├── client/
│   └── db/
│       └── client.ts
├── domain/
│   └── daily-record/
│       ├── daily-record.ts
│       ├── daily-record-id.ts
│       ├── daily-record.repository.ts
│       ├── good-thing.ts
│       ├── good-thing-id.ts
│       ├── good-thing-text.ts
│       ├── record-date.ts
│       ├── visibility.ts
│       └── index.ts
├── dto/
│   ├── recording/
│   │   ├── good-thing.dto.ts
│   │   ├── recording.command.dto.ts
│   │   ├── recording.query.dto.ts
│   │   └── index.ts
│   └── board/
│       ├── board.dto.ts
│       ├── board.query.dto.ts
│       └── index.ts
├── handler/
│   ├── recording/
│   │   ├── command.server.ts
│   │   ├── command.action.ts
│   │   ├── query.server.ts
│   │   ├── query.action.ts
│   │   ├── shared.ts
│   │   └── index.ts
│   └── board/
│       ├── query.server.ts
│       ├── query.action.ts
│       ├── shared.ts
│       └── index.ts
├── repository/
│   └── db/
│       └── DailyRecordRepository.ts
└── service/
    ├── recording/
    │   └── DailyRecordService.ts
    └── board/
        └── BoardQueryService.ts
```

## DTO（例）

### Recording

- `GoodThingItem`
- `SaveDailyRecordInput`
- `DailyRecordByDateInput`
- `DailyRecordsRangeInput`

### Board

- `BoardQueryInput`
- `BoardPostDto`

## Handler 仕様（例）

### Recording Query

- `getDailyRecordByDate(userId, date)`
- `getDailyRecordsRange(userId, from, to)`

### Recording Command

- `saveDailyRecord(userId, date, items)`
  - 記録対象は当日のみ（過去日の保存は不可）
  - 既存の当日記録は置き換え（transaction + deleteMany → createMany）
  - 3件超過は DTO バリデーションで弾く（集約でも防御する）
- `deleteGoodThing(userId, id)`（必要なら）

### Board Query

- `getBoardPosts({ from?, to?, limit? })`
  - 公開データのみ（`isPublic=true`）を返す
  - 返却DTOに `userId` を含めない

## 受け入れ基準

- `features/` からは handler + DTO のみを参照している。
- handler が Zod で入力を検証し、service/repository へ処理を委譲している。
- `server-only` が server 専用のファイル（handler/server/repository/client）に付与されている。
- import 順序: `@/features` → `@/shared` → `@/external` を遵守。
- 不変条件（1日最大3件 / 1〜140文字 / デフォルト公開）が DailyRecord集約（+ 値オブジェクト）で表現されている。

## 影響ファイル

- 追加: `src/external/domain/daily-record/*`
- 追加: `src/external/dto/recording/*`
- 追加: `src/external/dto/board/*`
- 追加: `src/external/handler/recording/*`
- 追加: `src/external/handler/board/*`
- 追加: `src/external/service/recording/DailyRecordService.ts`
- 追加: `src/external/service/board/BoardQueryService.ts`
- 追加: `src/external/repository/db/DailyRecordRepository.ts`
- 追加: `src/external/client/db/client.ts`
