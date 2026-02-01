import Image from 'next/image';

import { getAvatarUrl, requireSessionServer } from '@/features/auth/servers/session.server';

export const AuthenticatedHomePageTemplate = async () => {
  const { user } = await requireSessionServer();
  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="User avatar"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-zinc-600"
            aria-label="No avatar available"
          >
            ?
          </div>
        )}
        <div className="flex flex-col">
          <p className="text-sm text-zinc-500">Signed in as</p>
          <p className="text-lg font-semibold text-zinc-900">{user.email}</p>
        </div>
      </div>
    </div>
  );
};
