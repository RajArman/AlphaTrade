import { useContext } from "react";
import GeneralContext from "./GeneralContext";

const Apps = () => {
  const { holdings, orders } = useContext(GeneralContext);

  const totalInvestment = holdings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0
  );

  const currentValue = holdings.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0
  );

  const totalPL = currentValue - totalInvestment;

  const buyOrders = orders.filter((order) => order.mode === "BUY").length;
  const sellOrders = orders.filter((order) => order.mode === "SELL").length;

  const bestStock = holdings.length
    ? holdings.reduce((best, stock) => {
        const stockPL = stock.price * stock.qty - stock.avg * stock.qty;
        const bestPL = best.price * best.qty - best.avg * best.qty;
        return stockPL > bestPL ? stock : best;
      })
    : null;

  const worstStock = holdings.length
    ? holdings.reduce((worst, stock) => {
        const stockPL = stock.price * stock.qty - stock.avg * stock.qty;
        const worstPL = worst.price * worst.qty - worst.avg * worst.qty;
        return stockPL < worstPL ? stock : worst;
      })
    : null;

  const formatNumber = (num) =>
    num.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const insightCards = [
    {
      label: "Total Holdings",
      value: holdings.length,
      icon: "📦",
    },
    {
      label: "Investment",
      value: formatNumber(totalInvestment),
      icon: "💰",
    },
    {
      label: "Current Value",
      value: formatNumber(currentValue),
      icon: "📈",
    },
    {
      label: "Total P&L",
      value: formatNumber(totalPL),
      icon: totalPL >= 0 ? "🟢" : "🔴",
      className: totalPL >= 0 ? "profit" : "loss",
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "8px" }}>Portfolio Insights</h2>
      <p style={{ color: "#888", marginBottom: "30px" }}>
        Track your portfolio health, order activity, and key investment signals.
      </p>

      <div className="row">
        {insightCards.map((card) => (
          <div className="col" key={card.label}>
            <p style={{ fontSize: "1.6rem", marginBottom: "8px" }}>
              {card.icon}
            </p>
            <h5 className={card.className || ""}>{card.value}</h5>
            <p>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="section" style={{ marginTop: "45px" }}>
        <span>
          <p>Portfolio Statistics</p>
        </span>

        <div className="order-table">
          <table>
            <tbody>
              <tr>
                <td>Total Orders</td>
                <td>{orders.length}</td>
              </tr>
              <tr>
                <td>Buy Orders</td>
                <td className="profit">{buyOrders}</td>
              </tr>
              <tr>
                <td>Sell Orders</td>
                <td className="loss">{sellOrders}</td>
              </tr>
              <tr>
                <td>Best Holding</td>
                <td>{bestStock ? bestStock.name : "No holdings yet"}</td>
              </tr>
              <tr>
                <td>Weakest Holding</td>
                <td>{worstStock ? worstStock.name : "No holdings yet"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section" style={{ marginTop: "45px" }}>
        <span>
          <p>Portfolio Health</p>
        </span>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            background: "rgba(37, 99, 235, 0.04)",
          }}
        >
          <p>
            {holdings.length === 0
              ? "No holdings yet. Start by placing your first buy order."
              : totalPL >= 0
              ? "Your portfolio is currently in profit. Keep monitoring allocation and risk."
              : "Your portfolio is currently in loss. Review underperforming holdings carefully."}
          </p>

          <p style={{ marginBottom: 0, color: "#888" }}>
            Active holdings: {holdings.length} • Orders tracked: {orders.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Apps;