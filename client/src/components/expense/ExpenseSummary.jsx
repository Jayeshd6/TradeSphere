import {
  FaReceipt,
  FaWallet,
  FaCalendarAlt,
  FaChartLine
} from "react-icons/fa";

function ExpenseSummary({ analytics }) {
  const total = analytics?.totalExpenses || 0;
  const monthly = analytics?.monthlyExpenses || 0;
  const highestCat = analytics?.highestCategory || "-";
  const highestCatAmt = analytics?.highestCategoryAmount || 0;
  const average = analytics?.averageExpense || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
          <FaReceipt className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Expenses</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
            ₹{total.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">All Time</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
          <FaCalendarAlt className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">This Month</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
            ₹{monthly.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Current Period</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
          <FaWallet className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Highest Category</p>
          <h3 className="text-lg font-extrabold text-slate-800 mt-1 truncate max-w-[150px]">
            {highestCat}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Spent: ₹{highestCatAmt.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-green-50 text-green-500 rounded-xl">
          <FaChartLine className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Expense</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
            ₹{average.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Per Transaction</p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseSummary;
