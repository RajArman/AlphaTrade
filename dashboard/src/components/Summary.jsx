import { useContext } from "react";
import GeneralContext from "./GeneralContext";
import Loading from "./Loading";
import ErrorState from "./ErrorState";

const Summary = () => {
  const { user, orders, summary, isInitialLoading, hasError } =
    useContext(GeneralContext);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  // /allOrders now returns orders newest-first, so the first 4 are the
  // most recent transactions - no manual reversal needed.
  const recentOrders = orders ? orders.slice(0, 4) : [];

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  if (isInitialLoading) {
    return <Loading />;
  }

  if (hasError || !summary) {
    return <ErrorState />;
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

            <p>
              Total account value <span>{formatNumber(summary.totalAccountValue)}</span>
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
                  <th>Date</th>
                  <th>Name</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Type</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{formatDate(order.createdAt)}</td>
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