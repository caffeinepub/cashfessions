export interface Confession {
  id: bigint;
  text: string;
  tags: string[];
  timestamp: bigint;
  isHidden: boolean;
}

export type TagFilter = string | null;
