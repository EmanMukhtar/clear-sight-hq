# Cleard — Executive Mission Control

Rebuild the roadmap dashboard from first principles as an executive command center. All 38 seeded tasks, their names, departments, statuses, priorities, owners, ETAs, dependencies, notes, and launch-blocker flags carry over untouched, as does inline editing and filtering behavior.

## Screens (top nav, not one long scroll)

A persistent left rail + top bar shell with six views, all client-side routed:

- **Overview** — executive hero, metrics, critical path preview, sidebar
- **Roadmap** — milestone timeline (Completed / Current Sprint / Upcoming / Future)
- **Departments** — one premium card per department, expands to task detail
- **Critical Path** — large launch-blocker cards
- **Analytics** — charts
- **Settings** — launch date, data reset

## Overview layout

```text
+-----------------------------------------------------------+
|  Cleard / Launch Readiness            [ ⌘K  search ]       |
+-------------------+---------------------------+-----------+
|  84%  radial      |  Est. launch · Health     |  Sidebar  |
|  readiness ring   |  Total/Done/WIP/Blocked   |  Activity |
+-------------------+---------------------------+  Miles-   |
|  4 metric cards: value + trend + context + spark |  tones  |
+---------------------------------------------+  Checklist |
|  Launch Critical Path (large cards)          |  Quick     |
+---------------------------------------------+  stats     |
```

### 1. Executive header
Radial progress ring (completion %), launch date (inline editable, same as today), health pill (On Track / At Risk / Blocked, derived from blocker count), and a compact row of Total / Completed / In Progress / Blocked / Next Up counters — each clickable to jump into a filtered roadmap view.

### 2. Metric cards
Launch Readiness, Velocity (done vs. remaining), Blockers, Departments On Track. Each: big number, delta line, one-line context, and a mini bar/sparkline.

### 3. Analytics
Recharts: department completion (horizontal bars), status distribution (donut), priority distribution (stacked bars), department health scores, cumulative completion timeline.

### 4. Critical path
Full-width cards for every `blockingLaunch` task: name, status, priority, owner, ETA, dependency checklist with done/pending states, progress bar from dependency completion. Empty state when nothing blocks launch.

### 5. Roadmap
Milestone bands mapped from existing statuses: Completed = done, Current Sprint = inprogress, Upcoming = next, Future = next without ETA / low priority. No new fields invented.

### 6. Departments
Card per department: completion %, health dot, tasks remaining, blocked count, aggregate ETA, mini progress graph. Click expands inline task list.

### 7. Task card
Rebuilt: title, status + priority badges, owner, ETA, category chip, dependency count, blocker flag. Selects/inline inputs kept but restyled as quiet controls that reveal on hover/focus.

### 8. Filter toolbar
Floating, sticky: search, department, priority, status, category, owner, "Critical only". Segmented controls. Existing filter predicates preserved and extended with the new facets.

## Visual system

Dark-only. Background near-black blue-gray, cards one step elevated, hairline borders, minimal shadow, 8px spacing scale, tight modern type hierarchy. Semantic colors only: emerald (done), amber (in progress), red (blocked), blue (next up), slate (muted). Lucide icons. Subtle, fast transitions.

## Technical notes

- Built as TanStack Start routes under `src/routes/` (`/`, `/roadmap`, `/departments`, `/critical-path`, `/analytics`, `/settings`) with a shared shell; `/` becomes the Overview and replaces the placeholder index.
- The pasted code calls `window.storage`, which does not exist in a browser app. Persistence moves to `localStorage` under the same keys (`cleard-roadmap-v2`, `cleard-roadmap-meta-v2`) with an identical read/seed/save contract — same shape, same seeding-on-first-load behavior. Reads happen after mount to avoid SSR hydration mismatch.
- Seed data copied verbatim into `src/lib/roadmap-data.ts`.
- Design tokens added to `src/styles.css` in oklch; no hardcoded color utilities in components.
- Recharts installed; charts themed to the token palette with no default grids/tooltips styling.
- Components split under `src/components/roadmap/`.
- Per-route head() metadata with unique titles/descriptions.
