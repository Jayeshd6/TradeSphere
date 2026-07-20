function TopPerformers({ stocks }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">
        Top Performers
      </h2>

      {stocks.length === 0 ? (
        <p className="text-slate-500">
          No holdings yet.
        </p>
      ) : (
        <div className="space-y-4">
          {stocks.map((stock) => (
            <div
              key={stock.id}
              className="flex justify-between items-center"
            >
              <div>
                <p className="font-semibold uppercase">
                  {stock.symbol}
                </p>

                <p className="text-sm text-slate-500">
                  ₹{stock.currentPrice.toFixed(2)}
                </p>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${stock.profitPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.profitPercent >= 0 ? "+" : ""}{stock.profitPercent.toFixed(2)}%
                </p>

                <p className="text-sm text-slate-500">
                  ₹{stock.profit.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopPerformers;
