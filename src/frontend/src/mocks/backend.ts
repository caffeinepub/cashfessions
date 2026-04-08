import type { backendInterface } from "../backend";

const sampleConfessions = [
  {
    id: BigInt(1),
    tags: ["crypto"],
    text: "I put my entire life savings into Dogecoin at the peak of the 2021 bull run. Within two months, I had lost 80% of my investment. Lesson learned: never invest more than you can afford to lose.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(2),
    tags: ["stocks"],
    text: "I put my entire life savings into a biotech penny stock based on a 'sure bet' from an online forum. The company collapsed two weeks later. Lesson learned: never chase hype, do your own research.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(3),
    tags: ["forex"],
    text: "I thought I had cracked forex trading with a single week of backtesting. I went all in with leverage and blew up my account in 3 days. Markets are humbling.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(4),
    tags: ["real estate"],
    text: "I bought a rental property at the top of the market without doing proper due diligence. Renovation costs tripled my budget and I've been cash-flow negative for two years.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(5),
    tags: ["stocks"],
    text: "I panic sold all my index funds in March 2020 thinking the market would crash further. I watched it recover 50% while sitting in cash. Cost me years of compounding.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    id: BigInt(6),
    tags: ["crypto"],
    text: "I lost my seed phrase for a hardware wallet holding 2 BTC. I still have the wallet but can never access those coins. Back up your keys, people.",
    isHidden: false,
    timestamp: BigInt(Date.now() - 10 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
];

export const mockBackend: backendInterface = {
  claimOwnership: async () => true,
  deleteConfession: async (_id: bigint) => true,
  getConfessionsByTag: async (tag: string) =>
    sampleConfessions.filter((c) => c.tags.includes(tag)),
  getOwnerConfessions: async () => sampleConfessions,
  getPublicConfessions: async () => sampleConfessions.filter((c) => !c.isHidden),
  submitConfession: async (_text: string, _tags: string[]) => BigInt(7),
  toggleHideConfession: async (_id: bigint) => true,
};
