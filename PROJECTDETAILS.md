<div align="center">

# 📋 TripGenius — Project Details

**A complete breakdown of every feature, page, component, and route in TripGenius.**

_30+ features across 13 pages._

</div>

---

## 🗺️ Pages & Routes

| Route                | Page                   | Access    | Description                                   |
| -------------------- | ---------------------- | --------- | --------------------------------------------- |
| `/`                  | Home / Landing         | Public    | Hero section, feature highlights, stats, CTA  |
| `/planner`           | Trip Planner           | Protected | Full AI trip planning workspace (tabbed)      |
| `/dashboard`         | Dashboard              | Protected | Trip overview, stats, weather, widgets        |
| `/profile`           | Profile                | Protected | User stats, badges, spending charts           |
| `/journal`           | Travel Journal         | Protected | Personal day-by-day travel diary with mood    |
| `/reviews`           | Trip Reviews           | Protected | Write and browse destination reviews          |
| `/group-trips`       | Group Trip Planner     | Protected | Collaborative planning with friends ★ NEW     |
| `/compare`           | Destination Comparison | Public    | Side-by-side comparison of destinations ★ NEW |
| `/emergency`         | Travel Safety Hub      | Protected | Emergency numbers, contacts, checklist ★ NEW  |
| `/trip/share/:token` | Shared Trip View       | Public    | Read-only shareable itinerary link            |
| `/login`             | Login                  | Public    | Email/password authentication                 |
| `/signup`            | Sign Up                | Public    | New account registration                      |
| `*`                  | 404 Not Found          | Public    | Animated not-found page                       |

---

## 🤖 AI Features

### 1. AI Itinerary Generator

- **Route:** `POST /api/ai/itinerary`
- **File:** `server/routes/ai.ts`, `client/pages/Planner.tsx`
- Accepts: destination, origin, days, budget, members, travel style/mood
- Returns structured day-by-day itinerary with activities, meals, and notes
- Results displayed in tabbed Planner UI with calendar integration

### 2. AI Chat Widget

- **File:** `client/components/AIChatWidget.tsx` — mounted globally in `App.tsx`
- Floating chat bubble available on **every page**
- Connected to `POST /api/ai/chat` with smart offline fallbacks
- Features: message history, typing indicator, quick-suggestion chips, minimize button
- Keyboard shortcut: `Ctrl + K` to open/close

### 3. AI Trip Score

- **File:** `client/components/TripScore.tsx`
- Analyzes any saved trip across **5 dimensions**: Day Balance, Budget, Group Fit, Adventure Mix, Culture Depth
- Awards a **grade: S / A / B / C / D** with animated reveal and improvement tips per dimension

### 4. Destination Discovery Quiz

- **File:** `client/components/DestinationDiscovery.tsx` — Dashboard
- 4-step quiz: Climate → Activity Type → Vibe → Budget Tier
- Matches answers to curated destination list; result card has a **"Plan →"** deep link to Planner

---

## 🌦️ Travel Information Features

### 5. Live Weather Forecast

- **Route:** `GET /api/weather?location=<city>`
- **File:** `server/routes/weather.ts`, displayed in `Planner.tsx`
- OpenWeatherMap API: temperature, humidity, wind, 5-day forecast
- Smart fallback data if API key is absent

### 6. Nearby Places of Interest

- **Route:** `GET /api/places?lat=<lat>&lon=<lon>`
- **File:** `server/routes/places.ts`
- Powered by Wikipedia Geosearch API — returns name, description, distance, thumbnail, Wikipedia link

### 7. Transport Options

- **Route:** `GET /api/travel/options`
- **File:** `server/routes/travel.ts`
- Calculates ✈️ Flight / 🚆 Train / 🚗 Car / 🚢 Ferry options with Haversine distance + pricing

### 8. Visa Requirements Lookup

- **Route:** `GET /api/visa`
- **File:** `server/routes/visa.ts`, `client/components/planner/VisaChecker.tsx`
- Displays visa requirements based on origin country in Planner's "Trip Prep" tab

### 9. Carbon Footprint Tracker

- **File:** `client/components/CarbonTracker.tsx`
- Calculates CO₂ emissions by transport mode (flight / train / bus / car) × distance
- Shows kg CO₂, impact level (🟢/🟡/🔴), savings vs. flying, and carbon offset options

---

## 💰 Budget Features

### 10. Budget Overview

- **File:** `client/pages/Planner.tsx` — Budget tab
- Per-day and per-person spending breakdown; auto-adjusts by group size and duration

### 11. Budget Forecast Chart

- **File:** `client/components/BudgetForecast.tsx` — Dashboard
- Recharts **area chart**: projected vs. planned cumulative spend
- Status badge: ✅ Under Budget / ⚠️ On Track / 🔴 Over Budget + 3 money-saving tips

### 12. Currency Converter

- **Route:** `GET /api/currency/convert`
- **File:** `server/routes/currency.ts`
- Frankfurter API (free, no key needed): 30+ currencies, live rates with smart fallback

---

## 📅 Scheduling & Calendar Features

### 13. Drag-and-Drop Trip Calendar

- **File:** `client/pages/Planner.tsx` — Plan & Calendar tab
- Visual day-by-day grid; drag activities between days, set times, add notes

### 14. Trip Timeline (Gantt View)

- **File:** `client/components/planner/TripTimeline.tsx`
- Vertical connected timeline with color-coded activity types (meal, sightseeing, transport, hotel, activity)

### 15. Google Calendar Export

- **Files:** `client/components/CalendarExport.tsx`, `client/lib/icalExport.ts`
- **"Add to Google Calendar"** — pre-fills all events
- **Download .ics** — RFC-5545 compliant for Apple Calendar, Outlook, etc.

### 16. Trip Countdown Timer

- **File:** `client/components/CountdownWidget.tsx` — Dashboard
- Live real-time: Days / Hours / Minutes / Seconds to next trip
- Shimmer gradient progress bar; auto-picks next upcoming trip from saved data

---

## 🔗 Social & Sharing Features

### 17. Trip Sharing (Public Links)

- **File:** `client/pages/SharedTrip.tsx` — Route: `/trip/share/:token`
- Generates a public URL; read-only beautifully styled view, no login required
- Download PDF (browser print) + Copy Link confirmation toast

### 18. Travel Journal

- **File:** `client/pages/TravelJournal.tsx` — Route: `/journal`
- Fields: date, location, mood (5 emoji), weather notes, free-form text
- Entries expandable/collapsible; persisted in `localStorage`

### 19. Trip Reviews

- **File:** `client/pages/TripReviews.tsx` — Route: `/reviews`
- ⭐ 1–5 star rating + title + review text + 10 curated tags + 👍 "Helpful" votes
- Cards sorted by newest; all data in `localStorage`

---

## 👥 Collaboration Features ★ NEW

### 20. Group Trip Planner

- **File:** `client/pages/GroupTrips.tsx` — Route: `/group-trips`
- **Member Management** — invite by name & email, view members, remove members, organizer badge (👑)
- **Proposal Voting** — submit trip proposals with title & description; thumbs up/down voting per member
- **Expense Splitting** — log expenses with payer, auto-split among all members, per-person totals, transaction history
- **Group Chat** — real-time message thread with timestamps
- All data persisted in `localStorage` with demo data pre-loaded

---

## ⚖️ Discovery & Research Features ★ NEW

### 21. Destination Comparison

- **File:** `client/pages/TripComparison.tsx` — Route: `/compare`
- Select up to **3 destinations** to compare side-by-side from 8 pre-loaded options: Paris, Tokyo, Bali, New York, Rome, Bangkok, Dubai, Sydney
- **Metrics per destination:** avg daily cost, temperature, flight time, visa, internet speed, language/cuisine
- **Score bars:** Safety, Food & Nightlife, Attractions (each /10)
- **Winner badges:** 💰 Best Budget, 🛡️ Safest, 🍜 Best Food, 📸 Top Sights
- **Winners summary panel** at the bottom + direct "Plan Trip →" button to Planner

---

## 🛡️ Safety Features ★ NEW

### 22. Travel Safety Hub

- **File:** `client/pages/EmergencyContacts.tsx` — Route: `/emergency`
- **Emergency Numbers** for **15 countries**: India, USA, UK, France, Japan, Australia, Germany, Thailand, Italy, Spain, Singapore, Canada, UAE, Brazil, New Zealand — police, ambulance, fire, tourist hotline
- **Country Search** — live filter by country name; click any country to see detail panel
- **Clickable `tel:` links** for all emergency numbers; direct dial on mobile
- **US State Dept advisory link** for each selected country
- **Personal Emergency Contacts** — save name, relation, phone, email; click-to-call button
- **Safety Score** — circular progress widget showing % of pre-trip checklist completed
- **Pre-Trip Safety Checklist** — 10 essential safety items (travel insurance, cloud copies, hospital, embassy, etc.); toggleable with live score update

---

## 👤 Profile & Gamification

### 23. User Profile Page

- **File:** `client/pages/Profile.tsx` — Route: `/profile`
- Tabbed: **My Trips** → **Badges** → **Analytics**
- Hero section with stats (trips, countries, days, avg budget)

### 24. Gamification Badges

- 6 achievement badges with conditions: 🔰 First Steps, 🌍 World Explorer, 💰 Budget Master, 🗺️ Adventurer, ✈️ Frequent Flyer, 🌍 Globe Trotter
- Progress bars for locked badges

### 25. Spending Analytics Charts

- **File:** `client/pages/Profile.tsx` — Analytics tab
- Recharts **Pie chart**: spending by category (Accommodation, Food, Transport, Activities)
- Recharts **Bar chart**: per-trip budget vs. actual spend

---

## 🔔 UX & Onboarding

### 26. Onboarding Wizard

- **File:** `client/components/OnboardingModal.tsx`
- 3-step animated modal on first login: Meet AI Planner → Features → Quick Start
- Framer Motion slide transitions; stored in `localStorage` (`tg_onboarded`)

### 27. Keyboard Shortcuts

- **File:** `client/hooks/useKeyboardShortcuts.ts`
- `Ctrl + K` — Open AI Chat &nbsp;|&nbsp; `Ctrl + N` — New Trip &nbsp;|&nbsp; `Ctrl + D` — Dashboard
- Safely disabled when typing in input fields

### 28. PWA (Progressive Web App)

- **Files:** `public/manifest.json`, `index.html`
- Installable to homescreen (mobile & desktop); app shortcuts in manifest
- Theme color matches Aurora Glass palette (`#bfffff`)

### 29. Dark / Light Mode

- **File:** `client/components/site/Navbar.tsx`
- Animated Sun/Moon toggle; saved to `localStorage`; respects system preference on first load

### 30. Internationalization (i18n)

- **File:** `client/lib/i18n.ts`
- `react-i18next` with English and Spanish translations for core UI elements

---

## 🔐 Authentication

### 31. JWT Authentication

- **Files:** `server/routes/auth.ts`, `server/middleware/auth.ts`, `client/contexts/AuthContext.tsx`
- `POST /api/auth/signup` + `POST /api/auth/login` → JWT returned
- `<ProtectedRoute>` wrapper in React Router; JWT in `localStorage` (`auth_token`)
- **Guest Mode** available to explore without registration

---

## 🏗️ Technical Architecture

### Frontend Architecture

- **State**: Zustand (`tripStore.ts`) for global trip state; React Query for server data
- **Routing**: React Router v6 with lazy-loaded pages (`React.lazy` + `Suspense`)
- **Animation**: Framer Motion for page transitions, modals, and micro-interactions
- **Theming**: CSS variables + Tailwind custom config — Aurora Glass design system

### Backend Architecture

- **Pattern**: Feature-grouped Express router modules
- **Validation**: Zod schemas on all POST/PATCH endpoints
- **Error handling**: Global Express error handler + `fetchJsonWithRetry` utility
- **Auth**: Stateless JWT middleware (`Authorization: Bearer <token>`)
- **Serverless**: Netlify Functions adapter wraps the Express app

### Design System — Aurora Glass

| Token      | Value                                      |
| ---------- | ------------------------------------------ |
| Background | `#0a0a0f` — deep dark                      |
| Primary    | `hsl(180, 100%, 50%)` — cyan/teal          |
| Card style | `glass-card` — backdrop-blur + border glow |
| Typography | Inter (Google Fonts)                       |
| Gradients  | `gradient-text` utility on headings        |

### CI/CD & Quality

- **GitHub Actions** (`.github/workflows/ci.yml`): typecheck + lint + test on every PR
- **Playwright** E2E tests in `e2e/` directory
- **Sentry** error monitoring (frontend runtime tracking)

---

## 📦 Component Inventory

```
client/components/
├── site/
│   ├── Navbar.tsx              — Nav, More dropdown (6 links), theme toggle, auth
│   ├── Footer.tsx              — Site footer
│   └── ErrorBoundary.tsx       — React error boundary wrapper
├── common/
│   ├── ProtectedRoute.tsx      — Auth guard HOC
│   └── PageTransition.tsx      — Framer Motion page wrapper
├── ui/                         — Shadcn-style primitives (button, card, input, badge,
│                                  select, tabs, tooltip, dropdown, textarea, etc.)
├── planner/
│   ├── VisaChecker.tsx         — Visa requirements display
│   ├── PassportTracker.tsx     — Passport expiry checker
│   ├── TripTimeline.tsx        — Activity timeline for Planner tab
│   ├── LocalGuides.tsx         — Local guides listing
│   └── PackingList.tsx         — Smart packing checklist generator
├── AIChatWidget.tsx            — Floating AI chat bubble (global, every page)
├── OnboardingModal.tsx         — 3-step first-login wizard
├── TripScore.tsx               — AI trip grade (S/A/B/C/D) with 5 dimensions
├── BudgetForecast.tsx          — Recharts area chart budget projection
├── CalendarExport.tsx          — Google Calendar + .ics download
├── CountdownWidget.tsx         — Live countdown to next trip
├── DestinationDiscovery.tsx    — 4-step "Where should I go?" quiz
├── CarbonTracker.tsx           — CO₂ footprint calculator with offsets
└── TripTimeline.tsx            — Standalone timeline component
```

---

<div align="center">
<em>Built with ❤️ by <strong>Puspal Das</strong> — <a href="https://github.com/Puspaldas17">@Puspaldas17</a></em>
</div>
