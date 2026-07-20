import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import SearchStock from "../components/market/SearchStock";
import StockCard from "../components/market/StockCard";
import TradingChart from "../components/market/TradingChart";
import MarketBuyPanel from "../components/market/MarketBuyPanel";
import api from "../services/api";

function Market() {
  const [selectedStock, setSelectedStock] = useState({
    symbol: "NVDA",
    description: "NVIDIA Corporation",
  });
  const [balance, setBalance] = useState(0);
  const [watchlist, setWatchlist] = useState([]);

  // Fetch Wallet Balance
  const fetchBalance = useCallback(async () => {
    try {
      const response = await api.get("/transactions/balance");
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  }, []);

  // Fetch Watchlist items
  const fetchWatchlist = useCallback(async () => {
    try {
      const response = await api.get("/watchlist");
      setWatchlist(response.data.watchlist || []);
    } catch (error) {
      console.error("Watchlist fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchWatchlist();
  }, [fetchBalance, fetchWatchlist]);

  const handleBuySuccess = () => {
    fetchBalance();
  };

  const isWatchlisted = watchlist.some(
    (item) => item.symbol.toUpperCase() === selectedStock?.symbol?.toUpperCase()
  );

  const toggleWatchlist = async () => {
    if (!selectedStock) return;
    try {
      if (isWatchlisted) {
        await api.delete(`/watchlist/${selectedStock.symbol}`);
        toast.success(`Removed ${selectedStock.symbol} from watchlist`);
        setWatchlist((prev) =>
          prev.filter(
            (item) => item.symbol.toUpperCase() !== selectedStock.symbol.toUpperCase()
          )
        );
      } else {
        await api.post("/watchlist", {
          symbol: selectedStock.symbol,
          companyName: selectedStock.description,
        });
        toast.success(`Added ${selectedStock.symbol} to watchlist`);
        setWatchlist((prev) => [
          ...prev,
          {
            symbol: selectedStock.symbol,
            companyName: selectedStock.description,
            price: 0,
            changePercent: 0,
          },
        ]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update watchlist");
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Market
          </h1>
          <p className="text-slate-500 mt-2">
            Search and trade stocks
          </p>
        </div>
        {/* Wallet Balance Display */}
        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Wallet Balance
          </span>
          <span className="text-2xl font-black text-slate-800 mt-1">
            ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Search Input Section */}
      <div className="mb-8">
        <SearchStock onSelect={setSelectedStock} />
      </div>

      {/* Selected Stock Block & Interactive Views */}
      {selectedStock && (
        <div className="mt-8 space-y-6">
          <StockCard stock={selectedStock} />

          {/* Watchlist Toggle Action Button */}
          <div className="flex justify-end px-1">
            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-bold transition-all duration-200 shadow-sm ${
                isWatchlisted
                  ? "bg-amber-500 text-white border-transparent hover:bg-amber-600 hover:shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span className="text-base leading-none">{isWatchlisted ? "★" : "☆"}</span>
              <span>{isWatchlisted ? "Watchlisted" : "Add to Watchlist"}</span>
            </button>
          </div>

          {/* Main Content Grid (Chart + Trade Station) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TradingView Chart Container */}
            <div className="lg:col-span-2">
              <TradingChart symbol={selectedStock.symbol} />
            </div>

            {/* Buy Form & Key Financial Metrics */}
            <div className="lg:col-span-1">
              <div className="mt-8">
                <MarketBuyPanel
                  stock={selectedStock}
                  balance={balance}
                  onBuySuccess={handleBuySuccess}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Market;
