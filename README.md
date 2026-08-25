# AlphaTrade

A full-stack paper-trading platform where users trade stocks with a virtual wallet — real trade execution and portfolio math, simulated market data.

[Repository](https://github.com/RajArman/AlphaTrade)

---

## 📌 About the Project

AlphaTrade lets a user sign up, receive a virtual starting balance, and buy/sell stocks against simulated, real-time-updating prices. Every trade is validated and applied atomically against the user's wallet and holdings on the backend, so the portfolio, transaction history, and balance shown on the dashboard always reflect a consistent state — there's no client-side trust involved in the financial calculations.

The project is split into three independent apps: a marketing/auth site (`frontend/`), the trading dashboard (`dashboard/`), and a shared Express/MongoDB API (`backend/`).

## ✨ Features

- **Authentication** — JWT-based signup/login/logout, bcrypt password hashing, rate-limited auth endpoints, and clear duplicate email/username handling; every trading request is scoped to the authenticated user, so one account can never read or modify another's data
- **Virtual wallet** — every new account starts with a simulated balance used for all trading
- **Buy & sell execution** — quantity/price validation, atomic balance and holdings updates (a trade can't partially apply), insufficient-balance and overselling protection
- **Holdings & weighted average cost** — repeated buys of the same stock correctly recompute the average buy price
- **Portfolio calculations** — invested value, current value, and profit/loss computed from live holdings data
- **Transaction history** — dated, chronologically ordered record of every buy and sell
- **Real-time simulated prices** — a Socket.IO stream pushes simulated price updates to the watchlist and pre-fills the trade price when a buy/sell window opens
- **Cached dashboard summary** — an optional Redis cache in front of the summary endpoint, with automatic fallback to MongoDB if Redis is unavailable
- **Portfolio insights** — best/worst performing holding, order activity, and overall portfolio health at a glance

## 🛠️ Tech Stack

### Frontend
- **Dashboard** — React 19, Vite, React Router, Axios, Material UI, Chart.js (`react-chartjs-2`), Socket.IO client
- **Marketing site** — React 19, Vite, React Router, Bootstrap 5

### Backend
- Node.js, Express 5
- Socket.IO (real-time price simulation)
- Zod (request validation)
- express-rate-limit (auth rate limiting)

### Database
- MongoDB with Mongoose
- Redis — optional caching layer (`ioredis`/`redis` client), used only for the dashboard summary endpoint

### Authentication
- JWT (`jsonwebtoken`), bcrypt password hashing (`bcryptjs`)
- Auth-scoped rate limiting on signup/login

### Testing
- **Backend unit tests** — Node.js's built-in test runner (`node:test`), no external testing framework
- **Backend integration tests** — Vitest + Supertest + `mongodb-memory-server` (real in-memory MongoDB)
- **Marketing site** — Vitest + React Testing Library

### CI
- GitHub Actions

## 📂 Project Structure

```
AlphaTrade
├── backend
│   ├── controllers/     # Auth request handlers
│   ├── model/            # Mongoose models (User, Holding, Order)
│   ├── schemas/          # Mongoose schemas
│   ├── routes/            # Express route definitions
│   ├── middlewares/    # JWT auth middleware
│   ├── utils/               # Validation, trade math, caching, price simulation
│   ├── tests/                # node:test unit tests
│   └── test/                  # Vitest + Supertest integration tests
│
├── dashboard                 # Trading dashboard (post-login app)
│   └── src/components/    # Holdings, Orders, Summary, Buy/Sell windows, etc.
│
└── frontend                     # Marketing site, login/signup
    └── src/
        ├── landing_page/     # Home, about, pricing, products, support
        └── test/                    # Vitest component tests
```

## 🧪 Testing

**98 backend tests total** (74 unit + 24 integration).

**Backend unit tests** — 74 tests written with Node's built-in test runner, no additional testing framework or dependency. They cover:
- Buy/sell validation, atomic balance/holdings math, and weighted average cost calculation
- Portfolio value and profit/loss calculations
- Wallet defaults and legacy-user balance handling
- Auth validation schemas and duplicate-account error handling
- The Redis cache layer's hit/miss/fallback behavior, using injected fake clients rather than a real Redis instance

These are pure-logic unit tests — they don't require a running MongoDB or Redis instance. Run them with:

```bash
cd backend
npm test

# with coverage
node --test --experimental-test-coverage tests/*.test.js
```

This covers ~98% of the core trading/portfolio calculation logic these unit tests target (the `utils/` and `model/` layers) — not a claim about overall backend coverage, which is measured separately below.

**Backend integration tests** — 24 tests using Vitest + Supertest against the real Express app, backed by a real in-memory MongoDB replica set (`mongodb-memory-server`, required since buy/sell rely on MongoDB transactions). They exercise full HTTP request/response cycles rather than isolated functions, covering:
- Signup/login, password hashing, and duplicate-account rejection
- Protected-route auth enforcement, including that one user can never see another user's holdings
- End-to-end buy/sell execution: balance changes, weighted-average recalculation, insufficient-balance and overselling rejection, and order history/dashboard summary reflecting real trades

```bash
cd backend
npm run test:integration

# with coverage
npm run test:integration:coverage
```

**Marketing site** — a Vitest + React Testing Library test for the landing page's Hero component. Run with:

```bash
cd frontend
npm test
```

## ⚙️ CI Pipeline

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request targeting `main`, with four independent jobs:

- **backend-unit** — install, run the 74 unit tests with coverage
- **backend-integration** — install, run the 24 Supertest/mongodb-memory-server integration tests (no external MongoDB service or secrets required)
- **dashboard** — install, lint, production build
- **frontend** — install, run tests, lint, production build

This is CI only — it verifies the codebase builds and passes its checks, and does not deploy anything.

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- A MongoDB connection string (e.g. MongoDB Atlas)
- Redis connection string (optional — the app runs without it)

### Installation

```bash
git clone https://github.com/RajArman/AlphaTrade.git
cd AlphaTrade

cd backend && npm install
cd ../dashboard && npm install
cd ../frontend && npm install
```

### Environment Variables

**`backend/.env`** (see `backend/.env.example`):

```env
PORT=3002
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret_key
REDIS_URL=your_redis_connection_string
NODE_ENV=development
```

`TOKEN_KEY` is required. `REDIS_URL` is optional — caching is skipped and the app falls back to MongoDB if it's unset or unreachable.

**`dashboard/.env`** (see `dashboard/.env.example`) — optional, both have working defaults:

```env
VITE_API_URL=https://your-backend-url.example.com
VITE_SOCKET_URL=http://localhost:3002
```

### Running the Application

```bash
# Backend
cd backend
npm start

# Dashboard
cd dashboard
npm run dev

# Marketing site
cd frontend
npm run dev
```

## 🔌 API Overview

**Auth** (`/auth`)
- `POST /signup`, `POST /login` — rate-limited, Zod-validated
- `GET /me` — returns the authenticated user
- `POST /logout`

**Trading** (JWT-protected)
- `GET /dashboardSummary` — portfolio value, P&L, wallet balance (Redis-cached)
- `GET /allHoldings`, `GET /allOrders`
- `POST /newOrder` — buy
- `POST /sellOrder` — sell

## 🧠 Engineering Highlights

- **Atomic, concurrency-safe trade execution** — buy and sell orders run inside MongoDB transactions, so a partial failure can never leave the wallet, holdings, and order history out of sync with each other; balance and holding updates use atomic conditional queries (`$gte`/`$inc` in a single operation), so two concurrent requests can't overdraw a balance or oversell a holding
- **Cache with a real fallback path** — the Redis caching layer is written so its client is injectable, letting the hit/miss/failure logic be unit-tested without a live Redis instance, and the app functions identically with Redis absent
- **Race-safe account creation** — signup checks for duplicate email/username up front, and separately handles the database-level unique-constraint error as a fallback for near-simultaneous requests
- **Real-time price stream scoped to where it works** — Socket.IO runs on the persistent Node process used for local development; the code and docs are explicit that it does not run on the serverless deployment, rather than silently pretending it does
- **Test suite with no framework overhead** — all 74 backend tests run on Node's built-in test runner, keeping the dependency footprint minimal while still exercising the real validation and calculation logic

## 👨‍💻 Author

**Arman Raj**
B.Tech Electronics & Communication Engineering, Birla Institute of Technology, Mesra

GitHub: [github.com/RajArman](https://github.com/RajArman)
LinkedIn: [linkedin.com/in/arman-raj](https://linkedin.com/in/arman-raj)
