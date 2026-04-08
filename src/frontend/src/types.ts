export interface Reactions {
  relatable: bigint;
  crazy: bigint;
  sad: bigint;
  funny: bigint;
}

export interface Confession {
  id: bigint;
  text: string;
  tags: string[];
  timestamp: bigint;
  isHidden: boolean;
  reactions: Reactions;
  commentCount: bigint;
}

export interface Comment {
  id: bigint;
  confessionId: bigint;
  text: string;
  timestamp: bigint;
}

export type TagFilter = string | null;

export type Reaction = import("./backend").Reaction;
