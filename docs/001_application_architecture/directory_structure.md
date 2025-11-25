# ディレクトリ構成
責務を明確に分離するため、以下の4つのトップレベルディレクトリを採用します。

```
src/
├── app/           # ルーティング層 (Routing Layer)
│   ├── (auth)/    # ルートグループによる認証ガード
│   ├── layout.tsx # グローバルレイアウト
│   └── page.tsx   # ページ定義 (ロジックは持たず、Templateを呼ぶのみ)
│
├── features/      # ドメイン層 (Domain Layer - Vertical Slices)
│   ├── [feature]/ # 機能単位 (例: auth, posts, users)
│   │   ├── components/
│   │   │   ├── server/ # Server Components (Templates)
│   │   │   └── client/ # Client Components (Container/Presenter)
│   │   ├── hooks/      # Custom Hooks (Query/Mutation/Form)
│   │   ├── actions/    # Server Actions
│   │   └── types/      # 機能固有の型定義
│   └── ...
│
├── shared/        # 共有層 (Shared Layer)
│   ├── components/ # ドメイン知識を持たないUI (Button, Input等)
│   ├── lib/        # 汎用ユーティリティ
│   └── providers/  # Context Providers
│
└── external/      # インフラ層 (Infrastructure Layer)
    ├── db/         # データベース設定・スキーマ
    ├── dto/        # データ転送オブジェクト (Zod Schema)
    ├── handlers/   # ユースケース実装 (Controller的な役割)
    └── services/   # 外部API/DB接続ロジック (server-only)
```

# 各レイヤーの役割
## App Layer (src/app)
### 役割
URLとアプリケーションの接点。
### ルール
ビジネスロジックを記述しない。
### 実装
layout.tsx で認証ガードや共通UIを提供し、page.tsx は features 層の「Server Template」を呼び出すだけに留める。

## Feature Layer (src/features)
### 役割
アプリケーションの主要な機能（ビジネスロジックとUI）。
### 構成
- Server Template: データの初期フェッチを行い、Client Componentへ渡すエントリーポイント。
- Container Component: Hooks を呼び出し、状態管理やイベントハンドラを定義する。
- Presenter Component: 純粋なUI描画のみを行う（ロジックなし）。

## External Layer (src/external)
### 役割
データベースや外部APIとの通信、データのバリデーション。
### ルール
import 'server-only' を宣言し、クライアントバンドルへの混入を物理的に防ぐ。
### 実装
DTO: Zodを使用して入出力データの型定義とバリデーションを行う。

## Shared Layer (src/shared)
### 役割
アプリケーション全体で再利用される、ドメイン知識を持たない部品。
### 実装
例: UIライブラリ（shadcn/ui等）、日付フォーマッタ、共通レイアウト枠。
