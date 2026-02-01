import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'エラーが発生しました｜Good Spot',
  description: 'エラーが発生しました。もう一度お試しください。',
};

export default function ErrorLayout({ children }: LayoutProps<'/error'>) {
  return <div className="mx-auto max-w-md py-10">{children}</div>;
}
