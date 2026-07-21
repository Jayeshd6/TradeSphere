import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function PortfolioInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const response = await api.get("/portfolio/insights");
      setInsights(response.data);
    } catch (error) {
      console.error("Failed to fetch portfolio insights:", error);
      toast.error("Failed to load portfolio insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 h-80 flex items-center justify-center">
        <p className="text-slate-500 font-semibold text-sm">Loading portfolio insights...</p>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">📊</span>
        <h2 className="text-xl font-bold text-slate-800">Portfolio Insights</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Ring */}
        <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-green-500 transition-all duration-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * insights.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800">{insights.score}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-3 uppercase tracking-wider">Health Score</p>
        </div>

        {/* Analytics details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Risk</span>
              <span className={`text-base font-bold block mt-1 ${
                insights.riskLevel === "High" ? "text-red-600" : insights.riskLevel === "Medium" ? "text-yellow-600" : "text-green-600"
              }`}>{insights.riskLevel}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Diversification</span>
              <span className="text-base font-bold text-slate-800 block mt-1">{insights.diversification}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Largest Holding</span>
              <span className="text-base font-bold text-slate-800 block mt-1 uppercase">{insights.largestHolding}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Cash Balance</span>
              <span className="text-base font-bold text-slate-800 block mt-1">
                ₹{insights.cashBalance.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Performers */}
          <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className="text-green-600">▲</span> Best Performer
              </span>
              <span className="text-sm font-bold text-green-700 block mt-1 uppercase">
                {insights.bestPerformer || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className="text-red-600">▼</span> Worst Performer
              </span>
              <span className="text-sm font-bold text-red-700 block mt-1 uppercase">
                {insights.worstPerformer || "N/A"}
              </span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-sm font-bold text-slate-800 block mb-3">Suggestions</span>
            <ul className="space-y-2.5">
              {insights.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioInsights;
