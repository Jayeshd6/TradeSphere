import {
  FaReceipt,
  FaWallet,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";

function ExpenseSummary({ analytics }) {
  const isGrowthPositive = analytics.monthlyGrowth > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
          <FaReceipt className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Spent</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
            ₹{analytics.totalExpense.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">This Month</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
          <FaWallet className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Highest Category</p>
          <h3 className="text-lg font-extrabold text-slate-800 mt-1 truncate max-w-[150px]">
            {analytics.highestCategory}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Top Outflow</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
          <FaCalendarAlt className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Daily Avg Spend</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
            ₹{analytics.averageDailyExpense.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Calculated Daily</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isGrowthPositive ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}>
          {isGrowthPositive ? <FaArrowTrendUp className="text-xl" /> : <FaArrowTrendDown className="text-xl" />}
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Monthly Growth</p>
          <h3 className={`text-2xl font-extrabold mt-1 ${isGrowthPositive ? "text-red-600" : "text-green-600"}`}>
            {analytics.monthlyGrowth >= 0 ? "+" : ""}{analytics.monthlyGrowth}%
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Vs Previous Month</p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseSummary;
