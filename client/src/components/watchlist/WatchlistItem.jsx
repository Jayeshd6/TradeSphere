import { FaTrash, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";

function WatchlistItem({ item, onRemove }) {
  const isPositive = item.changePercent >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        {/* Clickable link to detailed market analysis for this stock */}
        <Link
          to={`/market`}
          state={{ symbol: item.symbol, description: item.companyName }}
          className="hover:opacity-85"
        >
          <div className="bg-slate-50 text-slate-800 font-extrabold text-sm px-3 py-2 rounded-lg border uppercase border-slate-100">
            {item.symbol}
          </div>
        </Link>
        <div>
          <Link
            to={`/market`}
            state={{ symbol: item.symbol, description: item.companyName }}
            className="font-bold text-slate-800 hover:text-green-600 transition-colors"
          >
            {item.companyName}
          </Link>
          <p className="text-xs text-slate-400 mt-0.5">Live Market Quote</p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Quote Details */}
        <div className="text-right">
          <p className="text-lg font-black text-slate-800">
            ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold mt-1 px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {isPositive ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
            {isPositive ? "+" : ""}
            {item.changePercent.toFixed(2)}%
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onRemove(item.symbol)}
          className="text-slate-400 hover:text-red-500 p-2.5 rounded-lg hover:bg-red-50 transition-all duration-200"
          title="Remove from Watchlist"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
}

export default WatchlistItem;
