'use client'

import { LoginFormPresenter } from './LoginFormPresenter'
import { useLoginForm } from './useLoginForm'

export const LoginFormContainer = () => {
  const state = useLoginForm()

  return <LoginFormPresenter {...state} />
}
