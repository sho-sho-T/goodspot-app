'use client'

import { SidebarPresenter } from './SidebarPresenter'
import { useSidebarNav } from './useSidebarNav'

/**
 * Sidebarのコンテナコンポーネント
 * フックを呼び出し、Presenterに props を渡す
 */
export const SidebarContainer = () => {
  const props = useSidebarNav()
  return <SidebarPresenter {...props} />
}
