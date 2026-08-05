import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Shell } from "@/components/roadmap/shell";
import { Card, FilterToolbar, MiniBars, TaskCard } from "@/components/roadmap/ui";
import { useRoadmap } from "@/lib/roadmap-store";
import { DEPARTMENTS, departmentStats } from "@/lib/roadmap-data";

export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [
      { title: "Departments — Cleard Mission Control" },
      {
        name: "description",
        content: "Department-level health, completion and remaining work for GTM, Finance, Ops and Security & Legal.",
      },
      { property: "og:title", content: "Departments — Cleard Mission Control" },
      { property: "og:description", content: "Which department is behind, and by how much." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DepartmentsPage,
});

const HEALTH = {
  healthy: { label: "Healthy", cls: "bg-success-soft text-success border-success-line" },
  watch: { label: "Watch", cls: "bg-warning-soft text-warning border-warning-line" },
  risk: { label: "At risk", cls: "bg-blocked-soft text-blocked border-blocked-line" },
};

function DepartmentsPage() {
  const { filtered } = useRoadmap();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <Shell title="Departments" subtitle="Health and throughput by team">
      <FilterToolbar />
      <div className="grid gap-4 xl:grid-cols-2">
        {DEPARTMENTS.map((dept) => {
          const st = departmentStats(filtered, dept);
          if (st.items.length === 0) return null;
          const h = HEALTH[st.health];
          const expanded = open[dept];
          return (
            <Card key={dept} className="overflow-hidden">
              <button
                onClick={() => setOpen((o) => ({ ...o, [dept]: !o[dept] }))}
                className="w-full p-5 text-left transition-colors hover:bg-elevated focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {expanded ? (
                        <ChevronDown size={14} className="text-muted-foreground" />
                      ) : (
                        <ChevronRight size={14} className="text-muted-foreground" />
                      )}
                      <h3 className="font-display text-[15px] font-semibold">{dept}</h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${h.cls}`}
                      >
                        {h.label}
                      </span>
                    </div>
                    <div className="num font-display mt-3 text-3xl font-semibold">{st.pct}%</div>
                    <div className="mt-1 text-[12px] text-muted-foreground">
                      {st.done} of {st.items.length} complete · ETA {st.eta}
                    </div>
                  </div>
                  <div className="w-28">
                    <MiniBars
                      values={[st.done, st.inProgress + 1, st.remaining + 1, st.blocked + 1, st.pct / 10]}
                      color={st.blocked > 0 ? "var(--chart-blocked)" : "var(--chart-success)"}
                    />
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all duration-700 ${st.blocked > 0 ? "bg-blocked" : "bg-success"}`}
                    style={{ width: `${st.pct}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
                  <div>
                    <div className="num font-display text-lg font-semibold">{st.remaining}</div>
                    <div className="text-muted-foreground">Remaining</div>
                  </div>
                  <div>
                    <div className="num font-display text-lg font-semibold text-warning">
                      {st.inProgress}
                    </div>
                    <div className="text-muted-foreground">In progress</div>
                  </div>
                  <div>
                    <div className="num font-display text-lg font-semibold text-blocked">
                      {st.blocked}
                    </div>
                    <div className="text-muted-foreground">Blocked</div>
                  </div>
                </div>
              </button>

              {expanded && (
                <div className="space-y-2 border-t border-border p-4">
                  {st.items.map((t) => (
                    <TaskCard key={t.id} task={t} />
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}
