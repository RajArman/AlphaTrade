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
  balance: 0,
  summary: null,
  isInitialLoading: true,
  hasError: false,
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const [user, setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(0);
  const [summary, setSummary] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

      const [userRes, holdingsRes, ordersRes, summaryRes] =
        await Promise.all([
          axios.get("https://alpha-trade-iota.vercel.app/auth/me", authConfig),
          axios.get("https://alpha-trade-iota.vercel.app/allHoldings", authConfig),
          axios.get("https://alpha-trade-iota.vercel.app/allOrders", authConfig),
          axios.get("https://alpha-trade-iota.vercel.app/dashboardSummary", authConfig),
        ]);

      if (userRes.data.success) {
        setUser(userRes.data.user);
      }

      setHoldings(holdingsRes.data);
      setOrders(ordersRes.data);

      if (summaryRes.data.success) {
        setBalance(summaryRes.data.availableMargin);
        setSummary(summaryRes.data);
      }

      setHasError(false);
    } catch (err) {
      console.error("Error fetching data in Context:", err);
      setHasError(true);
    } finally {
      setIsInitialLoading(false);
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
        balance,
        summary,
        isInitialLoading,
        hasError,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
      {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;