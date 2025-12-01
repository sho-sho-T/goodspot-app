'use client'

import { LogoutButtonPresenter } from './LogoutButtonPresenter'
import { useLogoutButton } from './useLogoutButton'

export const LogoutButtonContainer = () => {
  const props = useLogoutButton()

  return <LogoutButtonPresenter {...props} />
}
