import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import { API_BASE_URL, SOCKET_URL } from "../config";

const GeneralContext = createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
  openSellWindow: () => {},
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
  livePrices: {},
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
  const [livePrices, setLivePrices] = useState({});

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
          axios.get(`${API_BASE_URL}/auth/me`, authConfig),
          axios.get(`${API_BASE_URL}/allHoldings`, authConfig),
          axios.get(`${API_BASE_URL}/allOrders`, authConfig),
          axios.get(`${API_BASE_URL}/dashboardSummary`, authConfig),
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

  // One shared socket connection for the whole dashboard, established once
  // here rather than per-component. If the socket can't connect (e.g. the
  // backend isn't running as a persistent process), livePrices just stays
  // empty and the rest of the dashboard is unaffected.
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("priceUpdate", (updates) => {
      setLivePrices((prev) => {
        const next = { ...prev };
        updates.forEach(({ symbol, price }) => {
          next[symbol] = price;
        });
        return next;
      });
    });

    // Reconnection is automatic and intentionally unbounded (useful for
    // local dev restarts), but on a deployed dashboard where SOCKET_URL
    // is unreachable that means constant retries - dedupe the log so a
    // dead connection doesn't flood the console on every attempt.
    let lastLoggedSocketError = null;
    socket.on("connect_error", (err) => {
      if (lastLoggedSocketError !== err.message) {
        console.error("Price stream connection error:", err.message);
        lastLoggedSocketError = err.message;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
        livePrices,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
      {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;