import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/layout";
import SearchStock from "../components/market/SearchStock";
import StockCard from "../components/market/StockCard";
import TradingChart from "../components/market/TradingChart";
import MarketBuyPanel from "../components/market/MarketBuyPanel";
import api from "../services/api";
import { addToWatchlist } from "../services/watchlistService";

function Market() {
  const [selectedStock, setSelectedStock] = useState({
    symbol: "NVDA",
    description: "NVIDIA Corporation",
  });
  const [balance, setBalance] = useState(0);

  // Fetch Wallet Balance
  const fetchBalance = useCallback(async () => {
    try {
      const response = await api.get("/transactions/balance");
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleBuySuccess = () => {
    fetchBalance();
  };

  const handleAddToWatchlist = async () => {
    try {
      await addToWatchlist(
        selectedStock.symbol,
        selectedStock.description
      );
      toast.success("Added to Watchlist");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to add stock"
      );
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

          <div className="px-1">
            <button
              onClick={handleAddToWatchlist}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              ⭐ Add to Watchlist
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
