import Layout from "../components/layout/Layout";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "../components/dashboard/StatCard";
import PortfolioChart from "../components/dashboard/PortfolioChart";
import AssetAllocation from "../components/dashboard/AssetAllocation";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import WalletCard from "../components/dashboard/WalletCard";
import api from "../services/api";
import { useEffect, useState } from "react";

import {
  FaChartLine,
  FaWallet,
  FaMoneyBillWave,
  FaArrowTrendUp,
} from "react-icons/fa6";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const fetchBalance = async () => {
    try {
        const response = await api.get("/transactions/balance");
        setBalance(response.data.balance);
    } catch (error) {
        toast.error("Failed to fetch balance");
    }
};
useEffect(() => {
    fetchBalance();
}, []);
  return (
    <Layout>

      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <WalletCard balance={balance} />

        <StatCard
          title="Portfolio Value"
          value="₹10,45,000"
          change="+5.4%"
          icon={<FaChartLine />}
        />

        <StatCard
          title="Wallet Balance"
          value="₹2,30,000"
          change="+2.1%"
          icon={<FaWallet />}
        />

        <StatCard
          title="Expenses"
          value="₹32,000"
          change="-8.2%"
          icon={<FaMoneyBillWave />}
        />

        <StatCard
          title="Today's P/L"
          value="+₹12,500"
          change="+1.8%"
          icon={<FaArrowTrendUp />}
        />

      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <PortfolioChart />

        <AssetAllocation />

      </div>
      <RecentTransactions />

    </Layout>
  );
}

export default Dashboard;