---
name: HOS Dashboard architecture
description: Current architecture, data flow, and Supabase schema for the HOS Dashboard project
type: project
---

Driver compliance tracking dashboard. Fleet management tool tracking vehicle assignment and plan adherence per driver, with weekly analytics.

**Why:** Needed a real-time, multi-client dashboard for fleet ops.
**How to apply:** Always assume Supabase as the data layer — no localStorage involved in the current codebase.

## Stack
- Next.js 16 (App Router), React 19, TypeScript
- Material UI 7 (dark theme, primary: #90caf9)
- Recharts 3 (pie charts)
- Supabase JS 2 (DB + auth + real-time)
- Path alias: `@/*` → `src/*`

## Component tree
```
page.tsx (dynamic import, ssr:false)
  └─ Dashboard.tsx (auth check + hook wiring)
       ├─ useDashboardData (ALL state + Supabase ops)
       ├─ DashboardHeader
       ├─ StatsBar
       ├─ PieChartCard × 2
       ├─ ManagementSummary
       ├─ DashboardDailySection → DriverTable
       ├─ WeeklyAttendance
       └─ AddDriverDialog
```

## Supabase tables
- `drivers`: id (PK), name
- `driver_days`: driver_id, date (YYYY-MM-DD), worked, vehicle_assigned, followed_plan, vehicle_reason, plan_reason — unique on (driver_id, date)
- `summaries`: week_start (PK, YYYY-MM-DD), text

## Key files
- `src/hooks/useDashboardData.ts` — master hook, owns all state and DB calls
- `src/types/index.ts` — Driver, DayEntry types + emptyDay() factory
- `src/lib/dateUtils.ts` — week/date helpers
- `src/lib/supabase.ts` — Supabase client init
- `src/components/auth/LoginPage.tsx` — email/password auth
- `src/components/ThemeRegistry.tsx` — MUI dark theme + Emotion SSR

## Compliance logic
- Drivers with 0 worked days this week → excluded from denominators
- "Compliant" = field true on every day worked (not just once)
- Stats computed inline (not memoized): vehicleYes/No, planYes/No, driversWhoWorkedCount
