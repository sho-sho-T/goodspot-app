import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const ALLOWED_NEXT_PATHS = ['/', '/protected']

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!

  const getRedirectUrl = (
    origin: string,
    forwardedHost: string | null,
    next: string
  ) => {
    if (isLocalEnv) {
      return `${origin}${next}`
    } else if (forwardedHost) {
      return `https://${forwardedHost}${next}`
    } else {
      return `${origin}${next}`
    }
  }

  // next: リダイレクト先のパス
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/') || !ALLOWED_NEXT_PATHS.includes(next)) {
    next = '/'
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    })

    // セッション交換を実行
    // この処理の中で上記の setAll が呼ばれ、ブラウザにCookieが保存されます
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      getRedirectUrl(origin, forwardedHost, next)
    }
  }

  // エラー時はエラーページへ
  return NextResponse.redirect(`${origin}/error`)
}
