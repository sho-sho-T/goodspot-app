# データフェッチとハイドレーション戦略

「サーバーで取得し、クライアントで即座に表示・操作可能にする」戦略をとります。

## フロー

1. Server Component (Template)

- `external` 層のハンドラを使用してデータを取得。
- `QueryClient` を作成し、`prefetchQuery` でデータをキャッシュに格納。

2. Hydration:

- `dehydrate(queryClient)` でシリアライズしたデータを `HydrationBoundary` に渡す。

3. Client Component (Container)

- `useQuery` フックを使用。
- データは既にサーバーから渡されているため、ローディングスピナーなしで即座に描画される（初期表示）。
- 以降はクライアント側でキャッシュ管理・再取得が可能になる。

## コードイメージ

```tsx
// Server Template
export async function FeaturePageTemplate() {
  const queryClient = getQueryClient()

  // サーバーサイドでプリフェッチ
  await queryClient.prefetchQuery({
    queryKey: ['items'],
    queryFn: fetchItemsHandler, // external層の関数
  })

  return (
    // クライアントへデータを渡す
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeatureContainer />
    </HydrationBoundary>
  )
}
```
