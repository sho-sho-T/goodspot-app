import { UUID } from '@/external/domain/shared/value-objects/id'

// PlaygroundId 値オブジェクト
export class PlaygroundId extends UUID {
  static create(value: string): PlaygroundId {
    return new PlaygroundId(value)
  }

  static generate(): PlaygroundId {
    const uuid = super.generate()
    return new PlaygroundId(uuid.getValue())
  }
}
