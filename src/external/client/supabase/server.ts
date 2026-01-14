import 'server-only'

import { cookies } from 'next/headers'

import { createServerClient } from '@supabase/ssr'

/**
 * Next.jsのサーバーサイド（Server Components, Server Actions, Route Handlers）で
 * Supabaseクライアントを作成するための関数です。
 *
 * ユーザーの認証情報（Cookie）を自動的に処理し、認証済みの状態でSupabaseにアクセスできます。
 */
export const createAuthClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components（RSC）から呼び出された場合、Cookieの操作はできないためエラーが発生します。
            // ここではそのエラーを無視することで、RSCでもクライアント作成自体は成功するようにしています。
            // 実際にCookieの書き込みが必要な操作（ログイン、ログアウト、セッション更新など）は
            // Server ActionsやRoute Handlersで行う必要があります。
          }
        },
      },
    }
  )
}
