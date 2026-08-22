import test from "node:test";
import assert from "node:assert/strict";

// /allOrders now runs OrdersModel.find({ user }).sort({ createdAt: -1 }) so
// transaction history is deterministically newest-first, instead of relying
// on MongoDB's unspecified natural document order. These tests mirror that
// same "sort by createdAt descending" comparator at the unit level - the
// real Mongo query itself would require a live/in-memory replica set to
// exercise directly, consistent with how Milestones 2-3 tested query
// predicates.

const sortNewestFirst = (orders) =>
  [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

test("sorting orders by createdAt descending puts the most recent transaction first", () => {
  const orders = [
    { name: "INFY", mode: "BUY", createdAt: "2026-08-20T10:00:00.000Z" },
    { name: "TCS", mode: "SELL", createdAt: "2026-08-22T09:00:00.000Z" },
    { name: "WIPRO", mode: "BUY", createdAt: "2026-08-21T15:00:00.000Z" },
  ];

  const sorted = sortNewestFirst(orders);

  assert.deepEqual(
    sorted.map((o) => o.name),
    ["TCS", "WIPRO", "INFY"]
  );
});

test("sorting preserves every order - only the order changes, not the count", () => {
  const orders = [
    { name: "A", createdAt: "2026-08-20T10:00:00.000Z" },
    { name: "B", createdAt: "2026-08-21T10:00:00.000Z" },
  ];

  const sorted = sortNewestFirst(orders);

  assert.equal(sorted.length, orders.length);
  assert.deepEqual(new Set(sorted.map((o) => o.name)), new Set(["A", "B"]));
});

test("sorting an empty order history returns an empty list", () => {
  assert.deepEqual(sortNewestFirst([]), []);
});
