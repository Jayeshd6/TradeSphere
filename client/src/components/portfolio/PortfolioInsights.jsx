import { useMemo } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

function PortfolioInsights({ portfolios = [], balance = 0 }) {
  const insights = useMemo(() => {
    if (!portfolios || portfolios.length === 0) return null;

    // 1. Basic sums
    const portfolioValue = portfolios.reduce((sum, p) => sum + p.currentValue, 0);
    const totalInvested = portfolios.reduce((sum, p) => sum + p.invested, 0);
    const totalCapital = portfolioValue + balance;

    // 2. Cash ratio
    const cashPercent = totalCapital > 0 ? (balance / totalCapital) * 100 : 0;

    // 3. Best / Worst Performers & Largest Holding
    let largest = portfolios[0];
    let best = portfolios[0];
    let worst = portfolios[0];

    portfolios.forEach((p) => {
      if (p.currentValue > largest.currentValue) largest = p;
      if (p.profitPercent > best.profitPercent) best = p;
      if (p.profitPercent < worst.profitPercent) worst = p;
    });

    const largestWeight = portfolioValue > 0 ? (largest.currentValue / portfolioValue) * 100 : 0;

    // 4. Diversification Check
    const count = portfolios.length;
    let diversification = "Poor";
    if (count >= 6) diversification = "Excellent";
    else if (count >= 4) diversification = "Good";
    else if (count >= 2) diversification = "Fair";

    // 5. Risk Assessment
    let risk = "Low";
    if (largestWeight > 50) risk = "High";
    else if (largestWeight > 30) risk = "Medium";

    // 6. Overall Portfolio Score Algorithm (out of 100)
    let score = 65; // Base score
    // Diversification impact
    if (diversification === "Excellent") score += 15;
    else if (diversification === "Good") score += 10;
    else if (diversification === "Poor") score -= 10;

    // Profitability impact
    const overallProfitPercent = totalInvested > 0 ? ((portfolioValue - totalInvested) / totalInvested) * 100 : 0;
    if (overallProfitPercent > 15) score += 15;
    else if (overallProfitPercent > 5) score += 10;
    else if (overallProfitPercent < 0) score -= 10;

    // Concentration risk impact
    if (largestWeight > 60) score -= 15;
    else if (largestWeight > 45) score -= 8;

    // Cash safety net impact
    if (cashPercent >= 10 && cashPercent <= 25) score += 5;
    else if (cashPercent < 5) score -= 5;

    // Bound score
    score = Math.max(10, Math.min(100, score));

    // 7. Suggestions Generation
    const suggestions = [];
    if (largestWeight > 40) {
      suggestions.push(`Reduce exposure to ${largest.symbol} (${largestWeight.toFixed(0)}% weight) to spread concentration risk.`);
    }
    if (diversification === "Poor" || diversification === "Fair") {
      suggestions.push("Buy 2-3 more stocks from different sectors (e.g. Banking, FMCG, Energy) to diversify.");
    }
    if (cashPercent < 10) {
      suggestions.push("Increase cash balance to 15-20% to capitalize on buying opportunities during market dips.");
    } else if (cashPercent > 40) {
      suggestions.push("Deploy excess cash. Consider investing some idle cash into dividend blue-chips.");
    }
    if (worst.profitPercent < -8) {
      suggestions.push(`Averaging cost of ${worst.symbol} (${worst.profitPercent.toFixed(1)}%) on dips could improve recovery prospects.`);
    }

    // Default suggestions if none triggered
    if (suggestions.length === 0) {
      suggestions.push("Maintain current asset allocation. Your portfolio shows a healthy structure.");
      suggestions.push("Continue monitoring quarterly corporate performance reports.");
    }

    return {
      score,
      risk,
      diversification,
      largest: {
        symbol: largest.symbol,
        weight: largestWeight,
      },
      best: {
        symbol: best.symbol,
        change: best.profitPercent,
      },
      worst: {
        symbol: worst.symbol,
        change: worst.profitPercent,
      },
      cashPercent,
      suggestions,
    };
  }, [portfolios, balance]);

  if (!insights) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">📊</span>
        <h2 className="text-xl font-bold text-slate-800">Portfolio Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-center">
        {/* Score Radial Column */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Score Ring */}
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
                className={`stroke-green-500 transition-all duration-500`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * insights.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800">{insights.score}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 mt-4 text-center">
            Overall Portfolio Health Rating
          </span>
        </div>

        {/* Analytics Detail Column */}
        <div className="space-y-4 md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Level</p>
              <p className={`text-base font-bold mt-1 ${
                insights.risk === "High" ? "text-red-600" : insights.risk === "Medium" ? "text-yellow-600" : "text-green-600"
              }`}>{insights.risk}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diversification</p>
              <p className="text-base font-bold text-slate-800 mt-1">{insights.diversification}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Largest Asset</p>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {insights.largest.symbol} ({insights.largest.weight.toFixed(0)}%)
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cash Reserve</p>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {insights.cashPercent.toFixed(0)}% Allocation
              </p>
            </div>
          </div>

          {/* Performers */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className="text-green-600">▲</span> Best Performer
              </p>
              <p className="text-sm font-bold text-green-700 mt-0.5">
                {insights.best.symbol} ({insights.best.change >= 0 ? "+" : ""}{insights.best.change.toFixed(1)}%)
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className="text-red-600">▼</span> Worst Performer
              </p>
              <p className="text-sm font-bold text-red-700 mt-0.5">
                {insights.worst.symbol} ({insights.worst.change >= 0 ? "+" : ""}{insights.worst.change.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions block */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
          <FaCheckCircle className="text-slate-400" />
          <span>Strategic Recommendations</span>
        </h3>
        <ul className="space-y-2">
          {insights.suggestions.map((suggestion, idx) => (
            <li key={idx} className="flex gap-2 text-xs font-medium text-slate-600 leading-relaxed">
              <span className="text-green-600 mt-0.5">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PortfolioInsights;
