import { createActor } from "@/backend";
import { ConfessionCard } from "@/components/ConfessionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Confession, TagFilter } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

const TAG_FILTERS: { label: string; value: TagFilter }[] = [
  { label: "All", value: null },
  { label: "Crypto", value: "crypto" },
  { label: "Stocks", value: "stocks" },
  { label: "Real Estate", value: "real estate" },
  { label: "Forex", value: "forex" },
];

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SKELETON_KEYS.map((k) => (
        <div key={k} className="card-elevated p-5 flex flex-col gap-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
          <Skeleton className="h-4 w-3/6 rounded" />
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
      <Button asChild variant="default" data-ocid="feed-empty-cta">
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

export default function Feed() {
  const [activeTag, setActiveTag] = useState<TagFilter>(null);
  const { actor, isFetching: actorLoading } = useActor(createActor);

  const { data: confessions = [], isLoading } = useQuery<Confession[]>({
    queryKey: ["public-confessions", activeTag],
    queryFn: async () => {
      if (!actor) return [];
      if (activeTag) {
        return actor.getConfessionsByTag(activeTag);
      }
      return actor.getPublicConfessions();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 30_000,
  });

  const visibleConfessions = confessions.filter((c) => !c.isHidden);

  return (
    <div className="min-h-screen bg-background">
      {/* Page header band */}
      <section className="bg-card border-b border-border/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Confession Feed
            </h1>
            <p className="mt-1.5 text-muted-foreground text-sm sm:text-base">
              Browse investment mistakes from the community — anonymously
              shared, collectively learned.
            </p>
          </motion.div>

          {/* Tag filter bar */}
          <fieldset
            className="flex flex-wrap gap-2 mt-6 border-none p-0 m-0"
            aria-label="Filter by tag"
            data-ocid="feed-filter-bar"
          >
            {TAG_FILTERS.map(({ label, value }) => {
              const isActive = activeTag === value;
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => setActiveTag(value)}
                  aria-pressed={isActive}
                  className={[
                    "px-4 py-1.5 rounded-full text-xs font-semibold border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-accent text-accent-foreground border-accent shadow-md"
                      : "bg-transparent text-muted-foreground border-border hover:border-accent/50 hover:text-accent",
                  ].join(" ")}
                  data-ocid={`filter-${label.toLowerCase().replace(" ", "-")}`}
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

            {activeTag && (
              <Badge
                variant="secondary"
                className="ml-auto text-xs self-center px-3 py-1"
              >
                {visibleConfessions.length} result
                {visibleConfessions.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </fieldset>
        </div>
      </section>

      {/* Feed content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading || actorLoading ? (
          <FeedSkeleton />
        ) : visibleConfessions.length === 0 ? (
          activeTag ? (
            <FilterEmptyState tag={activeTag} />
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleConfessions.map((confession, index) => (
              <motion.div
                key={String(confession.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <ConfessionCard
                  confession={confession}
                  compact
                  isOwner={false}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
