import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaChartLine,
  FaWallet,
  FaArrowTrendUp,
} from "react-icons/fa6";

import Layout from "../components/layout/layout";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "../components/dashboard/StatCard";
import PortfolioPieChart from "../components/portfolio/PortfolioPieChart";
import TopPerformers from "../components/dashboard/TopPerformers";
import MarketOverview from "../components/dashboard/MarketOverview";
import PortfolioPerformanceChart from "../components/dashboard/PortfolioPerformanceChart";
import api from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>
        <p className="p-6 font-semibold text-slate-500">Loading dashboard...</p>
      </Layout>
    );
  }

  const chartData = dashboard.holdings.map((stock) => ({
    name: stock.symbol,
    value: stock.currentValue,
  }));

  const isProfit = dashboard.overallProfit >= 0;

  return (
    <Layout>
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Summary Cards (4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Wallet Balance"
          value={`₹${dashboard.walletBalance.toLocaleString("en-IN")}`}
          change="Available Cash"
          icon={<FaWallet />}
        />

        <StatCard
          title="Portfolio Value"
          value={`₹${dashboard.portfolioValue.toLocaleString("en-IN")}`}
          change={`Cost: ₹${dashboard.totalInvested.toLocaleString("en-IN")}`}
          icon={<FaChartLine />}
        />

        <StatCard
          title="Overall Profit"
          value={`${isProfit ? "+" : "-"}₹${Math.abs(dashboard.overallProfit).toLocaleString("en-IN")}`}
          change={`${dashboard.overallProfitPercent.toFixed(2)}%`}
          icon={<FaArrowTrendUp />}
        />

        <StatCard
          title="Holdings"
          value={dashboard.holdingsCount}
          change="Unique stocks"
          icon={<FaChartLine />}
        />
      </div>

      {/* Portfolio Performance Line Chart */}
      <div className="mt-6">
        <PortfolioPerformanceChart />
      </div>

      {/* Row 1: Market Overview & Portfolio Allocation Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <MarketOverview market={dashboard.marketOverview} />

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Portfolio Allocation
          </h2>
          <div className="h-80 w-full">
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-sm">
                No holdings to display in pie chart
              </div>
            ) : (
              <PortfolioPieChart data={chartData} />
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Top Performers & Recent Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <TopPerformers stocks={dashboard.topPerformers} />

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-xl font-bold mb-4">
            Recent Transactions
          </h2>

          {dashboard.recentTransactions.length === 0 ? (
            <p className="text-slate-500">No transactions yet.</p>
          ) : (
            <div className="space-y-4">
              {dashboard.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-semibold uppercase">
                      {tx.symbol}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.type === "BUY"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type}
                    </span>

                    <p className="mt-1 font-medium">
                      ₹{tx.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;