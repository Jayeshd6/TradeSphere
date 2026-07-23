import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

const CATEGORY_COLORS = {
  "Food": "#10B981",         // Emerald
  "Transport": "#3B82F6",    // Blue
  "Rent": "#EF4444",         // Red/Rose
  "Shopping": "#F59E0B",      // Amber
  "Entertainment": "#8B5CF6",// Violet
  "Healthcare": "#EC4899",   // Pink
  "Education": "#6366F1",    // Indigo
  "Utilities": "#06B6D4",    // Cyan
  "Bills": "#14B8A6",        // Teal
  "Others": "#64748B"        // Slate
};

function ExpenseChart({ categoryBreakdown, expenses }) {
  const getWeeklyData = () => {
    const weeks = [
      { name: "Week 1", amount: 0 },
      { name: "Week 2", amount: 0 },
      { name: "Week 3", amount: 0 },
      { name: "Week 4", amount: 0 }
    ];

    expenses.forEach((e) => {
      const d = new Date(e.expenseDate).getDate();
      if (d <= 7) weeks[0].amount += e.amount;
      else if (d <= 14) weeks[1].amount += e.amount;
      else if (d <= 21) weeks[2].amount += e.amount;
      else weeks[3].amount += e.amount;
    });

    return weeks;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      {/* Pie Chart: Category wise spending */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-base font-extrabold text-slate-800 mb-6">🍔 Category Breakdown</h3>
        <div className="h-64">
          {categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.category] || "#64748B"}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 font-medium text-xs">
              No spending breakdown available for this month.
            </div>
          )}
        </div>
      </div>

      {/* Line Chart: Monthly Trend */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-base font-extrabold text-slate-800 mb-6">📈 Monthly Trend</h3>
        <div className="h-64">
          {expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getWeeklyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} formatter={(val) => `₹${val}`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10B981"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 font-medium text-xs">
              No expenses logged to plot trends.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseChart;
