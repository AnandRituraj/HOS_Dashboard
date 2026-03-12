# HOS Dashboard

Weekly driver HOS compliance dashboard built with Next.js, React, Material UI, and Recharts.

The app is fully client-side. It tracks which drivers worked on each day of a selected week, whether they had a vehicle assigned, whether they followed the plan, and any reasons for non-compliance. All data is persisted in the browser with `localStorage`.

## Current Features

- Weekly date range selector with day tabs
- Daily driver compliance tracking
- Weekly attendance grid
- Weekly compliance rollups and pie charts
- Management summary notes
- Per-driver reason capture for failed checks
- Add driver dialog
- Reset to seeded driver list
- Persistent browser storage with no backend

## Tech Stack

- Next.js 16 App Router
- React 19
- Material UI 7
- Recharts 3
- TypeScript

## How The App Works

### Data Model

Each driver is defined in `src/data/drivers.ts` with:

- `id`
- `name`
- `workedDays[date]`: whether the driver worked on that date
- `days[date]`: compliance details for that date

Each daily compliance entry contains:

- `vehicleAssigned`
- `followedPlan`
- `vehicleReason`
- `planReason`

The seeded driver roster currently comes from a hardcoded name list in `src/data/drivers.ts`. The top-level `Driver List.csv` appears to be a reference file only and is not loaded by the application at runtime.

### State And Persistence

The main state logic lives in `src/hooks/useDashboardData.ts`.

- Driver data is stored in `localStorage` under `hos-dashboard-drivers`
- Management summary text is stored in `localStorage` under `hos-dashboard-summary`
- The selected week defaults to the current Monday through Sunday
- The selected day defaults to today when it falls inside the default week

### Compliance Calculation

Weekly rollups only count drivers who worked at least one day in the selected date range.

- `Vehicle Assigned = Yes` only if the driver had `vehicleAssigned === true` on every worked day in the selected week
- `Followed Plan = Yes` only if the driver had `followedPlan === true` on every worked day in the selected week

This means the stats and pie charts are weekly all-or-nothing rollups per worked driver, not per-day totals.

## UI Structure

The home page dynamically loads the dashboard client-side because the app depends on browser storage.

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

### Component Responsibilities

- `src/app/page.tsx`: dynamically imports the dashboard with `ssr: false`
- `src/components/Dashboard.tsx`: assembles the full screen
- `src/components/DashboardHeader.tsx`: week picker and title
- `src/components/StatsBar.tsx`: weekly summary cards
- `src/components/PieChartCard.tsx`: chart cards for weekly yes/no rollups
- `src/components/ManagementSummary.tsx`: editable management notes
- `src/components/DashboardDailySection.tsx`: day tabs and daily tracking controls
- `src/components/DriverTable.tsx`: per-driver daily compliance editing and reason dialog
- `src/components/WeeklyAttendance.tsx`: attendance matrix for the selected week
- `src/components/AddDriverDialog.tsx`: add-driver modal

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
npm start
```

## Notes And Limitations

- There is no backend, authentication, or shared persistence
- Data is scoped to the current browser profile via `localStorage`
- The selected date range is user-editable and is not restricted to exact Monday-Sunday weeks
- There are currently no automated tests in the repository

## Deployment

This project can be deployed as a standard Next.js app on Vercel or any platform that supports Next.js. Since the dashboard relies on browser storage and does not use server APIs, deployment is straightforward.

## License

For internal/demo use.
