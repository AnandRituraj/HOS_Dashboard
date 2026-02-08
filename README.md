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
- **Pie Charts** — Two side-by-side pie charts showing the percentage breakdown for each criteria
- **Stats Bar** — Quick-glance summary cards showing total drivers and compliance rates
- **Add Driver** — Click "Add Driver" to add new drivers on the fly via a dialog form
- **Responsive Layout** — Stacks vertically on mobile, side-by-side on desktop

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with MUI ThemeProvider
│   ├── page.tsx            # Main dashboard page (client component)
│   └── globals.css         # Minimal global styles
├── components/
│   ├── ThemeRegistry.tsx   # MUI + Emotion provider for Next.js App Router
│   ├── DriverTable.tsx     # MUI Table with Switch toggles and Chip indicators
│   ├── PieChartCard.tsx    # MUI Card wrapping a Recharts PieChart
│   └── StatsBar.tsx        # Summary stat cards (Total Drivers, % Compliant)
└── data/
    └── drivers.ts          # Sample driver data and TypeScript types
```

---

## How It Works

1. **Data** — A hardcoded array of driver objects is defined in `src/data/drivers.ts`. Each driver has an `id`, `name`, `vehicleAssigned` (boolean), and `followedPlan` (boolean).

2. **State** — The main page (`src/app/page.tsx`) loads this data into React `useState`. All components read from and write to this single state.

3. **Toggling** — When you click a switch in the table, the corresponding driver's boolean field flips. Since the pie charts and stats bar derive their values from the same state array, they re-render automatically with updated percentages.

4. **Adding Drivers** — The "Add Driver" button opens a MUI Dialog. Enter a name and click "Add" — the new driver is appended with both criteria defaulting to "No".

5. **Charts** — Each `PieChartCard` receives a `yesCount` and `noCount`, computes percentages, and renders a Recharts `PieChart` with green (Yes) and red (No) segments. Labels show the percentage inside each slice.

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
  { id: 1, name: "Your Driver", vehicleAssigned: true, followedPlan: false },
  // Add or remove drivers as needed
];
```

The app will pick up changes immediately on the next page load.

---

## License

This project is for demonstration purposes.
