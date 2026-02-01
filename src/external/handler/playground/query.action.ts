'use server';

import type { PlaygroundListInput, PlaygroundListResponse } from './query.server';
import { getPlaygroundListServer } from './query.server';

// Playground の Server Actions（参照系）
export async function getPlaygroundListAction(
  data: PlaygroundListInput = {}
): Promise<PlaygroundListResponse> {
  return getPlaygroundListServer(data);
}

export type {
  PlaygroundListInput,
  PlaygroundListResponse,
} from './query.server';
