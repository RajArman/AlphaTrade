import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateHoldingMetrics,
  calculatePortfolioTotals,
  calculateTotalAccountValue,
} from "../utils/portfolioMath.js";

// --- Per-holding metrics ---

test("calculateHoldingMetrics computes invested value as quantity x average buy price", () => {
  const { investedValue } = calculateHoldingMetrics(10, 100, 120);
  assert.equal(investedValue, 1000);
});

test("calculateHoldingMetrics computes current value as quantity x current price", () => {
  const { currentValue } = calculateHoldingMetrics(10, 100, 120);
  assert.equal(currentValue, 1200);
});

test("calculateHoldingMetrics reports positive profit/loss when current price is above average buy price", () => {
  const { profitLoss } = calculateHoldingMetrics(10, 100, 120);
  assert.equal(profitLoss, 200);
  assert.ok(profitLoss > 0);
});

test("calculateHoldingMetrics reports negative profit/loss when current price is below average buy price", () => {
  const { profitLoss } = calculateHoldingMetrics(10, 100, 80);
  assert.equal(profitLoss, -200);
  assert.ok(profitLoss < 0);
});

test("calculateHoldingMetrics computes profit/loss percentage relative to invested value", () => {
  // invested = 1000, current = 1200, profit = 200 -> 20%
  const { profitLossPercent } = calculateHoldingMetrics(10, 100, 120);
  assert.equal(profitLossPercent, 20);
});

test("calculateHoldingMetrics returns 0% profit/loss when invested value is zero (no divide-by-zero)", () => {
  const { investedValue, profitLossPercent } = calculateHoldingMetrics(0, 0, 150);
  assert.equal(investedValue, 0);
  assert.equal(profitLossPercent, 0);
  assert.ok(Number.isFinite(profitLossPercent));
});

// --- Portfolio totals across multiple holdings ---

test("calculatePortfolioTotals sums invested/current value and derives overall profit/loss across holdings", () => {
  const holdings = [
    { qty: 10, avg: 100, price: 120 }, // invested 1000, current 1200, +200
    { qty: 5, avg: 200, price: 180 }, // invested 1000, current 900, -100
  ];

  const totals = calculatePortfolioTotals(holdings);

  assert.equal(totals.totalInvested, 2000);
  assert.equal(totals.totalCurrentValue, 2100);
  assert.equal(totals.totalProfitLoss, 100);
  assert.equal(totals.totalProfitLossPercent, 5); // 100 / 2000 * 100
});

test("calculatePortfolioTotals returns all zeros for an empty portfolio", () => {
  const totals = calculatePortfolioTotals([]);

  assert.equal(totals.totalInvested, 0);
  assert.equal(totals.totalCurrentValue, 0);
  assert.equal(totals.totalProfitLoss, 0);
  assert.equal(totals.totalProfitLossPercent, 0);
});

// --- Total account value ---

test("calculateTotalAccountValue adds wallet balance and current portfolio value", () => {
  assert.equal(calculateTotalAccountValue(50000, 2100), 52100);
});

test("calculateTotalAccountValue equals wallet balance when the portfolio is empty", () => {
  assert.equal(calculateTotalAccountValue(100000, 0), 100000);
});
