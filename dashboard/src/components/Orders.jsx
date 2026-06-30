import { Link } from "react-router-dom";
import GeneralContext from "./GeneralContext";
import { useContext } from "react";

const Orders = () => {
  const { orders } = useContext(GeneralContext);

  const formatNumber = (num) =>
    Number(num || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  return (
    <div className="orders">
      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No orders yet</h3>
          <p>Start by selecting a stock from your watchlist and placing your first order.</p>
          <Link to="/" className="btn">
            Go to Watchlist
          </Link>
        </div>
      ) : (
        <>
          <h3 className="title">Orders ({orders.length})</h3>

          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Quantity</th>
                  <th>Order Price</th>
                  <th>Order Type</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
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
        </>
      )}
    </div>
  );
};

export default Orders;