# 003 external: DTO/Handler 実装

status: todo

## 目的
- 外部層（external）に GoodThing の入出力定義と業務処理を集約し、UI から直接 DB を触らない構造にする。

## 作業内容
1) `src/external/dto` を新規作成し、Zod で入出力型を定義。
2) `src/external/handlers` を新規作成し、クエリ/コマンドを分離。
3) `server-only` を付ける。

## 期待するファイル構成
```
src/external/
├── dto/
│   └── good-thing.dto.ts
└── handlers/
    ├── good-thing.query.ts
    └── good-thing.command.ts
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
- DTO と handler が外部層にまとまり、UI からは handler 経由でのみアクセスできる。
- `server-only` が付与されている。
- import 順序: `@/features` → `@/shared` → `@/external` を遵守。

## 影響ファイル
- 追加: `src/external/dto/good-thing.dto.ts`
- 追加: `src/external/handlers/good-thing.query.ts`
- 追加: `src/external/handlers/good-thing.command.ts`
