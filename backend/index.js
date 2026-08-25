import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import app, { corsOrigins } from "./app.js";
import { createInitialPriceState, generatePriceTick } from "./utils/priceSimulator.js";

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// Connect to database
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Start server only during local development.
//
// Socket.IO needs a long-lived process to hold connections open and run
// the price-emission interval, so it's only attached here - not to the
// Vercel serverless entry point in api/index.js, which invokes `app` fresh
// per HTTP request and has no persistent process to keep a socket or
// interval alive. Real-time prices work when the backend is run as a
// normal Node process (e.g. `npm start`, or a non-serverless host);
// deploying this feature to the current Vercel serverless setup would
// require moving off serverless (or a serverless-compatible pub/sub
// adapter), which is out of scope for this milestone.
if (process.env.NODE_ENV !== "production") {
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected to price stream:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected from price stream:", socket.id);
    });
  });

  // One shared interval for all connected clients, broadcasting via
  // io.emit - not one interval per socket.
  const priceState = createInitialPriceState();
  const PRICE_TICK_INTERVAL_MS = 3000;

  const priceInterval = setInterval(() => {
    const updates = generatePriceTick(priceState);
    io.emit("priceUpdate", updates);
  }, PRICE_TICK_INTERVAL_MS);

  httpServer.on("close", () => {
    clearInterval(priceInterval);
  });

  httpServer.listen(PORT, () => {
    console.log("APP started on port", PORT);
  });
}

export default app;
