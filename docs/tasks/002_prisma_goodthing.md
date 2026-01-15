# 002 Prisma: GoodThing モデル追加

status: done

## 目的
- 良いこと記録を保存するテーブルを追加する。
- 1ユーザーが日付単位で最大3件の記録を保持できる基盤を整える。

## 作業内容
1) `src/external/db/prisma/schema.prisma` に `GoodThing` モデルを追加。
2) `Profile` と関連付け（認証必須のため `userId` は null 禁止）。
3) 掲示板/履歴の取得性能を考慮した index を追加。
4) Prisma migration を作成。

## 仕様
- `GoodThing`
  - `id`: UUID
  - `userId`: UUID（必須）
  - `date`: Date（当日分の記録に使う）
  - `text`: string（1〜140文字）
  - `isPublic`: boolean（デフォルト true）
  - `createdAt` / `updatedAt`
- Index
  - `@@index([date, isPublic])`
  - `@@index([userId, date])`

## 例（Prisma モデル案）
```prisma
model GoodThing {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  user      Profile  @relation(fields: [userId], references: [id])
  date      DateTime @db.Date
  text      String
  isPublic  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([date, isPublic])
  @@index([userId, date])
}
```

## 受け入れ基準
- `GoodThing` が schema に追加され、migration が作成されている。
- `userId` は必須で、Profile と関連付く。

## 影響ファイル
- 変更: `src/external/db/prisma/schema.prisma`
- 追加: `src/external/db/prisma/migrations/*`
