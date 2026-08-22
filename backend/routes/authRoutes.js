import {Router} from "express";
import rateLimit from "express-rate-limit";
import { signup, login, logout } from "../controllers/authController.js";
import { verifyUser } from "../middlewares/authMiddleware.js";

const router = Router();

// Lightweight brute-force protection: 10 attempts per 15 minutes per IP.
// Shared across /signup and /login on purpose - both are credential/account
// endpoints, so one combined limit per IP is simpler than two separate
// counters and still throttles either being hammered from one IP. Uses
// express-rate-limit's default in-memory store; no Redis/distributed store
// needed at this scope.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

// SIGNUP route
router.post("/signup", authRateLimiter, signup);
// LOGIN route
router.post("/login", authRateLimiter, login);
// verifyUser route
router.get("/me", verifyUser, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});
// Logout route
router.post("/logout", logout);

export default router;
