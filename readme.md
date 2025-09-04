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
