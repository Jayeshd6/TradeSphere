import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const assetData = [
  {
    name: "Stocks",
    value: 60,
  },
  {
    name: "Mutual Funds",
    value: 25,
  },
  {
    name: "Cash",
    value: 10,
  },
  {
    name: "Gold",
    value: 5,
  },
];

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
];

function AssetAllocation() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Asset Allocation
        </h2>

        <p className="text-sm text-slate-500">
          Distribution of your investments
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={assetData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >

              {assetData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default AssetAllocation;