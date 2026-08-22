export const calculateHoldingMetrics = (qty, avg, currentPrice) => {
  const investedValue = qty * avg;
  const currentValue = qty * currentPrice;
  const profitLoss = currentValue - investedValue;
  const profitLossPercent = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

  return { investedValue, currentValue, profitLoss, profitLossPercent };
};

export const calculatePortfolioTotals = (holdings) => {
  const { totalInvested, totalCurrentValue } = holdings.reduce(
    (totals, holding) => {
      const { investedValue, currentValue } = calculateHoldingMetrics(
        holding.qty,
        holding.avg,
        holding.price
      );

      totals.totalInvested += investedValue;
      totals.totalCurrentValue += currentValue;
      return totals;
    },
    { totalInvested: 0, totalCurrentValue: 0 }
  );

  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercent =
    totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return { totalInvested, totalCurrentValue, totalProfitLoss, totalProfitLossPercent };
};

export const calculateTotalAccountValue = (walletBalance, totalCurrentValue) =>
  walletBalance + totalCurrentValue;
