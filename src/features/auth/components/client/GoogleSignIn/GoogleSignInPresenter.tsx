'use client';

import { Button } from '@/shared/components/ui/button';

import type { GoogleSignInPresenterProps } from './useGoogleSignIn';

export const GoogleSignInPresenter = (props: GoogleSignInPresenterProps) => {
  const { error, isLoading, onSubmit } = props;

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-6">
        {error && <p className="text-destructive-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Continue with Google'}
        </Button>
      </div>
    </form>
  );
};
