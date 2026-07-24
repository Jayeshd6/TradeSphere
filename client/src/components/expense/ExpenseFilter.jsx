const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Utilities",
  "Rent",
  "Investment",
  "Others"
];

const PAYMENT_METHODS = ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking"];

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

const YEARS = ["2024", "2025", "2026", "2027"];

function ExpenseFilter({ filters, onChange, onClear }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          🔍 Filters
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={onChange}
            placeholder="Search expenses..."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
          />
        </div>

        {/* Category */}
        <div>
          <select
            name="category"
            value={filters.category}
            onChange={onChange}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <select
            name="paymentMethod"
            value={filters.paymentMethod}
            onChange={onChange}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
          >
            <option value="">All Payments</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div>
          <select
            name="month"
            value={filters.month}
            onChange={onChange}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
          >
            <option value="">All Months</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <select
            name="year"
            value={filters.year}
            onChange={onChange}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
          >
            <option value="">All Years</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ExpenseFilter;
