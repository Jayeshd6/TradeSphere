import { useState } from "react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";

const PRESET_PROMPTS = [
  {
    text: "Should I buy NVDA?",
    type: "analyze-stock",
    label: "Analyze NVDA",
  },
  {
    text: "Review my portfolio holdings",
    type: "portfolio-review",
    label: "Portfolio Review",
  },
  {
    text: "Give me general financial advice",
    type: "financial-advice",
    label: "Financial Planning Tips",
  },
];

function AskAI({ onAsk, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    
    // Determine type based on query content for custom routing
    let type = "financial-advice";
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("portfolio") || lowerQuery.includes("holdings") || lowerQuery.includes("my assets")) {
      type = "portfolio-review";
    } else if (lowerQuery.includes("buy") || lowerQuery.includes("sell") || lowerQuery.includes("analyze") || lowerQuery.match(/\b[a-z]{2,5}\b/)) {
      type = "analyze-stock";
    }

    onAsk(query, type);
  };

  const handlePresetClick = (preset) => {
    setQuery(preset.text);
    onAsk(preset.text, preset.type);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="bg-green-50 text-green-600 p-3 rounded-xl border border-green-100">
          <FaRobot size={22} className="animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">AI Financial Assistant</h2>
          <p className="text-sm text-slate-500 mt-0.5">Ask questions, evaluate stocks, or review portfolio holdings</p>
        </div>
      </div>

      {/* Preset suggestions */}
      <div className="flex flex-wrap gap-2.5">
        {PRESET_PROMPTS.map((preset, index) => (
          <button
            key={index}
            onClick={() => handlePresetClick(preset)}
            disabled={loading}
            className="text-xs font-bold text-slate-600 bg-slate-50 hover:bg-green-50 hover:text-green-700 hover:border-green-200 border border-slate-200 rounded-xl px-4 py-2.5 transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          placeholder="Ask anything about saving, stock analysis, or portfolio recommendations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-5 pr-14 py-4 text-base outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-3.5 bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  );
}

export default AskAI;
