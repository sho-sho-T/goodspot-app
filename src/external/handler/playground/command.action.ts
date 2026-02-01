'use server';

import { revalidatePath } from 'next/cache';
import type {
  CreatePlaygroundInput,
  DeletePlaygroundInput,
  PlaygroundCommandResponse,
  UpdatePlaygroundInput,
} from './command.server';
import {
  createPlaygroundServer,
  deletePlaygroundServer,
  updatePlaygroundValueServer,
} from './command.server';

// Playground の Server Actions（変更系）
export async function createPlaygroundAction(
  data: CreatePlaygroundInput
): Promise<PlaygroundCommandResponse> {
  const result = await createPlaygroundServer(data);
  revalidatePath('/playground');

  return result;
}

export async function updatePlaygroundValueAction(
  data: UpdatePlaygroundInput
): Promise<PlaygroundCommandResponse> {
  const result = await updatePlaygroundValueServer(data);
  revalidatePath('/playground');

  return result;
}

export async function deletePlaygroundAction(
  data: DeletePlaygroundInput
): Promise<PlaygroundCommandResponse> {
  const result = await deletePlaygroundServer(data);
  revalidatePath('/playground');

  return result;
}

export type {
  CreatePlaygroundInput,
  DeletePlaygroundInput,
  PlaygroundCommandResponse,
  UpdatePlaygroundInput,
} from './command.server';
