import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FormEvent } from 'react';
import { useCallback, useMemo } from 'react';
import type { PlaygroundCommandResponse, PlaygroundItem } from '@/external/dto/playground';
import {
  createPlaygroundAction,
  deletePlaygroundAction,
  updatePlaygroundValueAction,
} from '@/external/handler/playground/command.action';
import { usePlaygroundListQuery } from '@/features/playground/hooks/query/usePlaygroundListQuery';
import { playgroundQueryKeys } from '@/features/playground/queries/keys';

type PlaygroundState = {
  items: PlaygroundItem[];
  total: number;
  isLoading: boolean;
  errorMessage?: string;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onCreate: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
};

const ensureSuccess = (result: PlaygroundCommandResponse, fallback: string) => {
  if (!result.success) {
    throw new Error(result.error ?? fallback);
  }
  return result;
};

export const usePlayground = (): PlaygroundState => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = usePlaygroundListQuery();

  const invalidateList = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: playgroundQueryKeys.all,
    });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: async (input: { name: string; value: number }) => {
      const result = await createPlaygroundAction(input);
      return ensureSuccess(result, 'Failed to create playground item');
    },
    onSuccess: invalidateList,
  });

  const updateMutation = useMutation({
    mutationFn: async (input: { id: string; value: number }) => {
      const result = await updatePlaygroundValueAction(input);
      return ensureSuccess(result, 'Failed to update playground item');
    },
    onSuccess: invalidateList,
  });

  const deleteMutation = useMutation({
    mutationFn: async (input: { id: string }) => {
      const result = await deletePlaygroundAction(input);
      return ensureSuccess(result, 'Failed to delete playground item');
    },
    onSuccess: invalidateList,
  });

  const handleCreate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name');
      const value = formData.get('value');
      if (typeof name !== 'string' || typeof value !== 'string') {
        return;
      }
      const numericValue = Number(value);
      if (Number.isNaN(numericValue)) {
        return;
      }

      try {
        await createMutation.mutateAsync({ name, value: numericValue });
        event.currentTarget.reset();
      } catch {
        // Errors are surfaced via mutation state.
      }
    },
    [createMutation]
  );

  const handleUpdate = useCallback(
    (id: string) => {
      const nextValue = Math.floor(Math.random() * 100);
      void updateMutation.mutateAsync({ id, value: nextValue });
    },
    [updateMutation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      void deleteMutation.mutateAsync({ id });
    },
    [deleteMutation]
  );

  const items = useMemo(() => (data?.success ? data.items : []), [data?.items, data?.success]);
  const total = useMemo(() => {
    if (!data?.success) {
      return 0;
    }
    return data.total ?? data.items.length;
  }, [data?.items.length, data?.success, data?.total]);

  const errorMessage =
    data?.success === false
      ? data.error
      : error instanceof Error
        ? error.message
        : createMutation.error instanceof Error
          ? createMutation.error.message
          : updateMutation.error instanceof Error
            ? updateMutation.error.message
            : deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : undefined;

  return {
    items,
    total,
    isLoading,
    errorMessage,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };
};
