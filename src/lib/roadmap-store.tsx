import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Dependency, Meta, Task } from "./roadmap-data";

export interface Filters {
  search: string;
  department: string;
  priority: string;
  status: string;
  category: string;
  owner: string;
  criticalOnly: boolean;
  quick: string;
}

export const DEFAULT_FILTERS: Filters = {
  search: "",
  department: "all",
  priority: "all",
  status: "all",
  category: "all",
  owner: "all",
  criticalOnly: false,
  quick: "all",
};

export type NewTask = Partial<Omit<Task, "id">> & { name: string };

interface Store {
  tasks: Task[];
  loaded: boolean;
  meta: Meta;
  updateTask: (id: string, patch: Partial<Task>) => void;
  addTask: (task: NewTask) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  saveMeta: (m: Meta) => void;
  resetTasks: () => void;
  refresh: () => Promise<void>;
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  clearFilters: () => void;
  filtered: Task[];
  owners: string[];
}

const RoadmapContext = createContext<Store | null>(null);

interface Row {
  id: string;
  name: string;
  department: string;
  category: string;
  status: string;
  priority: string;
  owner: string;
  eta: string;
  blocking_launch: boolean;
  dependencies: unknown;
  note: string;
  position: number;
}

function toTask(r: Row): Task {
  return {
    id: r.id,
    name: r.name,
    department: r.department,
    category: r.category,
    status: r.status as Task["status"],
    priority: r.priority as Task["priority"],
    owner: r.owner ?? "",
    eta: r.eta ?? "",
    blockingLaunch: r.blocking_launch,
    dependencies: Array.isArray(r.dependencies) ? (r.dependencies as Dependency[]) : [],
    note: r.note ?? "",
  };
}

function toRow(patch: Partial<Task>) {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row["name"] = patch.name;
  if (patch.department !== undefined) row["department"] = patch.department;
  if (patch.category !== undefined) row["category"] = patch.category;
  if (patch.status !== undefined) row["status"] = patch.status;
  if (patch.priority !== undefined) row["priority"] = patch.priority;
  if (patch.owner !== undefined) row["owner"] = patch.owner;
  if (patch.eta !== undefined) row["eta"] = patch.eta;
  if (patch.blockingLaunch !== undefined) row["blocking_launch"] = patch.blockingLaunch;
  if (patch.dependencies !== undefined) row["dependencies"] = patch.dependencies;
  if (patch.note !== undefined) row["note"] = patch.note;
  return row;
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<Meta>({ launchDate: "August 28" });
  const [loaded, setLoaded] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const positions = useRef<Map<string, number>>(new Map());

  const refresh = useCallback(async () => {
    const [{ data: rows }, { data: settings }] = await Promise.all([
      supabase
        .from("roadmap_tasks")
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("roadmap_settings").select("*").eq("id", "default").maybeSingle(),
    ]);
    if (rows) {
      const list = rows as unknown as Row[];
      positions.current = new Map(list.map((r) => [r.id, r.position]));
      setTasks(list.map(toTask));
    }
    if (settings) setMeta({ launchDate: (settings as { launch_date: string }).launch_date });
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
    const channel = supabase
      .channel("roadmap-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "roadmap_tasks" }, () => {
        void refresh();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "roadmap_settings" }, () => {
        void refresh();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    void supabase.from("roadmap_tasks").update(toRow(patch)).eq("id", id);
  }, []);

  const addTask = useCallback(
    async (task: NewTask) => {
      const maxPos = Math.max(0, ...Array.from(positions.current.values()));
      const payload = {
        name: task.name,
        department: task.department ?? "Ops",
        category: task.category ?? "feature",
        status: task.status ?? "next",
        priority: task.priority ?? "medium",
        owner: task.owner ?? "",
        eta: task.eta ?? "",
        blocking_launch: task.blockingLaunch ?? false,
        dependencies: task.dependencies ?? [],
        note: task.note ?? "",
        position: maxPos + 100,
      };
      await supabase.from("roadmap_tasks").insert(payload);
      await refresh();
    },
    [refresh],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await supabase.from("roadmap_tasks").delete().eq("id", id);
      await refresh();
    },
    [refresh],
  );

  const saveMeta = useCallback((m: Meta) => {
    setMeta(m);
    void supabase
      .from("roadmap_settings")
      .upsert({ id: "default", launch_date: m.launchDate }, { onConflict: "id" });
  }, []);

  const resetTasks = useCallback(() => {
    void refresh();
  }, [refresh]);

  const setFilters = useCallback((f: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  }, []);

  const clearFilters = useCallback(() => setFiltersState(DEFAULT_FILTERS), []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filters.category !== "all" && t.category !== filters.category) return false;
      if (filters.department !== "all" && t.department !== filters.department) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.owner !== "all" && t.owner !== filters.owner) return false;
      if (filters.criticalOnly && !t.blockingLaunch) return false;
      if (filters.quick === "mine" && t.owner !== "Eman") return false;
      if (filters.quick === "blocked" && t.status !== "blocked") return false;
      if (filters.quick === "launch" && !t.blockingLaunch) return false;
      if (filters.quick === "security" && t.category !== "security") return false;
      if (filters.quick === "inprogress" && t.status !== "inprogress") return false;
      if (q && !`${t.name} ${t.owner} ${t.department} ${t.note}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [tasks, filters]);

  const owners = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.owner).filter(Boolean))).sort(),
    [tasks],
  );

  const value: Store = {
    tasks,
    loaded,
    meta,
    updateTask,
    addTask,
    deleteTask,
    saveMeta,
    resetTasks,
    refresh,
    filters,
    setFilters,
    clearFilters,
    filtered,
    owners,
  };

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}

export function useRoadmap() {
  const ctx = useContext(RoadmapContext);
  if (!ctx) throw new Error("useRoadmap must be used inside RoadmapProvider");
  return ctx;
}
