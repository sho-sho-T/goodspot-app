# 008 ナビゲーション/レイアウト整備

status: todo

## 目的
- 主要画面への導線を用意し、日々の記録・振り返り・掲示板にすぐ移動できるようにする。

## 作業内容
1) `shared` にシンプルなナビゲーション UI を追加。
2) 認証必須ルート（`/` / `/history`）にヘッダーを表示。
3) `/board` からもトップに戻れる導線を用意。

## 期待する構成例
```
src/shared/components/layout/AppHeader.tsx
src/shared/components/layout/index.ts
```

## UI要件
- リンク: 今日 / 振り返り / 掲示板 / ログアウト
- シンプルでOK（後からデザイン調整）

## 受け入れ基準
- 主要ページ間の移動が 1〜2 クリックで完結する。

## 影響ファイル
- 追加: `src/shared/components/layout/AppHeader.tsx`
- 変更: 各レイアウト or ページ
