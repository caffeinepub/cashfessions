import { createActor } from "@/backend";
import { ConfessionCard } from "@/components/ConfessionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Confession, TagFilter } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Flame, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ALL_TAGS: { label: string; value: TagFilter }[] = [
  { label: "All", value: null },
  { label: "Crypto", value: "crypto" },
  { label: "Stocks", value: "stocks" },
  { label: "Real Estate", value: "real estate" },
  { label: "Forex", value: "forex" },
  { label: "Money", value: "money" },
  { label: "Money & Relationships", value: "money and relationships" },
  { label: "School & Money", value: "school and money" },
  { label: "Dark Money Secrets", value: "dark money secrets" },
  { label: "Investing Losses", value: "investing losses" },
];

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c"];

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {SKELETON_KEYS.map((k) => (
        <div key={k} className="card-elevated p-5 flex flex-col gap-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex justify-between mt-auto pt-3">
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-5"
      data-ocid="feed-empty"
    >
      <div className="text-5xl select-none">📭</div>
      <div>
        <h3 className="font-display text-xl text-foreground mb-1">
          No confessions yet
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Be the first to share your biggest investment mistake with the
          community.
        </p>
      </div>
      <Button
        asChild
        variant="default"
        size="lg"
        className="min-h-[48px]"
        data-ocid="feed-empty-cta"
      >
        <Link to="/">Share your confession</Link>
      </Button>
    </motion.div>
  );
}

function FilterEmptyState({ tag }: { tag: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-4"
      data-ocid="feed-filter-empty"
    >
      <div className="text-4xl select-none">🔍</div>
      <div>
        <h3 className="font-display text-xl text-foreground mb-1">
          No #{tag} confessions yet
        </h3>
        <p className="text-muted-foreground text-sm">
          Try a different filter or check back later.
        </p>
      </div>
    </motion.div>
  );
}

function ConfessionOfDayBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/40 w-fit">
      <Star className="w-3.5 h-3.5 text-primary fill-primary" />
      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
        Confession of the Day
      </span>
    </div>
  );
}

function TrendingBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 w-fit">
      <Flame className="w-3.5 h-3.5 text-accent" />
      <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
        Trending
      </span>
    </div>
  );
}

export default function Feed() {
  const [activeTag, setActiveTag] = useState<TagFilter>(null);
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const highlightedConfessionId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("confession")
      : null;
  const scrolledRef = useRef(false);

  // Scroll to and highlight the linked confession once data loads
  useEffect(() => {
    if (!highlightedConfessionId || scrolledRef.current) return;
    const el = document.querySelector(
      `[data-confession-id="${highlightedConfessionId}"]`,
    );
    if (!el) return;
    scrolledRef.current = true;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary/50", "ring-offset-2");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-primary/50", "ring-offset-2");
      }, 3000);
    }, 400);
  });

  const { data: confessions = [], isLoading } = useQuery<Confession[]>({
    queryKey: ["public-confessions", activeTag],
    queryFn: async () => {
      if (!actor) return [];
      if (activeTag) return actor.getConfessionsByTag(activeTag);
      return actor.getPublicConfessions();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 30_000,
  });

  const { data: confessionOfDay } = useQuery<Confession | null>({
    queryKey: ["confession-of-day"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getConfessionOfDay();
      if (Array.isArray(result) && result.length > 0)
        return result[0] as Confession;
      return null;
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 60_000,
  });

  const { data: trendingConfessions = [] } = useQuery<Confession[]>({
    queryKey: ["trending-confessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingConfessions();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 60_000,
  });

  const visibleConfessions = confessions.filter((c) => !c.isHidden);

  const highlightedIds = new Set<string>();
  if (confessionOfDay) highlightedIds.add(String(confessionOfDay.id));
  for (const c of trendingConfessions.slice(0, 5)) {
    highlightedIds.add(String(c.id));
  }

  const mainFeedConfessions = visibleConfessions.filter(
    (c) => !highlightedIds.has(String(c.id)),
  );

  const isPageLoading = isLoading || actorLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header band */}
      <section className="bg-card border-b border-border/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="font-display text-2xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Confession Feed
            </h1>
            <p className="mt-1.5 text-muted-foreground text-sm sm:text-base">
              Browse investment mistakes from the community — anonymously
              shared, collectively learned.
            </p>
          </motion.div>

          {/* Scrollable tag filter bar with right fade affordance */}
          <div className="relative mt-5">
            {/* Right fade gradient to signal scrollability */}
            <div
              className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(var(--card)))",
              }}
              aria-hidden="true"
            />
            <div
              className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
              aria-label="Filter by tag"
              data-ocid="feed-filter-bar"
            >
              <fieldset className="flex gap-2 border-none p-0 m-0 pb-1 w-max min-w-full">
                {ALL_TAGS.map(({ label, value }) => {
                  const isActive = activeTag === value;
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => setActiveTag(value)}
                      aria-pressed={isActive}
                      className={[
                        "px-4 py-2.5 rounded-full text-sm font-semibold border whitespace-nowrap transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]",
                        isActive
                          ? "bg-accent text-accent-foreground border-accent shadow-md"
                          : "bg-transparent text-muted-foreground border-border hover:border-accent/50 hover:text-accent",
                      ].join(" ")}
                      data-ocid={`filter-${label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {value ? (
                        <span>
                          <span className="opacity-60">#</span>
                          {label}
                        </span>
                      ) : (
                        label
                      )}
                    </button>
                  );
                })}
              </fieldset>
            </div>
          </div>

          {activeTag && !isPageLoading && (
            <div className="mt-3">
              <Badge variant="secondary" className="text-xs px-3 py-1">
                {visibleConfessions.length} result
                {visibleConfessions.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* Feed content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        {isPageLoading ? (
          <FeedSkeleton />
        ) : visibleConfessions.length === 0 &&
          !confessionOfDay &&
          trendingConfessions.length === 0 ? (
          activeTag ? (
            <FilterEmptyState tag={activeTag} />
          ) : (
            <EmptyState />
          )
        ) : (
          <>
            {/* Confession of the Day */}
            {confessionOfDay && !activeTag && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                data-ocid="confession-of-day-section"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Confession of the Day
                  </h2>
                </div>
                <div
                  className="ring-2 ring-primary/30 rounded-lg"
                  data-confession-id={String(confessionOfDay.id)}
                >
                  <ConfessionCard
                    confession={confessionOfDay}
                    isOwner={false}
                    badge={<ConfessionOfDayBadge />}
                  />
                </div>
              </motion.div>
            )}

            {/* Trending section */}
            {trendingConfessions.length > 0 && !activeTag && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                data-ocid="trending-section"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-accent" />
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Trending
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    Top {Math.min(trendingConfessions.length, 5)}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3">
                  {trendingConfessions.slice(0, 5).map((confession, index) => (
                    <motion.div
                      key={String(confession.id)}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.07 }}
                      data-confession-id={String(confession.id)}
                    >
                      <ConfessionCard
                        confession={confession}
                        isOwner={false}
                        compact
                        badge={<TrendingBadge />}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Main feed */}
            {(mainFeedConfessions.length > 0 || activeTag) && (
              <div data-ocid="main-feed">
                {!activeTag && mainFeedConfessions.length > 0 && (
                  <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                    All Confessions
                  </h2>
                )}
                <div className="flex flex-col gap-4">
                  {(activeTag ? visibleConfessions : mainFeedConfessions).map(
                    (confession, index) => (
                      <motion.div
                        key={String(confession.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                        data-ocid="feed-item"
                        data-confession-id={String(confession.id)}
                      >
                        <ConfessionCard
                          confession={confession}
                          compact
                          isOwner={false}
                        />
                      </motion.div>
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
