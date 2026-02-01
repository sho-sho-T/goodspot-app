import type { Playground } from './playground';
import type { PlaygroundId } from './playground-id';

// Playground 用リポジトリ契約
export type PlaygroundCreateInput = {
  name: string;
  value: number;
};

export type PlaygroundUpdateInput = {
  id: PlaygroundId;
  value: number;
};

export type PlaygroundListQuery = {
  limit?: number;
  offset?: number;
};

export interface PlaygroundRepository {
  findAll(query?: PlaygroundListQuery): Promise<Playground[]>;
  count(): Promise<number>;
  create(input: PlaygroundCreateInput): Promise<Playground>;
  updateValue(input: PlaygroundUpdateInput): Promise<Playground>;
  delete(id: PlaygroundId): Promise<void>;
}
