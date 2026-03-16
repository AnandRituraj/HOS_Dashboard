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

A **driver compliance tracking dashboard** for fleet management. Tracks daily vehicle assignment and plan adherence per driver, with weekly analytics. **Frontend-only** — no backend, all data persisted to browser `localStorage`.

## Architecture

Data flows through a single custom hook (`useDashboardData`) that owns all state and handlers, then passes everything as props to child components.

```
page.tsx (dynamic import, SSR: false)
  └─ Dashboard.tsx (wires hook → children)
       ├─ useDashboardData hook (all state + localStorage sync)
       ├─ DashboardHeader (week navigation)
       ├─ StatsBar (compliance summary cards)
       ├─ PieChartCard × 2 (Vehicle/Plan pie charts via Recharts)
       ├─ ManagementSummary (editable stakeholder notes)
       ├─ DashboardDailySection → DriverTable (per-day compliance toggles + reason dialogs)
       └─ WeeklyAttendance (driver × day checkbox matrix)
```

**Key files:**
- `src/hooks/useDashboardData.ts` — Master hook: all state, handlers, localStorage sync, weekly stats computation
- `src/data/drivers.ts` — TypeScript types (`Driver`, `DayEntry`), seed `driverNames` list, initial state factory
- `src/lib/dateUtils.ts` — Week range logic (Monday–Sunday), date formatting helpers
- `src/lib/constants.ts` — localStorage keys (`hos-dashboard-drivers`, `hos-dashboard-summary`)
- `src/components/ThemeRegistry.tsx` — MUI dark theme + Emotion SSR cache

## Important Logic

**Weekly compliance calculation** (in `useDashboardData`):
- Drivers with **zero worked days** are excluded from compliance denominators entirely
- "Compliant" = field is `true` on **every day** the driver worked (not just at least once)

**localStorage hydration**: Always guard with `typeof window === "undefined"` before accessing. Week selection is not persisted (resets to current Monday on load).

**Driver SSR**: `Dashboard` is dynamically imported with `{ ssr: false }` to avoid hydration mismatches from localStorage reads.

## Tech Stack

- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **Material UI 7** — dark mode (`palette.mode: "dark"`, primary: `#90caf9`)
- **Recharts 3** — pie charts
- Path alias: `@/*` → `src/*`
