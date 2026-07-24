function SpendingCalendar({ trendData }) {
  // Generate last 7 days date strings in local timezone
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const trendMap = {};
  if (trendData && Array.isArray(trendData)) {
    trendData.forEach((item) => {
      // item.date is 'YYYY-MM-DD'
      trendMap[item.date] = item.amount;
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 mb-8">
      <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center justify-between">
        <span>📅 Weekly Spending Activity</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last 7 Days</span>
      </h2>
      <div className="grid grid-cols-7 gap-3 text-center">
        {days.map((dateObj) => {
          const dateStr = dateObj.toISOString().split("T")[0];
          const spend = trendMap[dateStr] || 0;
          const dayName = dateObj.toLocaleDateString("en-IN", { weekday: "short" });
          const dayNum = dateObj.getDate();

          let bgColor = "bg-slate-50 text-slate-500 border-slate-100";
          if (spend > 5000) {
            bgColor = "bg-red-50 text-red-700 border-red-100 shadow-sm";
          } else if (spend > 1000) {
            bgColor = "bg-amber-50 text-amber-700 border-amber-100 shadow-sm";
          } else if (spend > 0) {
            bgColor = "bg-green-50 text-green-700 border-green-100 shadow-sm";
          }

          return (
            <div
              key={dateStr}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between gap-1.5 transition-all hover:scale-[1.03] ${bgColor}`}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">{dayName}</span>
              <span className="text-base font-black tracking-tight">{dayNum}</span>
              <span className="text-[10px] font-black leading-none">
                {spend > 0 ? `₹${spend.toLocaleString("en-IN")}` : "₹0"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SpendingCalendar;
