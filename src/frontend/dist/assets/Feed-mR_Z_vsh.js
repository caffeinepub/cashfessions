import { r as reactExports, j as jsxRuntimeExports, S as Skeleton, B as Button, L as Link } from "./index-ZTjGUZ0D.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DS25Mx_5.js";
import { B as Badge, C as ConfessionCard } from "./ConfessionCard-CFjH3LXg.js";
import { m as motion } from "./proxy-ESWgU8xn.js";
const TAG_FILTERS = [
  { label: "All", value: null },
  { label: "Crypto", value: "crypto" },
  { label: "Stocks", value: "stocks" },
  { label: "Real Estate", value: "real estate" },
  { label: "Forex", value: "forex" }
];
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];
function FeedSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-5 flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/6 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/6 rounded" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "default", "data-ocid": "feed-empty-cta", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Share your confession" }) })
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
function Feed() {
  const [activeTag, setActiveTag] = reactExports.useState(null);
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const { data: confessions = [], isLoading } = useQuery({
    queryKey: ["public-confessions", activeTag],
    queryFn: async () => {
      if (!actor) return [];
      if (activeTag) {
        return actor.getConfessionsByTag(activeTag);
      }
      return actor.getPublicConfessions();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 3e4
  });
  const visibleConfessions = confessions.filter((c) => !c.isHidden);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border/60 py-10 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight", children: "Confession Feed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-muted-foreground text-sm sm:text-base", children: "Browse investment mistakes from the community — anonymously shared, collectively learned." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "fieldset",
        {
          className: "flex flex-wrap gap-2 mt-6 border-none p-0 m-0",
          "aria-label": "Filter by tag",
          "data-ocid": "feed-filter-bar",
          children: [
            TAG_FILTERS.map(({ label, value }) => {
              const isActive = activeTag === value;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTag(value),
                  "aria-pressed": isActive,
                  className: [
                    "px-4 py-1.5 rounded-full text-xs font-semibold border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "bg-accent text-accent-foreground border-accent shadow-md" : "bg-transparent text-muted-foreground border-border hover:border-accent/50 hover:text-accent"
                  ].join(" "),
                  "data-ocid": `filter-${label.toLowerCase().replace(" ", "-")}`,
                  children: value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "#" }),
                    label
                  ] }) : label
                },
                label
              );
            }),
            activeTag && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "ml-auto text-xs self-center px-3 py-1",
                children: [
                  visibleConfessions.length,
                  " result",
                  visibleConfessions.length !== 1 ? "s" : ""
                ]
              }
            )
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: isLoading || actorLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(FeedSkeleton, {}) : visibleConfessions.length === 0 ? activeTag ? /* @__PURE__ */ jsxRuntimeExports.jsx(FilterEmptyState, { tag: activeTag }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: visibleConfessions.map((confession, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: index * 0.05 },
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
    )) }) })
  ] });
}
export {
  Feed as default
};
