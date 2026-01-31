# 開発ワークフロー

新規機能を実装する際は、以下のステップで進めます。

## Step1 ルートとデータ定義

1. `src/app` に新しいルートディレクトリを作成（必要に応じてルートグループ (authenticated) 等を使用）。
2. `src/external/dto` に Zod スキーマを作成（入力/出力の型定義）。
3. `src/external/handlers` にデータ取得・更新ロジックを実装。

## Step2 UI実装（Feature Layer）

1. `src/features/[feature]/components/server` に Page Template を作成。
   - ここでデータフェッチを行う。
2. `src/features/[feature]/components/client` に Container と Presenter を作成。
   - Container: `useQuery` や `useMutation` を呼ぶ。
   - Presenter: Propsを受け取って表示するだけ。

## Step3 結合

1. `src/app/[route]/page.tsx` から Step 2 で作った Page Template を呼び出す。
2. `bun typegen` を実行してルート定義を更新する。

## Step4 品質チェック

1. `bun lint` でアーキテクチャ違反（インポートルール等）がないか確認。
2. Server Actions が external 層を経由しているか、DTO でバリデーションされているか確認。
