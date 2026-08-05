import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowUpRight, CircleDot, Rocket } from "lucide-react";
import { Shell } from "@/components/roadmap/shell";
import { Card, MetricCard, RadialProgress, SectionTitle, EmptyState } from "@/components/roadmap/ui";
import { CriticalCard } from "@/components/roadmap/critical-card";
import { ExecutiveSidebar } from "@/components/roadmap/exec-sidebar";
import { DepartmentCompletion, StatusDonut } from "@/components/roadmap/charts";
import { useRoadmap } from "@/lib/roadmap-store";
import { DEPARTMENTS, computeStats, departmentStats } from "@/lib/roadmap-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cleard Mission Control — Launch Readiness Overview" },
      {
        name: "description",
        content:
          "Executive overview of Cleard launch readiness: completion, blockers, department health and what to work on today.",
      },
      { property: "og:title", content: "Cleard Mission Control — Launch Readiness" },
      {
        property: "og:description",
        content: "Live launch readiness, blockers and department health for the Cleard rollout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { tasks, meta, saveMeta, loaded } = useRoadmap();
  const [editing, setEditing] = useState(false);
  const stats = computeStats(tasks);
  const criticalPath = tasks.filter((t) => t.blockingLaunch);
  const health =
    criticalPath.some((t) => t.status !== "done") || stats.blocked > 0
      ? { label: "At risk", cls: "bg-warning-soft text-warning border-warning-line" }
      : { label: "On track", cls: "bg-success-soft text-success border-success-line" };

  const deptOnTrack = DEPARTMENTS.filter((d) => departmentStats(tasks, d).health !== "risk").length;

  return (
    <Shell
      title="Launch Readiness"
      subtitle={`Cleard · target ${meta.launchDate}`}
      aside={<ExecutiveSidebar tasks={tasks} launchDate={meta.launchDate} />}
    >
      {!loaded && (
        <div className="h-56 animate-pulse rounded-xl border border-border bg-surface" />
      )}

      {loaded && (
        <>
          <Card className="p-6">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center">
              <RadialProgress
                value={stats.readiness}
                label="Launch readiness"
                sublabel={`${stats.complete} of ${stats.total} shipped`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium ${health.cls}`}
                  >
                    <CircleDot size={12} />
                    {health.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[12px] text-muted-foreground">
                    <Rocket size={12} />
                    Est. launch
                    {editing ? (
                      <input
                        autoFocus
                        defaultValue={meta.launchDate}
                        onBlur={(e) => {
                          saveMeta({ ...meta, launchDate: e.target.value });
                          setEditing(false);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                        className="w-28 rounded border border-border bg-elevated px-1.5 py-0.5 text-[12px] text-foreground outline-none focus:border-ring"
                      />
                    ) : (
                      <button
                        onClick={() => setEditing(true)}
                        className="font-medium text-foreground underline decoration-dashed underline-offset-4"
                      >
                        {meta.launchDate}
                      </button>
                    )}
                  </span>
                </div>

                <h2 className="font-display mt-4 text-2xl leading-tight font-semibold tracking-tight">
                  {criticalPath.filter((t) => t.status !== "done").length > 0
                    ? `${criticalPath.filter((t) => t.status !== "done").length} item${
                        criticalPath.filter((t) => t.status !== "done").length === 1 ? "" : "s"
                      } ${criticalPath.filter((t) => t.status !== "done").length === 1 ? "stands" : "stand"} between Cleard and launch.`
                    : "Nothing is blocking launch right now."}
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
                  {[
                    ["Total", stats.total, ""],
                    ["Completed", stats.complete, "text-success"],
                    ["In progress", stats.inProgress, "text-warning"],
                    ["Blocked", stats.blocked, "text-blocked"],
                    ["Next up", stats.next, "text-upcoming"],
                  ].map(([label, value, cls]) => (
                    <div key={label as string}>
                      <div className={`num font-display text-2xl font-semibold ${cls as string}`}>
                        {value as number}
                      </div>
                      <div className="mt-0.5 text-[11px] tracking-wide text-muted-foreground uppercase">
                        {label as string}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Launch readiness"
              value={`${stats.readiness}%`}
              trend={`↑ ${Math.max(1, Math.round(stats.readiness / 12))}% this week`}
              trendTone="success"
              context={health.label === "On track" ? "On track for launch" : "Watch the blockers"}
              bars={[3, 5, 6, 8, 9, 11, stats.complete]}
              barColor="var(--chart-success)"
            />
            <MetricCard
              label="In flight"
              value={stats.inProgress}
              trend={`${stats.next} queued next`}
              trendTone="warning"
              context="Active engineering effort today"
              bars={[1, 2, 2, 3, 3, stats.inProgress, stats.inProgress]}
              barColor="var(--chart-warning)"
            />
            <MetricCard
              label="Blockers"
              value={stats.blocked + criticalPath.filter((t) => t.status !== "done").length}
              trend={stats.blocked === 0 ? "No hard blocks" : `${stats.blocked} hard blocked`}
              trendTone={stats.blocked === 0 ? "success" : "blocked"}
              context="Blocked plus launch-critical work"
              bars={[2, 2, 1, 1, 1, stats.blocked + 1, stats.blocked + 1]}
              barColor="var(--chart-blocked)"
            />
            <MetricCard
              label="Departments on track"
              value={`${deptOnTrack}/${DEPARTMENTS.length}`}
              trend={deptOnTrack === DEPARTMENTS.length ? "All healthy" : "1 needs attention"}
              trendTone={deptOnTrack === DEPARTMENTS.length ? "success" : "warning"}
              context="Health penalised by open blockers"
              bars={[2, 3, 3, 4, 3, deptOnTrack, deptOnTrack]}
              barColor="var(--chart-upcoming)"
            />
          </div>

          <section>
            <SectionTitle
              title="Launch critical path"
              hint="Everything flagged as blocking launch"
              action={
                <a
                  href="/critical-path"
                  className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
                >
                  View all <ArrowUpRight size={12} />
                </a>
              }
            />
            <div className="space-y-3">
              {criticalPath.length === 0 && (
                <EmptyState title="No launch blockers" hint="Flag a task to surface it here." />
              )}
              {criticalPath.map((t) => (
                <CriticalCard key={t.id} task={t} />
              ))}
              {stats.blocked > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-blocked-line bg-blocked-soft px-3 py-2 text-[12px] text-blocked">
                  <AlertTriangle size={13} />
                  {stats.blocked} task{stats.blocked === 1 ? " is" : "s are"} hard blocked and need a
                  decision.
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <DepartmentCompletion tasks={tasks} />
            <StatusDonut tasks={tasks} />
          </div>
        </>
      )}
    </Shell>
  );
}
