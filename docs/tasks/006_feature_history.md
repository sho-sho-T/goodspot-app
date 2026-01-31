# 006 振り返り画面

status: todo

## 目的

- 過去の記録を簡単に見返せる UI を提供する。

## 作業内容

1. ルート作成（例: `/history`）。
2. Server Template で範囲取得（直近30日など）。
3. クライアントでは日付ごとに一覧表示。

## 期待する構成例

```
src/app/(authenticated)/history/page.tsx
src/features/good-things/components/server/HistoryPageTemplate/HistoryPageTemplate.tsx
src/features/good-things/components/client/HistoryList/
  ├── HistoryListContainer.tsx
  ├── HistoryListPresenter.tsx
  ├── useHistoryList.ts
  └── index.ts
```

## UI要件

- 日付ごとに最大3件を表示
- 日付範囲は固定（例: 直近30日）でOK
- 余力があれば日付選択UI（後回し可）

## 受け入れ基準

- `/history` で過去の記録が一覧表示される。
- データがない日付は表示しない。

## 影響ファイル

- 追加: `src/app/(authenticated)/history/page.tsx`
- 追加: `src/features/good-things/**`
