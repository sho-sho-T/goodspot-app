import { z } from 'zod';

import type { PlaygroundItem } from './playground.dto';

// Playground の参照系入力スキーマ
export const playgroundListSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type PlaygroundListInput = z.input<typeof playgroundListSchema>;

export type PlaygroundListResponse = {
  success: boolean;
  error?: string;
  items: PlaygroundItem[];
  total?: number;
  limit?: number;
  offset?: number;
};
