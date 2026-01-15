import 'server-only'

import { PlaygroundId } from '@/external/domain/playground'
import type {
  PlaygroundCreateInput,
  PlaygroundListQuery,
  PlaygroundRepository,
} from '@/external/domain/playground'

// Playground ユースケースの窓口
export class PlaygroundService {
  constructor(private readonly playgroundRepository: PlaygroundRepository) {}

  async list(query?: PlaygroundListQuery) {
    return this.playgroundRepository.findAll(query)
  }

  async count() {
    return this.playgroundRepository.count()
  }

  async create(input: PlaygroundCreateInput) {
    return this.playgroundRepository.create(input)
  }

  async updateValue(id: PlaygroundId, value: number) {
    return this.playgroundRepository.updateValue({ id, value })
  }

  async delete(id: PlaygroundId) {
    await this.playgroundRepository.delete(id)
  }
}
