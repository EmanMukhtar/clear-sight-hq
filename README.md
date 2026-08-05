# Mission Control

You are a Staff Product Designer at Linear, Stripe, Vercel, and Ramp with extensive experience designing enterprise SaaS software used daily by operations teams, founders, and executives.

I have attached my current React JSX roadmap dashboard.

Do NOT incrementally improve it.

Instead, redesign it from first principles while preserving 100% of the underlying task data, statuses, priorities, departments, dependencies, owners, ETAs, and functionality.

The goal is to transform it from a project checklist into an Executive Mission Control dashboard.

DESIGN PHILOSOPHY

The current design is feature-rich but feels like a document.

I want it to feel like software used inside a billion-dollar startup.

Think:

 Linear

 Ramp

 Stripe Dashboard

 Vercel

 Raycast

 Arc Browser

 Apple Human Interface Guidelines

Avoid:

 Notion clone

 Trello clone

 Jira clone

 Generic admin templates

 Glassmorphism

 Heavy gradients

 Material UI look

The interface should feel:

 extremely premium

 minimal

 information-dense

 executive-focused

 effortless to scan

 visually calm

 modern

 polished

PRIMARY GOAL

When someone opens the page they should answer these questions within 10 seconds:

 How close are we to launch?

 What's blocking launch?

 What should we work on today?

 Which department is behind?

 What is currently in progress?

 Are we on schedule?

The current dashboard answers none of these efficiently.

INFORMATION HIERARCHY

Redesign the page completely.

Do NOT keep the current layout.

Instead create these sections.

1. Executive Header

Very premium hero section.

Include:

 Cleard Launch Readiness

 Overall completion percentage

 Estimated launch date

 Health indicator

 Total tasks

 Completed

 In Progress

 Blocked

 Next Up

Include a beautiful radial progress visualization.

2. Executive Metrics

Replace the current stat cards with richer cards.

Each card should include:

Main metric

Trend

Context

Mini progress visualization

Example:

Launch Readiness

84%

↑ +6% this week

On Track

instead of just

84%

3. Analytics Dashboard

Add multiple visualizations.

Examples:

Department completion

Horizontal progress chart

Task status distribution

Donut chart

Priority distribution

Stacked bars

Department health score

Progress timeline

Completion over time

Beautiful.

Minimal.

Professional.

4. Critical Path

Create a dedicated section titled

Launch Critical Path

Large premium cards.

Each card should display

Task

Status

Priority

Dependencies

ETA

Owner

Blocking indicator

Progress

This section should be impossible to miss.

5. Roadmap Timeline

Instead of simple task columns

Create a visual roadmap.

Use milestone sections.

Examples

Completed

Current Sprint

Upcoming

Future

Each should have beautiful cards.

6. Department Overview

Replace collapsible lists.

Instead each department becomes a premium dashboard card.

Include

Completion %

Health

Tasks remaining

Blocked tasks

ETA

Mini progress graph

Clicking expands detailed tasks.

7. Task Cards

Completely redesign task cards.

Much cleaner.

Much more premium.

Each task should show

Status badge

Priority badge

Owner

ETA

Dependencies

Launch blocker indicator

Category

No clutter.

Excellent typography.

8. Right Sidebar

Create an executive sidebar.

Include

Recent Activity

Upcoming Milestones

Launch Checklist

Quick Stats

Recent Updates

Important Notes

9. Filters

Move filters into a floating toolbar.

Include

Search

Department

Priority

Status

Category

Owner

Critical Only

Beautiful segmented controls.

10. Navigation

Instead of a long scrolling page

Create navigation.

Overview

Roadmap

Departments

Critical Path

Analytics

Settings

VISUAL DESIGN

Typography

Use modern typography hierarchy.

Lots of whitespace.

Large headings.

Readable spacing.

Cards

Soft rounded corners

Subtle borders

Minimal shadows

No heavy effects.

Spacing

Use an 8px spacing system.

Icons

Lucide icons only.

Charts

Use Recharts.

Make them elegant.

Animations

Subtle.

Fast.

Smooth.

Professional.

COLOR SYSTEM

Dark mode.

Background

Very dark blue-gray.

Cards

Slightly elevated.

Success

Emerald.

Warning

Amber.

Blocked

Red.

Upcoming

Blue.

Muted text

Slate.

Avoid random colors.

Every color should have semantic meaning.

UX IMPROVEMENTS

Everything should be clickable.

Everything should have hover states.

Keyboard friendly.

Excellent empty states.

Beautiful loading states.

Responsive.

No wasted space.

No unnecessary scrolling.

High information density.

Excellent scanability.

IMPORTANT

Do NOT change:

 task names

 task statuses

 departments

 priorities

 dependencies

 owners

 ETAs

 local storage logic

 filtering logic

 existing functionality

Only redesign the user experience and visual presentation.

APPROACH

Think like the Head of Product Design at Linear.

This should not feel like an admin template.

It should feel like software founders use every morning to decide where engineering effort should go.

Optimize for:

 decision making

 clarity

 hierarchy

 visual polish

 premium aesthetics

 speed of understanding

If this were shown to executives or investors, it should communicate professionalism immediately.import { useState, useEffect, useCallback } from "react";

import {

  ChevronDown, ChevronRight, AlertTriangle, Flame, Zap, Circle,

  Check, Clock, Users, MessageSquare, Layers

} from "lucide-react";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";




const STORAGE_KEY = "cleard-roadmap-v2";

const META_KEY = "cleard-roadmap-meta-v2";




const DEPARTMENTS = ["GTM", "Finance", "Ops", "Security & Legal"];

const CATEGORIES = [

  { id: "all", label: "All" },

  { id: "feature", label: "Features" },

  { id: "infrastructure", label: "Infrastructure" },

  { id: "security", label: "Security" },

  { id: "techdebt", label: "Technical debt" },

];

const STATUSES = ["done", "inprogress", "blocked", "next"];

const PRIORITIES = ["critical", "high", "medium", "low"];




const PRIORITY_META = {

  critical: { label: "Critical", icon: Flame, color: "text-red-400" },

  high: { label: "High", icon: Zap, color: "text-amber-400" },

  medium: { label: "Medium", icon: Circle, color: "text-sky-400" },

  low: { label: "Low", icon: Circle, color: "text-slate-500" },

};




const STATUS_META = {

  done: { label: "Done", color: "text-emerald-400", bg: "bg-emerald-950/40", border: "border-emerald-900/60", dot: "#34d399" },

  inprogress: { label: "In progress", color: "text-amber-400", bg: "bg-amber-950/40", border: "border-amber-900/60", dot: "#fbbf24" },

  blocked: { label: "Blocked", color: "text-red-400", bg: "bg-red-950/40", border: "border-red-900/60", dot: "#f87171" },

  next: { label: "Next up", color: "text-sky-400", bg: "bg-sky-950/40", border: "border-sky-900/60", dot: "#38bdf8" },

};




function seedTasks() {

  let n = 0;

  const t = (o) => ({ id: `t${++n}`, owner: "Eman", eta: "", priority: "medium", blockingLaunch: false, dependencies: [], note: "", ...o });

  return [

    t({ name: "Real property/parcel data — all 9 served cities", department: "GTM", category: "feature", status: "done", priority: "high" }),

    t({ name: "Municipality directory (real data)", department: "GTM", category: "infrastructure", status: "done", priority: "medium" }),

    t({ name: "Address lookup — Google + Census fallback", department: "GTM", category: "feature", status: "done", priority: "high" }),

    t({ name: "Integrate DBPR API key", department: "GTM", category: "feature", status: "next", priority: "medium" }),

    t({ name: "myCOI / illumend white-label partnership", department: "GTM", category: "feature", status: "inprogress", priority: "medium", eta: "1 week" }),

    t({ name: "Municipality Submission — expand past Plantation pilot", department: "GTM", category: "feature", status: "next", priority: "critical", blockingLaunch: true, eta: "2 weeks",

      dependencies: [{ name: "Agent 5 approval gate", done: true }, { name: "test_only safeguard", done: true }] }),

    t({ name: "Permit History", department: "GTM", category: "feature", status: "blocked", priority: "low", eta: "TBD",

      note: "Blocked on municipal portal logins — real permit history lives inside each city's own building department system, not a shared dataset. Need a quicker workaround than connecting to every portal one at a time.",

      dependencies: [{ name: "Building dept login storage", done: true }, { name: "Faster per-city workaround", done: false }] }),




    t({ name: "Real Stripe pricing tiers", department: "Finance", category: "feature", status: "done", priority: "high" }),

    t({ name: "Billing and invoicing — real Stripe charges", department: "Finance", category: "feature", status: "done", priority: "high" }),

    t({ name: "Payment Authorization — real embedded checkout", department: "Finance", category: "feature", status: "done", priority: "high" }),




    t({ name: "Staff assignment, priority, escalation tracking", department: "Ops", category: "feature", status: "done", priority: "medium" }),

    t({ name: "Audit trail — real activity log", department: "Ops", category: "infrastructure", status: "done", priority: "medium" }),

    t({ name: "Project notes — real, tenant-scoped", department: "Ops", category: "feature", status: "done", priority: "low" }),

    t({ name: "Reports — real numbers, not seeded", department: "Ops", category: "feature", status: "done", priority: "medium" }),

    t({ name: "Calendar — real deadlines", department: "Ops", category: "feature", status: "done", priority: "medium" }),

    t({ name: "Notary request queue", department: "Ops", category: "feature", status: "done", priority: "low" }),

    t({ name: "Inspections — real scheduling and results", department: "Ops", category: "feature", status: "done", priority: "medium" }),

    t({ name: "Dispatch property intelligence panel", department: "Ops", category: "feature", status: "done", priority: "high" }),

    t({ name: "Company Profile — real data + file uploads", department: "Ops", category: "feature", status: "done", priority: "medium" }),

    t({ name: "Legal Document Library — real storage + versioning", department: "Ops", category: "feature", status: "done", priority: "low" }),

    t({ name: "Insurance Requests — real submission + notification", department: "Ops", category: "feature", status: "done", priority: "medium",

      dependencies: [{ name: "Company Profiles", done: true }, { name: "File uploads", done: true }, { name: "E-signatures (SignWell)", done: true }] }),

    t({ name: "Full 7-agent permit automation pipeline", department: "Ops", category: "feature", status: "done", priority: "critical" }),

    t({ name: "Real e-signatures (SignWell)", department: "Ops", category: "infrastructure", status: "done", priority: "high" }),

    t({ name: "Automated code reviewer (QA Agent)", department: "Ops", category: "infrastructure", status: "done", priority: "medium" }),

    t({ name: "Staff Workload — fix fake employee roster", department: "Ops", category: "techdebt", status: "inprogress", priority: "medium", eta: "2 days" }),

    t({ name: "Check GC Clients admin page", department: "Ops", category: "techdebt", status: "next", priority: "low" }),

    t({ name: "PostHog product analytics setup", department: "Ops", category: "infrastructure", status: "inprogress", priority: "medium", eta: "3 days" }),

    t({ name: "Victoria AI intelligence layer", department: "Ops", category: "feature", status: "next", priority: "low" }),




    t({ name: "Fixed invite/signup tenant-isolation hole", department: "Security & Legal", category: "security", status: "done", priority: "critical" }),

    t({ name: "Fixed internal notes exposure", department: "Security & Legal", category: "security", status: "done", priority: "high" }),

    t({ name: "Locked database functions against forgery", department: "Security & Legal", category: "security", status: "done", priority: "high" }),

    t({ name: "Fixed fake support-reply forgery bug", department: "Security & Legal", category: "security", status: "done", priority: "high" }),

    t({ name: "Removed duplicate insecure credential system", department: "Security & Legal", category: "security", status: "done", priority: "medium" }),

    t({ name: "Approval gate — government filing (Agent 5)", department: "Security & Legal", category: "security", status: "done", priority: "critical" }),

    t({ name: "Approval gate — client-facing letters (Agent 7)", department: "Security & Legal", category: "security", status: "done", priority: "critical" }),

    t({ name: "Fixed 5 RLS/publish-blocking security findings", department: "Security & Legal", category: "security", status: "done", priority: "critical" }),

    t({ name: "Correction-reply routing — Plantation address", department: "Security & Legal", category: "feature", status: "inprogress", priority: "medium", eta: "pending confirmation",

      dependencies: [{ name: "Elajuwan needs to confirm the real email", done: false }] }),

  ];

}




function useStorage(key, initial, shared) {

  const [value, setValue] = useState(initial);

  const [loaded, setLoaded] = useState(false);




  useEffect(() => {

    let cancelled = false;

    (async () => {

      try {

        const res = await window.storage.get(key, shared);

        if (!cancelled && res && res.value != null) setValue(JSON.parse(res.value));

      } catch {

        // key doesn't exist yet

      } finally {

        if (!cancelled) setLoaded(true);

      }

    })();

    return () => { cancelled = true; };

  }, [key, shared]);




  const save = useCallback(async (next) => {

    setValue(next);

    try { await window.storage.set(key, JSON.stringify(next), shared); } catch { /* optimistic */ }

  }, [key, shared]);




  return [value, save, loaded];

}




function StatCard({ icon: Icon, iconBg, value, label, sub }) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 min-w-[150px]">

      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>

        <Icon size={16} className="text-white" />

      </div>

      <div className="text-2xl font-semibold text-white">{value}</div>

      <div className="text-xs text-slate-400 mt-0.5">{label}</div>

      {sub && <div className="text-[11px] text-slate-500 mt-1">{sub}</div>}

    </div>

  );

}




export default function ClearedDashboard() {

  const [tasks, saveTasks, tasksLoaded] = useStorage(STORAGE_KEY, null, true);

  const [meta, saveMeta] = useStorage(META_KEY, { launchDate: "August 28" }, true);

  const [viewMode, setViewMode] = useState("timeline");

  const [activeCategory, setActiveCategory] = useState("all");

  const [activeFilter, setActiveFilter] = useState("all");

  const [collapsed, setCollapsed] = useState({});

  const [editingField, setEditingField] = useState(null);




  const list = tasks ?? seedTasks();




  useEffect(() => {

    if (tasksLoaded && tasks === null) saveTasks(seedTasks());

  }, [tasksLoaded, tasks, saveTasks]);




  function updateTask(id, patch) {

    saveTasks(list.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  }

  function toggleDept(dept) {

    setCollapsed((c) => ({ ...c, [dept]: !c[dept] }));

  }




  const filtered = list.filter((t) => {

    if (activeCategory !== "all" && t.category !== activeCategory) return false;

    if (activeFilter === "mine" && t.owner !== "Eman") return false;

    if (activeFilter === "blocked" && t.status !== "blocked") return false;

    if (activeFilter === "launch" && !t.blockingLaunch) return false;

    if (activeFilter === "security" && t.category !== "security") return false;

    if (activeFilter === "inprogress" && t.status !== "inprogress") return false;

    return true;

  });




  const total = list.length;

  const complete = list.filter((t) => t.status === "done").length;

  const inProgress = list.filter((t) => t.status === "inprogress").length;

  const blocked = list.filter((t) => t.status === "blocked").length;

  const next = list.filter((t) => t.status === "next").length;

  const readiness = total ? Math.round((complete / total) * 100) : 0;

  const criticalPath = list.filter((t) => t.blockingLaunch);




  const pieData = [

    { name: "Done", value: complete, color: STATUS_META.done.dot },

    { name: "In progress", value: inProgress, color: STATUS_META.inprogress.dot },

    { name: "Blocked", value: blocked, color: STATUS_META.blocked.dot },

    { name: "Next up", value: next, color: STATUS_META.next.dot },

  ].filter((d) => d.value > 0);




  return (

    <div className="min-h-full bg-[#0b0f1a] text-slate-200" style={{ fontFamily: "system-ui, sans-serif" }}>

      <div className="max-w-6xl mx-auto p-6 space-y-5">




        <div>

          <h1 className="text-xl font-semibold text-white">Cleard — launch readiness</h1>

          <p className="text-sm text-slate-400 mt-0.5">Est. launch:{" "}

            {editingField === "launchDate" ? (

              <input

                autoFocus

                defaultValue={meta.launchDate}

                onBlur={(e) => { saveMeta({ ...meta, launchDate: e.target.value }); setEditingField(null); }}

                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}

                className="bg-slate-800 text-white text-sm px-2 py-0.5 rounded border border-slate-700 w-28"

              />

            ) : (

              <button onClick={() => setEditingField("launchDate")} className="text-sky-400 border-b border-dashed border-sky-800">

                {meta.launchDate}

              </button>

            )}

          </p>

        </div>




        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

          <StatCard icon={Layers} iconBg="bg-sky-600" value={`${readiness}%`} label="Launch readiness" />

          <StatCard icon={Users} iconBg="bg-emerald-600" value={complete} label="Complete" sub={`of ${total} tasks`} />

          <StatCard icon={Clock} iconBg="bg-amber-600" value={inProgress} label="In progress" />

          <StatCard icon={AlertTriangle} iconBg="bg-red-600" value={blocked} label="Blocked" />

          <StatCard icon={MessageSquare} iconBg="bg-violet-600" value={next} label="Next up" />

        </div>




        {criticalPath.length > 0 && (

          <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-4">

            <div className="flex items-center gap-2 text-red-300 font-semibold text-sm mb-3">

              <AlertTriangle size={16} /> Blocking launch

            </div>

            <div className="space-y-2">

              {criticalPath.map((t) => (

                <div key={t.id} className="flex items-center justify-between bg-slate-900 rounded-lg border border-slate-800 px-3 py-2">

                  <span className="text-sm font-medium text-slate-200">{t.name}</span>

                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_META[t.status].bg} ${STATUS_META[t.status].color}`}>

                    {STATUS_META[t.status].label}

                  </span>

                </div>

              ))}

            </div>

          </div>

        )}




        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">

          <div className="space-y-4">

            <div className="flex items-center justify-between flex-wrap gap-3">

              <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">

                {["timeline", "department"].map((m) => (

                  <button

                    key={m}

                    onClick={() => setViewMode(m)}

                    className={`px-3 py-1.5 text-sm rounded-md font-medium ${viewMode === m ? "bg-slate-700 text-white" : "text-slate-400"}`}

                  >

                    {m === "timeline" ? "Timeline" : "By department"}

                  </button>

                ))}

              </div>

              <div className="flex gap-1 flex-wrap">

                {CATEGORIES.map((c) => (

                  <button

                    key={c.id}

                    onClick={() => setActiveCategory(c.id)}

                    className={`px-3 py-1.5 text-xs rounded-full border ${activeCategory === c.id ? "bg-white text-slate-900 border-white" : "bg-slate-900 text-slate-400 border-slate-800"}`}

                  >

                    {c.label}

                  </button>

                ))}

              </div>

            </div>




            <div className="flex gap-2 flex-wrap">

              {[

                { id: "all", label: "All tasks" },

                { id: "mine", label: "Only mine" },

                { id: "blocked", label: "Only blocked" },

                { id: "launch", label: "Only launch-blocking" },

                { id: "security", label: "Only security" },

                { id: "inprogress", label: "Only in progress" },

              ].map((f) => (

                <button

                  key={f.id}

                  onClick={() => setActiveFilter(f.id)}

                  className={`px-3 py-1 text-xs rounded-full border ${activeFilter === f.id ? "bg-sky-950/60 text-sky-300 border-sky-800" : "bg-slate-900 text-slate-500 border-slate-800"}`}

                >

                  {f.label}

                </button>

              ))}

            </div>




            {viewMode === "timeline" ? (

              <TimelineView tasks={filtered} onUpdate={updateTask} editingField={editingField} setEditingField={setEditingField} />

            ) : (

              <DepartmentView tasks={filtered} collapsed={collapsed} toggleDept={toggleDept} onUpdate={updateTask} editingField={editingField} setEditingField={setEditingField} />

            )}

          </div>




          <div className="space-y-4">

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

              <div className="text-sm font-semibold text-white mb-3">Status overview</div>

              <div className="h-40">

                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={65} paddingAngle={2}>

                      {pieData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}

                    </Pie>

                  </PieChart>

                </ResponsiveContainer>

              </div>

              <div className="space-y-1.5 mt-2">

                {pieData.map((d) => (

                  <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">

                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />

                    {d.name}

                    <span className="ml-auto text-slate-300">{d.value}</span>

                  </div>

                ))}

              </div>

              <div className="text-center mt-2 pt-2 border-t border-slate-800">

                <div className="text-lg font-semibold text-white">{total}</div>

                <div className="text-[11px] text-slate-500">Total tasks</div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}




function TimelineView({ tasks, onUpdate, editingField, setEditingField }) {

  const cols = [

    { key: "done", label: "Done" },

    { key: "inprogress", label: "In progress" },

    { key: "blocked", label: "Blocked" },

    { key: "next", label: "Next up" },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

      {cols.map((col) => {

        const items = tasks.filter((t) => t.status === col.key);

        return (

          <div key={col.key} className="bg-slate-900 border border-slate-800 rounded-xl p-3">

            <div className="flex items-center gap-2 mb-3 px-1">

              <span className="w-2 h-2 rounded-full" style={{ background: STATUS_META[col.key].dot }} />

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{col.label}</span>

              <span className="text-xs text-slate-600 ml-auto">{items.length}</span>

            </div>

            <div className="space-y-2">

              {items.map((t) => (

                <TaskCard key={t.id} task={t} onUpdate={onUpdate} editingField={editingField} setEditingField={setEditingField} />

              ))}

              {items.length === 0 && <div className="text-xs text-slate-700 text-center py-4">Nothing here</div>}

            </div>

          </div>

        );

      })}

    </div>

  );

}




function DepartmentView({ tasks, collapsed, toggleDept, onUpdate, editingField, setEditingField }) {

  return (

    <div className="space-y-3">

      {DEPARTMENTS.map((dept) => {

        const items = tasks.filter((t) => t.department === dept);

        if (items.length === 0) return null;

        const done = items.filter((t) => t.status === "done").length;

        const deptBlocked = items.filter((t) => t.status === "blocked").length;

        const pct = Math.round((done / items.length) * 100);

        const isCollapsed = collapsed[dept];

        return (

          <div key={dept} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

            <button onClick={() => toggleDept(dept)} className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50">

              <div className="flex items-center gap-2">

                {isCollapsed ? <ChevronRight size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}

                <span className="font-semibold text-sm text-white">{dept}</span>

                <span className="text-xs text-slate-500">({items.length})</span>

              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">

                {deptBlocked > 0 && <span className="text-red-400 font-medium">{deptBlocked} blocked</span>}

                <span>{done} / {items.length} complete</span>

                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">

                  <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />

                </div>

                <span className="font-semibold text-slate-200 w-9 text-right">{pct}%</span>

              </div>

            </button>

            {!isCollapsed && (

              <div className="border-t border-slate-800 p-3 space-y-2">

                {items.map((t) => (

                  <TaskCard key={t.id} task={t} onUpdate={onUpdate} editingField={editingField} setEditingField={setEditingField} />

                ))}

              </div>

            )}

          </div>

        );

      })}

    </div>

  );

}




function TaskCard({ task, onUpdate, editingField, setEditingField }) {

  const fieldKey = (f) => `${task.id}:${f}`;

  const PIcon = PRIORITY_META[task.priority].icon;




  return (

    <div className={`rounded-lg border ${STATUS_META[task.status].border} ${STATUS_META[task.status].bg} p-3`}>

      <div className="flex items-start justify-between gap-2">

        <span className="text-sm font-medium leading-snug text-slate-100">{task.name}</span>

        <PIcon size={14} className={`shrink-0 mt-0.5 ${PRIORITY_META[task.priority].color}`} />

      </div>




      {task.note && (

        <p className="mt-2 text-xs text-slate-400 leading-relaxed">{task.note}</p>

      )}




      {task.dependencies.length > 0 && (

        <div className="mt-2 space-y-1">

          {task.dependencies.map((d, i) => (

            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">

              {d.done ? <Check size={12} className="text-emerald-500" /> : <Clock size={12} className="text-amber-500" />}

              <span className={d.done ? "line-through text-slate-600" : "text-slate-400"}>{d.name}</span>

            </div>

          ))}

        </div>

      )}




      <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px]">

        <select

          value={task.status}

          onChange={(e) => onUpdate(task.id, { status: e.target.value })}

          className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300"

        >

          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}

        </select>




        <select

          value={task.priority}

          onChange={(e) => onUpdate(task.id, { priority: e.target.value })}

          className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300"

        >

          {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}

        </select>




        {editingField === fieldKey("owner") ? (

          <input

            autoFocus

            defaultValue={task.owner}

            onBlur={(e) => { onUpdate(task.id, { owner: e.target.value }); setEditingField(null); }}

            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}

            className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 w-20 text-slate-200"

          />

        ) : (

          <button onClick={() => setEditingField(fieldKey("owner"))} className="text-slate-400 border-b border-dashed border-slate-700">

            {task.owner || "Unassigned"}

          </button>

        )}




        {editingField === fieldKey("eta") ? (

          <input

            autoFocus

            defaultValue={task.eta}

            onBlur={(e) => { onUpdate(task.id, { eta: e.target.value }); setEditingField(null); }}

            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}

            placeholder="ETA"

            className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 w-20 text-slate-200"

          />

        ) : (

          <button onClick={() => setEditingField(fieldKey("eta"))} className="text-slate-500 border-b border-dashed border-slate-700">

            {task.eta || "Set ETA"}

          </button>

        )}




        <button

          onClick={() => onUpdate(task.id, { blockingLaunch: !task.blockingLaunch })}

          className={`ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded ${task.blockingLaunch ? "bg-red-900/60 text-red-300" : "text-slate-700"}`}

          title="Toggle: blocks launch"

        >

          <AlertTriangle size={11} />

        </button>

      </div>

    </div>

  );

}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6dc97f3e-c39e-4754-921b-47ea22fbd99d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
