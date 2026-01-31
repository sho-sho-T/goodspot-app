import { usePathname } from 'next/navigation'

export type NavItem = {
  label: string
  href: string
  icon: string
}

export type SidebarPresenterProps = {
  navItems: NavItem[]
  currentPath: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Today', href: '/today', icon: 'Sun' },
  { label: 'History', href: '/history', icon: 'Clock' },
  { label: 'Board', href: '/board', icon: 'MessageSquare' },
  { label: 'Playground', href: '/playground', icon: 'FlaskConical' },
]

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
