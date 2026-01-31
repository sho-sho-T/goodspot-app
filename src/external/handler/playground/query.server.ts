import 'server-only'

import { ZodError } from 'zod'

import { createAuthClient } from '@/external/client/supabase/server'
import { playgroundListSchema } from '@/external/dto/playground'
import type {
  PlaygroundListInput,
  PlaygroundListResponse,
} from '@/external/dto/playground'
import { mapPlaygroundToDto, playgroundService } from './shared'

const AUTH_ERROR_MESSAGE = 'Unauthorized'

// Playground の参照処理（認可・検証・取得）
export async function getPlaygroundListServer(
  data: PlaygroundListInput = {}
): Promise<PlaygroundListResponse> {
  try {
    const supabase = await createAuthClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) {
      return { success: false, error: AUTH_ERROR_MESSAGE, items: [] }
    }

    const validated = playgroundListSchema.parse(data)
    const [items, total] = await Promise.all([
      playgroundService.list({
        limit: validated.limit,
        offset: validated.offset,
      }),
      playgroundService.count(),
    ])

    return {
      success: true,
      items: items.map(mapPlaygroundToDto),
      total,
      limit: validated.limit,
      offset: validated.offset,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: 'Invalid input data', items: [] }
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch playground items',
      items: [],
    }
  }
}

export type {
  PlaygroundListInput,
  PlaygroundListResponse,
} from '@/external/dto/playground'
