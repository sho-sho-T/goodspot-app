import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const ALLOWED_NEXT_PATHS = ['/', '/protected']
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!

const isLocalEnv = process.env.NODE_ENV === 'development'

const getValidatedNextPath = (next: string | null): string => {
  if (!next?.startsWith('/') || !ALLOWED_NEXT_PATHS.includes(next)) {
    return '/'
  }
  return next
}

const buildRedirectUrl = (
  origin: string,
  forwardedHost: string | null,
  next: string
): string => {
  if (isLocalEnv) {
    return `${origin}${next}`
  }
  return forwardedHost ? `https://${forwardedHost}${next}` : `${origin}${next}`
}

const initSupabaseClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) =>
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        ),
    },
  })
}

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const forwardedHost = request.headers.get('x-forwarded-host')

  if (!code) {
    return NextResponse.redirect(`${origin}/error`)
  }

  const next = getValidatedNextPath(searchParams.get('next'))
  const supabase = await initSupabaseClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/error`)
  }

  const redirectUrl = buildRedirectUrl(origin, forwardedHost, next)
  return NextResponse.redirect(redirectUrl)
}
