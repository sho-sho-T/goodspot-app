import { revalidatePath } from 'next/cache'

import { prisma } from '@/shared/lib/prisma'

export default async function PlaygroundPage() {
  // Fetch all items
  const items = await prisma.playground.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Server Action to create an item
  async function createItem(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const value = parseInt(formData.get('value') as string)

    if (!name || isNaN(value)) return

    await prisma.playground.create({
      data: { name, value },
    })
    revalidatePath('/playground')
  }

  // Server Action to delete an item
  async function deleteItem(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await prisma.playground.delete({
      where: { id },
    })
    revalidatePath('/playground')
  }

  // Server Action to update an item
  async function updateItem(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const value = Math.floor(Math.random() * 100)
    await prisma.playground.update({
      where: { id },
      data: { value },
    })
    revalidatePath('/playground')
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Prisma Playground</h1>

      <div className="mb-8 rounded-lg border bg-gray-50 p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Create New Item</h2>
        <form action={createItem} className="flex gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="flex-grow rounded-md border p-2 text-black"
            required
          />
          <input
            type="number"
            name="value"
            placeholder="Value"
            className="w-24 rounded-md border p-2 text-black"
            required
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h2 className="mb-4 text-xl font-semibold">Items ({items.length})</h2>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900"
          >
            <div>
              <div className="text-lg font-bold">{item.name}</div>
              <div className="text-sm text-gray-500">
                Value:{' '}
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {item.value}
                </span>
              </div>
              <div className="mt-1 font-mono text-xs text-gray-400">
                {item.id}
              </div>
            </div>
            <div className="flex gap-2">
              <form action={updateItem}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="rounded bg-yellow-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-yellow-600"
                >
                  Random Update
                </button>
              </form>
              <form action={deleteItem}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="rounded bg-red-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-600"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-lg border border-dashed bg-gray-50 py-10 text-center text-gray-500 dark:bg-gray-800">
            No items found. Add one above!
          </div>
        )}
      </div>
    </div>
  )
}
