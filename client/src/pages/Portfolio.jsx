import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/layout";
import BuyStock from "../components/transactions/BuyStock";
import SellButton from "../components/portfolio/SellButton";
import PortfolioPieChart from "../components/portfolio/PortfolioPieChart";
import PortfolioPerformanceChart from "../components/portfolio/PortfolioPerformanceChart";
import PortfolioInsights from "../components/portfolio/PortfolioInsights";
import api from "../services/api";


function Portfolio() {
    const [portfolios, setPortfolios] = useState([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchPortfolio = async () => {
        try {
            setLoading(true);

            const [portfolioRes, balanceRes] = await Promise.all([
                api.get("/portfolio/live"),
                api.get("/transactions/balance")
            ]);

            setPortfolios(portfolioRes.data.portfolio || []);
            setBalance(balanceRes.data.balance || 0);

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch portfolio"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    // Summary Cards
    const totalInvested = portfolios.reduce(
        (total, stock) => total + stock.invested,
        0
    );

    const portfolioValue = portfolios.reduce(
        (total, stock) => total + stock.currentValue,
        0
    );

    const totalProfit = portfolios.reduce(
        (total, stock) => total + stock.profit,
        0
    );

    const totalProfitPercent =
        totalInvested === 0
            ? 0
            : (totalProfit / totalInvested) * 100;

    return (
        <Layout>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    My Portfolio
                </h1>

                <p className="text-slate-500 mt-2">
                    Track your investments in real time
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-slate-500 text-sm">
                        Total Invested
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        ₹{totalInvested.toLocaleString("en-IN")}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-slate-500 text-sm">
                        Portfolio Value
                    </p>

                    <h2 className="text-2xl font-bold mt-2 text-blue-600">
                        ₹{portfolioValue.toLocaleString("en-IN")}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">

                    <p className="text-slate-500 text-sm">
                        Overall Profit
                    </p>

                    <h2
                        className={`text-2xl font-bold mt-2 ${totalProfit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                    >
                        ₹{totalProfit.toLocaleString("en-IN")}

                        <span className="text-base ml-2">
                            ({totalProfitPercent.toFixed(2)}%)
                        </span>

                    </h2>

                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">

                    <p className="text-slate-500 text-sm">
                        Holdings
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {portfolios.length}
                    </h2>

                </div>

            </div>
            {/* Portfolio Charts & Insights */}
            {portfolios.length > 0 && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <PortfolioPieChart portfolios={portfolios} />
                        <PortfolioPerformanceChart portfolios={portfolios} />
                    </div>
                    <div className="mb-8">
                        <PortfolioInsights portfolios={portfolios} balance={balance} />
                    </div>
                </>
            )}

            {/* Buy Stock */}
            <div className="mb-8">
                <BuyStock onSuccess={fetchPortfolio} />
            </div>

            {/* Portfolio List */}

            {loading ? (

                <p>Loading portfolio...</p>

            ) : portfolios.length === 0 ? (

                <div className="bg-white rounded-xl shadow-sm p-10 text-center">

                    <h2 className="text-xl font-semibold text-slate-700">
                        No Investments Found
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Buy your first stock to start building your portfolio.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {portfolios.map((portfolio) => (

                        <div
                            key={portfolio.id}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >

                            <h2 className="text-2xl font-bold text-slate-800">
                                {portfolio.symbol}
                            </h2>

                            <p className="text-slate-500 mb-5">
                                {portfolio.companyName}
                            </p>

                            <div className="space-y-3">

                                <div className="flex justify-between">
                                    <span>Quantity</span>

                                    <span className="font-semibold">
                                        {portfolio.quantity}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Buy Price</span>

                                    <span>
                                        ₹{portfolio.buyPrice}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Current Price</span>

                                    <span className="font-semibold text-blue-600">
                                        ₹{portfolio.currentPrice.toFixed(2)}
                                    </span>
                                </div>

                                <hr />

                                <div className="flex justify-between">
                                    <span>Invested</span>

                                    <span>
                                        ₹{portfolio.invested.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Current Value</span>

                                    <span className="font-semibold">
                                        ₹{portfolio.currentValue.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <hr />

                                <div className="flex justify-between">

                                    <span className="font-semibold">
                                        Profit / Loss
                                    </span>

                                    <span
                                        className={`font-bold ${portfolio.profit >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        ₹{portfolio.profit.toFixed(2)}

                                        <br />

                                        ({portfolio.profitPercent.toFixed(2)}%)

                                    </span>

                                </div>

                            </div>

                            <SellButton
                                portfolio={portfolio}
                                onSuccess={fetchPortfolio}
                            />

                        </div>

                    ))}

                </div>

            )}

        </Layout>
    );
}

export default Portfolio;