import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/roadmap/shell";
import { EmptyState, TaskCard, SectionTitle } from "@/components/roadmap/ui";
import { CriticalCard } from "@/components/roadmap/critical-card";
import { useRoadmap } from "@/lib/roadmap-store";

export const Route = createFileRoute("/critical-path")({
  head: () => ({
    meta: [
      { title: "Launch Critical Path — Cleard Mission Control" },
      {
        name: "description",
        content: "Every task blocking the Cleard launch, with dependencies, owners, ETAs and progress.",
      },
      { property: "og:title", content: "Launch Critical Path — Cleard" },
      { property: "og:description", content: "What stands between Cleard and launch, right now." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CriticalPathPage,
});

function CriticalPathPage() {
  const { tasks } = useRoadmap();
  const critical = tasks.filter((t) => t.blockingLaunch);
  const blocked = tasks.filter((t) => t.status === "blocked" && !t.blockingLaunch);

  return (
    <Shell title="Launch Critical Path" subtitle="The shortest list that decides the launch date">
      <section>
        <SectionTitle title="Blocking launch" hint="Flagged as must-ship" />
        <div className="space-y-3">
          {critical.length === 0 && (
            <EmptyState title="No launch blockers" hint="Flag a task as blocking to surface it." />
          )}
          {critical.map((t) => (
            <CriticalCard key={t.id} task={t} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Hard blocked" hint="Not launch-flagged, but stuck" />
        <div className="grid gap-2 md:grid-cols-2">
          {blocked.length === 0 && <EmptyState title="Nothing blocked" />}
          {blocked.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </section>
    </Shell>
  );
}
