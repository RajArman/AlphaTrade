import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import { API_BASE_URL } from "../config";
import "./BuyActionWindow.css"; // reuse same css for now

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { closeSellWindow, triggerRefresh } = useContext(GeneralContext);

const handleSellClick = async () => {
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
      `${API_BASE_URL}/sellOrder`,
      {
        name: uid,
        qty,
        price,
        mode: "SELL",
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    triggerRefresh();
    closeSellWindow();
  } catch (error) {
    console.error("Error in sell:", error);
    setErrorMessage(
      error.response?.data?.message || "Failed to place order. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
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
            className="btn btn-red"
            onClick={handleSellClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Selling..." : "Sell"}
          </button>
          <Link className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
