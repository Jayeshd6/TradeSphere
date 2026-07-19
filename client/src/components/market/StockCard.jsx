import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function StockCard({ details, balance, onBuySuccess }) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  if (!details) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-slate-500">
        Select a stock to view details and make a transaction.
      </div>
    );
  }

  const isPositive = details.change >= 0;
  const totalCost = Number(quantity) * details.price;

  const handleBuy = async (e) => {
    e.preventDefault();

    if (!quantity || Number(quantity) <= 0) {
      return toast.error("Please enter a valid quantity");
    }

    if (totalCost > balance) {
      return toast.error("Insufficient wallet balance");
    }

    setLoading(true);
    try {
      await api.post("/transactions/buy", {
        symbol: details.symbol,
        companyName: details.companyName,
        quantity: Number(quantity),
        price: details.price,
      });

      toast.success(`Successfully bought ${quantity} shares of ${details.symbol}`);
      setQuantity("");
      if (onBuySuccess) {
        onBuySuccess();
      }
    } catch (error) {
      console.error("Buy error:", error);
      toast.error(
        error.response?.data?.message || "Failed to purchase stock"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between h-full space-y-6">
      {/* Header Info */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {details.companyName}
            </h2>
            <span className="inline-block bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-md mt-1.5 uppercase">
              {details.symbol}
            </span>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-black text-slate-900">
              ₹{details.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h3>
            <span
              className={`inline-flex items-center text-sm font-bold mt-1 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {details.change.toFixed(2)} ({isPositive ? "+" : ""}
              {details.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Market Cap
            </p>
            <p className="text-sm font-bold text-slate-700 mt-0.5">
              {details.marketCap}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              P/E Ratio
            </p>
            <p className="text-sm font-bold text-slate-700 mt-0.5">
              {details.peRatio}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              52 Wk High
            </p>
            <p className="text-sm font-bold text-green-600 mt-0.5">
              ₹{details.high52Week.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              52 Wk Low
            </p>
            <p className="text-sm font-bold text-red-600 mt-0.5">
              ₹{details.low52Week.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Buy Form */}
      <form onSubmit={handleBuy} className="border-t border-slate-100 pt-5 space-y-4">
        <h4 className="text-base font-bold text-slate-800">Buy Stocks</h4>
        
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            placeholder="Number of shares"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {quantity && Number(quantity) > 0 && (
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Est. Cost
              </p>
              <p className="text-lg font-black text-slate-800 mt-0.5">
                ₹{totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
            {totalCost > balance ? (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-md">
                Insufficient Funds
              </span>
            ) : (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-md">
                Funds Available
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !quantity}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-100"
        >
          {loading ? "Processing Transaction..." : `Buy ${details.symbol}`}
        </button>
      </form>
    </div>
  );
}

export default StockCard;
