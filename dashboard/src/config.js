// Centralized backend endpoints. Defaults preserve the existing
// hardcoded behavior exactly; set VITE_API_URL / VITE_SOCKET_URL in a
// local .env to override without touching any call site.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://alpha-trade-iota.vercel.app";

// Socket.IO only runs on a persistent Node process (see the comment in
// backend/index.js above the io setup), not the Vercel serverless
// deployment - so this intentionally defaults to the local dev backend
// rather than the production API URL above.
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3002";
