import { AuthenticatedLayoutWrapper } from '@/shared/components/layout/server/AuthenticatedLayoutWrapper';

/**
 * 認証が必要なページ群の共通レイアウト
 *
 * AuthenticatedLayoutWrapperによって以下を提供:
 * - サーバー側での認証ガード（未認証なら /login へリダイレクト）
 * - React Query の初期状態の水和
 * - Header/Sidebar を含む共通UI構成
 */
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayoutWrapper>{children}</AuthenticatedLayoutWrapper>;
}
