import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

import { HoldingsModel } from "./model/HoldingsModel.js";
import { OrdersModel } from "./model/OrdersModel.js";
import User, { DEFAULT_STARTING_BALANCE, getUserBalance } from "./model/UserModel.js";

import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

import { verifyUser } from "./middlewares/authMiddleware.js";
import { buyOrderSchema, sellOrderSchema } from "./utils/validation.js";
import {
  InsufficientBalanceError,
  HoldingNotFoundError,
  InsufficientHoldingsError,
} from "./utils/tradeErrors.js";
import { calculateTotalCost, calculateWeightedAverage } from "./utils/tradeMath.js";
import { calculatePortfolioTotals, calculateTotalAccountValue } from "./utils/portfolioMath.js";
import {
  getCachedDashboardSummary,
  setCachedDashboardSummary,
  invalidateDashboardSummary,
} from "./utils/cache.js";

const app = express();

// Body parsing - MUST be before CORS in some cases
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Shared with the Socket.IO CORS config in index.js - same dashboard
// origins allowed on both the HTTP API and the socket connection.
export const corsOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://alpha-trade-6k67.vercel.app",
  "https://alpha-trade-hbht.vercel.app"
];

// CORS with proper configuration
app.use(cors({
  origin: corsOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());

app.get("/dashboardSummary", verifyUser, async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const cachedSummary = await getCachedDashboardSummary(userId);
    if (cachedSummary) {
      return res.json(cachedSummary);
    }

    const holdings = await HoldingsModel.find({ user: req.user._id });

    const totalHoldings = holdings.length;

    const { totalInvested, totalCurrentValue, totalProfitLoss, totalProfitLossPercent } =
      calculatePortfolioTotals(holdings);

    const availableMargin = getUserBalance(req.user);
    const totalAccountValue = calculateTotalAccountValue(availableMargin, totalCurrentValue);

    const summary = {
      success: true,
      totalHoldings,
      investment: totalInvested,
      currentValue: totalCurrentValue,
      profitLoss: totalProfitLoss,
      profitLossPercent: totalProfitLossPercent,
      availableMargin,
      marginsUsed: 0,
      openingBalance: DEFAULT_STARTING_BALANCE,
      totalAccountValue,
    };

    // Only successful summaries are ever cached.
    await setCachedDashboardSummary(userId, summary);

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
    });
  }
});

app.get("/allHoldings", verifyUser, async (req, res) => {
  let allHoldings = await HoldingsModel.find({user: req.user._id});
  res.json(allHoldings);
});

app.post("/newOrder", verifyUser, async (req, res) => {
  const validation = buyOrderSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: validation.error.issues[0].message,
    });
  }

  const { name, qty, price } = validation.data;
  const totalCost = calculateTotalCost(qty, price);

  // Milestone 1 relied on the schema's `default` for legacy users, but that
  // default only applies when Mongoose hydrates a document in memory - it
  // never touches the stored document. The atomic balance check/deduction
  // below runs directly against the stored field, so any user saved before
  // `balance` existed needs it backfilled first or the $gte filter below
  // would never match them.
  await User.updateOne(
    { _id: req.user._id, balance: { $exists: false } },
    { $set: { balance: DEFAULT_STARTING_BALANCE } }
  );

  const session = await mongoose.startSession();
  let updatedBalance;

  try {
    await session.withTransaction(async () => {
      // Atomic conditional decrement: this single query both checks and
      // deducts balance, so it stays correct under concurrent buy requests
      // without needing a separate read-then-write step.
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id, balance: { $gte: totalCost } },
        { $inc: { balance: -totalCost } },
        { new: true, session }
      );

      if (!updatedUser) {
        throw new InsufficientBalanceError();
      }

      updatedBalance = updatedUser.balance;

      const newOrder = new OrdersModel({
        name,
        qty,
        price,
        mode: "BUY",
        user: req.user._id,
      });

      await newOrder.save({ session });

      const existingHolding = await HoldingsModel.findOne({
        name,
        user: req.user._id,
      }).session(session);

      if (!existingHolding) {
        await new HoldingsModel({
          name,
          qty,
          avg: price,
          price,
          net: 0,
          day: 0,
          user: req.user._id,
        }).save({ session });
      } else {
        const { totalQty, avg } = calculateWeightedAverage(
          existingHolding.qty,
          existingHolding.avg,
          qty,
          price
        );

        existingHolding.qty = totalQty;
        existingHolding.avg = avg;
        existingHolding.price = price;

        await existingHolding.save({ session });
      }
    });

    // Transaction has committed at this point - invalidate only now, and
    // never before, so a failed/rolled-back buy can't wipe a still-valid
    // cached summary. invalidateDashboardSummary never throws, so a Redis
    // problem here can't turn this successful buy into a failed response.
    await invalidateDashboardSummary(req.user._id.toString());

    res.json({
      success: true,
      message: "Order saved!",
      balance: updatedBalance,
    });
  } catch (error) {
    if (error instanceof InsufficientBalanceError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Buy order failed:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  } finally {
    session.endSession();
  }
});

app.get("/allOrders", verifyUser, async (req, res) => {
  // Explicit sort so "most recent transaction first" is deterministic -
  // MongoDB doesn't guarantee find() returns insertion order.
  let allOrders = await OrdersModel.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(allOrders);
});

app.post("/sellOrder", verifyUser, async (req, res) => {
  const validation = sellOrderSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: validation.error.issues[0].message,
    });
  }

  const { name, qty, price } = validation.data;
  const saleValue = calculateTotalCost(qty, price);

  // Same legacy-user safety net as /newOrder: a user's very first trade
  // could be a sell, so the stored balance field must exist before the
  // credit below runs.
  await User.updateOne(
    { _id: req.user._id, balance: { $exists: false } },
    { $set: { balance: DEFAULT_STARTING_BALANCE } }
  );

  const session = await mongoose.startSession();
  let updatedBalance;
  let holdingRemoved = false;

  try {
    await session.withTransaction(async () => {
      // Atomic conditional decrement: only matches (and only writes) if the
      // user currently holds at least `qty` shares, so holdings can never
      // go negative even under concurrent sell requests.
      const updatedHolding = await HoldingsModel.findOneAndUpdate(
        { name, user: req.user._id, qty: { $gte: qty } },
        { $inc: { qty: -qty }, $set: { price } },
        { new: true, session }
      );

      if (!updatedHolding) {
        // The conditional update didn't tell us *why* it failed to match -
        // this read (same session/snapshot) distinguishes "never owned it"
        // from "owns it, just not enough shares" for a clearer error.
        const existingHolding = await HoldingsModel.findOne({
          name,
          user: req.user._id,
        }).session(session);

        if (!existingHolding) {
          throw new HoldingNotFoundError();
        }

        throw new InsufficientHoldingsError();
      }

      if (updatedHolding.qty === 0) {
        await HoldingsModel.deleteOne({ _id: updatedHolding._id }).session(session);
        holdingRemoved = true;
      }

      // Preserve the holding's average buy price exactly - a sale never
      // changes what the remaining shares were originally bought for.

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $inc: { balance: saleValue } },
        { new: true, session }
      );

      updatedBalance = updatedUser.balance;

      const sellOrder = new OrdersModel({
        name,
        qty,
        price,
        mode: "SELL",
        user: req.user._id,
      });

      await sellOrder.save({ session });
    });

    // Same rule as /newOrder: only invalidate after the transaction has
    // actually committed, and a Redis failure here can't turn this
    // successful sell into a failed response.
    await invalidateDashboardSummary(req.user._id.toString());

    res.json({
      success: true,
      message: "Sell order saved",
      balance: updatedBalance,
      holdingRemoved,
    });
  } catch (error) {
    if (
      error instanceof HoldingNotFoundError ||
      error instanceof InsufficientHoldingsError
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Sell order failed:", error);
    res.status(500).json({ success: false, message: "Failed to place sell order" });
  } finally {
    session.endSession();
  }
});

// New auth route registration
app.use("/auth", authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

export default app;
