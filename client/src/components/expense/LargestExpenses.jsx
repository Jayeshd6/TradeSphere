const CATEGORY_COLORS = {
  "Food": "text-emerald-700 bg-emerald-50 border-emerald-100",
  "Transport": "text-blue-700 bg-blue-50 border-blue-100",
  "Rent": "text-rose-700 bg-rose-50 border-rose-100",
  "Shopping": "text-amber-700 bg-amber-50 border-amber-100",
  "Entertainment": "text-violet-700 bg-violet-50 border-violet-100",
  "Healthcare": "text-pink-700 bg-pink-50 border-pink-100",
  "Education": "text-indigo-700 bg-indigo-50 border-indigo-100",
  "Utilities": "text-cyan-700 bg-cyan-50 border-cyan-100",
  "Bills": "text-teal-700 bg-teal-50 border-teal-100",
  "Others": "text-slate-700 bg-slate-50 border-slate-100"
};

function LargestExpenses({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        Top 5 Largest Expenses
      </h2>
      <div className="space-y-4 flex-1 overflow-y-auto max-h-[320px]">
        {data && data.length > 0 ? (
          data.map((item) => {
            const badgeColor = CATEGORY_COLORS[item.category] || "text-slate-700 bg-slate-50 border-slate-100";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:shadow-sm transition-all"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${badgeColor}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {new Date(item.expenseDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short"
                      })}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-black text-red-600">
                  ₹{item.amount.toLocaleString("en-IN")}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center text-slate-400 text-xs py-12 font-medium">
            No expenses logged yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default LargestExpenses;
