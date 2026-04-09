import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart2,
  Landmark,
  LayoutDashboard,
  Menu,
  Rss,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { to: "/feed", label: "Discover", icon: <Rss className="w-5 h-5" /> },
  {
    to: "/analytics",
    label: "Analytics",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
];

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, login, logout } = useAuth();
  const location = useLocation();

  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        // biome-ignore lint/a11y/useAriaPropsForRole: backdrop is intentionally hidden from AT
        aria-hidden="true"
      />
      {/* Drawer — nav panel */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col shadow-2xl"
        aria-label="Navigation menu"
        data-ocid="mobile-drawer"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={onClose}
            data-ocid="drawer-logo"
          >
            <Landmark className="w-5 h-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              gothic<span className="text-primary">garden</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            data-ocid="drawer-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav
          className="flex flex-col gap-1 px-3 py-4 flex-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-smooth min-h-[52px]",
                location.pathname === to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              ].join(" ")}
              data-ocid={`drawer-nav-${label.toLowerCase()}`}
            >
              {icon}
              {label}
            </Link>
          ))}

          <div className="border-t border-border/60 mt-2 pt-3 flex flex-col gap-1">
            <Link to="/" onClick={onClose}>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold bg-primary text-primary-foreground min-h-[52px] transition-smooth"
                data-ocid="drawer-submit"
              >
                Submit Confession
              </button>
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted min-h-[52px] transition-smooth"
                data-ocid="drawer-logout"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  login();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted min-h-[52px] transition-smooth"
                data-ocid="drawer-login"
              >
                Owner Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile(640);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prevPathRef = useRef(location.pathname);

  // Close drawer when route changes
  if (prevPathRef.current !== location.pathname) {
    prevPathRef.current = location.pathname;
    if (drawerOpen) setDrawerOpen(false);
  }

  return (
    <>
      <header className="confession-header shadow-md" data-ocid="nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-smooth hover:opacity-80"
            data-ocid="nav-logo"
          >
            <Landmark className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground tracking-tight">
              gothic<span className="text-primary">garden</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav
              className="flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={[
                    "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-smooth",
                    location.pathname === to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  ].join(" ")}
                  data-ocid={`nav-${label.toLowerCase()}`}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Auth */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              <Link to="/" data-ocid="nav-submit">
                <Button variant="default" size="sm" className="font-semibold">
                  Submit
                </Button>
              </Link>
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="nav-logout"
                >
                  Sign out
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => login()}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="nav-login"
                >
                  Owner Login
                </Button>
              )}
            </div>
          )}

          {/* Mobile: hamburger */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              data-ocid="nav-hamburger"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "gothicgarden",
  )}`;

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-primary" />
          <span className="font-display text-sm font-semibold text-foreground">
            gothic<span className="text-primary">garden</span>
          </span>
          <span className="text-muted-foreground text-xs">
            — Your investment therapy community.
          </span>
        </div>
        <p className="text-muted-foreground text-xs">
          © {year}.{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-200"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
