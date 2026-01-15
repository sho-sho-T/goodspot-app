import 'server-only'

import { prisma } from '@/external/client/db/client'
import { Playground, PlaygroundId } from '@/external/domain/playground'
import type {
  PlaygroundCreateInput,
  PlaygroundListQuery,
  PlaygroundRepository as PlaygroundRepositoryInterface,
  PlaygroundUpdateInput,
} from '@/external/domain/playground'

// Playground の DB 永続化
export class PlaygroundRepository implements PlaygroundRepositoryInterface {
  async findAll(query?: PlaygroundListQuery): Promise<Playground[]> {
    const rows = await prisma.playground.findMany({
      orderBy: { createdAt: 'desc' },
      take: query?.limit,
      skip: query?.offset,
    })

    return rows.map((row) =>
      Playground.restore({
        id: PlaygroundId.create(row.id),
        name: row.name,
        value: row.value,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })
    )
  }

  async count(): Promise<number> {
    return prisma.playground.count()
  }

  async create(input: PlaygroundCreateInput): Promise<Playground> {
    const row = await prisma.playground.create({
      data: {
        name: input.name,
        value: input.value,
      },
    })

    return Playground.restore({
      id: PlaygroundId.create(row.id),
      name: row.name,
      value: row.value,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  async updateValue(input: PlaygroundUpdateInput): Promise<Playground> {
    const row = await prisma.playground.update({
      where: { id: input.id.toString() },
      data: { value: input.value },
    })

    return Playground.restore({
      id: PlaygroundId.create(row.id),
      name: row.name,
      value: row.value,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  async delete(id: PlaygroundId): Promise<void> {
    await prisma.playground.delete({
      where: { id: id.toString() },
    })
  }
}
