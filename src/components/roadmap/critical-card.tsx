import { AlertTriangle, Check, Clock, User } from "lucide-react";
import type { Task } from "@/lib/roadmap-data";
import { PriorityBadge, StatusBadge } from "./ui";

export function CriticalCard({ task }: { task: Task }) {
  const deps = task.dependencies ?? [];
  const depDone = deps.filter((d) => d.done).length;
  const pct = deps.length ? Math.round((depDone / deps.length) * 100) : task.status === "done" ? 100 : 0;

  return (
    <div className="rounded-xl border border-blocked-line bg-surface p-5 transition-colors hover:bg-elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blocked-soft px-2 py-0.5 text-[11px] font-semibold text-blocked">
            <AlertTriangle size={11} />
            Blocks launch
          </div>
          <h3 className="font-display mt-2 text-[17px] leading-snug font-semibold">{task.name}</h3>
          <div className="mt-1 text-[12px] text-muted-foreground">{task.department}</div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {task.note && (
        <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
          {task.note}
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <div className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Dependencies
          </div>
          <div className="mt-2 space-y-1.5">
            {deps.length === 0 && (
              <div className="text-[12px] text-muted-foreground">No dependencies</div>
            )}
            {deps.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px]">
                {d.done ? (
                  <Check size={13} className="text-success" />
                ) : (
                  <Clock size={13} className="text-warning" />
                )}
                <span className={d.done ? "text-muted-foreground line-through" : ""}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-baseline justify-between text-[11px] text-muted-foreground">
              <span className="tracking-wide uppercase">Progress</span>
              <span className="num text-foreground">{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={pct === 100 ? "h-full bg-success" : "h-full bg-warning"}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User size={12} />
              {task.owner || "Unassigned"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {task.eta || "No ETA"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
