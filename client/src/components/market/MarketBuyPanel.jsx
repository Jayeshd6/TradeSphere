import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function MarketBuyPanel({ stock, balance, onBuySuccess }) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (!stock) return;
    
    const fetchPrice = async () => {
      try {
        const response = await api.get(`/stocks/quote/${stock.symbol}`);
        setPrice(response.data.quote.c);
      } catch (err) {
        console.error("Failed to load live price for buy panel", err);
      }
    };
    fetchPrice();
  }, [stock]);

  if (!stock || !price) return null;

  const totalCost = Number(quantity) * price;

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
        symbol: stock.symbol,
        companyName: stock.description,
        quantity: Number(quantity),
        price: price,
      });

      toast.success(`Successfully bought ${quantity} shares of ${stock.symbol}`);
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
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 space-y-4">
      <h4 className="text-lg font-bold text-slate-800">Buy Stocks</h4>
      
      <form onSubmit={handleBuy} className="space-y-4">
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
            className="w-full border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? "Processing..." : `Buy ${stock.symbol}`}
        </button>
      </form>
    </div>
  );
}

export default MarketBuyPanel;
