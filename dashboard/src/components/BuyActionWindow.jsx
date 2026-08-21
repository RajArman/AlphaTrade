import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1); // no of stock
  const [stockPrice, setStockPrice] = useState(0.0); // price of stock
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { closeBuyWindow, triggerRefresh } = useContext(GeneralContext);

 const handleBuyClick = async () => {
  const qty = Number(stockQuantity);
  const price = Number(stockPrice);

  if (!Number.isFinite(qty) || qty <= 0) {
    setErrorMessage("Quantity must be a positive number");
    return;
  }

  if (!Number.isFinite(price) || price <= 0) {
    setErrorMessage("Price must be a positive number");
    return;
  }

  setErrorMessage("");
  setIsSubmitting(true);

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://alpha-trade-iota.vercel.app/newOrder",
      {
        name: uid,
        qty,
        price,
        mode: "BUY",
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    triggerRefresh();
    closeBuyWindow();
  } catch (error) {
    console.error("Error in buy:", error);
    setErrorMessage(
      error.response?.data?.message || "Failed to place order. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>

        {errorMessage && (
          <p style={{ color: "#e53935", fontSize: "0.8rem", margin: "0 0 8px" }}>
            {errorMessage}
          </p>
        )}
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Buying..." : "Buy"}
          </button>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
