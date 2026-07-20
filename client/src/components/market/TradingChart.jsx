import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

function TradingChart({ symbol }) {
  if (!symbol) return null;

  // Helper to resolve symbol formatting for US (NASDAQ) and Indian (NSE/BSE) exchanges
  const getTradingViewSymbol = (sym) => {
    const upper = sym.toUpperCase();
    
    // If it's already exchange-qualified, use it directly
    if (upper.includes(":")) {
      return upper;
    }
    
    // Map Indian NSE stocks (e.g. TCS.NS -> NSE:TCS)
    if (upper.endsWith(".NS")) {
      return `NSE:${upper.slice(0, -3)}`;
    }
    
    // Map Indian BSE stocks (e.g. RELIANCE.BO -> BSE:RELIANCE)
    if (upper.endsWith(".BO")) {
      return `BSE:${upper.slice(0, -3)}`;
    }

    // Default to NASDAQ for US stock symbols (e.g. NVDA, AAPL, MSFT)
    return `NASDAQ:${upper}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">
        Live Trading Chart
      </h2>

      <div className="h-[500px] w-full border border-slate-100 rounded-lg overflow-hidden">
        <AdvancedRealTimeChart
          theme="light"
          autosize
          symbol={getTradingViewSymbol(symbol)}
          interval="D"
          hide_side_toolbar={false}
          allow_symbol_change={false}
        />
      </div>
    </div>
  );
}

export default TradingChart;
