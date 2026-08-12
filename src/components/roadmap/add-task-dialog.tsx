import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  CATEGORIES,
  DEPARTMENTS,
  PRIORITIES,
  PRIORITY_META,
  STATUSES,
  STATUS_META,
  type Task,
} from "@/lib/roadmap-data";
import { useRoadmap } from "@/lib/roadmap-store";

const field =
  "w-full rounded-md border border-border bg-elevated px-2.5 py-1.5 text-[13px] text-foreground outline-none focus:border-ring";

export function AddTaskButton() {
  const { addTask } = useRoadmap();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    department: DEPARTMENTS[0] as string,
    category: "feature",
    status: "next" as Task["status"],
    priority: "medium" as Task["priority"],
    owner: "",
    eta: "",
    note: "",
    blockingLaunch: false,
  });

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  async function submit() {
    if (!form.name.trim() || saving) return;
    setSaving(true);
    await addTask({ ...form, name: form.name.trim() });
    setSaving(false);
    setOpen(false);
    set({ name: "", owner: "", eta: "", note: "", blockingLaunch: false });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[12px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus size={13} />
        New task
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-6 backdrop-blur"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-10 w-full max-w-lg rounded-xl border border-border bg-surface p-5 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[14px] font-semibold">Add a task</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                autoFocus
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Task name"
                className={field}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className={field}
                  value={form.department}
                  onChange={(e) => set({ department: e.target.value })}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  className={field}
                  value={form.category}
                  onChange={(e) => set({ category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  className={field}
                  value={form.status}
                  onChange={(e) => set({ status: e.target.value as Task["status"] })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
                <select
                  className={field}
                  value={form.priority}
                  onChange={(e) => set({ priority: e.target.value as Task["priority"] })}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_META[p].label}
                    </option>
                  ))}
                </select>
                <input
                  className={field}
                  value={form.owner}
                  onChange={(e) => set({ owner: e.target.value })}
                  placeholder="Owner"
                />
                <input
                  className={field}
                  value={form.eta}
                  onChange={(e) => set({ eta: e.target.value })}
                  placeholder="ETA (e.g. 2 weeks)"
                />
              </div>
              <textarea
                className={`${field} min-h-20 resize-y`}
                value={form.note}
                onChange={(e) => set({ note: e.target.value })}
                placeholder="Notes (optional)"
              />
              <label className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.blockingLaunch}
                  onChange={(e) => set({ blockingLaunch: e.target.checked })}
                />
                Blocks launch
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!form.name.trim() || saving}
                className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Adding…" : "Add task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
