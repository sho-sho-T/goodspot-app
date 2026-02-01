import { useQuery } from '@tanstack/react-query';
import type { PlaygroundListInput, PlaygroundListResponse } from '@/external/dto/playground';

import { getPlaygroundListAction } from '@/external/handler/playground/query.action';
import { playgroundQueryKeys } from '@/features/playground/queries/keys';

export const usePlaygroundListQuery = (input: PlaygroundListInput = {}) =>
  useQuery<PlaygroundListResponse>({
    queryKey: playgroundQueryKeys.list(input),
    queryFn: () => getPlaygroundListAction(input),
  });
