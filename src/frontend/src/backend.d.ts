import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ConfessionId = bigint;
export interface Confession {
    id: ConfessionId;
    tags: Array<string>;
    text: string;
    isHidden: boolean;
    timestamp: bigint;
}
export interface backendInterface {
    claimOwnership(): Promise<boolean>;
    deleteConfession(id: bigint): Promise<boolean>;
    getConfessionsByTag(tag: string): Promise<Array<Confession>>;
    getOwnerConfessions(): Promise<Array<Confession>>;
    getPublicConfessions(): Promise<Array<Confession>>;
    submitConfession(text: string, tags: Array<string>): Promise<bigint>;
    toggleHideConfession(id: bigint): Promise<boolean>;
}
