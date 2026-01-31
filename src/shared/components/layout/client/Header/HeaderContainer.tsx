'use client'

import { HeaderPresenter } from './HeaderPresenter'
import { useHeaderNav } from './useHeaderNav'

/**
 * Headerのコンテナコンポーネント
 * フックを呼び出し、Presenterに props を渡す
 */
export const HeaderContainer = () => {
  const props = useHeaderNav()
  return <HeaderPresenter {...props} />
}
