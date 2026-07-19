import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/Layout";
import SearchStock from "../components/market/SearchStock";
import StockCard from "../components/market/StockCard";
import TradingChart from "../components/market/TradingChart";
import api from "../services/api";

function Market() {
  const [selectedStock, setSelectedStock] = useState({
    symbol: "NVDA",
    description: "NVIDIA Corporation",
  });
  const [stockDetails, setStockDetails] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch Wallet Balance
  const fetchBalance = useCallback(async () => {
    try {
      const response = await api.get("/transactions/balance");
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  }, []);

  // Fetch Selected Stock Details
  const fetchStockDetails = useCallback(async (symbol) => {
    setLoading(true);
    try {
      const response = await api.get(`/stocks/details/${symbol}`);
      setStockDetails(response.data.details);
    } catch (error) {
      console.error("Details fetch error:", error);
      toast.error("Failed to load stock details");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    if (selectedStock && selectedStock.symbol) {
      fetchStockDetails(selectedStock.symbol);
    }
  }, [selectedStock, fetchStockDetails]);

  const handleBuySuccess = () => {
    fetchBalance();
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
        <div className="mt-8 space-y-8">
          {/* Symbol & Description Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800">
              {selectedStock.symbol}
            </h2>
            <p className="text-slate-500 mt-1">
              {selectedStock.description}
            </p>
          </div>

          {/* Main Content Grid (Chart + Trade Station) */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="animate-spin h-10 w-10 text-green-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-slate-500 font-medium">Fetching live market data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* TradingView Chart Container */}
              <div className="lg:col-span-2">
                <TradingChart symbol={selectedStock.symbol} />
              </div>

              {/* Buy Form & Key Financial Metrics */}
              <div className="lg:col-span-1">
                <StockCard
                  details={stockDetails}
                  balance={balance}
                  onBuySuccess={handleBuySuccess}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default Market;
