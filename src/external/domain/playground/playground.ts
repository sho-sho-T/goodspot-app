import { PlaygroundId } from './playground-id'

// Playground エンティティ
export type PlaygroundProps = {
  id: PlaygroundId
  name: string
  value: number
  createdAt: Date
  updatedAt: Date
}

export class Playground {
  private constructor(private readonly props: PlaygroundProps) {}

  static create(name: string, value: number): Playground {
    const now = new Date()
    return new Playground({
      id: PlaygroundId.generate(),
      name,
      value,
      createdAt: now,
      updatedAt: now,
    })
  }

  static restore(props: PlaygroundProps): Playground {
    return new Playground(props)
  }

  updateValue(value: number): Playground {
    return new Playground({
      ...this.props,
      value,
      updatedAt: new Date(),
    })
  }

  get id(): PlaygroundId {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get value(): number {
    return this.props.value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
