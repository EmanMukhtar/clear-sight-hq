import { Activity, CalendarClock, CheckCircle2, ListChecks, StickyNote } from "lucide-react";
import { STATUS_META, computeStats, type Task } from "@/lib/roadmap-data";
import { Card } from "./ui";

export function ExecutiveSidebar({ tasks, launchDate }: { tasks: Task[]; launchDate: string }) {
  const stats = computeStats(tasks);
  const recent = tasks.filter((t) => t.status === "inprogress").slice(0, 5);
  const milestones = tasks.filter((t) => t.status === "next").slice(0, 4);
  const checklist = [
    { label: "Security findings resolved", done: !tasks.some((t) => t.category === "security" && t.status !== "done") },
    { label: "Payments live", done: !tasks.some((t) => t.department === "Finance" && t.status !== "done") },
    { label: "No launch blockers open", done: !tasks.some((t) => t.blockingLaunch && t.status !== "done") },
    { label: "Zero blocked tasks", done: stats.blocked === 0 },
  ];
  const notes = tasks.filter((t) => t.note).slice(0, 2);

  return (
    <>
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold">
          <Activity size={13} className="text-warning" />
          Recent activity
        </div>
        <div className="space-y-2.5">
          {recent.length === 0 && (
            <div className="text-[12px] text-muted-foreground">Nothing in flight.</div>
          )}
          {recent.map((t) => (
            <div key={t.id} className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: STATUS_META[t.status].dot }}
              />
              <div className="min-w-0">
                <div className="truncate text-[12px] font-medium">{t.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {t.owner} · {t.eta || "no ETA"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold">
          <CalendarClock size={13} className="text-upcoming" />
          Upcoming milestones
        </div>
        <div className="space-y-2.5">
          {milestones.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-2">
              <span className="min-w-0 truncate text-[12px]">{t.name}</span>
              <span className="shrink-0 text-[11px] text-muted-foreground">{t.eta || "TBD"}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
          Target launch <span className="text-foreground">{launchDate}</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold">
          <ListChecks size={13} className="text-success" />
          Launch checklist
        </div>
        <div className="space-y-2">
          {checklist.map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-[12px]">
              <CheckCircle2
                size={13}
                className={c.done ? "text-success" : "text-muted-foreground"}
              />
              <span className={c.done ? "text-muted-foreground line-through" : ""}>{c.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-3 text-[12px] font-semibold">Quick stats</div>
        <dl className="grid grid-cols-2 gap-3">
          {[
            ["Total", stats.total],
            ["Done", stats.complete],
            ["In progress", stats.inProgress],
            ["Blocked", stats.blocked],
          ].map(([k, v]) => (
            <div key={k as string}>
              <dt className="text-[11px] text-muted-foreground">{k}</dt>
              <dd className="num font-display text-lg font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {notes.length > 0 && (
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold">
            <StickyNote size={13} className="text-muted-foreground" />
            Important notes
          </div>
          <div className="space-y-3">
            {notes.map((t) => (
              <div key={t.id}>
                <div className="text-[12px] font-medium">{t.name}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
