import 'server-only';

import type { User } from '@supabase/supabase-js';

import { createAuthClient } from '@/external/client/supabase/server';

/**
 * サーバー側でSupabaseのセッションを取得する薄いラッパー
 * 認証ガードやサーバーコンポーネントで「現在のログインユーザー情報」を得る入口
 *
 * @returns セッション情報（ユーザーが存在する場合）またはnull
 */
export const getSessionServer = async () => {
  const supabase = await createAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return { user };
};

/**
 * 認証済みが前提のセッション取得関数
 * AuthenticatedLayoutWrapperなど、認証ガード済みのコンテキストで使用する
 *
 * @throws セッションが取得できない場合
 * @returns セッション情報
 */
export const requireSessionServer = async () => {
  const session = await getSessionServer();
  if (!session) {
    throw new Error('Session not found despite authenticated context');
  }
  return session;
};

/**
 * ユーザーのアバターURLを取得する
 * プロバイダ（Google等）によってuser_metadataの構造が異なるため、
 * avatar_url → picture の順でフォールバックする
 *
 * @param user - Supabase User オブジェクト
 * @returns アバターURL、または取得できない場合はnull
 */
export const getAvatarUrl = (user: User): string | null => {
  if (typeof user.user_metadata?.avatar_url === 'string') {
    return user.user_metadata.avatar_url;
  }
  if (typeof user.user_metadata?.picture === 'string') {
    return user.user_metadata.picture;
  }
  return null;
};
