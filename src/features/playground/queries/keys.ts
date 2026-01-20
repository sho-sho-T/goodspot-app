import type { PlaygroundListInput } from '@/external/dto/playground'

export const playgroundQueryKeys = {
  all: ['playground'] as const,
  list: (input: PlaygroundListInput = {}) =>
    [...playgroundQueryKeys.all, 'list', input] as const,
}
