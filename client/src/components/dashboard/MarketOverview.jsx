function MarketOverview({ market }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-5">
        Market Overview
      </h2>

      <div className="space-y-4">
        {market.map((item) => (
          <div
            key={item.name}
            className="flex justify-between"
          >
            <div>
              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p className="text-slate-500">
                {item.value}
              </p>
            </div>

            <div
              className={
                item.changePercent >= 0
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketOverview;
