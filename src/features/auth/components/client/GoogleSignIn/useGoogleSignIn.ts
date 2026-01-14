import { useState } from 'react'

import { supabaseAuthClient as supabase } from '@/shared/lib/supabase/client'

export type GoogleSignInPresenterProps = {
  error: string | null
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
}

export const useGoogleSignIn = (): GoogleSignInPresenterProps => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/protected`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return {
    error,
    isLoading,
    onSubmit: handleGoogleSignIn,
  }
}
