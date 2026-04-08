import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ReactionCount {
    sad: bigint;
    funny: bigint;
    crazy: bigint;
    relatable: bigint;
}
export type CommentId = bigint;
export interface Comment {
    id: CommentId;
    text: string;
    timestamp: bigint;
    confessionId: ConfessionId;
}
export interface Confession {
    id: ConfessionId;
    tags: Array<string>;
    text: string;
    isHidden: boolean;
    timestamp: bigint;
    commentCount: bigint;
    reactions: ReactionCount;
}
export type ConfessionId = bigint;
export interface TagAnalytic {
    tag: string;
    count: bigint;
}
export enum Reaction {
    Sad = "Sad",
    Relatable = "Relatable",
    Funny = "Funny",
    Crazy = "Crazy"
}
export interface backendInterface {
    addComment(confessionId: bigint, text: string): Promise<Comment>;
    addReaction(confessionId: bigint, reaction: Reaction): Promise<ReactionCount>;
    claimOwnership(): Promise<boolean>;
    deleteConfession(id: bigint): Promise<boolean>;
    getAllConfessions(): Promise<Array<Confession>>;
    getComments(confessionId: bigint): Promise<Array<Comment>>;
    getConfessionOfDay(): Promise<Confession | null>;
    getConfessionsByTag(tag: string): Promise<Array<Confession>>;
    getPublicConfessions(): Promise<Array<Confession>>;
    getTagAnalytics(): Promise<Array<TagAnalytic>>;
    getTrendingConfessions(): Promise<Array<Confession>>;
    submitConfession(text: string, tags: Array<string>): Promise<bigint>;
    toggleHideConfession(id: bigint): Promise<boolean>;
}
