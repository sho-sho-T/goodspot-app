'use client';

import { Clock, FlaskConical, type LucideIcon, MessageSquare, Sun } from 'lucide-react';
import Link from 'next/link';

import type { SidebarPresenterProps } from './useSidebarNav';

const iconMap: Record<string, LucideIcon> = {
  Sun,
  Clock,
  MessageSquare,
  FlaskConical,
};

/**
 * Sidebarのプレゼンテーションコンポーネント
 * 純粋なUI表示のみを担当
 */
export const SidebarPresenter = ({ navItems, currentPath }: SidebarPresenterProps) => {
  return (
    <aside className="bg-muted/40 flex w-60 flex-col border-r">
      <div className="px-6 py-4">
        <span className="text-xl font-bold">goodspot</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
