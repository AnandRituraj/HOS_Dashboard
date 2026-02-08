# HOS Dashboard

A simple, interactive driver compliance dashboard built with **Next.js** and **Material UI**. Track whether drivers have been assigned a vehicle while driving and whether they followed the plan — with real-time pie chart visualizations.

No backend or database required. All data lives in the browser.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | React framework with server-side rendering |
| [Material UI (MUI) v7](https://mui.com/) | Component library for styling and layout |
| [Recharts](https://recharts.org/) | Lightweight charting library for pie charts |
| TypeScript | Type safety across all components |

---

## Features

- **Driver Table** — View all drivers with two Yes/No criteria per driver
  - *Vehicle Assigned While Driving* — toggle on/off
  - *Followed the Plan* — toggle on/off
- **Interactive Toggles** — Click any switch to flip a driver's status; charts update instantly
- **Include/Exclude Drivers** — Checkbox per driver to include or exclude them from stats and charts; excluded drivers move to the bottom of the table
- **Reason Tracking** — When a driver has "No" for either criteria, click the note icon to add a reason why (e.g., "Route was changed last minute")
- **Pie Charts** — Two side-by-side pie charts showing the percentage breakdown for each criteria (only counts included drivers)
- **Stats Bar** — Quick-glance summary cards showing counted drivers and compliance rates
- **Add Driver** — Click "Add Driver" to add new drivers on the fly via a dialog form
- **Data Persistence** — All changes are saved to `localStorage` and survive page refreshes
- **Reset Button** — Click "Reset" to clear all saved data and restore the original driver list
- **Dark Mode** — Full dark theme UI
- **Responsive Layout** — Stacks vertically on mobile, side-by-side on desktop

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with MUI ThemeProvider
│   ├── page.tsx            # Entry point, dynamically loads Dashboard (no SSR)
│   └── globals.css         # Minimal global styles (dark mode)
├── components/
│   ├── ThemeRegistry.tsx   # MUI + Emotion cache provider for Next.js App Router
│   ├── Dashboard.tsx       # Main dashboard with state, localStorage, and all logic
│   ├── DriverTable.tsx     # MUI Table with toggles, checkboxes, and reason dialogs
│   ├── PieChartCard.tsx    # MUI Card wrapping a Recharts PieChart
│   └── StatsBar.tsx        # Summary stat cards (Counted Drivers, % Compliant)
└── data/
    └── drivers.ts          # Default driver list and TypeScript types
```

---

## How It Works

1. **Data** — A default array of driver objects is defined in `src/data/drivers.ts`. Each driver has an `id`, `name`, `vehicleAssigned`, `followedPlan`, `included` (whether to count them), `vehicleReason`, and `planReason`.

2. **Persistence** — On first load, the app checks `localStorage` for saved data. If found, it uses that; otherwise it falls back to the default driver list. Every change auto-saves to `localStorage`, so data survives page refreshes.

3. **Toggling** — When you click a switch in the table, the corresponding driver's boolean field flips. The pie charts and stats bar only count drivers with the "Count" checkbox enabled, and re-render automatically.

4. **Include/Exclude** — Each driver has a checkbox in the "Count" column. Unchecking it excludes that driver from all stats and charts, and moves them to the bottom of the table (visually faded).

5. **Reasons** — When a driver has "No" for either criteria, a note icon appears. Click it to open a dialog and record why (e.g., "Vehicle was in maintenance"). The reason is shown on hover. Reasons auto-clear when toggled back to "Yes".

6. **Adding Drivers** — The "Add Driver" button opens a MUI Dialog. Enter a name and click "Add" — the new driver is appended with both criteria defaulting to "No".

7. **Reset** — The "Reset" button clears `localStorage` and restores the original default driver list.

8. **Charts** — Each `PieChartCard` receives a `yesCount` and `noCount` (from included drivers only), computes percentages, and renders a Recharts `PieChart` with green (Yes) and red (No) segments.

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later (v20+ recommended)
- **npm** v9 or later

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page will auto-refresh as you edit files.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm start
```

Serves the production build on [http://localhost:3000](http://localhost:3000).

### Lint

```bash
npm run lint
```

Runs ESLint across the project.

---

## Pushing to GitHub

### First Time Setup

```bash
# Initialize git (skip if already a repo)
git init

# Add all files
git add .

# Create the first commit
git commit -m "Initial commit: HOS Dashboard"

# Create a new repo on GitHub (via github.com or GitHub CLI)
# Then link it:
git remote add origin https://github.com/YOUR_USERNAME/HOS_Dashboard.git

# Push to GitHub
git branch -M master
git push -u origin master
```

### Subsequent Pushes

```bash
git add .
git commit -m "Your commit message"
git push
```

### Using GitHub CLI (alternative)

If you have the [GitHub CLI](https://cli.github.com/) installed:

```bash
# Create repo and push in one go
gh repo create HOS_Dashboard --public --source=. --remote=origin --push
```

---

## Deployment

### Vercel (Recommended)

The easiest way to deploy a Next.js app is via [Vercel](https://vercel.com/):

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Your dashboard will be live at a `.vercel.app` URL within seconds

No configuration needed. Vercel handles builds, CDN, and HTTPS automatically.

### Other Platforms

Since this is a static/client-side app (no API routes or server-side data fetching), you can also export it as static HTML:

1. Add `output: 'export'` to `next.config.ts`:

```typescript
const nextConfig = {
  output: 'export',
};
export default nextConfig;
```

2. Run `npm run build` — this generates a static `out/` directory
3. Deploy the `out/` folder to any static hosting service:
   - **Netlify** — drag and drop the `out/` folder
   - **GitHub Pages** — push `out/` contents to `gh-pages` branch
   - **AWS S3 + CloudFront** — upload `out/` to an S3 bucket

---

## Customizing Driver Data

To change the default driver list, edit `src/data/drivers.ts`:

```typescript
export const initialDrivers: Driver[] = [
  { id: 1, name: "Your Driver", vehicleAssigned: false, followedPlan: false, included: true, vehicleReason: "", planReason: "" },
  // Add or remove drivers as needed
];
```

After editing, click the **Reset** button in the dashboard (or clear localStorage) to load the new defaults.

---

## License

This project is for demonstration purposes.
