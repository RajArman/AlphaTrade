import { useContext, useEffect, useState } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Summary = () => {
  const { user } = useContext(GeneralContext);

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
    </>
  );
};

export default Summary;