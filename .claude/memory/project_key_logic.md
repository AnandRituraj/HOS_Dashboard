---
name: HOS Dashboard key logic and patterns
description: Important implementation details, mutation patterns, and real-time sync behavior
type: project
---

## Mutation pattern (all toggles/updates)
1. Optimistic local state update via `setDrivers`
2. Call `upsertDay(driverId, date, patch)` which merges patch with existing state and does `.upsert(..., { onConflict: "driver_id,date" })`
3. Real-time subscription confirms/syncs the change

Toggling a compliance field to `true` clears the associated reason field (vehicleReason / planReason).

## Real-time channels (3, set up on mount)
- `realtime_driver_days` — all events on driver_days table
- `realtime_drivers` — INSERT only on drivers table
- `realtime_summaries` — all events on summaries (filtered to current week_start in handler)

## Data loading
- Single useEffect keyed on `refreshKey` (int, bumped by handleReset)
- Loads all drivers + all driver_days in parallel
- `rowsToDrivers()` converts flat DB rows → nested Driver[] shape

## handleReset
Deletes ALL driver_days and ALL summaries (not week-scoped), resets week to current Monday, bumps refreshKey to trigger reload.

## Week state
- Not persisted anywhere — always resets to current Monday on page load
- selectedDayIdx defaults to today's index within the week

## Auth
- Supabase email/password only
- Dashboard.tsx checks session on mount, shows LoginPage if not authenticated
- Logout via supabase.auth.signOut() in DashboardHeader
