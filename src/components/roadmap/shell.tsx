import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GitBranch,
  Building2,
  AlertTriangle,
  BarChart3,
  Settings,
  Command,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useRoadmap } from "@/lib/roadmap-store";
import { computeStats } from "@/lib/roadmap-data";

const NAV: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/roadmap", label: "Roadmap", icon: GitBranch },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/critical-path", label: "Critical Path", icon: AlertTriangle },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Shell({
  title,
  subtitle,
  children,
  aside,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  const { tasks } = useRoadmap();
  const stats = computeStats(tasks);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
            <span className="font-display text-[13px] font-bold text-background">C</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-tight">Cleard</div>
            <div className="text-[11px] text-muted-foreground">Mission Control</div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                  active
                    ? "bg-sidebar-accent text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                }`}
              >
                <item.icon size={15} className={active ? "text-foreground" : ""} />
                <span className="font-medium">{item.label}</span>
                {item.to === "/critical-path" && stats.blocked + 1 > 0 && (
                  <span className="ml-auto rounded-full bg-blocked-soft px-1.5 py-0.5 text-[10px] font-semibold text-blocked">
                    {tasks.filter((t) => t.blockingLaunch).length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-5 py-4">
          <div className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Readiness
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="num font-display text-2xl font-semibold">{stats.readiness}%</span>
            <span className="text-[11px] text-muted-foreground">
              {stats.complete}/{stats.total}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-success" style={{ width: `${stats.readiness}%` }} />
          </div>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-5 lg:px-8">
            <div className="min-w-0">
              <h1 className="font-display truncate text-[15px] font-semibold tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-[12px] text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div className="ml-auto hidden items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground sm:flex">
              <Command size={11} />
              <span>K</span>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 lg:hidden">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-sidebar-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div
          className={`px-5 py-6 lg:px-8 ${aside ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]" : ""}`}
        >
          <main className="min-w-0 space-y-6">{children}</main>
          {aside && <div className="min-w-0 space-y-4">{aside}</div>}
        </div>
      </div>
    </div>
  );
}
