import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DEPARTMENTS,
  PRIORITIES,
  PRIORITY_META,
  STATUSES,
  STATUS_META,
  computeStats,
  departmentStats,
  type Task,
} from "@/lib/roadmap-data";
import { Card, SectionTitle } from "./ui";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
};

export function StatusDonut({ tasks }: { tasks: Task[] }) {
  const s = computeStats(tasks);
  const data = [
    { name: "Done", value: s.complete, color: STATUS_META.done.dot },
    { name: "In progress", value: s.inProgress, color: STATUS_META.inprogress.dot },
    { name: "Blocked", value: s.blocked, color: STATUS_META.blocked.dot },
    { name: "Next up", value: s.next, color: STATUS_META.next.dot },
  ].filter((d) => d.value > 0);

  return (
    <Card className="p-4">
      <SectionTitle title="Status distribution" />
      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={52} outerRadius={72} paddingAngle={2}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="num font-display text-2xl font-semibold">{s.total}</span>
          <span className="text-[11px] text-muted-foreground">tasks</span>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />
            {d.name}
            <span className="num ml-auto text-foreground">{d.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DepartmentCompletion({ tasks }: { tasks: Task[] }) {
  return (
    <Card className="p-4">
      <SectionTitle title="Department completion" hint="Share of tasks marked done" />
      <div className="space-y-3">
        {DEPARTMENTS.map((d) => {
          const st = departmentStats(tasks, d);
          return (
            <div key={d}>
              <div className="flex items-baseline justify-between text-[12px]">
                <span className="font-medium">{d}</span>
                <span className="num text-muted-foreground">
                  {st.done}/{st.items.length} · {st.pct}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-700 ${
                    st.blocked > 0 ? "bg-blocked" : st.pct >= 80 ? "bg-success" : "bg-warning"
                  }`}
                  style={{ width: `${st.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function PriorityStack({ tasks }: { tasks: Task[] }) {
  const data = PRIORITIES.map((p) => {
    const row: Record<string, string | number> = { name: PRIORITY_META[p].label };
    STATUSES.forEach((s) => {
      row[s] = tasks.filter((t) => t.priority === p && t.status === s).length;
    });
    return row;
  });

  return (
    <Card className="p-4">
      <SectionTitle title="Priority distribution" hint="Status mix inside each priority" />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={18}>
            <XAxis dataKey="name" {...axis} />
            <YAxis {...axis} width={24} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
            {STATUSES.map((s, i) => (
              <Bar
                key={s}
                dataKey={s}
                stackId="a"
                fill={STATUS_META[s].dot}
                name={STATUS_META[s].label}
                radius={i === STATUSES.length - 1 ? [3, 3, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function DepartmentHealth({ tasks }: { tasks: Task[] }) {
  const data = DEPARTMENTS.map((d) => {
    const st = departmentStats(tasks, d);
    const score = Math.max(0, st.pct - st.blocked * 15);
    return { name: d, score, color: st.blocked > 0 ? STATUS_META.blocked.dot : score >= 80 ? STATUS_META.done.dot : STATUS_META.inprogress.dot };
  });

  return (
    <Card className="p-4">
      <SectionTitle title="Department health score" hint="Completion penalised by blockers" />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={16}>
            <XAxis type="number" domain={[0, 100]} {...axis} />
            <YAxis type="category" dataKey="name" width={98} {...axis} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
            <Bar dataKey="score" radius={[0, 3, 3, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function CompletionTimeline({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "Now"];
  const data = weeks.map((w, i) => ({
    week: w,
    completed: Math.round((done * (i + 1)) / weeks.length),
    target: Math.round((total * (i + 1)) / weeks.length),
  }));

  return (
    <Card className="p-4">
      <SectionTitle title="Completion over time" hint="Delivered vs. plan" />
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="week" {...axis} />
            <YAxis {...axis} width={24} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="target"
              stroke="var(--chart-muted)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="var(--chart-success)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
