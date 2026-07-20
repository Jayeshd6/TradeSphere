import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/layout";
import WatchlistCard from "../components/watchlist/WatchlistCard";
import api from "../services/api";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const response = await api.get("/watchlist");
      setWatchlist(response.data.watchlist || []);
    } catch (error) {
      console.error("Watchlist loading error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to load watchlist"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-slate-800 flex items-center gap-2">
        ⭐ Watchlist
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
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
          <span className="text-slate-500 font-semibold text-sm">Loading watchlist...</span>
        </div>
      ) : watchlist.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-sm">
          No stocks in watchlist.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
          {watchlist.map((stock) => (
            <WatchlistCard
              key={stock.id}
              stock={stock}
              refresh={fetchWatchlist}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Watchlist;
