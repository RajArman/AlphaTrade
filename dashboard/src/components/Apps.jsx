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

  const formatNumber = (num) =>
    num.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "25px" }}>Portfolio Insights</h2>

      <div className="row">
        <div className="col">
          <h5>{holdings.length}</h5>
          <p>Total Holdings</p>
        </div>

        <div className="col">
          <h5>{formatNumber(currentValue)}</h5>
          <p>Current Value</p>
        </div>

        <div className="col">
          <h5 className={totalPL >= 0 ? "profit" : "loss"}>
            {formatNumber(totalPL)}
          </h5>
          <p>Total P&amp;L</p>
        </div>
      </div>

      <div className="section" style={{ marginTop: "40px" }}>
        <span>
          <p>Quick Stats</p>
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
                <td>{buyOrders}</td>
              </tr>
              <tr>
                <td>Sell Orders</td>
                <td>{sellOrders}</td>
              </tr>
              <tr>
                <td>Best Holding</td>
                <td>{bestStock ? bestStock.name : "No holdings yet"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Apps;