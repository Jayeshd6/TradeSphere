import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";

function PortfolioPerformanceChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = async () => {
    try {
      const response = await api.get("/dashboard/performance");
      setData(response.data.performance || []);
    } catch (error) {
      console.error("Failed to fetch performance chart:", error);
      toast.error("Failed to load portfolio performance chart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const formatCurrency = (val) => {
    return `₹${val.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 h-80 flex items-center justify-center">
        <p className="text-slate-500 font-semibold text-sm">Loading performance chart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800">
        Portfolio Performance 📈
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        Historical tracking of your total portfolio valuation
      </p>

      <div className="w-full h-72 mt-6">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-sm">
            No snapshot data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}K`}
              />
              <Tooltip formatter={(value) => [formatCurrency(value), "Portfolio Value"]} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#22c55e", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default PortfolioPerformanceChart;
