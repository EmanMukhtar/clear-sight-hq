import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/roadmap/shell";
import { FilterToolbar, TaskCard, EmptyState, SectionTitle } from "@/components/roadmap/ui";
import { useRoadmap } from "@/lib/roadmap-store";
import { STATUS_META, type Task } from "@/lib/roadmap-data";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — Cleard Mission Control" },
      {
        name: "description",
        content: "Milestone roadmap of Cleard delivery: completed work, current sprint, upcoming and future.",
      },
      { property: "og:title", content: "Roadmap — Cleard Mission Control" },
      { property: "og:description", content: "Milestone view of Cleard delivery across four launch phases." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoadmapPage,
});

const BANDS: { key: string; label: string; hint: string; match: (t: Task) => boolean }[] = [
  {
    key: "inprogress",
    label: "Current sprint",
    hint: "Active this week",
    match: (t) => t.status === "inprogress",
  },
  {
    key: "next",
    label: "Upcoming",
    hint: "Queued with an ETA or priority",
    match: (t) => t.status === "next" && (Boolean(t.eta) || t.priority !== "low"),
  },
  {
    key: "future",
    label: "Future",
    hint: "Unscheduled and blocked work",
    match: (t) => t.status === "blocked" || (t.status === "next" && !t.eta && t.priority === "low"),
  },
  { key: "done", label: "Completed", hint: "Shipped and verified", match: (t) => t.status === "done" },
];


function RoadmapPage() {
  const { filtered } = useRoadmap();

  return (
    <Shell title="Roadmap" subtitle="Milestone view of everything between here and launch">
      <FilterToolbar />
      <div className="space-y-8">
        {BANDS.map((band) => {
          const items = filtered.filter(band.match);
          const dot =
            band.key === "future" ? STATUS_META.blocked.dot : STATUS_META[band.key as "done"].dot;
          return (
            <section key={band.key}>
              <SectionTitle
                title={band.label}
                hint={band.hint}
                action={
                  <span className="num text-[12px] text-muted-foreground">{items.length}</span>
                }
              />
              <div className="relative border-l border-border pl-5">
                <span
                  className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full"
                  style={{ background: dot }}
                />
                <div className="grid gap-2 md:grid-cols-2">
                  {items.map((t) => (
                    <TaskCard key={t.id} task={t} />
                  ))}
                </div>
                {items.length === 0 && (
                  <EmptyState title="Nothing here" hint="Adjust filters to see more work." />
                )}
              </div>
            </section>
          );
        })}
      </div>
    </Shell>
  );
}
