import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/roadmap/shell";
import {
  CompletionTimeline,
  DepartmentCompletion,
  DepartmentHealth,
  PriorityStack,
  StatusDonut,
} from "@/components/roadmap/charts";
import { useRoadmap } from "@/lib/roadmap-store";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Cleard Mission Control" },
      {
        name: "description",
        content: "Delivery analytics for Cleard: status mix, priority distribution, department health and completion trend.",
      },
      { property: "og:title", content: "Analytics — Cleard Mission Control" },
      { property: "og:description", content: "How Cleard delivery is trending across teams and priorities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { tasks } = useRoadmap();
  return (
    <Shell title="Analytics" subtitle="Where the work sits and how fast it moves">
      <div className="grid gap-4 lg:grid-cols-2">
        <DepartmentCompletion tasks={tasks} />
        <StatusDonut tasks={tasks} />
        <PriorityStack tasks={tasks} />
        <DepartmentHealth tasks={tasks} />
        <div className="lg:col-span-2">
          <CompletionTimeline tasks={tasks} />
        </div>
      </div>
    </Shell>
  );
}
