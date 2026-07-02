import { useState, createContext, useEffect } from "react";
import axios from "axios";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid) => {},
  closeSellWindow: () => {},
  refreshCount: 0,
  triggerRefresh: () => {},
  user: null,
  holdings: [],
  orders: [],
  positions: [],
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const [user, setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [positions, setPositions] = useState([]);

  const handleOpenBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  const handleOpenSellWindow = (uid) => {
    setSelectedStockUID(uid);
    setIsSellWindowOpen(true);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
  };

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");

      const authConfig = {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [userRes, holdingsRes, ordersRes, positionsRes] =
        await Promise.all([
          axios.get("https://alpha-trade-iota.vercel.app/auth/me", authConfig),
          axios.get("https://alpha-trade-iota.vercel.app/allHoldings", authConfig),
          axios.get("https://alpha-trade-iota.vercel.app/allOrders", authConfig),
          axios.get("https://alpha-trade-iota.vercel.app/allPositions", authConfig),
        ]);

      if (userRes.data.success) {
        setUser(userRes.data.user);
      }

      setHoldings(holdingsRes.data);
      setOrders(ordersRes.data);
      setPositions(positionsRes.data);
    } catch (err) {
      console.error("Error fetching data in Context:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [refreshCount]);

  const triggerRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        refreshCount,
        triggerRefresh,
        user,
        holdings,
        orders,
        positions,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
      {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;