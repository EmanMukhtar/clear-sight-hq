import {
  Flame,
  Zap,
  Circle,
  type LucideIcon,
} from "lucide-react";

export const STORAGE_KEY = "cleard-roadmap-v2";
export const META_KEY = "cleard-roadmap-meta-v2";

export const DEPARTMENTS = ["GTM", "Finance", "Ops", "Security & Legal"] as const;

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "feature", label: "Features" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "security", label: "Security" },
  { id: "techdebt", label: "Technical debt" },
] as const;

export const STATUSES = ["done", "inprogress", "blocked", "next"] as const;
export const PRIORITIES = ["critical", "high", "medium", "low"] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Department = (typeof DEPARTMENTS)[number];

export interface Dependency {
  name: string;
  done: boolean;
}

export interface Task {
  id: string;
  name: string;
  department: string;
  category: string;
  status: Status;
  priority: Priority;
  owner: string;
  eta: string;
  blockingLaunch: boolean;
  dependencies: Dependency[];
  note: string;
}

export interface Meta {
  launchDate: string;
}

export const PRIORITY_META: Record<
  Priority,
  { label: string; icon: LucideIcon; color: string; chip: string }
> = {
  critical: {
    label: "Critical",
    icon: Flame,
    color: "text-blocked",
    chip: "bg-blocked-soft text-blocked border-blocked-line",
  },
  high: {
    label: "High",
    icon: Zap,
    color: "text-warning",
    chip: "bg-warning-soft text-warning border-warning-line",
  },
  medium: {
    label: "Medium",
    icon: Circle,
    color: "text-upcoming",
    chip: "bg-upcoming-soft text-upcoming border-upcoming-line",
  },
  low: {
    label: "Low",
    icon: Circle,
    color: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground border-border",
  },
};

export const STATUS_META: Record<
  Status,
  { label: string; color: string; chip: string; dot: string; ring: string }
> = {
  done: {
    label: "Done",
    color: "text-success",
    chip: "bg-success-soft text-success border-success-line",
    dot: "var(--chart-success)",
    ring: "bg-success",
  },
  inprogress: {
    label: "In progress",
    color: "text-warning",
    chip: "bg-warning-soft text-warning border-warning-line",
    dot: "var(--chart-warning)",
    ring: "bg-warning",
  },
  blocked: {
    label: "Blocked",
    color: "text-blocked",
    chip: "bg-blocked-soft text-blocked border-blocked-line",
    dot: "var(--chart-blocked)",
    ring: "bg-blocked",
  },
  next: {
    label: "Next up",
    color: "text-upcoming",
    chip: "bg-upcoming-soft text-upcoming border-upcoming-line",
    dot: "var(--chart-upcoming)",
    ring: "bg-upcoming",
  },
};

export const CATEGORY_LABEL: Record<string, string> = {
  feature: "Feature",
  infrastructure: "Infrastructure",
  security: "Security",
  techdebt: "Tech debt",
};

export function seedTasks(): Task[] {
  let n = 0;
  const t = (o: Partial<Task> & { name: string; department: string; category: string; status: Status }): Task => ({
    id: `t${++n}`,
    owner: "Eman",
    eta: "",
    priority: "medium",
    blockingLaunch: false,
    dependencies: [],
    note: "",
    ...o,
  });
  return [
    t({ name: "Real property/parcel data — all 9 served cities", department: "GTM", category: "feature", status: "done", priority: "high" }),
    t({ name: "Municipality directory (real data)", department: "GTM", category: "infrastructure", status: "done", priority: "medium" }),
    t({ name: "Address lookup — Google + Census fallback", department: "GTM", category: "feature", status: "done", priority: "high" }),
    t({ name: "Integrate DBPR API key", department: "GTM", category: "feature", status: "next", priority: "medium" }),
    t({ name: "myCOI / illumend white-label partnership", department: "GTM", category: "feature", status: "inprogress", priority: "medium", eta: "1 week" }),
    t({
      name: "Municipality Submission — expand past Plantation pilot",
      department: "GTM",
      category: "feature",
      status: "next",
      priority: "critical",
      blockingLaunch: true,
      eta: "2 weeks",
      dependencies: [
        { name: "Agent 5 approval gate", done: true },
        { name: "test_only safeguard", done: true },
      ],
    }),
    t({
      name: "Permit History",
      department: "GTM",
      category: "feature",
      status: "blocked",
      priority: "low",
      eta: "TBD",
      note: "Blocked on municipal portal logins — real permit history lives inside each city's own building department system, not a shared dataset. Need a quicker workaround than connecting to every portal one at a time.",
      dependencies: [
        { name: "Building dept login storage", done: true },
        { name: "Faster per-city workaround", done: false },
      ],
    }),

    t({ name: "Real Stripe pricing tiers", department: "Finance", category: "feature", status: "done", priority: "high" }),
    t({ name: "Billing and invoicing — real Stripe charges", department: "Finance", category: "feature", status: "done", priority: "high" }),
    t({ name: "Payment Authorization — real embedded checkout", department: "Finance", category: "feature", status: "done", priority: "high" }),

    t({ name: "Staff assignment, priority, escalation tracking", department: "Ops", category: "feature", status: "done", priority: "medium" }),
    t({ name: "Audit trail — real activity log", department: "Ops", category: "infrastructure", status: "done", priority: "medium" }),
    t({ name: "Project notes — real, tenant-scoped", department: "Ops", category: "feature", status: "done", priority: "low" }),
    t({ name: "Reports — real numbers, not seeded", department: "Ops", category: "feature", status: "done", priority: "medium" }),
    t({ name: "Calendar — real deadlines", department: "Ops", category: "feature", status: "done", priority: "medium" }),
    t({ name: "Notary request queue", department: "Ops", category: "feature", status: "done", priority: "low" }),
    t({ name: "Inspections — real scheduling and results", department: "Ops", category: "feature", status: "done", priority: "medium" }),
    t({ name: "Dispatch property intelligence panel", department: "Ops", category: "feature", status: "done", priority: "high" }),
    t({ name: "Company Profile — real data + file uploads", department: "Ops", category: "feature", status: "done", priority: "medium" }),
    t({ name: "Legal Document Library — real storage + versioning", department: "Ops", category: "feature", status: "done", priority: "low" }),
    t({
      name: "Insurance Requests — real submission + notification",
      department: "Ops",
      category: "feature",
      status: "done",
      priority: "medium",
      dependencies: [
        { name: "Company Profiles", done: true },
        { name: "File uploads", done: true },
        { name: "E-signatures (SignWell)", done: true },
      ],
    }),
    t({ name: "Full 7-agent permit automation pipeline", department: "Ops", category: "feature", status: "done", priority: "critical" }),
    t({ name: "Real e-signatures (SignWell)", department: "Ops", category: "infrastructure", status: "done", priority: "high" }),
    t({ name: "Automated code reviewer (QA Agent)", department: "Ops", category: "infrastructure", status: "done", priority: "medium" }),
    t({ name: "Staff Workload — fix fake employee roster", department: "Ops", category: "techdebt", status: "inprogress", priority: "medium", eta: "2 days" }),
    t({ name: "Check GC Clients admin page", department: "Ops", category: "techdebt", status: "next", priority: "low" }),
    t({ name: "PostHog product analytics setup", department: "Ops", category: "infrastructure", status: "inprogress", priority: "medium", eta: "3 days" }),
    t({ name: "Victoria AI intelligence layer", department: "Ops", category: "feature", status: "next", priority: "low" }),

    t({ name: "Fixed invite/signup tenant-isolation hole", department: "Security & Legal", category: "security", status: "done", priority: "critical" }),
    t({ name: "Fixed internal notes exposure", department: "Security & Legal", category: "security", status: "done", priority: "high" }),
    t({ name: "Locked database functions against forgery", department: "Security & Legal", category: "security", status: "done", priority: "high" }),
    t({ name: "Fixed fake support-reply forgery bug", department: "Security & Legal", category: "security", status: "done", priority: "high" }),
    t({ name: "Removed duplicate insecure credential system", department: "Security & Legal", category: "security", status: "done", priority: "medium" }),
    t({ name: "Approval gate — government filing (Agent 5)", department: "Security & Legal", category: "security", status: "done", priority: "critical" }),
    t({ name: "Approval gate — client-facing letters (Agent 7)", department: "Security & Legal", category: "security", status: "done", priority: "critical" }),
    t({ name: "Fixed 5 RLS/publish-blocking security findings", department: "Security & Legal", category: "security", status: "done", priority: "critical" }),
    t({
      name: "Correction-reply routing — Plantation address",
      department: "Security & Legal",
      category: "feature",
      status: "inprogress",
      priority: "medium",
      eta: "pending confirmation",
      dependencies: [{ name: "Elajuwan needs to confirm the real email", done: false }],
    }),
  ];
}

export interface Stats {
  total: number;
  complete: number;
  inProgress: number;
  blocked: number;
  next: number;
  readiness: number;
}

export function computeStats(list: Task[]): Stats {
  const total = list.length;
  const complete = list.filter((t) => t.status === "done").length;
  const inProgress = list.filter((t) => t.status === "inprogress").length;
  const blocked = list.filter((t) => t.status === "blocked").length;
  const next = list.filter((t) => t.status === "next").length;
  return {
    total,
    complete,
    inProgress,
    blocked,
    next,
    readiness: total ? Math.round((complete / total) * 100) : 0,
  };
}

export function departmentStats(list: Task[], dept: string) {
  const items = list.filter((t) => t.department === dept);
  const done = items.filter((t) => t.status === "done").length;
  const blocked = items.filter((t) => t.status === "blocked").length;
  const inProgress = items.filter((t) => t.status === "inprogress").length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const health: "healthy" | "watch" | "risk" =
    blocked > 0 ? "risk" : pct >= 80 ? "healthy" : "watch";
  const eta =
    items.find((t) => t.status === "inprogress" && t.eta)?.eta ??
    items.find((t) => t.eta)?.eta ??
    "—";
  return { items, done, blocked, inProgress, pct, health, remaining: items.length - done, eta };
}
