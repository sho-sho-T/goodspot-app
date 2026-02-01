'use client';

import { GoogleSignInPresenter } from './GoogleSignInPresenter';
import { useGoogleSignIn } from './useGoogleSignIn';

export const GoogleSignInContainer = () => {
  const state = useGoogleSignIn();

  return <GoogleSignInPresenter {...state} />;
};
