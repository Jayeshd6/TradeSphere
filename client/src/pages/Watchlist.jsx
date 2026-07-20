import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/Layout";
import WatchlistCard from "../components/watchlist/WatchlistCard";
import api from "../services/api";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all watchlist items from server
  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/watchlist");
      setWatchlist(response.data.watchlist || []);
    } catch (error) {
      console.error("Watchlist fetch error:", error);
      toast.error("Failed to fetch watchlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Remove a stock symbol from watchlist
  const handleRemove = async (symbol) => {
    try {
      await api.delete(`/watchlist/${symbol}`);
      toast.success(`${symbol} removed from watchlist`);
      
      // Update local state to immediately reflect removal in UI
      setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
    } catch (error) {
      console.error("Watchlist delete error:", error);
      toast.error(error.response?.data?.message || "Failed to remove stock");
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          My Watchlist
        </h1>
        <p className="text-slate-500 mt-2">
          Monitor your favorite stock quotes and daily price changes
        </p>
      </div>

      {/* Watchlist Items Grid */}
      <WatchlistCard
        items={watchlist}
        loading={loading}
        onRemove={handleRemove}
      />
    </Layout>
  );
}

export default Watchlist;
