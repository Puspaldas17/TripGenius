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

1. Clone the repo
   - On the GitHub page of this repository, click the green “Code” button and copy the HTTPS URL.
   - In your terminal, run git clone and paste the URL you copied, then press Enter.
2. Open in VS Code
   - In the terminal: cd into the cloned folder (it matches the repository name)
   - Launch VS Code in that folder:
     - macOS/Linux: `code .`
     - Windows: `code .`
3. Install dependencies (pnpm)
   - If pnpm isn’t active yet:
     - `corepack enable`
     - `corepack prepare pnpm@latest --activate`
   - Install:
     - `pnpm install`
4. Start the dev server
   - `pnpm dev`
   - Open the preview when prompted (or use your environment’s preview button)
5. (Optional) Production build and serve
   - `pnpm build`
   - `pnpm start`

Notes:

- API routes are under `/api`. Weather will work without a key but improves with `OPENWEATHER_API_KEY` set in your environment.
- Avoid committing secrets; set them in your hosting platform’s environment settings.

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
