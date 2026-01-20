import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { Playground } from '@/features/playground/components/client/Playground'
import { playgroundQueryKeys } from '@/features/playground/queries/keys'

import { getQueryClient } from '@/shared/lib/query-client'

import type { PlaygroundListInput } from '@/external/dto/playground'
import { getPlaygroundListServer } from '@/external/handler/playground/query.server'

const defaultPlaygroundListInput: PlaygroundListInput = {}

export const PlaygroundPageTemplate = async () => {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: playgroundQueryKeys.list(defaultPlaygroundListInput),
    queryFn: () => getPlaygroundListServer(defaultPlaygroundListInput),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Playground />
    </HydrationBoundary>
  )
}
