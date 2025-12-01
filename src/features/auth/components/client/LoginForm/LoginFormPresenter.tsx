'use client'

import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

import { LoginFormPresenterProps } from './useLoginForm'

export const LoginFormPresenter = (props: LoginFormPresenterProps) => {
  const { error, isLoading, onSubmit } = props

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Good Spotにようこそ！</CardTitle>
          <CardDescription>サインインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              {error && <p className="text-destructive-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Continue with GitHub'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
