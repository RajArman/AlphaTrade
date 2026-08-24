# 📈 AlphaTrade

[![CI](https://github.com/RajArman/AlphaTrade/actions/workflows/ci.yml/badge.svg)](https://github.com/RajArman/AlphaTrade/actions/workflows/ci.yml)

A full-stack MERN paper-trading platform featuring secure authentication, a virtual wallet, buy/sell execution, portfolio management, real-time simulated prices, and interactive analytics on a modern trading dashboard.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based Authentication
- Secure Login & Signup with Duplicate Email/Username Handling
- Rate-Limited Login & Signup (brute-force protection)
- Protected Routes
- Cookie-based Session Management
- User-specific Data Isolation

### 💰 Paper Trading
- Virtual Wallet with Starting Balance
- Buy & Sell Execution with Atomic Balance/Holding Updates
- Transaction History
- Portfolio Value & Profit/Loss Calculation

### 📊 Portfolio Dashboard
- Portfolio Overview
- Holdings Management
- Order History
- Funds Overview
- Portfolio Insights

### ⚡ Real-Time & Caching
- Live Simulated Stock Price Updates via Socket.IO
- Redis Caching for Dashboard Summary (optional, with automatic MongoDB fallback)

### 📉 Analytics
- Portfolio Performance
- Doughnut Chart
- Holdings Chart
- Profit/Loss Calculation
- Investment Summary
- Portfolio Health Statistics

### 🎨 UI Features
- Responsive Design
- Dark Mode
- Watchlist Search
- Interactive Dashboard
- Custom Branding
- Custom Favicon

---

# 🛠 Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Material UI
- Bootstrap 5
- Chart.js

## Backend
- Node.js
- Express.js
- JWT Authentication
- Cookie Parser
- Zod (Validation)
- bcryptjs (Password Hashing)
- express-rate-limit (Auth Rate Limiting)
- Socket.IO (Real-Time Simulated Prices)
- Redis (Optional Caching Layer, node-redis)

## Database
- MongoDB
- Mongoose

## Other
- Git
- GitHub
- Vite

---

# 📂 Project Structure

```
AlphaTrade
│
├── frontend
│   ├── Landing Website
│   ├── Login / Signup
│   └── Responsive UI
│
├── dashboard
│   ├── Portfolio Dashboard
│   ├── Holdings
│   ├── Orders
│   ├── Funds
│   ├── Insights
│   └── Charts
│
└── backend
    ├── Authentication
    ├── REST APIs
    ├── JWT Middleware
    ├── MongoDB Models
    └── Business Logic
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AlphaTrade.git
```

## Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Dashboard

```bash
cd dashboard
npm install
```

### Backend

```bash
cd backend
npm install
```

---

# ▶️ Run the Project

### Backend

```bash
npm start
```

### Frontend

```bash
npm run dev
```

### Dashboard

```bash
npm run dev
```

---

# 🔑 Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in real values.

```env
PORT=3002
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_secret_key
REDIS_URL=your_redis_connection_string
```

- `TOKEN_KEY` is required - it signs the JWTs used for authentication.
- `REDIS_URL` is optional. It enables caching for `/dashboardSummary`; if it's
  unset (or Redis is unreachable), the app automatically falls back to
  querying MongoDB directly, so Redis is never required for the app to run.
- Leave `NODE_ENV` unset (or set it to `development`) for local development.
  The local Express server and Socket.IO real-time price stream only start
  when `NODE_ENV` is not `"production"`.

The dashboard also has an optional `dashboard/.env.example` for overriding
the backend API/Socket.IO URLs (`VITE_API_URL`, `VITE_SOCKET_URL`); both
have working defaults, so this is only needed to point the dashboard at a
different backend.

---

# 🔮 Future Improvements

- AI Portfolio Advisor
- Live Stock Market Data Integration
- Stock Price Alerts
- News Feed Integration
- Portfolio Risk Analysis
- Watchlist Personalization
- Export Portfolio Reports

---

# 🎯 Learning Outcomes

This project helped strengthen my understanding of:

- Full Stack MERN Development
- JWT Authentication
- REST API Design
- MongoDB Data Modeling
- Protected Routes
- React Context API
- State Management
- CRUD Operations
- Dashboard UI Development
- Responsive Design
- Data Visualization with Chart.js

---

# 👨‍💻 Author

**Arman Raj**

B.Tech Electronics & Communication Engineering  
Birla Institute of Technology, Mesra

GitHub: https://github.com/RajArman

LinkedIn: https://linkedin.com/in/arman-raj