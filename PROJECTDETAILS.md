<div align="center">

# 📋 TripGenius — Project Details

**A complete breakdown of every feature, component, and page in TripGenius.**

</div>

---

## 🗺️ Pages & Routes

| Route                | Page             | Access    | Description                           |
| -------------------- | ---------------- | --------- | ------------------------------------- |
| `/`                  | Home / Landing   | Public    | Hero section, feature highlights, CTA |
| `/planner`           | Trip Planner     | Protected | Full AI trip planning workspace       |
| `/dashboard`         | Dashboard        | Protected | Trip overview, stats, and widgets     |
| `/profile`           | Profile          | Protected | User stats, badges, spending charts   |
| `/journal`           | Travel Journal   | Protected | Personal day-by-day travel diary      |
| `/reviews`           | Trip Reviews     | Protected | Write and browse destination reviews  |
| `/trip/share/:token` | Shared Trip View | Public    | Read-only sharable itinerary link     |
| `/login`             | Login            | Public    | Email/password authentication         |
| `/signup`            | Sign Up          | Public    | New account registration              |

---

## 🤖 AI Features

### 1. AI Itinerary Generator

- **Route:** `POST /api/ai/itinerary`
- **File:** `server/routes/ai.ts`, `client/pages/Planner.tsx`
- Accepts: destination, origin, days, budget, members, travel style/mood
- Returns a structured day-by-day itinerary with activities, meals, and notes
- Results are displayed in a tabbed Planner UI with calendar integration

### 2. AI Chat Widget

- **File:** `client/components/AIChatWidget.tsx`
- Floating chat bubble available on **every page**
- Connected to `POST /api/ai/chat` backend endpoint
- Features: message history, typing indicator, quick-suggestion chips
- Keyboard shortcut: `Ctrl + K` to open/close

### 3. AI Trip Score

- **File:** `client/components/TripScore.tsx`
- Analyzes any saved trip across **5 dimensions**:
  - ⏱️ Day Balance — optimal trip length scoring
  - 💰 Budget Score — per-day spend efficiency
  - 👥 Group Fit — member count suitability
  - 🎢 Adventure Mix — activity variety
  - 🏛️ Culture Depth — cultural immersion rating
- Awards a **grade: S / A / B / C / D** with animated reveal
- Each dimension includes an AI improvement tip

### 4. Destination Discovery Quiz

- **File:** `client/components/DestinationDiscovery.tsx`
- **Location:** Dashboard
- 4-step interactive quiz:
  1. 🌡️ Climate preference (Tropical / Temperate / Cold / Desert)
  2. 🏃 Activity type (Adventure / Cultural / Relaxation / Foodie)
  3. ✨ Vibe (Romantic / Solo / Family / Party)
  4. 💸 Budget tier (Budget / Mid-range / Luxury)
- AI matches answers to curated destination list
- Result card includes description + **"Plan →"** deep link to Planner

---

## 🌦️ Travel Information Features

### 5. Live Weather Forecast

- **Route:** `GET /api/weather?location=<city>`
- **File:** `server/routes/weather.ts`, displayed in `Planner.tsx`
- Uses OpenWeatherMap API (geocoding + 5-day forecast)
- Shows: temperature, description, humidity, wind, min/max per day
- Smart fallback data if API key is missing

### 6. Nearby Places of Interest

- **Route:** `GET /api/places?lat=<lat>&lon=<lon>`
- **File:** `server/routes/places.ts`
- Powered by Wikipedia Geosearch API
- Returns: name, description, distance, thumbnail, Wikipedia link
- Displayed as cards in the Planner's "Explore" tab

### 7. Transport Options

- **Route:** `GET /api/travel/options`
- **File:** `server/routes/travel.ts`
- Calculates route options: ✈️ Flight / 🚆 Train / 🚗 Car / 🚢 Ferry
- Haversine distance calculation + realistic price/time estimates
- Toggleable in Planner's transport tab

### 8. Visa Requirements Lookup

- **Route:** `GET /api/visa`
- **File:** `server/routes/visa.ts`, `client/components/planner/VisaChecker.tsx`
- Displays visa requirements based on origin country
- Shown in Planner's "Trip Prep" tab

### 9. Carbon Footprint Tracker

- **File:** `client/components/CarbonTracker.tsx`
- Calculates estimated CO₂ emissions based on:
  - Transport mode (flight / train / car)
  - Distance (km)
- Shows emission value in kg CO₂ and suggests offset actions

---

## 💰 Budget Features

### 10. Budget Overview

- **File:** `client/pages/Planner.tsx` — Budget tab
- Per-day and per-person spending breakdown
- Auto-adjusts based on group size and trip duration
- Visual bar chart breakdown by category

### 11. Budget Forecast Chart

- **File:** `client/components/BudgetForecast.tsx`
- **Location:** Dashboard, bottom section
- Recharts **area chart** showing:
  - Projected cumulative spend (solid line)
  - Planned cumulative spend (dashed line)
- Realistic spending simulation (high on arrival day, dip mid-trip, spike at end)
- Status badge: ✅ Under Budget / ⚠️ On Track / 🔴 Over Budget
- 3 personalized money-saving tips

### 12. Currency Converter

- **Route:** `GET /api/currency/convert`
- **File:** `server/routes/currency.ts`
- Uses Frankfurter API (free, no API key needed)
- Supports 30+ world currencies
- Live exchange rates with smart fallback

---

## 📅 Scheduling & Calendar Features

### 13. Drag-and-Drop Trip Calendar

- **File:** `client/pages/Planner.tsx` — Plan & Calendar tab
- Visual day-by-day calendar grid
- Drag activities between days
- Set start/end times per activity
- Add custom notes

### 14. Trip Timeline (Gantt View)

- **File:** `client/components/TripTimeline.tsx`
- Vertical connected timeline showing all activities across days
- Color-coded by activity type (meal, sightseeing, transport, etc.)
- Available in Planner as a visual overview tab

### 15. Google Calendar Export

- **File:** `client/components/CalendarExport.tsx`, `client/lib/icalExport.ts`
- **"Add to Google Calendar"** — opens Google Calendar with trip pre-filled
- **Download .ics** — RFC-5545 compliant file for Apple Calendar, Outlook, etc.
- All activities exported as individual calendar events with times and locations

### 16. Trip Countdown Timer

- **File:** `client/components/CountdownWidget.tsx`
- **Location:** Dashboard
- Live real-time ticker: Days / Hours / Minutes / Seconds
- Auto-detects the next upcoming trip from saved data
- Shimmer gradient progress bar effect

---

## 🔗 Social & Sharing Features

### 17. Trip Sharing (Public Links)

- **File:** `client/pages/SharedTrip.tsx`, Route: `/trip/share/:token`
- Generates a **public, shareable URL** for any trip itinerary
- Read-only beautifully styled view visible without login
- **Download PDF** button using browser's native print API
- **Copy Link** button with toast confirmation

### 18. Travel Journal

- **File:** `client/pages/TravelJournal.tsx`, Route: `/journal`
- Write personal travel memories with:
  - 📅 Date picker
  - 📍 Location name
  - 😄 Mood picker (5 emoji options: Amazing / Good / Okay / Tired / Stressful)
  - 🌤️ Weather notes
  - ✍️ Free-form journal text
- All entries stored in `localStorage` — no account required
- Entries are expandable/collapsible with smooth animations

### 19. Trip Reviews

- **File:** `client/pages/TripReviews.tsx`, Route: `/reviews`
- Write star-rated reviews for any destination
- Features:
  - ⭐ 1–5 star interactive rating
  - 📝 Title + full review text
  - 🏷️ 10 curated tag options (Hidden gem, Budget-friendly, Foodie paradise, etc.)
  - 👍 "Helpful" vote button per review
- Expandable review cards sorted by newest
- All data stored in `localStorage`

---

## 👤 Profile & Gamification

### 20. User Profile Page

- **File:** `client/pages/Profile.tsx`, Route: `/profile`
- Tabbed interface:
  - **My Trips** — list of saved trips with stats
  - **Badges** — earned achievement badges
  - **Analytics** — spending charts

### 21. Gamification Badges

- **File:** `client/pages/Profile.tsx`
- 6 achievement badges with unlock conditions:
  - 🌍 **World Explorer** — 5+ trips planned
  - 💰 **Budget Master** — under-budget trip
  - 🗺️ **Adventurer** — adventure-type trip
  - ✈️ **Frequent Flyer** — 10+ trips
  - 🌍 **Globe Trotter** — 20+ trips
  - 🔰 **First Steps** — first trip planned
- Progress bars show progress toward locked badges

### 22. Spending Analytics Charts

- **File:** `client/pages/Profile.tsx` — Analytics tab
- **Recharts** Pie chart: spending by category (Accommodation, Food, Transport, Activities)
- **Recharts** Bar chart: per-trip budget vs. estimated spend comparison
- Data sourced from real saved trip data

---

## 🔔 UX & Onboarding

### 23. Onboarding Wizard

- **File:** `client/components/OnboardingModal.tsx`
- 3-step animated welcome modal shown on first login
- Steps: Welcome → Preferences → Quick Start
- Framer Motion slide transitions between steps
- Stored in `localStorage` so it only shows once (`tg_onboarded`)

### 24. Keyboard Shortcuts

- **File:** `client/hooks/useKeyboardShortcuts.ts`
- Global shortcuts (safely disabled when typing in inputs):
  - `Ctrl + K` — Open AI Chat
  - `Ctrl + N` — New Trip (navigate to Planner)
  - `Ctrl + D` — Go to Dashboard

### 25. PWA (Progressive Web App)

- **Files:** `public/manifest.json`, `index.html`
- App can be **installed to homescreen** on mobile/desktop
- App shortcuts defined in manifest (Plan Trip, Dashboard)
- Theme color matches the Aurora Glass palette (`#bfffff`)
- Works offline after install (cached assets)

### 26. Dark / Light Mode Toggle

- **File:** `client/components/site/Navbar.tsx`
- Animated Sun/Moon toggle in Navbar
- Preference saved to `localStorage` (`tg_theme`)
- Respects system preference on first load

---

## 🔐 Authentication

### 27. JWT Authentication

- **Files:** `server/routes/auth.ts`, `server/middleware/auth.ts`, `client/contexts/AuthContext.tsx`
- `POST /api/auth/signup` — creates a user account
- `POST /api/auth/login` — validates credentials and returns JWT
- Protected routes use `<ProtectedRoute>` wrapper in React Router
- JWT stored in `localStorage` (`auth_token`)
- Guest Mode available for exploring without registration

---

## 🏗️ Technical Architecture

### Frontend Architecture

- **State**: Zustand for global state, React Query for server data
- **Routing**: React Router v6 with lazy-loaded pages
- **Animation**: Framer Motion for page transitions and micro-interactions
- **Forms**: Native React controlled forms with Zod-like client-side validation
- **Theming**: CSS variables + Tailwind + custom Aurora Glass design system

### Backend Architecture

- **Pattern**: Feature-grouped Express router modules
- **Validation**: Zod schemas on all POST/PATCH endpoints
- **Error handling**: Global Express error handler + `fetchJsonWithRetry` utility
- **Auth**: Stateless JWT middleware (`Authorization: Bearer <token>`)
- **Serverless**: Netlify Functions adapter wraps the Express app

### Design System — Aurora Glass

- Background: deep dark tones (`#0a0a0f`)
- Primary: luminous cyan/teal (`hsl(180, 100%, 50%)`)
- Glassmorphism: `backdrop-blur-xl` + `bg-background/60` + border glow
- All cards: `glass-card` class with gradient borders
- Typography: Inter (Google Fonts)
- Gradients: `gradient-text` utility across headings

---

## 📦 Component Inventory

```
client/components/
├── site/
│   ├── Navbar.tsx           — Top navigation, mobile bar, theme toggle
│   └── Footer.tsx           — Site footer
├── ui/                      — Shadcn-style primitives (30+ components)
├── AIChatWidget.tsx          — Floating AI chat bubble (global)
├── OnboardingModal.tsx       — First-login wizard
├── TripScore.tsx             — AI trip grade (S/A/B/C/D)
├── BudgetForecast.tsx        — Recharts budget projection
├── CalendarExport.tsx        — Google Cal + .ics download
├── CountdownWidget.tsx       — Live trip countdown
├── DestinationDiscovery.tsx  — "Where should I go?" quiz
├── CarbonTracker.tsx         — CO₂ footprint calculator
├── TripTimeline.tsx          — Day-by-day activity timeline
└── planner/
    ├── VisaChecker.tsx       — Visa requirements display
    ├── PassportTracker.tsx   — Passport validity tracker
    ├── LocalGuides.tsx       — Local guides listing
    └── PackingList.tsx       — Smart packing checklist
```

---

<div align="center">
<em>Built with ❤️ by <strong>Puspal Das</strong> — <a href="https://github.com/Puspaldas17">@Puspaldas17</a></em>
</div>
