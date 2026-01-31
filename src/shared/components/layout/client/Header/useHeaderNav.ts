import { usePathname, useRouter } from 'next/navigation'

import { supabaseAuthClient } from '@/shared/lib/supabase/client'

export type HeaderPresenterProps = {
  pageTitle: string
  onLogout: () => Promise<void>
}

/**
 * パス名からページタイトルを導出する
 */
const derivePageTitle = (pathname: string): string => {
  // パスの最初のセグメントを取得
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  const titleMap: Record<string, string> = {
    playground: 'Playground',
    today: 'Today',
    history: 'History',
    board: 'Board',
  }

  return titleMap[firstSegment] || 'goodspot'
}

/**
 * Headerコンポーネントのロジックを管理するカスタムフック
 *
 * @returns HeaderPresenterProps
 */
export const useHeaderNav = (): HeaderPresenterProps => {
  const pathname = usePathname()
  const router = useRouter()

  const pageTitle = derivePageTitle(pathname)

  const handleLogout = async () => {
    await supabaseAuthClient.auth.signOut()
    router.push('/login')
  }

  return {
    pageTitle,
    onLogout: handleLogout,
  }
}
