import { NextResponse } from 'next/server'

import { createServerClient } from '@supabase/ssr'

import type { NextRequest } from 'next/server'

/**
 * Supabaseのセッションを更新するためのミドルウェア関数です。
 *
 * サーバーコンポーネントへのリクエスト前に実行され、認証トークン（Cookie）のリフレッシュを行います。
 * これにより、サーバーサイドレンダリング時に常に最新の認証状態を維持できます。
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // グローバル変数にクライアントを保持せず、リクエストごとに新しいクライアントを作成してください。
  // これにより、異なるユーザーのリクエスト間で認証情報が混在するのを防ぎます。
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Cookieをリクエストとレスポンスの両方に設定します。
          // これにより、後続の処理でも更新されたCookieが利用可能になります。
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // createServerClientとsupabase.auth.getClaims()の間には、他の処理を挟まないでください。
  // ここで処理が入ると、予期せぬタイミングでユーザーがログアウトされるなどの問題が発生し、
  // デバッグが困難になる可能性があります。

  // 重要: getClaims()（またはgetUser()）を削除しないでください。
  // これを呼び出すことで、必要に応じてAuthトークンがリフレッシュされ、Cookieが更新されます。
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/board') &&
    !request.nextUrl.pathname.startsWith('/error')
  ) {
    // ユーザーが認証されておらず、かつログインページや認証関連のパスでない場合、
    // ログインページへリダイレクトします。
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 重要: ここで作成した supabaseResponse オブジェクトをそのまま返す必要があります。
  // もし NextResponse.next() で新しいレスポンスを作成する場合は、以下の点に注意してください：
  // 1. リクエストを渡す: const myNewResponse = NextResponse.next({ request })
  // 2. Cookieをコピーする: myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. myNewResponse を変更する（ただしCookieは変更しない！）
  // 4. 最後に myNewResponse を返す
  // これを守らないと、ブラウザとサーバーでセッションの不整合が起き、ユーザーがログアウトされる可能性があります。

  return supabaseResponse
}
