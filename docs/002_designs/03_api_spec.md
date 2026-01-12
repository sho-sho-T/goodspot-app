# API / Server Actions 仕様

## 方針
- Next.js App RouterでServer ActionsまたはRoute Handlersを利用
- クライアントからはfetch/Server Actionで呼び出す
- `@/external` にDB/DTO/サービスを配置

## 1. 記録（自分用）
※ 認証必須（ログインユーザーのみ利用可）

### 1.1 当日記録取得
- **Method**: GET
- **Path**: `/api/good-things/today`
- **Query**: なし
- **Response**
```json
{
  "date": "2026-01-12",
  "items": [
    {"id": "uuid", "text": "...", "isPublic": true}
  ]
}
```

### 1.2 記録登録/更新（一括保存）
- **Method**: POST
- **Path**: `/api/good-things`
- **Body**
```json
{
  "date": "2026-01-12",
  "items": [
    {"text": "...", "isPublic": true}
  ]
}
```
- **Validation**
  - `items.length <= 3`
  - `text`は1〜140文字
- **Response**
```json
{
  "date": "2026-01-12",
  "items": [
    {"id": "uuid", "text": "...", "isPublic": true}
  ]
}
```

### 1.3 記録削除（任意）
- **Method**: DELETE
- **Path**: `/api/good-things/:id`

## 2. 掲示板

### 2.1 公開記録取得
- **Method**: GET
- **Path**: `/api/board`
- **Query**
  - `from` (optional, YYYY-MM-DD)
  - `to` (optional, YYYY-MM-DD)
  - `limit` (default 50)
- **Response**
```json
{
  "items": [
    {
      "id": "uuid",
      "date": "2026-01-12",
      "text": "..."
    }
  ]
}
```

## 3. エラーレスポンス共通
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "1日最大3件までです"
  }
}
```

## 4. 認可
- `/api/good-things*`はログイン必須
- `/api/board`は公開

## 5. 未決定/要確認
- 一括保存 vs 1件ごとの保存
- 掲示板のレート制限
