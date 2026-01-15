# 003 external: DTO/Handler/Service/Repository 実装

status: doing

## 目的

- 外部層（external）に GoodThing の入出力定義・業務処理・永続化を集約し、UI/feature から直接 DB を触らない構造にする。
- `features/` は **handler と DTO のみ** を参照する（service/repository/client へは依存しない）。

## 作業内容

1. `src/external/domain/good-thing` を作成し、ドメインモデル + repository interface を用意。
2. `src/external/dto/good-thing` を作成し、Zod で command/query の入力と DTO を定義。
3. `src/external/repository/db/GoodThingRepository.ts` を実装（Prisma 経由で永続化）。
4. `src/external/service/good-thing` を作成し、ユースケース/オーケストレーションを実装。
5. `src/external/handler/good-thing` を作成し、command/query を分離（`*.server.ts` と `*.action.ts`）。
6. handler/server/repository/client に `server-only` を付ける。

## 期待するファイル構成

```
src/external/
├── client/
│   └── db/
│       └── client.ts
├── domain/
│   └── good-thing/
│       ├── good-thing.ts
│       ├── good-thing-id.ts
│       ├── good-thing.repository.ts
│       └── index.ts
├── dto/
│   └── good-thing/
│       ├── good-thing.dto.ts
│       ├── good-thing.command.dto.ts
│       ├── good-thing.query.dto.ts
│       └── index.ts
├── handler/
│   └── good-thing/
│       ├── command.server.ts
│       ├── command.action.ts
│       ├── query.server.ts
│       ├── query.action.ts
│       ├── shared.ts
│       └── index.ts
├── repository/
│   └── db/
│       └── GoodThingRepository.ts
└── service/
    └── good-thing/
        └── GoodThingService.ts
```

## DTO（例）

- `GoodThingItem`
- `SaveGoodThingsInput`
- `GoodThingsByDateInput`
- `BoardQueryInput`

## Handler 仕様（例）

### Query

- `getGoodThingsByDate(userId, date)`
- `getGoodThingsRange(userId, from, to)`
- `getBoardItems({ from?, to?, limit? })`

### Command

- `saveGoodThings(userId, date, items)`
  - 既存の当日記録は置き換え（deleteMany → createMany）
  - 3件超過は DTO バリデーションで弾く
- `deleteGoodThing(userId, id)`

## 受け入れ基準

- `features/` からは handler + DTO のみを参照している。
- handler が Zod で入力を検証し、service/repository へ処理を委譲している。
- `server-only` が server 専用のファイル（handler/server/repository/client）に付与されている。
- import 順序: `@/features` → `@/shared` → `@/external` を遵守。

## 影響ファイル

- 追加: `src/external/domain/good-thing/*`
- 追加: `src/external/dto/good-thing/*`
- 追加: `src/external/handler/good-thing/*`
- 追加: `src/external/service/good-thing/GoodThingService.ts`
- 追加: `src/external/repository/db/GoodThingRepository.ts`
- 追加: `src/external/client/db/client.ts`
