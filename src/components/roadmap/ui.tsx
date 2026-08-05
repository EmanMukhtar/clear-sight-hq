import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  DEPARTMENTS,
  PRIORITIES,
  PRIORITY_META,
  STATUSES,
  STATUS_META,
  type Task,
} from "@/lib/roadmap-data";
import { useRoadmap } from "@/lib/roadmap-store";

/* ---------------------------------- atoms --------------------------------- */

export function Card({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface transition-colors ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-[13px] font-semibold tracking-wide text-foreground uppercase">
          {title}
        </h2>
        {hint && <p className="mt-0.5 text-[12px] text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: Task["status"] }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${m.chip}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const m = PRIORITY_META[priority];
  const Icon = m.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${m.chip}`}
    >
      <Icon size={10} />
      {m.label}
    </span>
  );
}

export function RadialProgress({
  value,
  size = 176,
  stroke = 10,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="var(--muted)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="var(--chart-success)"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num font-display text-4xl font-semibold">{value}%</span>
        {label && (
          <span className="mt-1 text-[11px] tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
        )}
        {sublabel && <span className="text-[11px] text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}

export function MiniBars({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-8 items-end gap-1">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${Math.max(8, (v / max) * 100)}%`,
            background: color,
            opacity: 0.3 + (0.7 * (i + 1)) / values.length,
          }}
        />
      ))}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  trend,
  trendTone = "muted",
  context,
  bars,
  barColor,
  onClick,
}: {
  label: string;
  value: string | number;
  trend?: string;
  trendTone?: "success" | "warning" | "blocked" | "muted";
  context?: string;
  bars?: number[];
  barColor?: string;
  onClick?: () => void;
}) {
  const tone = {
    success: "text-success",
    warning: "text-warning",
    blocked: "text-blocked",
    muted: "text-muted-foreground",
  }[trendTone];

  return (
    <Card
      onClick={onClick}
      className={`p-4 ${onClick ? "cursor-pointer hover:border-border-strong hover:bg-elevated" : ""}`}
    >
      <div className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="num font-display text-3xl leading-none font-semibold">{value}</div>
          {trend && <div className={`mt-2 text-[12px] font-medium ${tone}`}>{trend}</div>}
        </div>
        {bars && (
          <div className="w-24">
            <MiniBars values={bars} color={barColor ?? "var(--chart-muted)"} />
          </div>
        )}
      </div>
      {context && <div className="mt-3 text-[12px] text-muted-foreground">{context}</div>}
    </Card>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <div className="font-display text-[13px] font-medium">{title}</div>
      {hint && <div className="mt-1 text-[12px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

/* --------------------------------- inline edit ---------------------------- */

function InlineText({
  value,
  placeholder,
  onSave,
  className = "",
}: {
  value: string;
  placeholder: string;
  onSave: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <input
        autoFocus
        defaultValue={value}
        placeholder={placeholder}
        onBlur={(e) => {
          onSave(e.target.value);
          setEditing(false);
        }}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        className="w-24 rounded-md border border-border bg-elevated px-1.5 py-0.5 text-[11px] text-foreground outline-none focus:border-ring"
      />
    );
  }
  return (
    <button
      onClick={() => setEditing(true)}
      className={`rounded-md px-1 py-0.5 text-[11px] transition-colors hover:bg-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${className}`}
    >
      {value || placeholder}
    </button>
  );
}

/* --------------------------------- task card ------------------------------ */

export function TaskCard({ task, dense = false }: { task: Task; dense?: boolean }) {
  const { updateTask } = useRoadmap();
  const [open, setOpen] = useState(false);
  const deps = task.dependencies ?? [];
  const depDone = deps.filter((d) => d.done).length;

  return (
    <div className="group rounded-lg border border-border bg-surface p-3 transition-colors hover:border-border-strong hover:bg-elevated">
      <div className="flex items-start gap-3">
        <span
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
          style={{ background: STATUS_META[task.status].dot }}
        />
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 text-left text-[13px] leading-snug font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {task.name}
        </button>
        {task.blockingLaunch && (
          <span title="Blocks launch" className="mt-0.5 text-blocked">
            <AlertTriangle size={13} />
          </span>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-5">
        <PriorityBadge priority={task.priority} />
        <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {CATEGORY_LABEL[task.category] ?? task.category}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <User size={11} />
          {task.owner || "Unassigned"}
        </span>
        {task.eta && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock size={11} />
            {task.eta}
          </span>
        )}
        {deps.length > 0 && (
          <span className="text-[11px] text-muted-foreground">
            {depDone}/{deps.length} deps
          </span>
        )}
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t border-border pt-3 pl-5">
          {task.note && (
            <p className="text-[12px] leading-relaxed text-muted-foreground">{task.note}</p>
          )}
          {deps.length > 0 && (
            <div className="space-y-1">
              {deps.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[12px]">
                  {d.done ? (
                    <Check size={12} className="text-success" />
                  ) : (
                    <Clock size={12} className="text-warning" />
                  )}
                  <span className={d.done ? "text-muted-foreground line-through" : ""}>
                    {d.name}
                  </span>
                </div>
              ))}
            </div>
          )}
          {!dense && (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value as Task["status"] })}
                className="rounded-md border border-border bg-elevated px-1.5 py-1 text-[11px] text-foreground outline-none focus:border-ring"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
              <select
                value={task.priority}
                onChange={(e) =>
                  updateTask(task.id, { priority: e.target.value as Task["priority"] })
                }
                className="rounded-md border border-border bg-elevated px-1.5 py-1 text-[11px] text-foreground outline-none focus:border-ring"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_META[p].label}
                  </option>
                ))}
              </select>
              <InlineText
                value={task.owner}
                placeholder="Unassigned"
                onSave={(v) => updateTask(task.id, { owner: v })}
                className="text-muted-foreground"
              />
              <InlineText
                value={task.eta}
                placeholder="Set ETA"
                onSave={(v) => updateTask(task.id, { eta: v })}
                className="text-muted-foreground"
              />
              <button
                onClick={() => updateTask(task.id, { blockingLaunch: !task.blockingLaunch })}
                className={`ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors ${
                  task.blockingLaunch
                    ? "bg-blocked-soft text-blocked"
                    : "text-muted-foreground hover:bg-elevated"
                }`}
              >
                <AlertTriangle size={11} />
                Blocks launch
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- filter toolbar --------------------------- */

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-0.5 rounded-lg border border-border bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-md px-2.5 py-1 text-[12px] font-medium whitespace-nowrap transition-colors ${
            value === o.id
              ? "bg-elevated text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function FilterToolbar() {
  const { filters, setFilters, clearFilters, filtered, tasks, owners } = useRoadmap();
  const [expanded, setExpanded] = useState(false);
  const dirty =
    filters.search !== "" ||
    filters.department !== "all" ||
    filters.priority !== "all" ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.owner !== "all" ||
    filters.criticalOnly ||
    filters.quick !== "all";

  const select =
    "rounded-md border border-border bg-surface px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-ring";

  return (
    <div className="sticky top-16 z-10 -mx-1 rounded-xl border border-border bg-background/90 p-2 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={13}
            className="absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search tasks, owners, departments"
            className="w-full rounded-md border border-border bg-surface py-1.5 pr-2 pl-8 text-[12px] outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <Segmented
          value={filters.status}
          onChange={(v) => setFilters({ status: v })}
          options={[
            { id: "all", label: "All" },
            ...STATUSES.map((s) => ({ id: s, label: STATUS_META[s].label })),
          ]}
        />

        <button
          onClick={() => setFilters({ criticalOnly: !filters.criticalOnly })}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
            filters.criticalOnly
              ? "border-blocked-line bg-blocked-soft text-blocked"
              : "border-border bg-surface text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertTriangle size={12} />
          Critical only
        </button>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <SlidersHorizontal size={12} />
          Filters
        </button>

        <span className="num ml-auto pr-1 text-[12px] text-muted-foreground">
          {filtered.length}/{tasks.length}
        </span>
      </div>

      {expanded && (
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border pt-2">
          <select
            className={select}
            value={filters.department}
            onChange={(e) => setFilters({ department: e.target.value })}
          >
            <option value="all">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            className={select}
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value })}
          >
            <option value="all">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_META[p].label}
              </option>
            ))}
          </select>
          <select
            className={select}
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id === "all" ? "All categories" : c.label}
              </option>
            ))}
          </select>
          <select
            className={select}
            value={filters.owner}
            onChange={(e) => setFilters({ owner: e.target.value })}
          >
            <option value="all">All owners</option>
            {owners.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <Segmented
            value={filters.quick}
            onChange={(v) => setFilters({ quick: v })}
            options={[
              { id: "all", label: "Everything" },
              { id: "mine", label: "Mine" },
              { id: "blocked", label: "Blocked" },
              { id: "launch", label: "Launch-blocking" },
              { id: "security", label: "Security" },
              { id: "inprogress", label: "In progress" },
            ]}
          />
          {dirty && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[12px] text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
