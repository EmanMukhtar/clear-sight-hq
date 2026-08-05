import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/roadmap/shell";
import { Card, SectionTitle } from "@/components/roadmap/ui";
import { useRoadmap } from "@/lib/roadmap-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cleard Mission Control" },
      {
        name: "description",
        content: "Configure the Cleard launch target date and reset locally stored roadmap data.",
      },
      { property: "og:title", content: "Settings — Cleard Mission Control" },
      { property: "og:description", content: "Launch date and local roadmap data controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { meta, saveMeta, resetTasks, tasks } = useRoadmap();
  const [value, setValue] = useState(meta.launchDate);

  return (
    <Shell title="Settings" subtitle="Workspace configuration">
      <div className="grid max-w-2xl gap-4">
        <Card className="p-5">
          <SectionTitle title="Launch target" hint="Shown across every view" />
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="rounded-md border border-border bg-elevated px-3 py-1.5 text-[13px] outline-none focus:border-ring"
            />
            <button
              onClick={() => saveMeta({ ...meta, launchDate: value })}
              className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Save
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Local data" hint={`${tasks.length} tasks stored in this browser`} />
          <button
            onClick={resetTasks}
            className="rounded-md border border-blocked-line bg-blocked-soft px-3 py-1.5 text-[13px] font-medium text-blocked transition-opacity hover:opacity-90"
          >
            Reset to seeded roadmap
          </button>
        </Card>
      </div>
    </Shell>
  );
}
