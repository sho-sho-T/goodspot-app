import { redirect } from 'next/navigation'

import { LogoutButton } from '@/features/auth/components/client/LogoutButton'

import { createAuthClient } from '@/external/supabase/server'

export async function ProtectedScreen() {
  const supabase = await createAuthClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{user.email}</span>
      </p>
      <LogoutButton />
    </div>
  )
}
