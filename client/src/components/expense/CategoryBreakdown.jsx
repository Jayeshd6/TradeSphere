const CATEGORY_COLORS = {
  "Food": "bg-emerald-500",
  "Transport": "bg-blue-500",
  "Rent": "bg-rose-500",
  "Shopping": "bg-amber-500",
  "Entertainment": "bg-violet-500",
  "Healthcare": "bg-pink-500",
  "Education": "bg-indigo-500",
  "Utilities": "bg-cyan-500",
  "Bills": "bg-teal-500",
  "Others": "bg-slate-500"
};

const CATEGORY_ICONS = {
  "Food": "🍔",
  "Transport": "🚕",
  "Rent": "🏠",
  "Shopping": "🛒",
  "Entertainment": "🎬",
  "Healthcare": "💊",
  "Education": "📚",
  "Utilities": "💡",
  "Bills": "📱",
  "Others": "📦"
};

function CategoryBreakdown({ data, total }) {
  const sortedData = [...(data || [])].sort((a, b) => b.amount - a.amount);
  const totalAmt = total || 1;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        Category Breakdown
      </h2>
      <div className="space-y-5 flex-1 overflow-y-auto max-h-[320px] pr-1">
        {sortedData.length > 0 ? (
          sortedData.map((item) => {
            const percent = Math.round((item.amount / totalAmt) * 100) || 0;
            const barColor = CATEGORY_COLORS[item.category] || "bg-slate-500";
            const icon = CATEGORY_ICONS[item.category] || "📦";

            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span>{icon}</span>
                    <span>{item.category}</span>
                  </span>
                  <span className="font-extrabold text-slate-800">
                    ₹{item.amount.toLocaleString("en-IN")} ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${barColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-slate-400 text-xs py-12 font-medium">
            No spending records registered yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryBreakdown;
