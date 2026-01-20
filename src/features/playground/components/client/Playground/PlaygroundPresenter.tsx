'use client'

import { PlaygroundItem } from '@/external/dto/playground'
import { FormEvent } from 'react'

type PlaygroundPresenterProps = {
  items: PlaygroundItem[]
  total: number
  isLoading: boolean
  errorMessage?: string
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  onCreate: (event: FormEvent<HTMLFormElement>) => void
  onUpdate: (id: string) => void
  onDelete: (id: string) => void
}

export const PlaygroundPresenter = ({
  items,
  total,
  isLoading,
  errorMessage,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
}: PlaygroundPresenterProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Prisma Playground</h1>
        <p className="mt-2 text-sm text-gray-500">
          Experiment with basic CRUD using server actions and React Query.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="rounded-lg border bg-gray-50 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Create New Item</h2>
        <form onSubmit={onCreate} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="flex-1 rounded-md border p-2 text-black"
            required
          />
          <input
            type="number"
            name="value"
            placeholder="Value"
            className="w-full rounded-md border p-2 text-black sm:w-28"
            required
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isCreating}
          >
            {isCreating ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Items</h2>
          <span className="text-sm text-gray-500">{total}</span>
        </div>

        {isLoading && (
          <div className="rounded-lg border border-dashed bg-gray-50 py-10 text-center text-gray-500">
            Loading items...
          </div>
        )}

        {!isLoading &&
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-lg font-bold">{item.name}</div>
                <div className="text-sm text-gray-500">
                  Value:{' '}
                  <span className="font-mono text-blue-600">{item.value}</span>
                </div>
                <div className="mt-1 font-mono text-xs text-gray-400">
                  {item.id}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onUpdate(item.id)}
                  className="rounded bg-yellow-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Random Update'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded bg-red-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}

        {!isLoading && items.length === 0 && (
          <div className="rounded-lg border border-dashed bg-gray-50 py-10 text-center text-gray-500">
            No items found. Add one above!
          </div>
        )}
      </div>
    </div>
  )
}
