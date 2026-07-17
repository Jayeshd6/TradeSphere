import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/Layout";
import api from "../services/api";
import BuyStock from "../components/transactions/BuyStock";
import SellStock from "../components/transactions/SellStock";

function Portfolio() {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPortfolios = async () => {
        try {
            const response = await api.get("/portfolio");

            setPortfolios(response.data.portfolios);
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
        fetchPortfolios();
    }, []);

    const totalInvested = portfolios.reduce(
        (total, portfolio) =>
            total + portfolio.quantity * portfolio.buyPrice,
        0
    );

    const totalHoldings = portfolios.length;

    return (
        <Layout>

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    My Portfolio
                </h1>

                <p className="text-slate-500 mt-2">
                    Track your investments and portfolio performance
                </p>
            </div>


            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Total Invested */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-slate-500">
                        Total Invested
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-2">
                        ₹{totalInvested.toLocaleString("en-IN")}
                    </h2>
                </div>


                {/* Total Holdings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-slate-500">
                        Total Holdings
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-2">
                        {totalHoldings}
                    </h2>
                </div>


                {/* Portfolio Status */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-slate-500">
                        Portfolio Status
                    </p>

                    <h2 className="text-2xl font-bold text-green-500 mt-2">
                        Active
                    </h2>
                </div>

            </div>


            {/* Buy Stock Form */}
            <BuyStock
                onStockBought={fetchPortfolios}
            />

            <SellStock
                portfolios={portfolios}
                onStockSold={fetchPortfolios}
            />

            {/* Portfolio List */}
            {loading ? (

                <p>Loading portfolio...</p>

            ) : portfolios.length === 0 ? (

                <p className="text-slate-500">
                    No investments found.
                </p>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {portfolios.map((portfolio) => (

                        <div
                            key={portfolio.id}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >

                            <h2 className="text-xl font-bold text-slate-800">
                                {portfolio.symbol}
                            </h2>

                            <p className="text-sm text-slate-500">
                                {portfolio.companyName}
                            </p>

                            <div className="mt-4 space-y-2">

                                <p className="text-slate-600">
                                    Quantity:{" "}
                                    <span className="font-semibold">
                                        {portfolio.quantity}
                                    </span>
                                </p>

                                <p className="text-slate-600">
                                    Average Buy Price:{" "}
                                    <span className="font-semibold">
                                        ₹{portfolio.buyPrice}
                                    </span>
                                </p>

                                <p className="text-slate-600">
                                    Invested Value:{" "}
                                    <span className="font-semibold">
                                        ₹
                                        {(
                                            portfolio.quantity *
                                            portfolio.buyPrice
                                        ).toLocaleString("en-IN")}
                                    </span>
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </Layout>
    );
}

export default Portfolio;