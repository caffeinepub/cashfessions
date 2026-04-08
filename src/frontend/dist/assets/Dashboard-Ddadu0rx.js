import { c as createLucideIcon, u as useAuth, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, d as LayoutDashboard, B as Button, S as Skeleton } from "./index-ZTjGUZ0D.js";
import { u as useActor, a as useQuery, c as createActor } from "./backend-DS25Mx_5.js";
import { B as Badge, C as ConfessionCard } from "./ConfessionCard-CFjH3LXg.js";
import { u as useMutation, L as Lock } from "./lock-C7SxTtb8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$1);
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "hidden", label: "Hidden" }
];
function ConfirmDelete({ open, onConfirm, onCancel }) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a;
    if (open) (_a = ref.current) == null ? void 0 : _a.focus();
  }, [open]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      "aria-modal": "true",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref,
          tabIndex: -1,
          className: "card-elevated max-w-sm w-full mx-4 p-6 flex flex-col gap-4 outline-none",
          "data-ocid": "confirm-delete-dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg text-foreground", children: "Delete confession?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Are you sure? This cannot be undone." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: onCancel,
                  "data-ocid": "confirm-cancel",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "destructive",
                  size: "sm",
                  onClick: onConfirm,
                  "data-ocid": "confirm-delete",
                  children: "Delete"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"];
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 w-full rounded-lg" }, k)) });
}
function LoginWall({ onLogin }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center gap-6 py-24 text-center",
      "data-ocid": "login-wall",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-7 h-7 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground", children: "Owner Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Sign in with Internet Identity to manage your confessions, moderate submissions, and view your complete feed." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "lg",
            onClick: onLogin,
            className: "gap-2",
            "data-ocid": "login-btn",
            children: "Login with Internet Identity"
          }
        )
      ]
    }
  );
}
function Dashboard() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [pendingDeleteId, setPendingDeleteId] = reactExports.useState(null);
  const hasClaimed = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (isAuthenticated && actor && !actorFetching && !hasClaimed.current) {
      hasClaimed.current = true;
      actor.claimOwnership().catch(() => {
      });
    }
  }, [isAuthenticated, actor, actorFetching]);
  const {
    data: confessions,
    isLoading: confessionsLoading,
    isError
  } = useQuery({
    queryKey: ["owner-confessions"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getOwnerConfessions();
      return raw;
    },
    enabled: isAuthenticated && !!actor && !actorFetching,
    staleTime: 15e3
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteConfession(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["owner-confessions"] });
      const prev = queryClient.getQueryData([
        "owner-confessions"
      ]);
      queryClient.setQueryData(
        ["owner-confessions"],
        (old) => (old ?? []).filter((c) => c.id !== id)
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx == null ? void 0 : ctx.prev) {
        queryClient.setQueryData(["owner-confessions"], ctx.prev);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["owner-confessions"] });
      setDeletingId(null);
    }
  });
  const toggleHideMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      return actor.toggleHideConfession(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["owner-confessions"] });
      const prev = queryClient.getQueryData([
        "owner-confessions"
      ]);
      queryClient.setQueryData(
        ["owner-confessions"],
        (old) => (old ?? []).map(
          (c) => c.id === id ? { ...c, isHidden: !c.isHidden } : c
        )
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx == null ? void 0 : ctx.prev) {
        queryClient.setQueryData(["owner-confessions"], ctx.prev);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["owner-confessions"] });
    }
  });
  const handleDeleteRequest = reactExports.useCallback((id) => {
    setPendingDeleteId(id);
  }, []);
  const handleDeleteConfirm = reactExports.useCallback(() => {
    if (pendingDeleteId === null) return;
    setDeletingId(pendingDeleteId);
    deleteMutation.mutate(pendingDeleteId);
    setPendingDeleteId(null);
  }, [pendingDeleteId, deleteMutation]);
  const handleDeleteCancel = reactExports.useCallback(() => {
    setPendingDeleteId(null);
  }, []);
  const handleToggleHide = reactExports.useCallback(
    (id) => {
      toggleHideMutation.mutate(id);
    },
    [toggleHideMutation]
  );
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSkeleton, {}) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginWall, { onLogin: login }) });
  }
  const allConfessions = confessions ?? [];
  const filtered = activeTab === "all" ? allConfessions : activeTab === "active" ? allConfessions.filter((c) => !c.isHidden) : allConfessions.filter((c) => c.isHidden);
  const totalCount = allConfessions.length;
  const hiddenCount = allConfessions.filter((c) => c.isHidden).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDelete,
      {
        open: pendingDeleteId !== null,
        onConfirm: handleDeleteConfirm,
        onCancel: handleDeleteCancel
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-5 h-5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-foreground leading-tight", children: "My Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
              totalCount,
              " ",
              totalCount === 1 ? "confession" : "confessions",
              " ",
              "total",
              hiddenCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground/60", children: [
                "· ",
                hiddenCount,
                " hidden"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: logout,
            className: "gap-2 self-start sm:self-auto",
            "data-ocid": "logout-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
              "Log out"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-1 bg-muted/50 p-1 rounded-lg w-fit",
          "aria-label": "Filter confessions",
          "data-ocid": "filter-tabs",
          children: TABS.map(({ key, label }) => {
            const count = key === "all" ? totalCount : key === "active" ? totalCount - hiddenCount : hiddenCount;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "aria-pressed": activeTab === key,
                onClick: () => setActiveTab(key),
                className: `flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `tab-${key}`,
                children: [
                  label,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-[10px] px-1.5 py-0 min-w-[1.25rem] justify-center",
                      children: count
                    }
                  )
                ]
              },
              key
            );
          })
        }
      ),
      confessionsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSkeleton, {}) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center gap-4 py-16 text-center",
          "data-ocid": "error-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-destructive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: "Could not load confessions. You may not be registered as the owner yet." })
          ]
        }
      ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col items-center justify-center gap-3 py-16 text-center",
          "data-ocid": "empty-state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: activeTab === "hidden" ? "No hidden confessions." : activeTab === "active" ? "No active confessions. Share your link to get some!" : "No confessions yet. Share your link to get started!" })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "ul",
        {
          className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          "aria-label": "Confessions",
          "data-ocid": "confessions-grid",
          children: filtered.map((confession) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "li",
            {
              className: deletingId === confession.id ? "opacity-40 pointer-events-none transition-smooth" : "transition-smooth",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ConfessionCard,
                {
                  confession,
                  isOwner: true,
                  onDelete: handleDeleteRequest,
                  onToggleHide: handleToggleHide
                }
              )
            },
            String(confession.id)
          ))
        }
      )
    ] })
  ] });
}
export {
  Dashboard as default
};
