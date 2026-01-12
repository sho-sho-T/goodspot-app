# tasks

Goodspot の実装タスク一覧と運用ルールです。各タスクは 1〜2日で完了できる粒度を想定しています。

## 現状サマリー（確認済み）
- 認証: Supabase Auth 実装済み（ログイン/ログアウト/認証取得）
- 画面: `/login` あり、`/protected` に認証確認サンプルあり
- 外部層: Prisma + Supabase の基盤のみ（業務ドメインは未実装）
- Goodspot 機能（良いこと記録/掲示板）は未実装

## タスク運用ルール
- 各タスクは `status` を更新して管理（todo / doing / done）。
- 依存タスクがある場合は先に解消する。
- 実装後に `npm run typegen` / `npm run lint` を必要に応じて実行。
- `src/app` は薄く保ち、ロジックは `src/features` / `src/external` に配置。
- `@/*` エイリアスを使用し、import順は `@/features` → `@/shared` → `@/external`。
- `external` 層ファイルには `import 'server-only'` を付与。

## タスク一覧
| ID | タイトル | status | 依存 | ドキュメント |
|---|---|---|---|---|
| 001 | 認証ミドルウェア/公開ルート整理 | todo | - | `docs/tasks/001_auth_middleware.md` |
| 002 | Prisma: GoodThing モデル追加 | todo | 001 | `docs/tasks/002_prisma_goodthing.md` |
| 003 | external: DTO/Handler 実装 | todo | 002 | `docs/tasks/003_external_handlers.md` |
| 004 | API Route 実装 | todo | 003 | `docs/tasks/004_api_routes.md` |
| 005 | 今日は記録する画面（/today） | todo | 004 | `docs/tasks/005_feature_today.md` |
| 006 | 振り返り画面 | todo | 004 | `docs/tasks/006_feature_history.md` |
| 007 | 掲示板画面（公開） | todo | 004 | `docs/tasks/007_feature_board.md` |
| 008 | ナビゲーション/レイアウト整備 | todo | 005,006,007 | `docs/tasks/008_navigation.md` |
