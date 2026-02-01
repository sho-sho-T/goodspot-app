import { z } from 'zod';

import type { PlaygroundItem } from './playground.dto';

// Playground の変更系入力スキーマ
export const createPlaygroundSchema = z
  .object({
    name: z.string().trim().min(1),
    value: z.coerce.number().int(),
  })
  .strict();

export const updatePlaygroundSchema = z
  .object({
    id: z.string(),
    value: z.coerce.number().int(),
  })
  .strict();

export const deletePlaygroundSchema = z
  .object({
    id: z.string(),
  })
  .strict();

export type CreatePlaygroundInput = z.input<typeof createPlaygroundSchema>;
export type UpdatePlaygroundInput = z.input<typeof updatePlaygroundSchema>;
export type DeletePlaygroundInput = z.input<typeof deletePlaygroundSchema>;

export type PlaygroundCommandResponse = {
  success: boolean;
  error?: string;
  item?: PlaygroundItem;
};
