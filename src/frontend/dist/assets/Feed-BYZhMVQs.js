import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, S as Skeleton, B as Button, L as Link } from "./index-DOhjICs9.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-D5_D6H8M.js";
import { B as Badge, C as ConfessionCard } from "./ConfessionCard-BG59nR0q.js";
import { m as motion } from "./proxy-SUiY6OB1.js";
import "./textarea-B0bica--.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
const ALL_TAGS = [
  { label: "All", value: null },
  { label: "Crypto", value: "crypto" },
  { label: "Stocks", value: "stocks" },
  { label: "Real Estate", value: "real estate" },
  { label: "Forex", value: "forex" },
  { label: "Money", value: "money" },
  { label: "Money & Relationships", value: "money and relationships" },
  { label: "School & Money", value: "school and money" },
  { label: "Dark Money Secrets", value: "dark money secrets" },
  { label: "Investing Losses", value: "investing losses" }
];
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c"];
function FeedSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4 max-w-2xl mx-auto", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-5 flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/6 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between mt-auto pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20 rounded" }) })
  ] }, k)) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center py-24 text-center gap-5",
      "data-ocid": "feed-empty",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl select-none", children: "📭" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-foreground mb-1", children: "No confessions yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: "Be the first to share your biggest investment mistake with the community." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            variant: "default",
            size: "lg",
            className: "min-h-[48px]",
            "data-ocid": "feed-empty-cta",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Share your confession" })
          }
        )
      ]
    }
  );
}
function FilterEmptyState({ tag }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center py-24 text-center gap-4",
      "data-ocid": "feed-filter-empty",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl select-none", children: "🔍" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl text-foreground mb-1", children: [
            "No #",
            tag,
            " confessions yet"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Try a different filter or check back later." })
        ] })
      ]
    }
  );
}
function ConfessionOfDayBadge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/40 w-fit", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 text-primary fill-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-primary", children: "Confession of the Day" })
  ] });
}
function TrendingBadge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 w-fit", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5 text-accent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-accent", children: "Trending" })
  ] });
}
function Feed() {
  const [activeTag, setActiveTag] = reactExports.useState(null);
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const highlightedConfessionId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("confession") : null;
  const scrolledRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!highlightedConfessionId || scrolledRef.current) return;
    const el = document.querySelector(
      `[data-confession-id="${highlightedConfessionId}"]`
    );
    if (!el) return;
    scrolledRef.current = true;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary/50", "ring-offset-2");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-primary/50", "ring-offset-2");
      }, 3e3);
    }, 400);
  });
  const { data: confessions = [], isLoading } = useQuery({
    queryKey: ["public-confessions", activeTag],
    queryFn: async () => {
      if (!actor) return [];
      if (activeTag) return actor.getConfessionsByTag(activeTag);
      return actor.getPublicConfessions();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 3e4
  });
  const { data: confessionOfDay } = useQuery({
    queryKey: ["confession-of-day"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getConfessionOfDay();
      if (Array.isArray(result) && result.length > 0)
        return result[0];
      return null;
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 6e4
  });
  const { data: trendingConfessions = [] } = useQuery({
    queryKey: ["trending-confessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingConfessions();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 6e4
  });
  const visibleConfessions = confessions.filter((c) => !c.isHidden);
  const highlightedIds = /* @__PURE__ */ new Set();
  if (confessionOfDay) highlightedIds.add(String(confessionOfDay.id));
  for (const c of trendingConfessions.slice(0, 5)) {
    highlightedIds.add(String(c.id));
  }
  const mainFeedConfessions = visibleConfessions.filter(
    (c) => !highlightedIds.has(String(c.id))
  );
  const isPageLoading = isLoading || actorLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border/60 py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-4xl font-semibold text-foreground tracking-tight", children: "Confession Feed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-muted-foreground text-sm sm:text-base", children: "Browse investment mistakes from the community — anonymously shared, collectively learned." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute right-0 top-0 bottom-0 w-10 pointer-events-none z-10",
            style: {
              background: "linear-gradient(to right, transparent, oklch(var(--card)))"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8",
            "aria-label": "Filter by tag",
            "data-ocid": "feed-filter-bar",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("fieldset", { className: "flex gap-2 border-none p-0 m-0 pb-1 w-max min-w-full", children: ALL_TAGS.map(({ label, value }) => {
              const isActive = activeTag === value;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTag(value),
                  "aria-pressed": isActive,
                  className: [
                    "px-4 py-2.5 rounded-full text-sm font-semibold border whitespace-nowrap transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]",
                    isActive ? "bg-accent text-accent-foreground border-accent shadow-md" : "bg-transparent text-muted-foreground border-border hover:border-accent/50 hover:text-accent"
                  ].join(" "),
                  "data-ocid": `filter-${label.toLowerCase().replace(/\s+/g, "-")}`,
                  children: value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "#" }),
                    label
                  ] }) : label
                },
                label
              );
            }) })
          }
        )
      ] }),
      activeTag && !isPageLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs px-3 py-1", children: [
        visibleConfessions.length,
        " result",
        visibleConfessions.length !== 1 ? "s" : ""
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10", children: isPageLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(FeedSkeleton, {}) : visibleConfessions.length === 0 && !confessionOfDay && trendingConfessions.length === 0 ? activeTag ? /* @__PURE__ */ jsxRuntimeExports.jsx(FilterEmptyState, { tag: activeTag }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      confessionOfDay && !activeTag && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          "data-ocid": "confession-of-day-section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-primary fill-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Confession of the Day" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "ring-2 ring-primary/30 rounded-lg",
                "data-confession-id": String(confessionOfDay.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ConfessionCard,
                  {
                    confession: confessionOfDay,
                    isOwner: false,
                    badge: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfessionOfDayBadge, {})
                  }
                )
              }
            )
          ]
        }
      ),
      trendingConfessions.length > 0 && !activeTag && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay: 0.1 },
          "data-ocid": "trending-section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-5 h-5 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Trending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                "Top ",
                Math.min(trendingConfessions.length, 5)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: trendingConfessions.slice(0, 5).map((confession, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, x: -16 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.35, delay: index * 0.07 },
                "data-confession-id": String(confession.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ConfessionCard,
                  {
                    confession,
                    isOwner: false,
                    compact: true,
                    badge: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingBadge, {})
                  }
                )
              },
              String(confession.id)
            )) })
          ]
        }
      ),
      (mainFeedConfessions.length > 0 || activeTag) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "main-feed", children: [
        !activeTag && mainFeedConfessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground mb-3", children: "All Confessions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: (activeTag ? visibleConfessions : mainFeedConfessions).map(
          (confession, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.35, delay: index * 0.05 },
              "data-ocid": "feed-item",
              "data-confession-id": String(confession.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ConfessionCard,
                {
                  confession,
                  compact: true,
                  isOwner: false
                }
              )
            },
            String(confession.id)
          )
        ) })
      ] })
    ] }) })
  ] });
}
export {
  Feed as default
};
