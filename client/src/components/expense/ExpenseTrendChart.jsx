import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function ExpenseTrendChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        Expense Trend
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })
            }
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`₹${value}`, "Expense"]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("en-IN")
            }
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseTrendChart;
