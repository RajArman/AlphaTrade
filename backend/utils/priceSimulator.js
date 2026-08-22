// Simulated demo market data only. AlphaTrade has no real external stock
// price feed - these symbols/base prices mirror the dashboard's static
// watchlist (dashboard/src/data/data.js) purely so the Socket.IO push flow
// has something realistic-looking to broadcast. This is NOT real market data.
export const SIMULATED_SYMBOLS = [
  { symbol: "INFY", basePrice: 1555.45 },
  { symbol: "ONGC", basePrice: 116.8 },
  { symbol: "TCS", basePrice: 3194.8 },
  { symbol: "KPITTECH", basePrice: 266.45 },
  { symbol: "QUICKHEAL", basePrice: 308.55 },
  { symbol: "WIPRO", basePrice: 577.75 },
  { symbol: "M&M", basePrice: 779.8 },
  { symbol: "RELIANCE", basePrice: 2112.4 },
  { symbol: "HUL", basePrice: 512.4 },
];

const MAX_TICK_JITTER = 0.005; // +/-0.5% per tick
const MIN_PRICE = 0.05;

// Small random walk step, rounded to paise and floored above zero so a long
// run of unlucky ticks can never drift a price to 0 or negative.
export const nextPrice = (currentPrice) => {
  const changePercent = (Math.random() - 0.5) * 2 * MAX_TICK_JITTER;
  const next = currentPrice * (1 + changePercent);
  return Math.max(Number(next.toFixed(2)), MIN_PRICE);
};

export const createInitialPriceState = () =>
  new Map(SIMULATED_SYMBOLS.map(({ symbol, basePrice }) => [symbol, basePrice]));

// Advances every symbol in `priceState` by one tick (mutating it in place)
// and returns the batch of { symbol, price } updates to broadcast.
export const generatePriceTick = (priceState) => {
  const updates = [];

  for (const [symbol, price] of priceState.entries()) {
    const updatedPrice = nextPrice(price);
    priceState.set(symbol, updatedPrice);
    updates.push({ symbol, price: updatedPrice });
  }

  return updates;
};
