# TripGenius — AI Travel Planner

Plan smarter, travel better. TripGenius creates personalized, day‑by‑day itineraries with real‑time weather, travel options, nearby places, budgeting, and a drag‑and‑drop calendar.

## What

An end‑to‑end travel planning app:

- AI itinerary generation by mood and budget
- Weather preview per day
- Nearby places from open data
- Transport options with quick links (flight/train/bus/car/waterway)
- Budget suggestions (per person/day totals)
- Group collaboration (shareable trip code)
- Drag‑and‑drop calendar with times per activity
- Hotel and flight searches, currency conversion

## Why

Travel planning is fragmented across many tabs. TripGenius unifies discovery, logistics, costs, and collaboration into one workflow so you can go from idea to actionable plan in minutes.

## How (Architecture)

- Frontend: React + Vite + Tailwind (component library based on Radix UI)
- Backend: Express (Node.js) with REST endpoints under /api
- Data: Open APIs (weather, geocoding, places), mock search endpoints for demo
- Build: Client and server built separately; server serves compiled output

## When

Built as a modern starter you can customize for quick MVPs or production apps. Extend routes, UI, and data sources as needed.

---

## Clone from GitHub and run in VS Code

Prerequisites:

- Node.js 18+ (recommended 20+)
- pnpm (preferred)
- VS Code with extensions: “ESLint” and “Tailwind CSS IntelliSense” (optional)

Steps:

1) Clone the repo
   - Copy the HTTPS URL of the repository (example):
     - `https://github.com/Puspaldas17/TripGenius.git`
   - In a terminal:
     - `git clone https://github.com/Puspaldas17/TripGenius.git`
     - `cd TripGenius`
2) Open in VS Code
   - `code .` (or open the folder via File → Open Folder…)
3) Install dependencies (pnpm)
   - If pnpm isn’t active yet:
     - `corepack enable`
     - `corepack prepare pnpm@latest --activate`
   - Install deps:
     - `pnpm install`

Run options (choose one):

A) Quick Dev (frontend live preview)
- Start Vite dev server (hot reload):
  - `pnpm dev`
- This serves the frontend; API features may be limited locally unless a backend is available.

B) Full Backend (recommended for all features)
- Build client and server, then run the Node server:
  - `pnpm build`
  - `pnpm start`
- This serves the compiled SPA and the Express API under `/api`.

Ports & URLs:
- Dev (A): Vite prints the local URL (commonly http://localhost:5173)
- Full (B): Server prints http://localhost:3000 and API at http://localhost:3000/api

Environment variables (optional but recommended):
- `OPENWEATHER_API_KEY` — improves weather accuracy. Set it in your shell before running:
  - macOS/Linux: `export OPENWEATHER_API_KEY=your_key`
  - Windows (PowerShell): `$env:OPENWEATHER_API_KEY="your_key"`

Troubleshooting:
- If API calls fail in Quick Dev, use Full Backend mode (`pnpm build && pnpm start`).
- If ports are in use, stop other processes or change PORT before `pnpm start` (e.g., `PORT=4000 pnpm start`).
- Do not commit secrets; use host environment settings for deployments (Netlify/Vercel via MCP).
}
```}```}

Scripts:

- `pnpm dev` — Vite dev server
- `pnpm build` — builds client and server
- `pnpm start` — runs the built server
- `pnpm test` — runs unit tests (vitest)
- `pnpm typecheck` — TypeScript checks

Environment:

- API routes under `/api` (weather, travel options, places, etc.)
- Secrets can be set via env vars; avoid committing them. In hosted environments, configure environment variables in the platform settings.

## Deploy

Use your preferred platform:

- Netlify or Vercel are ideal. In Builder.io, you can connect deployments via MCP.
  - To connect: Open MCP popover and connect Netlify or Vercel.

## Customization

- Edit `client/pages/Planner.tsx` to adjust the planning experience
- Update styles in `client/global.css` and Tailwind config
- Add/modify API routes in `server/routes/`

## License

MIT
