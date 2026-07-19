import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function BuyStock({ onSuccess }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  const [quantity, setQuantity] = useState("");

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  // Search Stocks
  const searchStocks = async (query) => {
    setSearch(query);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoadingSearch(true);

      const response = await api.get(
        `/stocks/search?q=${query}`
      );

      setResults(response.data.stocks);

    } catch (error) {
      console.error(error);

      toast.error("Failed to search stocks");
    } finally {
      setLoadingSearch(false);
    }
  };

  // Select Stock
  const selectStock = async (stock) => {
    try {
      const response = await api.get(
        `/stocks/quote/${stock.symbol}`
      );

      setSelectedStock({
        symbol: stock.symbol,
        companyName: stock.description,
        price: response.data.quote.c,
      });

      setSearch(stock.symbol);
      setResults([]);

    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch live price");
    }
  };

  // Buy Stock
  const handleBuy = async (e) => {
    e.preventDefault();

    if (!selectedStock) {
      return toast.error("Please select a stock");
    }

    if (!quantity || Number(quantity) <= 0) {
      return toast.error("Enter a valid quantity");
    }

    try {
      setBuyLoading(true);

      await api.post("/transactions/buy", {
        symbol: selectedStock.symbol,
        companyName: selectedStock.companyName,
        quantity: Number(quantity),
        price: selectedStock.price,
      });

      toast.success("Stock purchased successfully");

      // Refresh Portfolio
      if (onSuccess) {
        onSuccess();
      }

      // Reset Form
      setSearch("");
      setSelectedStock(null);
      setQuantity("");
      setResults([]);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to buy stock"
      );
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <h2 className="text-xl font-bold mb-6">
        Buy Stock
      </h2>

      <form
        onSubmit={handleBuy}
        className="space-y-5"
      >

        {/* Search */}
        <div>

          <label className="block text-sm font-medium mb-2">
            Search Stock
          </label>

          <input
            type="text"
            placeholder="Search by Symbol..."
            value={search}
            onChange={(e) =>
              searchStocks(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {loadingSearch && (
            <p className="text-sm text-slate-500 mt-2">
              Searching...
            </p>
          )}

          {results.length > 0 && (
            <div className="border rounded-lg mt-2 max-h-60 overflow-y-auto">

              {results.map((stock) => (

                <div
                  key={stock.symbol}
                  onClick={() =>
                    selectStock(stock)
                  }
                  className="p-3 hover:bg-slate-100 cursor-pointer border-b"
                >
                  <p className="font-semibold">
                    {stock.symbol}
                  </p>

                  <p className="text-sm text-slate-500">
                    {stock.description}
                  </p>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* Selected Stock */}
        {selectedStock && (

          <div className="bg-slate-50 rounded-lg p-4">

            <p>
              <strong>Company:</strong>{" "}
              {selectedStock.companyName}
            </p>

            <p className="mt-2">
              <strong>Current Price:</strong>{" "}
              ₹{selectedStock.price}
            </p>

          </div>

        )}

        {/* Quantity */}
        <div>

          <label className="block text-sm font-medium mb-2">
            Quantity
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter quantity"
          />

        </div>

        {/* Total Cost */}
        {selectedStock && quantity && (
          <div className="bg-green-50 rounded-lg p-4">

            <p className="font-semibold text-green-700">
              Total Cost
            </p>

            <h3 className="text-2xl font-bold text-green-600">
              ₹
              {(
                selectedStock.price *
                Number(quantity)
              ).toLocaleString("en-IN")}
            </h3>

          </div>
        )}

        <button
          type="submit"
          disabled={buyLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {buyLoading ? "Buying..." : "Buy Stock"}
        </button>

      </form>

    </div>
  );
}

export default BuyStock;