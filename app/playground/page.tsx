import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';

export default async function PlaygroundPage() {
    // Fetch all items
    const items = await prisma.playground.findMany({
        orderBy: { createdAt: 'desc' },
    });

    // Server Action to create an item
    async function createItem(formData: FormData) {
        'use server';
        const name = formData.get('name') as string;
        const value = parseInt(formData.get('value') as string);

        if (!name || isNaN(value)) return;

        await prisma.playground.create({
            data: { name, value },
        });
        revalidatePath('/playground');
    }

    // Server Action to delete an item
    async function deleteItem(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await prisma.playground.delete({
            where: { id },
        });
        revalidatePath('/playground');
    }

    // Server Action to update an item
    async function updateItem(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const value = Math.floor(Math.random() * 100);
        await prisma.playground.update({
            where: { id },
            data: { value },
        });
        revalidatePath('/playground');
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Prisma Playground</h1>

            <div className="mb-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
                <form action={createItem} className="flex gap-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="border p-2 rounded-md flex-grow text-black"
                        required
                    />
                    <input
                        type="number"
                        name="value"
                        placeholder="Value"
                        className="border p-2 rounded-md w-24 text-black"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                        Add
                    </button>
                </form>
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <div className="font-bold text-lg">{item.name}</div>
                            <div className="text-sm text-gray-500">Value: <span className="font-mono text-blue-600 dark:text-blue-400">{item.value}</span></div>
                            <div className="text-xs text-gray-400 mt-1 font-mono">{item.id}</div>
                        </div>
                        <div className="flex gap-2">
                            <form action={updateItem}>
                                <input type="hidden" name="id" value={item.id} />
                                <button type="submit" className="bg-yellow-500 text-white px-3 py-1.5 rounded hover:bg-yellow-600 text-sm transition-colors">
                                    Random Update
                                </button>
                            </form>
                            <form action={deleteItem}>
                                <input type="hidden" name="id" value={item.id} />
                                <button type="submit" className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 text-sm transition-colors">
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
                        No items found. Add one above!
                    </div>
                )}
            </div>
        </div>
    );
}
