function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">

      {/* Top */}
      <div className="flex items-center justify-between">

        <h3 className="text-slate-500 font-medium">
          {title}
        </h3>

        <div className="text-2xl text-green-500">
          {icon}
        </div>

      </div>

      {/* Value */}
      <h2 className="text-3xl font-bold mt-4 text-slate-800">
        {value}
      </h2>

      {/* Change */}
      <p className="text-green-500 mt-2 text-sm">
        {change} from last month
      </p>

    </div>
  );
}

export default StatCard;