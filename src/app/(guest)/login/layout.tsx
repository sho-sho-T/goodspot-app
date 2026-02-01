import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'サインイン｜Good Spot',
  description: 'Good Spotへサインインします。',
};

export default function LoginLayout({ children }: LayoutProps<'/login'>) {
  return <div className="mx-auto max-w-md py-10">{children}</div>;
}
