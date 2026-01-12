# データモデル設計

## 1. エンティティ一覧

- User（認証必須）
- GoodThing（良いこと記録）

## 2. テーブル定義（案）

### 2.1 User

| カラム    | 型        | 制約     | 説明       |
| --------- | --------- | -------- | ---------- |
| id        | UUID      | PK       | ユーザーID |
| createdAt | timestamp | not null | 作成日時   |

### 2.2 GoodThing

| カラム    | 型        | 制約     | 説明             |
| --------- | --------- | -------- | ---------------- |
| id        | UUID      | PK       | 記録ID           |
| userId    | UUID      | not null | 記録作成者       |
| date      | date      | not null | 記録対象日       |
| text      | string    | not null | 良いこと本文     |
| isPublic  | boolean   | not null | 掲示板公開フラグ |
| createdAt | timestamp | not null | 作成日時         |
| updatedAt | timestamp | not null | 更新日時         |

## 3. インデックス/制約

- `GoodThing(date, isPublic)` 掲示板取得高速化
- `GoodThing(userId, date)` 振り返り取得高速化
- 1日最大3件はアプリ層で制御（必要ならDBトリガー/制約を検討）

## 4. Prismaモデル例（イメージ）

```prisma
model User {
  id          String     @id @default(uuid())
  goodThings  GoodThing[]
  createdAt   DateTime   @default(now())
}

model GoodThing {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      DateTime
  text      String
  isPublic  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([date, isPublic])
  @@index([userId, date])
}
```
