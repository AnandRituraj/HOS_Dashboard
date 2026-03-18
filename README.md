# HOS Dashboard

Driver compliance tracking dashboard for fleet management. Tracks daily vehicle assignment and plan adherence per driver, with weekly analytics. Uses **Supabase** for all data persistence, auth, and real-time sync across clients.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **React 19**
- **Material UI 7** (`@mui/material`, `@mui/icons-material`, Emotion) — Linear-inspired dark theme
- **Inter** (via `next/font/google`) — loaded in `layout.tsx`
- **Recharts 3** (pie charts)
- **Supabase JS 2** (database, auth, real-time)

## Features

- **Authentication** — Email/password login via Supabase Auth; session persists across page refreshes
- **Day tabs** — Switch between days of the selected week to track each driver's compliance
- **Vehicle Assigned toggle** — Yes/No switch per driver per day
- **Followed Plan toggle** — Yes/No switch per driver per day
- **Reason capture** — When a driver has "No", record why via a note dialog
- **Weekly attendance grid** — Checkbox matrix (driver × day) showing who worked each day, with a totals column
- **Weekly pie charts** — Visual breakdown of vehicle assignment and plan compliance across all worked days
- **Stats cards** — Total drivers, vehicle compliance %, plan compliance % for the selected week
- **Management summary** — Editable stakeholder notes, saved per week to the database
- **Add Driver** — Dialog to add new drivers; persisted instantly to Supabase
- **Week navigation** — Prev/next week arrows, "go to today" button, manual From/To date pickers, and a "jump to date" picker that auto-selects the week containing that date
- **Real-time sync** — Changes from any client appear instantly for all logged-in users via Supabase subscriptions

## How Weekly Stats Work

The pie charts and stats cards show **per-driver weekly compliance**, not per-day-entry counts.

For each driver:

1. If they have **zero worked days** checked in the attendance grid, they are **excluded** from the weekly stats entirely.
2. `Vehicle Assigned = Yes (week)` only if `vehicleAssigned === true` on **every day they worked**.
3. Same logic for `Followed Plan`.

This means: "10/12 (83.3%)" = 10 out of 12 drivers who worked that week were fully compliant on every single day they worked.

## Supabase Database Schema

**`drivers`** — `id` (int4 PK, auto-increment), `name` (text)

**`driver_days`** — `id` (int4 PK), `driver_id` (int4 FK → drivers.id), `date` (text, YYYY-MM-DD), `worked` (bool), `vehicle_assigned` (bool), `followed_plan` (bool), `vehicle_reason` (text), `plan_reason` (text)
- Unique constraint: `(driver_id, date)` — all writes use `.upsert(..., { onConflict: "driver_id,date" })`

**`summaries`** — `week_start` (text PK, YYYY-MM-DD), `text` (text)

All three tables require RLS policies that allow authenticated users to read and write.

## Data Model

```typescript
type Driver = {
  id: number;
  name: string;
  workedDays: { [date: string]: boolean };
  days: { [date: string]: DayEntry };
};

type DayEntry = {
  vehicleAssigned: boolean;
  followedPlan: boolean;
  vehicleReason: string;
  planReason: string;
};
```

## Project Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                        # Dynamic import of Dashboard (SSR: false)
├── components/
│   ├── ThemeRegistry.tsx               # MUI dark theme + Emotion SSR cache
│   ├── auth/
│   │   └── LoginPage.tsx               # Email/password login UI
│   └── dashboard/
│       ├── Dashboard.tsx               # Auth guard + top-level composition
│       ├── DashboardHeader.tsx         # Title, week navigation, logout
│       ├── DashboardDailySection.tsx   # Day tabs, Add Driver button
│       ├── DriverTable.tsx             # Per-driver compliance toggles + reason dialog
│       ├── WeeklyAttendance.tsx        # Driver × day attendance checkbox grid
│       ├── StatsBar.tsx                # Weekly summary stat cards
│       ├── PieChartCard.tsx            # Recharts pie chart in MUI Card
│       ├── ManagementSummary.tsx       # Editable weekly notes
│       └── AddDriverDialog.tsx         # Add new driver dialog
├── hooks/
│   └── useDashboardData.ts             # All state, Supabase calls, real-time subscriptions
├── lib/
│   ├── dateUtils.ts                    # Week range logic, date formatting, week shift helpers
│   └── supabase.ts                     # Supabase client singleton
└── types/
    └── index.ts                        # Driver, DayEntry types + emptyDay() factory
```

## Module Responsibilities

| Module | Purpose |
|--------|---------|
| `hooks/useDashboardData.ts` | All state, Supabase UPSERT/SELECT, real-time subscriptions, weekly compliance calculations |
| `components/dashboard/Dashboard.tsx` | Session check, loading states, wires hook data to child components |
| `components/dashboard/DashboardHeader.tsx` | Title, prev/next week buttons, today button, date pickers, jump-to-date, logout |
| `components/dashboard/DashboardDailySection.tsx` | Day tab switcher, Add Driver button, renders DriverTable |
| `components/dashboard/DriverTable.tsx` | Per-driver daily compliance toggles and reason note dialog |
| `components/dashboard/WeeklyAttendance.tsx` | Attendance checkbox matrix (driver × day) with totals column |
| `components/dashboard/StatsBar.tsx` | Weekly summary stat cards (total, vehicle %, plan %) |
| `components/dashboard/PieChartCard.tsx` | Recharts pie chart wrapped in MUI Card |
| `components/dashboard/ManagementSummary.tsx` | Editable weekly notes with edit and view modes |
| `components/dashboard/AddDriverDialog.tsx` | MUI Dialog to add a new driver |
| `components/ThemeRegistry.tsx` | Linear-inspired dark theme (single indigo accent, near-black bg) + Emotion cache for Next.js App Router |
| `components/auth/LoginPage.tsx` | Supabase email/password login form |
| `lib/dateUtils.ts` | Week range logic (Monday–Sunday), date formatting, shift/jump helpers |
| `lib/supabase.ts` | Supabase client (reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) |
| `types/index.ts` | `Driver`, `DayEntry` types and `emptyDay()` factory function |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project with the schema above and RLS enabled for authenticated users

### Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with a Supabase Auth user.

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Deploy (Vercel)

- Framework preset: **Next.js**
- Root directory: leave default (repository root)
- Build command: `npm run build` (default)
- Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- After deploying, add your Vercel URL to **Supabase → Authentication → URL Configuration → Site URL**

## Creating Users

Users are managed in **Supabase → Authentication → Users → Add user**. There is no self-signup flow — all accounts are created by an admin.

## Limitations

- No automated tests
- No role-based access control — all authenticated users have full read/write access
