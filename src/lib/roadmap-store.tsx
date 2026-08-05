import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  META_KEY,
  STORAGE_KEY,
  seedTasks,
  type Meta,
  type Task,
} from "./roadmap-data";

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

interface Store {
  tasks: Task[];
  loaded: boolean;
  meta: Meta;
  updateTask: (id: string, patch: Partial<Task>) => void;
  saveMeta: (m: Meta) => void;
  resetTasks: () => void;
  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  clearFilters: () => void;
  filtered: Task[];
  owners: string[];
}

const RoadmapContext = createContext<Store | null>(null);

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* optimistic */
  }
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => seedTasks());
  const [meta, setMeta] = useState<Meta>({ launchDate: "August 28" });
  const [loaded, setLoaded] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);

  useEffect(() => {
    const storedTasks = read<Task[]>(STORAGE_KEY);
    if (storedTasks && storedTasks.length) {
      setTasks(storedTasks);
    } else {
      const seeded = seedTasks();
      setTasks(seeded);
      write(STORAGE_KEY, seeded);
    }
    const storedMeta = read<Meta>(META_KEY);
    if (storedMeta) setMeta(storedMeta);
    setLoaded(true);
  }, []);

  const saveTasks = useCallback((next: Task[]) => {
    setTasks(next);
    write(STORAGE_KEY, next);
  }, []);

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
        write(STORAGE_KEY, next);
        return next;
      });
    },
    [],
  );

  const saveMeta = useCallback((m: Meta) => {
    setMeta(m);
    write(META_KEY, m);
  }, []);

  const resetTasks = useCallback(() => saveTasks(seedTasks()), [saveTasks]);

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
    saveMeta,
    resetTasks,
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
