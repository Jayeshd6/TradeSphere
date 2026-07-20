import WatchlistItem from "./WatchlistItem";

function WatchlistCard({ items = [], loading, onRemove }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
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
        <span className="text-slate-500 font-medium">Loading your watchlist...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-xl mx-auto">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
          <span className="text-2xl">⭐</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Your Watchlist is Empty</h3>
        <p className="text-slate-500 mt-2.5 max-w-md mx-auto leading-relaxed">
          Add stocks from the Market page to monitor real-time prices, growth rates, and charts on this dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Tracked Stocks ({items.length})
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <WatchlistItem key={item.symbol} item={item} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

export default WatchlistCard;
