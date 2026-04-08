import { createActor } from "@/backend";
import { ConfessionCard } from "@/components/ConfessionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import type { Confession } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, LayoutDashboard, Lock, LogOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Filter tabs ─────────────────────────────────────────────────────────────

type FilterTab = "all" | "active" | "hidden";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "hidden", label: "Hidden" },
];

// ─── Delete confirmation ──────────────────────────────────────────────────────

interface ConfirmDeleteProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDelete({ open, onConfirm, onCancel }: ConfirmDeleteProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-modal="true"
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="card-elevated max-w-sm w-full mx-4 p-6 flex flex-col gap-4 outline-none"
        data-ocid="confirm-delete-dialog"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <h2 className="font-display text-lg text-foreground">
              Delete confession?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Are you sure? This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            data-ocid="confirm-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            data-ocid="confirm-delete"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"];

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SKELETON_KEYS.map((k) => (
        <Skeleton key={k} className="h-52 w-full rounded-lg" />
      ))}
    </div>
  );
}

// ─── Login wall ───────────────────────────────────────────────────────────────

function LoginWall({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-24 text-center"
      data-ocid="login-wall"
    >
      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center">
        <Lock className="w-7 h-7 text-primary" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h1 className="font-display text-3xl text-foreground">
          Owner Dashboard
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign in with Internet Identity to manage your confessions, moderate
          submissions, and view your complete feed.
        </p>
      </div>
      <Button
        size="lg"
        onClick={onLogin}
        className="gap-2"
        data-ocid="login-btn"
      >
        Login with Internet Identity
      </Button>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<bigint | null>(null);

  // ── Claim ownership after first login ──────────────────────────────────────
  const hasClaimed = useRef(false);
  useEffect(() => {
    if (isAuthenticated && actor && !actorFetching && !hasClaimed.current) {
      hasClaimed.current = true;
      actor.claimOwnership().catch(() => {
        // benign — may already be owner
      });
    }
  }, [isAuthenticated, actor, actorFetching]);

  // ── Fetch owner confessions ────────────────────────────────────────────────
  const {
    data: confessions,
    isLoading: confessionsLoading,
    isError,
  } = useQuery<Confession[]>({
    queryKey: ["owner-confessions"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getAllConfessions();
      return raw as Confession[];
    },
    enabled: isAuthenticated && !!actor && !actorFetching,
    staleTime: 15_000,
  });

  // ── Delete mutation ────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteConfession(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["owner-confessions"] });
      const prev = queryClient.getQueryData<Confession[]>([
        "owner-confessions",
      ]);
      queryClient.setQueryData<Confession[]>(["owner-confessions"], (old) =>
        (old ?? []).filter((c) => c.id !== id),
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["owner-confessions"], ctx.prev);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["owner-confessions"] });
      setDeletingId(null);
    },
  });

  // ── Toggle hide mutation ───────────────────────────────────────────────────
  const toggleHideMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.toggleHideConfession(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["owner-confessions"] });
      const prev = queryClient.getQueryData<Confession[]>([
        "owner-confessions",
      ]);
      queryClient.setQueryData<Confession[]>(["owner-confessions"], (old) =>
        (old ?? []).map((c) =>
          c.id === id ? { ...c, isHidden: !c.isHidden } : c,
        ),
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["owner-confessions"], ctx.prev);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["owner-confessions"] });
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDeleteRequest = useCallback((id: bigint) => {
    setPendingDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (pendingDeleteId === null) return;
    setDeletingId(pendingDeleteId);
    deleteMutation.mutate(pendingDeleteId);
    setPendingDeleteId(null);
  }, [pendingDeleteId, deleteMutation]);

  const handleDeleteCancel = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

  const handleToggleHide = useCallback(
    (id: bigint) => {
      toggleHideMutation.mutate(id);
    },
    [toggleHideMutation],
  );

  // ── Auth loading ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DashboardSkeleton />
      </div>
    );
  }

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoginWall onLogin={login} />
      </div>
    );
  }

  // ── Filter confessions ─────────────────────────────────────────────────────
  const allConfessions = confessions ?? [];
  const filtered =
    activeTab === "all"
      ? allConfessions
      : activeTab === "active"
        ? allConfessions.filter((c) => !c.isHidden)
        : allConfessions.filter((c) => c.isHidden);

  const totalCount = allConfessions.length;
  const hiddenCount = allConfessions.filter((c) => c.isHidden).length;

  return (
    <>
      <ConfirmDelete
        open={pendingDeleteId !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h1 className="font-display text-2xl text-foreground leading-tight">
                My Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {totalCount} {totalCount === 1 ? "confession" : "confessions"}{" "}
                total
                {hiddenCount > 0 && (
                  <span className="ml-1.5 text-muted-foreground/60">
                    · {hiddenCount} hidden
                  </span>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="gap-2 self-start sm:self-auto"
            data-ocid="logout-btn"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>

        {/* ── Filter tabs ─────────────────────────────────────────────────── */}
        <div
          className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit"
          aria-label="Filter confessions"
          data-ocid="filter-tabs"
        >
          {TABS.map(({ key, label }) => {
            const count =
              key === "all"
                ? totalCount
                : key === "active"
                  ? totalCount - hiddenCount
                  : hiddenCount;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={activeTab === key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeTab === key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`tab-${key}`}
              >
                {label}
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 min-w-[1.25rem] justify-center"
                >
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {confessionsLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <div
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
            data-ocid="error-state"
          >
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="text-muted-foreground text-sm max-w-xs">
              Could not load confessions. You may not be registered as the owner
              yet.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 py-16 text-center"
            data-ocid="empty-state"
          >
            <p className="text-muted-foreground text-sm">
              {activeTab === "hidden"
                ? "No hidden confessions."
                : activeTab === "active"
                  ? "No active confessions. Share your link to get some!"
                  : "No confessions yet. Share your link to get started!"}
            </p>
          </div>
        ) : (
          <ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Confessions"
            data-ocid="confessions-grid"
          >
            {filtered.map((confession) => (
              <li
                key={String(confession.id)}
                className={
                  deletingId === confession.id
                    ? "opacity-40 pointer-events-none transition-smooth"
                    : "transition-smooth"
                }
              >
                <ConfessionCard
                  confession={confession}
                  isOwner
                  onDelete={handleDeleteRequest}
                  onToggleHide={handleToggleHide}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
