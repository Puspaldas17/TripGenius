<div align="center">

<br />

<img src="public/placeholder.svg" alt="TripGenius Logo" width="100" height="100" />

<h1>TripGenius ✈️</h1>

<p>
  <strong>AI-powered Travel Planner — Plan smarter, travel better.</strong><br/>
  From idea to itinerary in minutes. Built for real travelers.
</p>

<p>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Node.js-6366f1?style=flat-square&logo=react" alt="Stack" /></a>
  <a href="#-installation"><img src="https://img.shields.io/badge/Package_Manager-pnpm-f59e0b?style=flat-square&logo=pnpm" alt="pnpm" /></a>
  <a href="#-license"><img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="MIT" /></a>
  <a href="https://github.com/Puspaldas17/TripGenius"><img src="https://img.shields.io/badge/Author-Puspal%20Das-8b5cf6?style=flat-square&logo=github" alt="Author" /></a>
  <img src="https://img.shields.io/badge/Pages-13-0ea5e9?style=flat-square" alt="Pages" />
  <img src="https://img.shields.io/badge/Features-30%2B-22c55e?style=flat-square" alt="Features" />
</p>

<br />

</div>

---

## 📌 Overview

**TripGenius** is a full-stack, production-ready travel planning application powered by AI. Enter your origin, destination, dates, budget, and travel style — and get a complete day-by-day itinerary in seconds. Packed with 30+ professional features including live weather, budget forecasting, group trip collaboration, destination comparison, a travel safety hub, trip sharing, a travel journal, calendar export, and more.

> See [`PROJECTDETAILS.md`](./PROJECTDETAILS.md) for a full breakdown of every feature, route, and component.

---

## ✨ Key Features at a Glance

| Category         | Features                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| 🤖 AI Planning   | Itinerary generation, AI Chat Widget, Trip Score Analysis, Destination Quiz      |
| 🗺️ Travel Tools  | Weather, Maps, Transport Options, Nearby Places, Visa Info, Passport Tracker     |
| 💰 Budget        | Budget Overview, Forecast Chart, Currency Converter, Carbon Footprint Tracker    |
| 📅 Scheduling    | Drag-and-Drop Calendar, Trip Timeline, Google Calendar Export, Countdown Widget  |
| 🔗 Social        | Trip Sharing (public links), Travel Journal, Trip Reviews                        |
| 👥 Collaboration | Group Trip Planner (invite, vote, split expenses, group chat)                    |
| ⚖️ Discovery     | Side-by-side Destination Comparison (8 destinations, 6 metrics)                  |
| 🛡️ Safety        | Emergency Numbers for 15 countries, Personal Contacts, Pre-trip Safety Checklist |
| 📊 Analytics     | Profile Badges, Spending Charts, Budget Forecasting                              |
| 🔔 UX            | Onboarding Wizard, Keyboard Shortcuts, PWA Installable, Dark/Light Mode, i18n    |

---

## 🛠 Tech Stack

### Frontend

| Technology                                      | Purpose                  |
| ----------------------------------------------- | ------------------------ |
| [React 18](https://react.dev)                   | UI framework             |
| [Vite](https://vitejs.dev)                      | Build tool & dev server  |
| [TypeScript](https://typescriptlang.org)        | Type safety              |
| [Tailwind CSS](https://tailwindcss.com)         | Styling                  |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Radix UI / Shadcn](https://ui.shadcn.com)      | UI components            |
| [Zustand](https://zustand-demo.pmnd.rs/)        | Global state             |
| [React Query](https://tanstack.com/query)       | Data fetching & caching  |
| [Recharts](https://recharts.org)                | Analytics charts         |
| [Lucide Icons](https://lucide.dev)              | Icon set                 |
| [react-i18next](https://react.i18next.com)      | Internationalization     |

### Backend

| Technology                                                       | Purpose            |
| ---------------------------------------------------------------- | ------------------ |
| [Node.js + Express](https://expressjs.com)                       | REST API server    |
| [Mongoose / MongoDB](https://mongoosejs.com)                     | Database ORM       |
| [Zod](https://zod.dev)                                           | Request validation |
| [JWT](https://jwt.io)                                            | Authentication     |
| [Netlify Functions](https://www.netlify.com/products/functions/) | Serverless deploy  |

### External APIs

| API                                                                 | Usage                   |
| ------------------------------------------------------------------- | ----------------------- |
| [OpenWeatherMap](https://openweathermap.org)                        | Live weather forecasts  |
| [OpenStreetMap Nominatim](https://nominatim.org)                    | Geocoding & routing     |
| [Wikipedia Geosearch](https://www.mediawiki.org/wiki/API:Geosearch) | Nearby places           |
| [Frankfurter API](https://www.frankfurter.app)                      | Currency exchange rates |

### DevOps & Quality

| Tool                                                  | Purpose          |
| ----------------------------------------------------- | ---------------- |
| [Playwright](https://playwright.dev)                  | E2E testing      |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline   |
| [Sentry](https://sentry.io)                           | Error monitoring |
| ESLint + TypeScript                                   | Code quality     |

---

## 📁 Project Structure

```
TripGenius/
├── client/                        # React frontend (Vite)
│   ├── App.tsx                    # App shell, routes, providers
│   ├── pages/                     # Route-level pages
│   │   ├── Index.tsx              # Landing / Home (premium SaaS layout)
│   │   ├── Planner.tsx            # Main AI trip planning workspace
│   │   ├── Dashboard.tsx          # User dashboard & analytics
│   │   ├── Profile.tsx            # User profile, badges, charts
│   │   ├── SharedTrip.tsx         # Public shared itinerary view
│   │   ├── TravelJournal.tsx      # Travel journal with mood tracking
│   │   ├── TripReviews.tsx        # Destination reviews & ratings
│   │   ├── GroupTrips.tsx         # Collaborative group trip planner ★ NEW
│   │   ├── EmergencyContacts.tsx  # Travel safety hub ★ NEW
│   │   ├── TripComparison.tsx     # Side-by-side destination compare ★ NEW
│   │   ├── Login.tsx / Signup.tsx # Auth pages
│   │   └── NotFound.tsx           # 404 page
│   ├── components/
│   │   ├── site/                  # Navbar, Footer, ErrorBoundary
│   │   ├── ui/                    # Reusable UI primitives (shadcn-style)
│   │   ├── common/                # ProtectedRoute, PageTransition
│   │   ├── planner/               # VisaChecker, PassportTracker, LocalGuides, PackingList, TripTimeline
│   │   ├── AIChatWidget.tsx       # Floating AI chat assistant (global)
│   │   ├── OnboardingModal.tsx    # First-login 3-step wizard
│   │   ├── TripScore.tsx          # AI trip grade (S/A/B/C/D)
│   │   ├── BudgetForecast.tsx     # Budget projection chart
│   │   ├── CalendarExport.tsx     # Google Cal + .ics export
│   │   ├── CountdownWidget.tsx    # Live trip countdown timer
│   │   ├── DestinationDiscovery.tsx # "Where should I go?" quiz
│   │   ├── CarbonTracker.tsx      # CO₂ footprint calculator
│   │   └── TripTimeline.tsx       # Day-by-day visual timeline
│   ├── hooks/                     # useKeyboardShortcuts, useTripQueries, useMobile
│   ├── lib/                       # api.ts, icalExport.ts, i18n.ts, utils.ts
│   ├── store/                     # tripStore.ts (Zustand)
│   └── contexts/                  # AuthContext
│
├── server/                        # Express backend
│   ├── index.ts                   # App factory, mounts routes
│   ├── routes/                    # Feature-grouped API endpoints
│   │   ├── ai.ts                  # POST /api/ai/itinerary, /api/ai/chat
│   │   ├── auth.ts                # POST /api/auth/signup, /login
│   │   ├── trips.ts               # CRUD /api/trips
│   │   ├── weather.ts             # GET /api/weather
│   │   ├── currency.ts            # GET /api/currency/convert
│   │   ├── travel.ts              # GET /api/travel/options
│   │   ├── places.ts              # GET /api/places
│   │   ├── geocode.ts             # GET /api/geocode/*
│   │   └── visa.ts                # GET /api/visa
│   ├── middleware/auth.ts          # JWT Bearer validation
│   └── utils/                     # HTTP retry, logger, JWT helpers
│
├── shared/
│   └── api.ts                     # Types shared by client & server
│
├── public/                        # Static assets, manifest.json (PWA)
├── netlify/functions/api.ts       # Serverless adapter
├── e2e/                           # Playwright E2E tests
├── .github/workflows/ci.yml       # GitHub Actions CI/CD
├── PROJECTDETAILS.md              # Full feature documentation
└── README.md                      # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **pnpm** (preferred package manager)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Puspaldas17/TripGenius.git
cd TripGenius

# 2. Enable pnpm (if not installed)
corepack enable
corepack prepare pnpm@latest --activate

# 3. Install dependencies
pnpm install
```

### Environment Variables (Optional)

Create a `.env` file in the root:

```env
# Unlocks live weather data
OPENWEATHER_API_KEY=your_openweather_key

# MongoDB (for persistent trip storage)
MONGODB_URI=your_mongodb_connection_string

# JWT secret
JWT_SECRET=your_jwt_secret_key
```

> The app works without these — it uses smart fallbacks for weather and in-memory storage for trips.

---

## 💻 Running Locally

```bash
# Development (Vite + Express, hot reload)
pnpm dev
# → http://localhost:8080
# → API at http://localhost:8080/api

# Production build
pnpm build
pnpm start
# → http://localhost:3000
```

### Useful Scripts

```bash
pnpm typecheck       # TypeScript type checking
pnpm lint            # ESLint
pnpm test            # Unit tests (Vitest)
npx playwright test  # E2E tests (Playwright)
```

---

## 🌐 Deployment

### Netlify (Recommended)

The project includes a ready-to-use `netlify.toml` and serverless adapter:

```
Build command:      pnpm build
Publish directory:  dist
Functions directory: netlify/functions
```

### Vercel

Set the output directory to `dist`. The Express server adapts automatically.

---

## 📡 API Reference

| Method   | Route                   | Description                 |
| -------- | ----------------------- | --------------------------- |
| `POST`   | `/api/ai/itinerary`     | Generate AI trip itinerary  |
| `POST`   | `/api/ai/chat`          | AI travel chat assistant    |
| `GET`    | `/api/weather`          | Live weather forecast       |
| `GET`    | `/api/travel/options`   | Transport options & pricing |
| `GET`    | `/api/currency/convert` | Currency conversion         |
| `GET`    | `/api/places`           | Nearby places of interest   |
| `GET`    | `/api/geocode/search`   | Forward geocoding           |
| `GET`    | `/api/visa`             | Visa requirements lookup    |
| `POST`   | `/api/auth/signup`      | Register new user           |
| `POST`   | `/api/auth/login`       | Login & receive JWT         |
| `GET`    | `/api/trips`            | Get user's saved trips      |
| `POST`   | `/api/trips`            | Save a new trip             |
| `DELETE` | `/api/trips/:id`        | Delete a trip               |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please follow the existing code style (TypeScript, Prettier, ESLint, Tailwind conventions).

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](https://opensource.org/licenses/MIT) for details.

---

## 👤 Author

<div align="center">

**Puspal Das**

[![GitHub](https://img.shields.io/badge/GitHub-Puspaldas17-181717?style=flat-square&logo=github)](https://github.com/Puspaldas17)
[![Portfolio](https://img.shields.io/badge/Portfolio-View%20Projects-6366f1?style=flat-square&logo=vercel)](https://github.com/Puspaldas17?tab=repositories)

_Built with ❤️ for travelers who love smart planning._

</div>
