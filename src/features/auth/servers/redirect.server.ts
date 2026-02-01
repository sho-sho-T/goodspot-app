import 'server-only';

import { redirect } from 'next/navigation';

import { getSessionServer } from './session.server';

/**
 * サーバー側で認証状態を判定する
 * セッション取得失敗も未認証扱いにして安全側に倒す
 *
 * @returns 認証済みならtrue、未認証またはエラーならfalse
 */
export const isAuthenticatedServer = async (): Promise<boolean> => {
  try {
    const session = await getSessionServer();
    return !!session?.user;
  } catch {
    return false;
  }
};

/**
 * 認証が必要なページで使用するガード関数
 * 未認証の場合は /login にリダイレクトする
 *
 * @throws redirect() による例外（Next.jsのリダイレクト機構）
 */
export const requireAuthServer = async (): Promise<void> => {
  const authenticated = await isAuthenticatedServer();
  if (!authenticated) {
    redirect('/login');
  }
};

/**
 * 認証済みユーザーを別ページにリダイレクトする
 * ログインページなどで使用（既にログイン済みならダッシュボードへ）
 *
 * @throws redirect() による例外（Next.jsのリダイレクト機構）
 */
export const redirectIfAuthenticatedServer = async (): Promise<void> => {
  const authenticated = await isAuthenticatedServer();
  if (authenticated) {
    redirect('/');
  }
};
