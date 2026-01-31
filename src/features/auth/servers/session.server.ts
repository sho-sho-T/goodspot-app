import 'server-only'

import { createAuthClient } from '@/external/client/supabase/server'

/**
 * サーバー側でSupabaseのセッションを取得する薄いラッパー
 * 認証ガードやサーバーコンポーネントで「現在のログインユーザー情報」を得る入口
 *
 * @returns セッション情報（ユーザーが存在する場合）またはnull
 */
export const getSessionServer = async () => {
  const supabase = await createAuthClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return { user }
}
