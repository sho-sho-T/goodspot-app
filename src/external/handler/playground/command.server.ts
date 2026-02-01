import 'server-only';

import { ZodError } from 'zod';

import { createAuthClient } from '@/external/client/supabase/server';
import { PlaygroundId } from '@/external/domain/playground';
import type {
  CreatePlaygroundInput,
  DeletePlaygroundInput,
  PlaygroundCommandResponse,
  UpdatePlaygroundInput,
} from '@/external/dto/playground';
import {
  createPlaygroundSchema,
  deletePlaygroundSchema,
  updatePlaygroundSchema,
} from '@/external/dto/playground';
import { mapPlaygroundToDto, playgroundService } from './shared';

const AUTH_ERROR_MESSAGE = 'Unauthorized';

// Playground の変更処理（認可・検証・永続化）
export async function createPlaygroundServer(
  data: CreatePlaygroundInput
): Promise<PlaygroundCommandResponse> {
  try {
    const supabase = await createAuthClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return { success: false, error: AUTH_ERROR_MESSAGE };
    }

    const validated = createPlaygroundSchema.parse(data);
    const created = await playgroundService.create(validated);

    return {
      success: true,
      item: mapPlaygroundToDto(created),
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: 'Invalid input data' };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create playground item',
    };
  }
}

export async function updatePlaygroundValueServer(
  data: UpdatePlaygroundInput
): Promise<PlaygroundCommandResponse> {
  try {
    const supabase = await createAuthClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return { success: false, error: AUTH_ERROR_MESSAGE };
    }

    const validated = updatePlaygroundSchema.parse(data);
    const updated = await playgroundService.updateValue(
      PlaygroundId.create(validated.id),
      validated.value
    );

    return {
      success: true,
      item: mapPlaygroundToDto(updated),
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: 'Invalid input data' };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update playground item',
    };
  }
}

export async function deletePlaygroundServer(
  data: DeletePlaygroundInput
): Promise<PlaygroundCommandResponse> {
  try {
    const supabase = await createAuthClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return { success: false, error: AUTH_ERROR_MESSAGE };
    }

    const validated = deletePlaygroundSchema.parse(data);
    await playgroundService.delete(PlaygroundId.create(validated.id));
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: 'Invalid input data' };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete playground item',
    };
  }
}

export type {
  CreatePlaygroundInput,
  DeletePlaygroundInput,
  PlaygroundCommandResponse,
  UpdatePlaygroundInput,
} from '@/external/dto/playground';
