import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "@tanstack/react-router";
import { BarChart2, Landmark, LayoutDashboard, Rss } from "lucide-react";

function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/feed", label: "Discover", icon: <Rss className="w-4 h-4" /> },
    {
      to: "/analytics",
      label: "Analytics",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
  ];

  return (
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

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
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

        {/* Auth */}
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
      </div>
    </header>
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
            — Confess anonymously.
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
