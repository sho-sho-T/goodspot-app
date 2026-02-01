'use client';

import { Button } from '@/shared/components/ui/button';

import type { LogoutButtonPresenterProps } from './useLogoutButton';

export const LogoutButtonPresenter = ({ onLogout }: LogoutButtonPresenterProps) => {
  return <Button onClick={onLogout}>Logout</Button>;
};
