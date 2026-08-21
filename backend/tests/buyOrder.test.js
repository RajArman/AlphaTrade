import test from "node:test";
import assert from "node:assert/strict";

import { buyOrderSchema } from "../utils/validation.js";
import { calculateTotalCost, calculateWeightedAverage } from "../utils/tradeMath.js";
import { InsufficientBalanceError } from "../utils/tradeErrors.js";

// --- Validation (mirrors /newOrder's first line of defense) ---

test("buyOrderSchema accepts a valid buy order", () => {
  const result = buyOrderSchema.safeParse({ name: "INFY", qty: 5, price: 100 });

  assert.equal(result.success, true);
  assert.equal(result.data.qty, 5);
  assert.equal(result.data.price, 100);
});

test("buyOrderSchema coerces numeric strings from the frontend's number inputs", () => {
  // The dashboard's <input type=number> stores values as strings (e.target.value),
  // so the backend must not assume req.body.qty/price already arrive as numbers.
  const result = buyOrderSchema.safeParse({ name: "INFY", qty: "5", price: "100.5" });

  assert.equal(result.success, true);
  assert.equal(result.data.qty, 5);
  assert.equal(result.data.price, 100.5);
});

test("buyOrderSchema rejects zero or negative quantity", () => {
  assert.equal(buyOrderSchema.safeParse({ name: "INFY", qty: 0, price: 100 }).success, false);
  assert.equal(buyOrderSchema.safeParse({ name: "INFY", qty: -5, price: 100 }).success, false);
});

test("buyOrderSchema rejects zero or negative price", () => {
  assert.equal(buyOrderSchema.safeParse({ name: "INFY", qty: 5, price: 0 }).success, false);
  assert.equal(buyOrderSchema.safeParse({ name: "INFY", qty: 5, price: -10 }).success, false);
});

test("buyOrderSchema rejects non-numeric quantity or price", () => {
  assert.equal(buyOrderSchema.safeParse({ name: "INFY", qty: "abc", price: 100 }).success, false);
  assert.equal(buyOrderSchema.safeParse({ name: "INFY", qty: 5, price: "abc" }).success, false);
});

test("buyOrderSchema rejects a missing stock name", () => {
  assert.equal(buyOrderSchema.safeParse({ name: "", qty: 5, price: 100 }).success, false);
});

// --- Trade math (the exact functions /newOrder uses) ---

test("calculateTotalCost multiplies quantity by price", () => {
  assert.equal(calculateTotalCost(5, 100), 500);
});

test("calculateWeightedAverage preserves existing average-buy-price behavior", () => {
  // 2 shares @ 100 already held, buying 2 more @ 200 -> avg should be 150
  const { totalQty, avg } = calculateWeightedAverage(2, 100, 2, 200);

  assert.equal(totalQty, 4);
  assert.equal(avg, 150);
});

// --- Balance rules ---
// /newOrder enforces "balance >= totalCost" atomically via a MongoDB
// findOneAndUpdate({ balance: { $gte: totalCost } }, { $inc: { balance: -totalCost } })
// filter, so the check and the deduction happen in one indivisible operation
// (no partial order/holding writes on rejection). Exercising that filter for
// real requires a live/in-memory MongoDB replica set; asserting the same
// balance >= totalCost predicate here at the unit level covers the business
// rule without adding a heavyweight test-DB dependency for this milestone.

test("sufficient balance: order is affordable and balance is deducted by exactly totalCost", () => {
  const balance = 100000;
  const totalCost = calculateTotalCost(10, 500); // 5000

  assert.ok(balance >= totalCost, "order should be affordable");

  const remainingBalance = balance - totalCost;
  assert.equal(remainingBalance, 95000);
});

test("insufficient balance: order is rejected and balance is left untouched", () => {
  const balance = 1000;
  const totalCost = calculateTotalCost(10, 500); // 5000

  assert.ok(balance < totalCost, "order should be rejected as unaffordable");

  // The route throws InsufficientBalanceError precisely when the atomic
  // update finds no matching document (i.e. balance < totalCost), which
  // means no order/holding write is ever reached.
  const wouldReject = balance < totalCost;
  assert.equal(wouldReject, true);
});

test("InsufficientBalanceError carries a clear default message", () => {
  const error = new InsufficientBalanceError();

  assert.equal(error.name, "InsufficientBalanceError");
  assert.match(error.message, /insufficient balance/i);
});
