import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../../services/api";

function SearchStock({ onSelectStock, defaultSymbol = "NVDA" }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search API call
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/stocks/search?q=${search}`);
        setResults(response.data.stocks || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSelect = (stock) => {
    onSelectStock(stock.symbol);
    setSearch(stock.symbol);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-slate-400">
          <FaSearch />
        </span>
        <input
          type="text"
          placeholder="Search stocks (e.g. NVIDIA, AAPL, MSFT)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {loading && (
        <div className="absolute right-4 top-3.5 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-green-500"
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
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-64 overflow-y-auto transition-all duration-200">
          {results.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelect(stock)}
              className="w-full flex flex-col items-start px-5 py-3.5 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors text-left"
            >
              <span className="font-bold text-slate-800 text-sm tracking-wide">
                {stock.symbol}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {stock.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {showDropdown && search.trim() && !loading && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl px-5 py-4 text-center text-sm text-slate-500">
          No stocks found matching "{search}"
        </div>
      )}
    </div>
  );
}

export default SearchStock;
