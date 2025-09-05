<div align="center">

<img src="public/placeholder.svg" alt="TripGenius Logo" width="96" height="96" />

# TripGenius

AI‑powered Trip Planner • Plan smarter, travel better ✈️🗺️

[![build](https://img.shields.io/badge/build-Vite%20%2B%20Express-blue)](#) [![license](https://img.shields.io/badge/license-MIT-green)](#license) [![stack](https://img.shields.io/badge/stack-React%20%7C%20Tailwind%20%7C%20Node.js%20%7C%20Express%20%7C%20Vite-9cf)](#tech-stack)

</div>

---

## Description

TripGenius helps you go from idea to itinerary in minutes. Enter your trip details and generate a personalized, day‑by‑day plan with weather previews, interactive maps, transport options, budgeting, nearby places, and a drag‑and‑drop calendar. Built for individuals and groups, optimized for mobile, tablet, and desktop.

---

## Features

- 🌦 Weather Forecast — daily outlook with min/max temps and summaries
- 🗺 Interactive Map Overview — quick map preview of your route and places
- 📅 Drag‑and‑Drop Calendar — arrange activities with editable times per day
- 💰 Budget Overview — per‑day/per‑person breakdown with auto‑adjustments
- 👥 Group Collaboration — shareable trip code and collaborative planning
- ✈️/🚆/🛣 Transport Search — flights, trains, road, and waterways estimates
- 🏨 Hotel Search — sample hotel results with pricing and ratings
- 💱 Currency Converter — convert between currencies with live rates/fallbacks
- 🔒 Authentication — prepared endpoints for future auth (JWT‑ready)

---

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Radix UI, Lucide Icons
- Backend: Node.js, Express (REST under `/api`), serverless‑ready (Netlify)
- Utilities: TypeScript, Zod, date‑fns
- Tooling: Vitest, Prettier, ESLint

---

## Project Structure (Brief)

```
.
├── client/
│  ├── App.tsx                # App shell: routes, providers, layout (Navbar/Footer)
│  ├── pages/                 # Route pages (Planner, Dashboard, Index, Auth)
│  ├── components/
│  │  ├── site/               # App chrome: Navbar, Footer
│  │  └── ui/                 # Reusable UI primitives (Card, Button, Tabs, ...)
│  ├── hooks/                 # Custom hooks (use-toast, use-mobile)
│  ├── lib/                   # Utils & helpers
│  ├── global.css             # Tailwind base + theme styles
│  └── index.html             # Vite entry
├── server/
│  ├── index.ts               # Express app factory; mounts all /api routes
│  ├── routes/                # API endpoints (ai, weather, travel, currency, ...)
│  ├── middleware/            # Auth middleware (JWT)
│  ├── utils/                 # HTTP fetch retry, JWT, logger
│  └── node-build.ts          # Production server entry (Vite server build)
├── shared/
│  └── api.ts                 # Types shared between client and server
├── netlify/
│  └── functions/api.ts       # Serverless handler wrapper
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind setup & custom breakpoints
├── vite.config*.ts           # Vite client/server build configs
├── package.json              # Scripts & deps (pnpm)
└── readme.md                 # Documentation
```

## Project Structure (Detailed)

- client/
  - App.tsx
    - Provides QueryClient, Tooltip/Toaster providers, Router, and layout.
    - Routes: "/" → Index, "/planner" → Planner, "/dashboard" → Dashboard, "/login", "/signup", catch-all → NotFound.
  - pages/
    - Planner.tsx: AI itinerary, weather, nearby places, route & modes, transport options, plan & calendar, budget, hotels, currency. Uses safeFetch and ensureServer to call /api.
    - Dashboard.tsx: Quick Actions, Insights, Upcoming Weather, Notifications, Saved Plans (search, pagination, per-plan delete/open), Recent Activity.
      - Saved plans stored in localStorage (tg*saved_trips) and optionally enriched from /api/trips (when authenticated). Full plan payloads stored as tg_trip*<id>.
      - Open plan sets tg*open_trip and navigates to Planner; Planner hydrates state from tg_trip*<id>.
    - Index.tsx, Login.tsx, Signup.tsx, NotFound.tsx, Placeholder.tsx: basic pages.
  - components/
    - site/Navbar.tsx: Top nav (Home, Planner, Dashboard), theme toggle, auth links, mobile nav.
    - site/Footer.tsx: Footer links and meta.
    - ui/\*: Shadcn-like UI primitives (button, card, tabs, select, input, badge, skeleton, pagination, etc.).
  - hooks/: use-toast, use-mobile.
  - lib/utils.ts: classNames helper (cn) and utilities.
  - global.css: Tailwind layers and theme variables.

- server/
  - index.ts: Creates Express app, health/ping, mounts /api routes, global error handler.
  - routes/
    - ai.ts: POST /api/ai/itinerary (mocked AI generator).
    - weather.ts: GET /api/weather (OpenWeather geocoding + forecast; hourly + alerts; cached fallback).
    - travel.ts: GET /api/travel/options (Nominatim geocode + haversine to estimate km/time/prices).
    - currency.ts: GET /api/currency/convert (exchangerate.host).
    - geocode.ts: GET /api/geocode/reverse and /api/geocode/search.
    - places.ts: GET /api/places (nearby places via Wikipedia).
    - search.ts: GET /api/search/{flights,hotels} (demo data with rating/reviews).
    - trips.ts: GET/POST /api/trips (auth‑protected, in‑memory store) for saved trips.
    - auth.ts: POST /api/auth/{signup,login} (JWT issue/verify).
  - middleware/auth.ts: Bearer JWT validation.
  - utils/http.ts: fetchJsonWithRetry with timeouts; logger.ts, jwt.ts helpers.
  - node-build.ts: Production entry serving SPA + API.

- shared/
  - api.ts: TypeScript interfaces shared across client/server (Itinerary, Weather, TravelOptions, etc.).

- netlify/
  - functions/api.ts & netlify.toml: Serverless adapter for Express under /.netlify/functions/api.

- public/
  - Static assets (favicon, robots.txt, placeholder.svg).

## How things connect

- client/App.tsx registers routes that render pages from client/pages/\* and wraps them with Navbar/Footer.
- client/pages/Planner.tsx calls backend endpoints under /api (or /.netlify/functions/api) using ensureServer, then renders UI via components/ui/\*.
- client/pages/Dashboard.tsx reads from localStorage and, when logged in, fetches /api/trips. Opening a saved plan sets tg*open_trip; Planner loads tg_trip*<id> to hydrate itinerary/calendar/origin/dates/etc.
- server/index.ts mounts all routes under /api; each server/routes/\*.ts file implements one feature area.
- shared/api.ts shares the TypeScript types used by both sides.

Naming & labels

- Filenames are kebab/pascal case per convention (e.g., Planner.tsx, Navbar.tsx).
- UI components are collocated under components/ui with clear, reusable names.
- API routes are grouped by domain in server/routes (weather, travel, currency, trips, etc.).

## Installation Guide

Prerequisites:

- Node.js 18+ (20+ recommended)
- pnpm (preferred; repo declares `packageManager`)

Clone and install:

```bash
# Clone
git clone https://github.com/Puspaldas17/TripGenius.git
cd TripGenius

# Install deps
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```

Environment variables (optional but recommended):

```bash
# Improve weather accuracy
# macOS/Linux
export OPENWEATHER_API_KEY=YOUR_KEY
# Windows (PowerShell)
$env:OPENWEATHER_API_KEY="YOUR_KEY"
```

Run locally (choose one):

```bash
# A) Quick Dev (frontend HMR)
pnpm dev
# → Opens Vite dev server (API may be limited unless backend is available)

# B) Full Backend (recommended for all features)
pnpm build
pnpm start
# → Serves SPA + Express API under /api (default http://localhost:3000)
```

Common scripts:

```bash
pnpm test       # run unit tests (vitest)
pnpm typecheck  # TypeScript checks
```

Ports & URLs:

- Dev: Vite prints a local URL (commonly http://localhost:5173)
- Full: Server prints http://localhost:3000 and API at http://localhost:3000/api

---

## Usage

1. Open the app and go to the Planner.
2. Enter Origin, Destination, Trip Type, Dates (or Length), Budget, Members, and Mood.
3. Click “Generate Itinerary”.
4. Review the Weather Preview, Nearby Places, and Transport Options.
5. Use the Plan & Calendar to drag‑and‑drop and set times for activities.
6. Check Budget Overview and convert currencies as needed.

Tip: The map preview uses your selected origin/destination to render a quick route.

---

## API Integrations

- OpenWeatherMap — geocoding + 5‑day forecast (uses `OPENWEATHER_API_KEY` when set)
- OpenStreetMap Nominatim — forward/reverse geocoding for places and routing
- Wikipedia Geosearch — nearby places of interest
- exchangerate.host — currency conversion with fallback rates
- Flight/Hotel Search — demo endpoints for sample results

Server routes are under `server/routes/` and mounted at `/api` by `server/index.ts`.

---

## Responsive Design

Optimized for mobile → desktop using Tailwind CSS. Custom breakpoints:

```ts
// tailwind.config.ts
screens: {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  "2xl": "1400px",
}
```

Core responsive pages/components:

- Planner UI: `client/pages/Planner.tsx`
- Landing/Home: `client/pages/Index.tsx`
- Navbar + Theme: `client/components/site/Navbar.tsx`

---

## Error Handling & Debugging

TripGenius is designed to be resilient so one failing feature doesn’t block others:

- Safe network layer: all fetches use retry‑capable utilities with timeouts
- Backend probe: API calls are gated behind a server health check when needed
- Graceful fallbacks: cached/empty data returned on provider errors
- Structured logging: server logs errors and avoids noisy console spam in UI
- Background tasks: data fetches are deferred until user action/confirmed server

Relevant files: `server/utils/http.ts`, `server/utils/logger.ts`, `server/index.ts`.

---

## Contributing

Contributions are welcome!

1. Fork the repo and create a feature branch
2. `pnpm install`
3. `pnpm dev` to run locally
4. Commit with clear messages; open a PR describing your change

Code style: TypeScript, Prettier, ESLint, and Tailwind conventions. Prefer small, composable components (see `client/components/ui/` and `client/components/site/`).

---

## License

MIT — see the [LICENSE](https://opensource.org/licenses/MIT) terms.

---

## Contact / Author

- Author: Puspal Das
- GitHub: https://github.com/Puspaldas17
- Portfolio: https://github.com/Puspaldas17?tab=repositories

---

## Deployment

Deploy with your preferred platform. In Builder.io you can connect via MCP:

- Netlify: [Connect Netlify MCP](#open-mcp-popover) — serverless function at `/.netlify/functions/api`
- Vercel: [Connect Vercel MCP](#open-mcp-popover)

Note: Netlify builds from source; local `pnpm build` is optional for CI.
