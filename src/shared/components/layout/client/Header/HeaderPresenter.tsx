'use client';

import { Button } from '@/shared/components/ui/button';

import type { HeaderPresenterProps } from './useHeaderNav';

/**
 * Headerのプレゼンテーションコンポーネント
 * 純粋なUI表示のみを担当
 */
export const HeaderPresenter = ({ pageTitle, onLogout }: HeaderPresenterProps) => {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <h1 className="text-lg font-semibold">{pageTitle}</h1>
      <Button variant="ghost" size="sm" onClick={onLogout}>
        ログアウト
      </Button>
    </header>
  );
};
