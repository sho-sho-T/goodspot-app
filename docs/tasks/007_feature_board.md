# 007 掲示板画面（公開）

status: todo

## 目的
- 2ch風のテキスト主体 UI で全国の良いことを閲覧できるようにする。
- 未ログインユーザーも閲覧可能。

## 作業内容
1) 公開ルート作成（例: `/board`）。
2) Server Template で公開データを取得。
3) クライアントで一覧表示（時系列）。

## 期待する構成例
```
src/app/(public)/board/page.tsx
src/features/board/components/server/BoardPageTemplate/BoardPageTemplate.tsx
src/features/board/components/client/BoardList/
  ├── BoardListContainer.tsx
  ├── BoardListPresenter.tsx
  ├── useBoardList.ts
  └── index.ts
```

## UI要件
- テキスト主体の一覧（2ch風）
- 1件あたり「日付 + テキスト」
- ページング or limit は 50 件固定でOK

## 受け入れ基準
- 未ログインでも `/board` が閲覧できる。
- 公開データのみ表示される。

## 影響ファイル
- 追加: `src/app/(public)/board/page.tsx`
- 追加: `src/features/board/**`
