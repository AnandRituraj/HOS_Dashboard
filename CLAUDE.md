# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build
npm start         # Run production server
npm run lint      # Run ESLint
```

No tests are configured.

## What This Is

A **driver compliance tracking dashboard** for fleet management. Tracks daily vehicle assignment and plan adherence per driver, with weekly analytics. Uses **Supabase** for all data persistence, auth, and real-time sync across clients.

## Architecture

Data flows through a single custom hook (`useDashboardData`) that owns all state and Supabase interactions, then passes everything as props to child components.

```
page.tsx (dynamic import, SSR: false)
  └─ Dashboard.tsx (auth check, wires hook → children)
       ├─ useDashboardData hook (all state + Supabase sync + real-time)
       ├─ DashboardHeader (week navigation, logout)
       ├─ StatsBar (compliance summary cards)
       ├─ PieChartCard × 2 (Vehicle/Plan pie charts via Recharts)
       ├─ ManagementSummary (editable stakeholder notes)
       ├─ DashboardDailySection → DriverTable (per-day compliance toggles + reason dialogs)
       ├─ WeeklyAttendance (driver × day checkbox matrix)
       └─ AddDriverDialog (add new driver modal)
```

**Key files:**
- `src/hooks/useDashboardData.ts` — Master hook: all state, handlers, Supabase UPSERT/DELETE, real-time subscriptions, weekly stats computation
- `src/types/index.ts` — TypeScript types (`Driver`, `DayEntry`), `emptyDay()` factory
- `src/lib/dateUtils.ts` — Week range logic (Monday–Sunday), date formatting, `shiftWeek`, `getWeekForDate`, `getDayTabLabel`, `getTodayStr`
- `src/lib/supabase.ts` — Supabase client (reads from `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `src/components/ThemeRegistry.tsx` — MUI dark theme + Emotion SSR cache
- `src/components/auth/LoginPage.tsx` — Supabase email/password login UI
- `src/components/dashboard/` — All dashboard UI components

## Supabase Database Schema

**`drivers`** — `id` (int4 PK), `name` (text)

**`driver_days`** — `id` (int4 PK), `driver_id` (int4 FK → drivers.id), `date` (text, YYYY-MM-DD), `worked` (bool), `vehicle_assigned` (bool), `followed_plan` (bool), `vehicle_reason` (text), `plan_reason` (text)
- Unique constraint: `(driver_id, date)` — all writes use `.upsert(..., { onConflict: "driver_id,date" })`

**`summaries`** — `week_start` (text PK, YYYY-MM-DD), `text` (text)
- Upsert conflict key: `week_start`

## Important Logic

**Weekly compliance calculation** (in `useDashboardData`, NOT memoized — runs inline on each render):
- Drivers with **zero worked days** this week are excluded from compliance denominators entirely
- "Compliant" = field is `true` on **every day** the driver worked (not just at least once)
- Stats exposed: `vehicleYes`, `vehicleNo`, `planYes`, `planNo`, `driversWhoWorkedCount`

**Real-time sync** — 3 Supabase channels subscribed on mount:
- `realtime_driver_days` — INSERT/UPDATE/DELETE → merges into `drivers` state
- `realtime_drivers` — INSERT only → appends new driver to state
- `realtime_summaries` — INSERT/UPDATE → updates `summary` if `week_start` matches current week

**Data loading** — two `useEffect` hooks that run on mount:
- One fetches all `drivers` + all `driver_days` in parallel (keyed on `refreshKey`, but `refreshKey` is never incremented — loads once per mount); `rowsToDrivers()` hydrates flat rows into nested `Driver[]` shape
- A second separate effect fetches the `summaries` row for the current week; re-runs on `week.start` change

**Week state**: Not persisted — resets to current Monday on load. `selectedDayIdx` defaults to today's index in the week.

**Driver SSR**: `Dashboard` is dynamically imported with `{ ssr: false }` in `page.tsx`.

## Tech Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Material UI 7** — dark mode (`palette.mode: "dark"`, primary: `#90caf9`)
- **Recharts 3** — pie charts
- **Supabase JS 2** — database, auth, real-time
- Path alias: `@/*` → `src/*`
