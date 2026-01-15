# Playground フロー（フォーム入力 → DB 保存）

このドキュメントは `/playground` ページで「作成」ボタンを押したときに、
フォーム入力から DB 保存までがどのように流れるかを具体的に整理したものです。

## 1. UI（フォーム送信）

- `src/app/playground/page.tsx` のフォームが送信される。
- `createPlaygroundFormAction` が `FormData` から **必要なキーだけ** を抽出する。
  - `name` と `value` を取り出し、`CreatePlaygroundInput` 形に整える。
  - `$ACTION_*` などの内部キーは渡さない（Zod `strict()` 対応）。

## 2. Server Action（UI 入口）

- `src/external/handler/playground/command.action.ts`
  - `createPlaygroundAction` が呼ばれる。
  - ここでは `createPlaygroundServer` を呼び出すだけに留める。
  - 成功/失敗に関係なく `revalidatePath('/playground')` で再描画を促す。

## 3. Handler（認可・入力検証）

- `src/external/handler/playground/command.server.ts`
  1. **認可**: `createAuthClient().auth.getUser()` でログイン状態を確認。
     - 未ログインなら `{ success: false, error: 'Unauthorized' }` を返して終了。
  2. **入力検証**: `createPlaygroundSchema.parse(data)` で Zod 検証。
     - `name` は空文字禁止、`value` は整数。
  3. **Service 呼び出し**: 検証済みデータを `playgroundService.create()` に渡す。
  4. **DTO 変換**: `mapPlaygroundToDto()` で UI 用 DTO に整形して返す。

## 4. Service（ユースケース）

- `src/external/service/playground/PlaygroundService.ts`
  - `create` が `PlaygroundRepository.create` を呼ぶ。
  - ここではオーケストレーションのみ行い、永続化は Repository に委譲する。

## 5. Repository（DB 永続化）

- `src/external/repository/db/PlaygroundRepository.ts`
  - `prisma.playground.create` で DB へ保存する。
  - 保存された行を `Playground.restore` に変換して返す。

## 6. DTO 変換とレスポンス

- `src/external/handler/playground/shared.ts`
  - `mapPlaygroundToDto` が `Playground` から表示用 DTO を作成する。
  - `createdAt/updatedAt` は ISO 文字列に変換して返す。

## 7. 画面再描画

- `revalidatePath('/playground')` によりサーバーコンポーネントが再実行され、
  `getPlaygroundListServer` が最新の DB 内容を取得して UI に反映する。

## 参考：更新・削除の違い

- **更新**: `updatePlaygroundValueAction` → `updatePlaygroundValueServer`
  - `id` と `value` を Zod 検証し、`updateValue` を呼ぶ。
- **削除**: `deletePlaygroundAction` → `deletePlaygroundServer`
  - `id` を Zod 検証し、`delete` を呼ぶ。

## つまずきやすいポイント

- `FormData` をそのまま `Object.fromEntries` で渡すと、
  Zod `strict()` で **余計なキーが弾かれる**。
- 未ログインだと `Unauthorized` で処理が止まる（HTTP 200 でも DB 保存はされない）。
