import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
// import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

import { HoldingsModel } from "./model/HoldingsModel.js";
import { PositionsModel } from "./model/PositionsModel.js";
import { OrdersModel } from "./model/OrdersModel.js";
import User, { DEFAULT_STARTING_BALANCE, getUserBalance } from "./model/UserModel.js";

import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

import { verifyUser } from "./middlewares/authMiddleware.js";
import { buyOrderSchema } from "./utils/validation.js";
import { InsufficientBalanceError } from "./utils/tradeErrors.js";
import { calculateTotalCost, calculateWeightedAverage } from "./utils/tradeMath.js";

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

// Body parsing - MUST be before CORS in some cases
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// CORS with proper configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://alpha-trade-6k67.vercel.app",
    "https://alpha-trade-hbht.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());

// app.get('/addHoldings', async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel( {
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Holdings Done");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });

//   res.send("Positions Done");
// });

app.get("/dashboardSummary", verifyUser, async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({ user: req.user._id });

    const totalHoldings = holdings.length;

    const investment = holdings.reduce((sum, stock) => {
      return sum + stock.avg * stock.qty;
    }, 0);

    const currentValue = holdings.reduce((sum, stock) => {
      return sum + stock.price * stock.qty;
    }, 0);

    const profitLoss = currentValue - investment;

    const profitLossPercent =
      investment > 0 ? (profitLoss / investment) * 100 : 0;

    res.json({
      success: true,
      totalHoldings,
      investment,
      currentValue,
      profitLoss,
      profitLossPercent,
      availableMargin: getUserBalance(req.user),
      marginsUsed: 0,
      openingBalance: DEFAULT_STARTING_BALANCE,
    });
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

app.get("/allPositions", verifyUser, async (req, res) => {
  let allPositions = await PositionsModel.find({user: req.user._id});
  res.json(allPositions);
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
  let allOrders = await OrdersModel.find({user: req.user._id});
  res.json(allOrders);
});

app.post("/sellOrder", verifyUser, async (req, res) => {
  const { name, qty, price } = req.body;

  let sellOrder = new OrdersModel({
    name: name,
    qty: qty,
    price: price,
    mode: "SELL",
    user: req.user._id,
  }); 

  sellOrder.save();
  res.send("Sell order saved");

  const holding = await HoldingsModel.findOne({ name, user: req.user._id });

  if (!holding) {
    return res.status(400).send("No holdings to sell");
  }

  if (holding.qty < qty) {
    return res.status(400).send("Not enough quantity");
  }

  holding.qty -= qty;
  holding.price = price;

  if (holding.qty === 0) {
    await HoldingsModel.deleteOne({ name, user: req.user._id });
  } else {
    await holding.save();
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

// Connect to database
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Start server only during local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("APP started on port", PORT);
  });
}

export default app;
