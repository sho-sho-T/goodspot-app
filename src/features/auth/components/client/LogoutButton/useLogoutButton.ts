import { useRouter } from 'next/navigation'

import { supabaseAuthClient as supabase } from '@/external/supabase/client'

export type LogoutButtonPresenterProps = {
  onLogout: () => Promise<void>
}

export const useLogoutButton = (): LogoutButtonPresenterProps => {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return {
    onLogout: handleLogout,
  }
}
