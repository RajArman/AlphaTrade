import { useContext, useEffect, useState } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Summary = () => {
  const { user, orders } = useContext(GeneralContext);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3002/dashboardSummary",
          { withCredentials: true }
        );

        if (data.success) {
          setSummary(data);
        }
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      }
    };

    fetchSummary();
  }, []);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const recentOrders = orders ? orders.slice(-4).reverse() : [];

  if (!summary) {
    return <p>Loading portfolio summary...</p>;
  }

  return (
    <>
      <div className="username">
        <h6>Hi, {user?.username || "User"} 👋</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatNumber(summary.availableMargin)}</h3>
            <p>Margin available</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Margins used <span>{formatNumber(summary.marginsUsed)}</span>
            </p>

            <p>
              Opening balance <span>{formatNumber(summary.openingBalance)}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({summary.totalHoldings})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={summary.profitLoss >= 0 ? "profit" : "loss"}>
              {formatNumber(summary.profitLoss)}{" "}
              <small>
                {summary.profitLossPercent >= 0 ? "+" : ""}
                {summary.profitLossPercent.toFixed(2)}%
              </small>
            </h3>
            <p>P&amp;L</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Current Value <span>{formatNumber(summary.currentValue)}</span>
            </p>

            <p>
              Investment <span>{formatNumber(summary.investment)}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Recent Transactions</p>
        </span>

        {recentOrders.length === 0 ? (
          <p style={{ color: "#8a8a8a", fontSize: "0.9rem" }}>
            No recent transactions yet.
          </p>
        ) : (
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Type</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.name}</td>
                    <td>{order.qty}</td>
                    <td>{formatNumber(order.price)}</td>
                    <td className={order.mode === "BUY" ? "profit" : "loss"}>
                      {order.mode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;