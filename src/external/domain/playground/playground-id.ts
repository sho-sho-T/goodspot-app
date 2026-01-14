import { UUID } from '@/external/domain/shared/value-objects/id'

export class PlaygroundId extends UUID {
  static from(value: string): PlaygroundId {
    return new PlaygroundId(value)
  }
}
