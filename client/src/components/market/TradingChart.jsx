import { useEffect, useRef, useState } from "react";

function TradingChart({ symbol = "NVDA" }) {
  const containerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Map stock symbol to standard exchange:symbol for TradingView Widget
  const getTradingViewSymbol = (sym) => {
    const uppercaseSym = sym.toUpperCase();
    const usTechStocks = ["NVDA", "AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "META", "NFLX"];
    
    if (usTechStocks.includes(uppercaseSym)) {
      return `NASDAQ:${uppercaseSym}`;
    }
    return uppercaseSym;
  };

  useEffect(() => {
    // 1. Check if the script is already loaded
    if (window.TradingView) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById("tradingview-widget-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    // 2. Load TradingView Script dynamically
    const script = document.createElement("script");
    script.id = "tradingview-widget-script";
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    // Reset container contents
    containerRef.current.innerHTML = "";
    
    const widgetId = `tradingview_${Math.random().toString(36).substring(7)}`;
    const widgetContainer = document.createElement("div");
    widgetContainer.id = widgetId;
    widgetContainer.style.height = "100%";
    containerRef.current.appendChild(widgetContainer);

    // Instantiate widget
    if (window.TradingView) {
      try {
        new window.TradingView.widget({
          autosize: true,
          symbol: getTradingViewSymbol(symbol),
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f5f9",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: widgetId,
          studies: [
            "RSI@tv-basicstudies",
            "MASimple@tv-basicstudies"
          ],
        });
      } catch (err) {
        console.error("TradingView widget error:", err);
      }
    }
  }, [scriptLoaded, symbol]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full min-h-[500px]">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-800">
          Interactive Market Chart
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Candlestick charts, timeframes, and key indicators
        </p>
      </div>
      <div ref={containerRef} className="flex-1 w-full min-h-[400px] border border-slate-100 rounded-lg overflow-hidden" />
    </div>
  );
}

export default TradingChart;
