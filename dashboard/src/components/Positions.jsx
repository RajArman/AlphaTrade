import { useContext } from "react";
import GeneralContext from "./GeneralContext";

const Positions = () => {
  const { positions } = useContext(GeneralContext);

  const formatNumber = (num) =>
    Number(num || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  return (
    <>
      <h3 className="title">Open Positions ({positions.length})</h3>

      {positions.length === 0 ? (
        <div
          style={{
            padding: "50px",
            textAlign: "center",
            color: "#888",
          }}
        >
          <h4>No Active Positions</h4>
          <p>
            Your intraday and open trading positions will appear here.
          </p>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Instrument</th>
                <th>Quantity</th>
                <th>Average Price</th>
                <th>Current Price</th>
                <th>P&amp;L</th>
                <th>Day Change</th>
              </tr>
            </thead>

            <tbody>
              {positions.map((stock, index) => {
                const currentValue = stock.price * stock.qty;
                const investment = stock.avg * stock.qty;
                const pnl = currentValue - investment;

                return (
                  <tr key={index}>
                    <td>{stock.product}</td>

                    <td>{stock.name}</td>

                    <td>{stock.qty}</td>

                    <td>₹ {formatNumber(stock.avg)}</td>

                    <td>₹ {formatNumber(stock.price)}</td>

                    <td className={pnl >= 0 ? "profit" : "loss"}>
                      ₹ {formatNumber(pnl)}
                    </td>

                    <td className={stock.day >= 0 ? "profit" : "loss"}>
                      {stock.day >= 0 ? "+" : ""}
                      {stock.day.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Positions;