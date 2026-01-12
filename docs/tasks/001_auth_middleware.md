# 001 認証ミドルウェア/公開ルート整理

status: done

## 目的

- 認証必須の方針を明確化し、公開ページ（掲示板など）は誰でも閲覧できるようにする。
- App Router の方針に沿って `src/middleware.ts` を配置する。

## 背景/現状

- `src/external/supabase/middleware.ts` に `updateSession` が定義済みだが、`src/middleware.ts` は未作成。
- 掲示板は「完全匿名・誰でも閲覧可」の要件がある。

## 作業内容

1. `src/middleware.ts` を新規作成し、`updateSession` を呼び出す。
2. 公開ルートを allowlist 方式で除外する。
   - 例: `/login`, `/auth/*`, `/board`, `/error`（既存）
3. `config.matcher` を設定し、静的アセット/Next.js内部を除外。

## 参考実装方針（サンプル）

```ts
// src/middleware.ts
import { updateSession } from '@/external/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- `updateSession` 側の allowlist 条件に `/board` を追加。

## 受け入れ基準

- 未ログインで `/board` にアクセスできる。
- 未ログインで `/login` 以外の認証必須ページにアクセスすると `/login` にリダイレクトされる。
- ログイン済みで通常ページにアクセスできる。

## 影響ファイル

- 追加: `src/middleware.ts`
- 変更: `src/external/supabase/middleware.ts`

## 備考

- ルートグループ `(guest)` / `(authenticated)` / `(public)` は後続タスクで整理。
