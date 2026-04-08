import type { backendInterface } from "../backend";
import { Reaction } from "../backend";

const sampleConfessions = [
  {
    id: BigInt(1),
    tags: ["crypto"],
    text: "I put my entire life savings into Dogecoin at the peak of the 2021 bull run. Within two months, I had lost 80% of my investment. Lesson learned: never invest more than you can afford to lose.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    reactions: { relatable: BigInt(42), crazy: BigInt(31), sad: BigInt(15), funny: BigInt(8) },
    commentCount: BigInt(3),
  },
  {
    id: BigInt(2),
    tags: ["stocks"],
    text: "I put my entire life savings into a biotech penny stock based on a 'sure bet' from an online forum. The company collapsed two weeks later. Lesson learned: never chase hype, do your own research.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    reactions: { relatable: BigInt(65), crazy: BigInt(20), sad: BigInt(18), funny: BigInt(12) },
    commentCount: BigInt(5),
  },
  {
    id: BigInt(3),
    tags: ["forex"],
    text: "I thought I had cracked forex trading with a single week of backtesting. I went all in with leverage and blew up my account in 3 days. Markets are humbling.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    reactions: { relatable: BigInt(19), crazy: BigInt(22), sad: BigInt(27), funny: BigInt(6) },
    commentCount: BigInt(1),
  },
  {
    id: BigInt(4),
    tags: ["real estate"],
    text: "I bought a rental property at the top of the market without doing proper due diligence. Renovation costs tripled my budget and I've been cash-flow negative for two years.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    reactions: { relatable: BigInt(28), crazy: BigInt(12), sad: BigInt(35), funny: BigInt(3) },
    commentCount: BigInt(2),
  },
  {
    id: BigInt(5),
    tags: ["stocks"],
    text: "I panic sold all my index funds in March 2020 thinking the market would crash further. I watched it recover 50% while sitting in cash. Cost me years of compounding.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    reactions: { relatable: BigInt(55), crazy: BigInt(10), sad: BigInt(20), funny: BigInt(5) },
    commentCount: BigInt(0),
  },
  {
    id: BigInt(6),
    tags: ["crypto"],
    text: "I lost my seed phrase for a hardware wallet holding 2 BTC. I still have the wallet but can never access those coins. Back up your keys, people.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 10 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    reactions: { relatable: BigInt(33), crazy: BigInt(15), sad: BigInt(50), funny: BigInt(2) },
    commentCount: BigInt(4),
  },
];

const sampleComments = [
  { id: BigInt(1), confessionId: BigInt(1), text: "This hits so hard, I did the same thing.", timestamp: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000) * BigInt(1_000_000) },
  { id: BigInt(2), confessionId: BigInt(1), text: "At least you're not alone in this.", timestamp: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1_000_000) },
  { id: BigInt(3), confessionId: BigInt(2), text: "Penny stocks are a trap, I learned the hard way too.", timestamp: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000) * BigInt(1_000_000) },
];

export const mockBackend: backendInterface = {
  claimOwnership: async () => true,
  deleteConfession: async (_id: bigint) => true,
  getConfessionsByTag: async (tag: string) =>
    sampleConfessions.filter((c) => c.tags.includes(tag)),
  getAllConfessions: async () => sampleConfessions,
  getPublicConfessions: async () => sampleConfessions.filter((c) => !c.isHidden),
  submitConfession: async (_text: string, _tags: string[]) => BigInt(7),
  toggleHideConfession: async (_id: bigint) => true,
  getTagAnalytics: async () => [
    { tag: "crypto", count: BigInt(2) },
    { tag: "stocks", count: BigInt(2) },
    { tag: "forex", count: BigInt(1) },
    { tag: "real estate", count: BigInt(1) },
    { tag: "money", count: BigInt(0) },
    { tag: "money and relationships", count: BigInt(0) },
    { tag: "school and money", count: BigInt(0) },
    { tag: "dark money secrets", count: BigInt(0) },
    { tag: "investing losses", count: BigInt(0) },
  ],
  addReaction: async (_confessionId: bigint, _reaction: Reaction) => ({
    relatable: BigInt(43),
    crazy: BigInt(31),
    sad: BigInt(15),
    funny: BigInt(8),
  }),
  addComment: async (_confessionId: bigint, text: string) => ({
    id: BigInt(99),
    confessionId: _confessionId,
    text,
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  getComments: async (confessionId: bigint) =>
    sampleComments.filter((c) => c.confessionId === confessionId),
  getConfessionOfDay: async () => sampleConfessions[1] ?? null,
  getTrendingConfessions: async () => [...sampleConfessions].slice(0, 5),
};
