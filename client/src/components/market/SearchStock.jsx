import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function SearchStock({ onSelect }) {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchStocks = async (value) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setStocks([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/stocks/search?q=${value}`
      );

      setStocks(response.data.stocks);
    } catch (error) {
      toast.error("Failed to search stocks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">

      <input
        type="text"
        placeholder="Search stocks..."
        value={query}
        onChange={(e) => searchStocks(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
      />

      {loading && (
        <p className="mt-2 text-sm text-slate-500">
          Searching...
        </p>
      )}

      {stocks.length > 0 && (
        <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border">

          {stocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => {
                onSelect(stock);
                setQuery(stock.description);
                setStocks([]);
              }}
              className="w-full text-left px-4 py-3 hover:bg-slate-100"
            >
              <p className="font-semibold">
                {stock.symbol}
              </p>

              <p className="text-sm text-slate-500">
                {stock.description}
              </p>
            </button>
          ))}

        </div>
      )}

    </div>
  );
}

export default SearchStock;
