import 'server-only';

import type { Playground } from '@/external/domain/playground';
import type { PlaygroundItem } from '@/external/dto/playground';
import { PlaygroundRepository } from '@/external/repository';
import { PlaygroundService } from '@/external/service/playground/PlaygroundService';

// Playground の wiring と DTO 変換
const playgroundRepository = new PlaygroundRepository();
export const playgroundService = new PlaygroundService(playgroundRepository);

export function mapPlaygroundToDto(playground: Playground): PlaygroundItem {
  return {
    id: playground.id.toString(),
    name: playground.name,
    value: playground.value,
    createdAt: playground.createdAt.toISOString(),
    updatedAt: playground.updatedAt.toISOString(),
  };
}
