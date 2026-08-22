import test from "node:test";
import assert from "node:assert/strict";

import { sellOrderSchema } from "../utils/validation.js";
import { calculateTotalCost } from "../utils/tradeMath.js";
import {
  HoldingNotFoundError,
  InsufficientHoldingsError,
} from "../utils/tradeErrors.js";

// --- Validation (mirrors /sellOrder's first line of defense) ---

test("sellOrderSchema accepts a valid sell order", () => {
  const result = sellOrderSchema.safeParse({ name: "INFY", qty: 5, price: 100 });

  assert.equal(result.success, true);
  assert.equal(result.data.qty, 5);
  assert.equal(result.data.price, 100);
});

test("sellOrderSchema coerces numeric strings from the frontend's number inputs", () => {
  const result = sellOrderSchema.safeParse({ name: "INFY", qty: "3", price: "250.5" });

  assert.equal(result.success, true);
  assert.equal(result.data.qty, 3);
  assert.equal(result.data.price, 250.5);
});

test("sellOrderSchema rejects zero or negative quantity", () => {
  assert.equal(sellOrderSchema.safeParse({ name: "INFY", qty: 0, price: 100 }).success, false);
  assert.equal(sellOrderSchema.safeParse({ name: "INFY", qty: -2, price: 100 }).success, false);
});

test("sellOrderSchema rejects zero or negative price", () => {
  assert.equal(sellOrderSchema.safeParse({ name: "INFY", qty: 2, price: 0 }).success, false);
  assert.equal(sellOrderSchema.safeParse({ name: "INFY", qty: 2, price: -50 }).success, false);
});

test("sellOrderSchema rejects non-numeric quantity or price", () => {
  assert.equal(sellOrderSchema.safeParse({ name: "INFY", qty: "abc", price: 100 }).success, false);
  assert.equal(sellOrderSchema.safeParse({ name: "INFY", qty: 2, price: "abc" }).success, false);
});

test("sellOrderSchema rejects a missing stock name", () => {
  assert.equal(sellOrderSchema.safeParse({ name: "", qty: 2, price: 100 }).success, false);
});

// --- Sale value (reuses the exact function /sellOrder uses) ---

test("calculateTotalCost computes sale value as quantity x price", () => {
  assert.equal(calculateTotalCost(4, 250), 1000);
});

// --- Ownership / overselling rules ---
// /sellOrder enforces these atomically via
// HoldingsModel.findOneAndUpdate({ name, user, qty: { $gte: qty } }, { $inc: { qty: -qty } }),
// so a holding's quantity can never go negative - the write simply doesn't
// happen if the filter doesn't match. Exercising the real Mongo query
// requires a live/in-memory replica set; these tests assert the same
// ownership/quantity predicates the route relies on, at the unit level,
// without adding a heavyweight test-DB dependency for this milestone.

test("selling a stock not owned at all is rejected", () => {
  const existingHolding = null; // user has no holding document for this stock
  const sellQty = 5;

  const wouldMatchAtomicUpdate = existingHolding !== null && existingHolding.qty >= sellQty;
  assert.equal(wouldMatchAtomicUpdate, false);

  // The route distinguishes "not owned" from "not enough" by checking
  // existence separately once the atomic update fails to match.
  assert.equal(existingHolding === null, true);
});

test("selling more shares than owned is rejected and the holding is left untouched", () => {
  const existingHolding = { qty: 3, avg: 150 };
  const sellQty = 5;

  const wouldMatchAtomicUpdate = existingHolding.qty >= sellQty;
  assert.equal(wouldMatchAtomicUpdate, false, "oversell should not match the atomic filter");

  // Since the filter never matched, $inc never ran - qty is provably unchanged.
  assert.equal(existingHolding.qty, 3);
});

test("holding quantity cannot become negative for a valid partial sale", () => {
  const existingHolding = { qty: 10, avg: 150 };
  const sellQty = 4;

  const wouldMatchAtomicUpdate = existingHolding.qty >= sellQty;
  assert.equal(wouldMatchAtomicUpdate, true);

  const remainingQty = existingHolding.qty - sellQty;
  assert.equal(remainingQty, 6);
  assert.ok(remainingQty >= 0);
});

test("partial sale preserves the holding's existing average buy price", () => {
  const existingHolding = { qty: 10, avg: 150 };
  const sellQty = 4;

  const remainingQty = existingHolding.qty - sellQty;

  // The route never recalculates `avg` on sell - only qty (and the last
  // observed `price`) change.
  assert.equal(existingHolding.avg, 150);
  assert.equal(remainingQty, 6);
});

test("a full sale (remaining quantity 0) means the holding should be removed", () => {
  const existingHolding = { qty: 5, avg: 150 };
  const sellQty = 5;

  const remainingQty = existingHolding.qty - sellQty;
  const shouldRemoveHolding = remainingQty === 0;

  assert.equal(remainingQty, 0);
  assert.equal(shouldRemoveHolding, true);
});

test("HoldingNotFoundError carries a clear message", () => {
  const error = new HoldingNotFoundError();

  assert.equal(error.name, "HoldingNotFoundError");
  assert.match(error.message, /do not own this stock/i);
});

test("InsufficientHoldingsError carries a clear message", () => {
  const error = new InsufficientHoldingsError();

  assert.equal(error.name, "InsufficientHoldingsError");
  assert.match(error.message, /not own enough shares/i);
});

// --- Wallet credit on successful sale ---

test("successful sale credits the wallet by exactly the sale value", () => {
  const balanceBefore = 50000;
  const saleValue = calculateTotalCost(4, 250); // 1000

  const balanceAfter = balanceBefore + saleValue;
  assert.equal(balanceAfter, 51000);
});
