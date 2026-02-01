import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { requireAuthServer } from '@/features/auth/servers/redirect.server';

import { getQueryClient } from '@/shared/lib/query-client';

import { Header } from '../../client/Header';
import { Sidebar } from '../../client/Sidebar';

type AuthenticatedLayoutWrapperProps = {
  children: React.ReactNode;
};

/**
 * 認証が必要なページ群のサーバー側ゲート + 共通レイアウトラッパー
 *
 * 役割:
 * 1. サーバー側で認証チェック（未認証なら /login へリダイレクト）
 * 2. React Query の初期状態をサーバーで用意し、クライアントで安全に水和
 * 3. Header/Sidebar を含む共通 UI 構成を提供
 */
export const AuthenticatedLayoutWrapper = async ({ children }: AuthenticatedLayoutWrapperProps) => {
  // サーバー側で認証チェック（未認証なら /login へリダイレクト）
  await requireAuthServer();

  // QueryClient 生成 + dehydrate
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  // HydrationBoundary + 共通レイアウト
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </HydrationBoundary>
  );
};
