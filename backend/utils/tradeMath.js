export const calculateTotalCost = (qty, price) => qty * price;

export const calculateWeightedAverage = (
  existingQty,
  existingAvg,
  incomingQty,
  incomingPrice
) => {
  const totalQty = existingQty + incomingQty;
  const avg = (existingAvg * existingQty + incomingPrice * incomingQty) / totalQty;
  return { totalQty, avg };
};
