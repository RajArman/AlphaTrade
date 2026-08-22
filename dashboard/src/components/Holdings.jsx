import { useContext } from "react";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";
import Loading from "./Loading";
import ErrorState from "./ErrorState";

const Holdings = () => {
  const { holdings, isInitialLoading, hasError } = useContext(GeneralContext);

  const portfolioSummary = holdings.reduce(
    (summary, stock) => {
      summary.totalInvestment += stock.avg * stock.qty;
      summary.currentValue += stock.price * stock.qty;
      return summary;
    },
    { totalInvestment: 0, currentValue: 0 }
  );

  portfolioSummary.totalPL =
    portfolioSummary.currentValue - portfolioSummary.totalInvestment;
  portfolioSummary.pnlPercent =
    portfolioSummary.totalInvestment === 0
      ? 0
      : (portfolioSummary.totalPL / portfolioSummary.totalInvestment) * 100;

  const formatNumber = (num) => {
    return num.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const labels = holdings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Current Value",
        data: holdings.map((stock) => stock.price * stock.qty),
        backgroundColor: "rgba(37, 99, 235, 0.6)",
      },
    ],
  };

  if (isInitialLoading) {
    return <Loading />;
  }

  if (hasError) {
    return <ErrorState />;
  }

  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="row">
        <div className="col">
          <h5>{formatNumber(portfolioSummary.totalInvestment)}</h5>
          <p>Total Investment</p>
        </div>

        <div className="col">
          <h5>{formatNumber(portfolioSummary.currentValue)}</h5>
          <p>Current Value</p>
        </div>

        <div className="col">
          <h5 className={portfolioSummary.totalPL >= 0 ? "profit" : "loss"}>
            {formatNumber(portfolioSummary.totalPL)} (
            {portfolioSummary.pnlPercent.toFixed(2)}%)
          </h5>
          <p>Overall P&amp;L</p>
        </div>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((stock) => {
              const curValue = stock.price * stock.qty;
              const profitLoss = curValue - stock.avg * stock.qty;
              const isProfit = profitLoss >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.day >= 0 ? "profit" : "loss";

              return (
                <tr key={stock._id}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{formatNumber(stock.avg)}</td>
                  <td>{formatNumber(stock.price)}</td>
                  <td>{formatNumber(curValue)}</td>
                  <td className={profClass}>{formatNumber(profitLoss)}</td>
                  <td className={profClass}>
                    {stock.net > 0 ? "+" : ""}
                    {stock.net.toFixed(2)}%
                  </td>
                  <td className={dayClass}>
                    {stock.day > 0 ? "+" : ""}
                    {stock.day.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;