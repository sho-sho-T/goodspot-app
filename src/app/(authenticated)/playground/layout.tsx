import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playground | Good Spot',
  description: 'Playground for testing playground features.',
};

export default function PlaygroundLayout({ children }: LayoutProps<'/playground'>) {
  return <div className="mx-auto max-w-2xl p-8">{children}</div>;
}
