# 004 API Route 実装

status: todo

## 目的
- Client から `useQuery`/`useMutation` で叩ける API を揃える。
- 認証必須のルートと公開ルートを明確に分離する。

## 作業内容
1) `src/app/api` に route handlers を追加。
2) handler から `src/external/handlers/*` を呼び出す。
3) 認証必須の API では Supabase のユーザー情報を取得し、未認証は 401。

## 追加するAPI
### 認証必須
- `GET /api/good-things/today`
- `GET /api/good-things?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `POST /api/good-things`
- `DELETE /api/good-things/[id]`

### 公開
- `GET /api/board?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=50`

## 受け入れ基準
- API が 200/401/400 を適切に返す。
- DTO バリデーションに失敗した場合は 400。
- `GET /api/board` は未ログインでも取得できる。

## 影響ファイル
- 追加: `src/app/api/good-things/today/route.ts`
- 追加: `src/app/api/good-things/route.ts`
- 追加: `src/app/api/good-things/[id]/route.ts`
- 追加: `src/app/api/board/route.ts`
