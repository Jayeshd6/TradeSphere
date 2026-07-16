import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const portfolioData = [
  { month: "Jan", value: 100000 },
  { month: "Feb", value: 115000 },
  { month: "Mar", value: 108000 },
  { month: "Apr", value: 130000 },
  { month: "May", value: 145000 },
  { month: "Jun", value: 160000 },
];

function PortfolioChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">

      {/* Chart Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Portfolio Performance
        </h2>

        <p className="text-sm text-slate-500">
          Your portfolio growth over time
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={portfolioData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={3}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default PortfolioChart;