import type { Route } from 'next'
import { usePathname } from 'next/navigation'

export type NavItem = {
  label: string
  href: Route
  icon: string
}

export type SidebarPresenterProps = {
  navItems: readonly NavItem[]
  currentPath: string
}

const NAV_ITEMS = [
  { label: 'Playground', href: '/playground', icon: 'FlaskConical' },
] as const satisfies readonly NavItem[]

/**
 * Sidebarコンポーネントのロジックを管理するカスタムフック
 *
 * @returns SidebarPresenterProps
 */
export const useSidebarNav = (): SidebarPresenterProps => {
  const pathname = usePathname()

  return {
    navItems: NAV_ITEMS,
    currentPath: pathname,
  }
}
