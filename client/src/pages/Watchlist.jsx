import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/layout";
import WatchlistCard from "../components/watchlist/WatchlistCard";
import api from "../services/api";
import SkeletonDashboard from "../components/loading/SkeletonDashboard";
import EmptyState from "../components/common/EmptyState";

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
        <SkeletonDashboard />
      ) : watchlist.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="Watchlist is Empty"
          description="Add your favorite stocks to track them easily."
          buttonText="Browse Market"
          buttonLink="/market"
        />
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
