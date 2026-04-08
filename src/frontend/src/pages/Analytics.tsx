import { createActor } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TagAnalytic {
  tag: string;
  count: bigint;
}

interface ChartDatum {
  tag: string;
  label: string;
  count: number;
  isTop: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  crypto: "Crypto",
  stocks: "Stocks",
  "real estate": "Real Estate",
  forex: "Forex",
  money: "Money",
  "money and relationships": "Money & Relationships",
  "school and money": "School & Money",
  "dark money secrets": "Dark Money",
  "investing losses": "Inv. Losses",
};

function toLabel(tag: string): string {
  return CATEGORY_LABELS[tag.toLowerCase()] ?? tag;
}

const SKELETON_HEIGHTS = [
  "h-24",
  "h-40",
  "h-32",
  "h-56",
  "h-20",
  "h-36",
  "h-28",
  "h-48",
  "h-16",
];

function ChartSkeleton() {
  return (
    <div className="flex gap-3 h-72 w-full items-end px-4">
      {SKELETON_HEIGHTS.map((h) => (
        <Skeleton key={h} className={`flex-1 rounded-t-md ${h}`} />
      ))}
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: ChartDatum }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card-elevated px-4 py-3 text-sm shadow-lg min-w-[140px]">
      <p className="font-display font-semibold text-foreground">
        {CATEGORY_LABELS[d.tag] ?? d.label}
      </p>
      <p className="text-muted-foreground mt-0.5">
        <span className="text-accent font-bold text-base">{d.count}</span>{" "}
        confession{d.count !== 1 ? "s" : ""}
      </p>
      {d.isTop && (
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          🏆 Most Popular
        </p>
      )}
    </div>
  );
}

export default function Analytics() {
  const { actor, isFetching: actorLoading } = useActor(createActor);

  const { data: rawAnalytics = [], isLoading } = useQuery<TagAnalytic[]>({
    queryKey: ["tag-analytics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTagAnalytics();
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 60_000,
  });

  // Build chart data sorted descending
  const chartData: ChartDatum[] = rawAnalytics
    .map((a) => ({
      tag: a.tag,
      label: toLabel(a.tag),
      count: Number(a.count),
      isTop: false,
    }))
    .sort((a, b) => b.count - a.count)
    .map((d, i, arr) => ({
      ...d,
      isTop: i === 0 && arr.length > 0 && d.count > 0,
    }));

  const topCategory = chartData.find((d) => d.isTop);
  const totalConfessions = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <section className="bg-card border-b border-border/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Category Analytics
            </h1>
            <p className="mt-1.5 text-muted-foreground text-sm sm:text-base">
              Which investment category carries the most shame? The data speaks
              for itself.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-muted/30 border-b border-border/40 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card-elevated p-4 flex flex-col gap-1"
          >
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Total Confessions
            </span>
            <span className="font-display text-3xl font-bold text-foreground">
              {isLoading || actorLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                totalConfessions
              )}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="card-elevated p-4 flex flex-col gap-1"
          >
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Categories Tracked
            </span>
            <span className="font-display text-3xl font-bold text-foreground">
              {isLoading || actorLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                chartData.filter((d) => d.count > 0).length
              )}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card-elevated p-4 flex flex-col gap-1 col-span-2 sm:col-span-1"
          >
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              Top Category
            </span>
            {isLoading || actorLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : topCategory ? (
              <span className="font-display text-2xl font-bold text-primary truncate">
                {topCategory.label}
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">None yet</span>
            )}
          </motion.div>
        </div>
      </section>

      {/* Bar chart */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="card-elevated p-6"
          data-ocid="analytics-chart"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Confessions by Category
              </h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                Tallied from all public submissions
              </p>
            </div>
            {topCategory && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
                <span className="text-xs font-semibold text-primary">
                  🏆 {topCategory.label}
                </span>
              </div>
            )}
          </div>

          {isLoading || actorLoading ? (
            <ChartSkeleton />
          ) : chartData.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-3 text-center"
              data-ocid="analytics-empty"
            >
              <div className="text-4xl select-none">📊</div>
              <p className="font-display text-lg text-foreground">
                No data yet
              </p>
              <p className="text-muted-foreground text-sm max-w-xs">
                Analytics will appear once confessions are submitted with
                category tags.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={chartData}
                margin={{ top: 28, right: 8, left: -12, bottom: 40 }}
                barCategoryGap="28%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{
                    fill: "oklch(var(--muted-foreground))",
                    fontSize: 10,
                    fontFamily: "var(--font-body)",
                  }}
                  axisLine={false}
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "oklch(var(--muted-foreground))",
                    fontSize: 11,
                    fontFamily: "var(--font-body)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "oklch(var(--muted) / 0.4)", radius: 4 }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{
                      fill: "oklch(var(--muted-foreground))",
                      fontSize: 11,
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                    }}
                  />
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.tag}
                      fill={
                        entry.isTop
                          ? "oklch(var(--primary))"
                          : "oklch(var(--accent) / 0.7)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Category breakdown list */}
        {!isLoading && !actorLoading && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-6 card-elevated divide-y divide-border/60"
            data-ocid="analytics-breakdown"
          >
            {chartData.map((d, index) => {
              const pct =
                totalConfessions > 0
                  ? Math.round((d.count / totalConfessions) * 100)
                  : 0;
              return (
                <div
                  key={d.tag}
                  className="flex items-center gap-4 px-5 py-4"
                  data-ocid={`analytics-row-${d.tag.replace(/\s+/g, "-")}`}
                >
                  <span className="text-muted-foreground text-sm w-5 text-right shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {CATEGORY_LABELS[d.tag] ?? d.label}
                      </span>
                      {d.isTop && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/25 shrink-0">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: d.isTop
                            ? "oklch(var(--primary))"
                            : "oklch(var(--accent) / 0.7)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-foreground font-bold text-sm tabular-nums">
                      {d.count}
                    </span>
                    <span className="text-muted-foreground text-xs tabular-nums w-9 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
}
