# 005 今日は記録する画面

status: todo

## 目的

- 最短ステップで「今日の良いこと」を最大3件まで記録できる UI を実装する。
- Server Component でプリフェッチし、初期表示の体験を高速化する。

## 作業内容

1. ルートを作成（`/today` を今日の記録にする）。
2. `/` は `/today` へリダイレクト。
3. `features/good-things` を新規作成。
4. Server Template → Client Container → Presenter の構成で実装。
5. `useQuery` で当日データを取得、`useMutation` で保存。

## 期待する構成例

```
src/app/(authenticated)/today/page.tsx
src/features/good-things/components/server/TodayPageTemplate/TodayPageTemplate.tsx
src/features/good-things/components/client/TodayForm/
  ├── TodayFormContainer.tsx
  ├── TodayFormPresenter.tsx
  ├── useTodayForm.ts
  └── index.ts
```

## UI要件

- 入力欄は最大3件（追加ボタン or 3枠固定）
- 140文字以内、空欄不可
- 保存ボタンは1回で保存完了
- 保存後はトースト or メッセージ

## 受け入れ基準

- ログイン後、`/today` で当日記録が表示される。
- 3件以上の入力はできない（UI/バリデーションで制御）。
- 保存後に画面が最新状態に反映される。

## 影響ファイル

- 追加: `src/app/(authenticated)/today/page.tsx`
- 追加: `src/features/good-things/**`
- 変更: `src/app/page.tsx`（`/today` へリダイレクト）
