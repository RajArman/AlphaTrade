import test from "node:test";
import assert from "node:assert/strict";

import {
  SIMULATED_SYMBOLS,
  nextPrice,
  createInitialPriceState,
  generatePriceTick,
} from "../utils/priceSimulator.js";

test("nextPrice stays within +/-0.5% of the current price", () => {
  const current = 100;
  const updated = nextPrice(current);

  assert.ok(updated >= current * 0.995 - 0.01);
  assert.ok(updated <= current * 1.005 + 0.01);
});

test("nextPrice never returns zero or a negative price, even from a tiny starting price", () => {
  for (let i = 0; i < 50; i++) {
    const updated = nextPrice(0.05);
    assert.ok(updated > 0);
  }
});

test("nextPrice rounds to at most 2 decimal places (paise)", () => {
  const updated = nextPrice(1555.45);
  const decimals = (String(updated).split(".")[1] || "").length;
  assert.ok(decimals <= 2);
});

test("createInitialPriceState seeds one entry per simulated symbol at its base price", () => {
  const state = createInitialPriceState();

  assert.equal(state.size, SIMULATED_SYMBOLS.length);
  SIMULATED_SYMBOLS.forEach(({ symbol, basePrice }) => {
    assert.equal(state.get(symbol), basePrice);
  });
});

test("generatePriceTick returns one update per symbol and advances the shared state", () => {
  const state = createInitialPriceState();
  const before = new Map(state);

  const updates = generatePriceTick(state);

  assert.equal(updates.length, SIMULATED_SYMBOLS.length);

  updates.forEach(({ symbol, price }) => {
    assert.ok(before.has(symbol));
    assert.equal(state.get(symbol), price);
  });
});

test("generatePriceTick emits every symbol exactly once", () => {
  const state = createInitialPriceState();
  const updates = generatePriceTick(state);

  const symbols = updates.map((u) => u.symbol).sort();
  const expected = SIMULATED_SYMBOLS.map((s) => s.symbol).sort();

  assert.deepEqual(symbols, expected);
});
