import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#3f51b5",
  "#00bcd4",
  "#ff5722",
];

function AssetAllocation({ data = [] }) {
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

        {data.length === 0 || (data.length === 1 && data[0].value === 100) ? (
          <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-sm">
            Cash: 100% (No stock holdings to display)
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}%`}
              >

                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip formatter={(value) => `${value}%`} />

              <Legend />

            </PieChart>

          </ResponsiveContainer>
        )}

      </div>

    </div>
  );
}

export default AssetAllocation;

export default AssetAllocation;