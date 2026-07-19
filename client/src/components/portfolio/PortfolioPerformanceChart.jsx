import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function PortfolioPerformanceChart({ portfolios = [] }) {
  // Map portfolios to chart data
  const data = portfolios.map((item) => ({
    name: item.symbol,
    "Invested Amount": item.invested,
    "Current Value": item.currentValue,
  }));

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full justify-between min-h-[350px]">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Portfolio Performance</h2>
        <p className="text-sm text-slate-500 mt-1">
          Comparison of invested value versus current market value
        </p>
      </div>

      <div className="w-full h-64 mt-4">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            No holdings performance data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(val) => `₹${val}`} />
              <Tooltip formatter={(value) => [formatCurrency(value)]} />
              <Legend />
              <Bar dataKey="Invested Amount" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current Value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default PortfolioPerformanceChart;
