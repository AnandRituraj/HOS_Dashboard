# HOS Dashboard

Driver compliance dashboard built with Next.js, Material UI, and Recharts. Frontend-only -- no backend or database.

Track driver attendance and daily compliance throughout the week, then present weekly stakeholder rollups with pie charts and summary stats.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **React 19**
- **Material UI 7** (`@mui/material`, `@mui/icons-material`, Emotion)
- **Recharts 3** (pie charts)
- **Dark mode** theme

## Features

- **Day tabs** -- Switch between days of the week to track each driver's compliance for that day
- **Vehicle Assigned toggle** -- Yes/No per driver per day
- **Followed Plan toggle** -- Yes/No per driver per day
- **Reason capture** -- When a driver has "No", click the note icon to record why
- **Weekly attendance grid** -- Checkbox matrix (driver x day) to mark who worked each day, with a total column
- **Weekly pie charts** -- Per-driver rollup showing how many drivers were fully compliant across all their worked days
- **Stats cards** -- Total drivers, vehicle assigned compliance %, followed plan compliance %
- **Management summary** -- Type bullet points for stakeholders, save to preview, click to edit again
- **Add Driver** -- Dialog to add new drivers on the fly
- **Reset** -- Clears all saved data and restores the seeded driver list
- **Data persistence** -- All data saved to `localStorage`, survives page refreshes
- **Responsive layout** -- Charts stack on mobile, sit side-by-side on desktop

## How Weekly Stats Work

The pie charts and stats cards show **per-driver weekly compliance**, not per-day-entry counts.

For each driver:

1. If they have **zero worked days** checked in the attendance grid, they are **excluded** from the weekly stats entirely.
2. If they worked, `Vehicle Assigned = Yes (week)` only if `vehicleAssigned === true` on **every day they worked**.
3. Same logic for `Followed Plan`.

This means: "10/12 (83.3%)" = 10 out of 12 drivers who worked that week had vehicle assigned on every single day they worked.

## Data Model

Defined in `src/data/drivers.ts`:

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

The seeded roster (14 drivers) is defined in `driverNames` in the same file.

## Persistence

Browser `localStorage` keys:

| Key | Contents |
|-----|----------|
| `hos-dashboard-drivers` | Driver list, attendance, daily compliance, reasons |
| `hos-dashboard-summary` | Management summary text |

- Data persists across page refreshes on the same browser.
- Data does **not** sync across different devices or browsers.
- The selected week always defaults to the current Monday-Sunday on page load (not saved).

## Project Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AddDriverDialog.tsx
│   ├── Dashboard.tsx
│   ├── DashboardDailySection.tsx
│   ├── DashboardHeader.tsx
│   ├── DriverTable.tsx
│   ├── ManagementSummary.tsx
│   ├── PieChartCard.tsx
│   ├── StatsBar.tsx
│   ├── ThemeRegistry.tsx
│   └── WeeklyAttendance.tsx
├── data/
│   └── drivers.ts
├── hooks/
│   └── useDashboardData.ts
└── lib/
    ├── constants.ts
    └── dateUtils.ts
```

### Module Responsibilities

| Module | Purpose |
|--------|---------|
| `hooks/useDashboardData.ts` | All state, event handlers, localStorage persistence, weekly compliance calculations |
| `components/Dashboard.tsx` | Top-level composition -- wires hook data to child components |
| `components/DashboardHeader.tsx` | Title, subtitle, week date range picker |
| `components/DashboardDailySection.tsx` | Day tabs, Reset/Add Driver buttons, renders DriverTable |
| `components/DriverTable.tsx` | Per-driver daily compliance toggles and reason dialog |
| `components/WeeklyAttendance.tsx` | Attendance checkbox matrix (driver x day) with totals |
| `components/StatsBar.tsx` | Weekly summary stat cards |
| `components/PieChartCard.tsx` | Recharts pie chart in MUI Card |
| `components/ManagementSummary.tsx` | Editable summary with save/edit/preview workflow |
| `components/AddDriverDialog.tsx` | MUI Dialog to add a new driver |
| `components/ThemeRegistry.tsx` | MUI dark theme + Emotion cache for Next.js App Router |
| `lib/dateUtils.ts` | Date helpers (local date formatting, week calculation, day labels) |
| `lib/constants.ts` | localStorage key constants |
| `data/drivers.ts` | Driver/DayEntry types, seeded driver names, `emptyDay()` factory |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Update Driver Names

Edit the `driverNames` array in `src/data/drivers.ts`, then click **Reset** in the dashboard to clear old `localStorage` data and load the updated roster.

## Deploy (Vercel)

- Framework preset: **Next.js**
- Root directory: leave default (repository root)
- Build command: `npm run build` (default)
- Install command: `npm install` (default)

No backend configuration needed.

## Push to GitHub

```bash
git add .
git commit -m "update hos dashboard"
git push origin master
```

## Limitations

- No backend, authentication, or database
- No cross-device data sync (`localStorage` only)
- No automated tests
