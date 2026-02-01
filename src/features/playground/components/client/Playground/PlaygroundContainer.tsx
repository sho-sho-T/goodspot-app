'use client';

import { PlaygroundPresenter } from './PlaygroundPresenter';
import { usePlayground } from './usePlayground';

export const PlaygroundContainer = () => {
  const {
    items,
    total,
    isLoading,
    errorMessage,
    isCreating,
    isUpdating,
    isDeleting,
    onCreate,
    onUpdate,
    onDelete,
  } = usePlayground();

  return (
    <PlaygroundPresenter
      items={items}
      total={total}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    />
  );
};
