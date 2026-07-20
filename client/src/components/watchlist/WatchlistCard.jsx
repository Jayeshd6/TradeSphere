import RemoveWatchlistButton from "./RemoveWatchlistButton";

function WatchlistCard({ stock, refresh }) {
  const isPositive = stock.change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
          {stock.symbol}
        </h2>

        <p className="text-slate-500 text-sm mt-1">
          {stock.companyName}
        </p>

        <h3 className="text-2xl font-black mt-4 text-slate-900">
          ₹{stock.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </h3>

        <p
          className={`text-sm font-bold mt-1 ${
            isPositive ? "text-green-600" : "text-red-650"
          }`}
        >
          {isPositive ? "+" : ""}
          {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
          {stock.changePercent.toFixed(2)}%)
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50">
        <RemoveWatchlistButton
          symbol={stock.symbol}
          refresh={refresh}
        />
      </div>
    </div>
  );
}

export default WatchlistCard;
