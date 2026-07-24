import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/layout";
import api from "../services/api";
import EmptyState from "../components/common/EmptyState";
import SkeletonTable from "../components/loading/SkeletonTable";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");

      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Fetch Transactions Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Layout>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Transactions
        </h1>

        <p className="text-slate-500 mt-2">
          View your complete trading history
        </p>
      </div>


      {/* Content */}
      {loading ? (
        <SkeletonTable />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No Transactions"
          description="Your buy and sell history will appear here."
          buttonText="Explore Market"
          buttonLink="/market"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 text-sm text-slate-500 font-bold">Date</th>
                  <th className="py-3 text-sm text-slate-500 font-bold">Symbol</th>
                  <th className="py-3 text-sm text-slate-500 font-bold">Type</th>
                  <th className="py-3 text-sm text-slate-500 font-bold">Quantity</th>
                  <th className="py-3 text-sm text-slate-500 font-bold">Price</th>
                  <th className="py-3 text-sm text-slate-500 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="py-4 text-xs font-bold text-slate-650">
                      {new Date(transaction.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="py-4 text-xs font-black text-slate-800 uppercase">
                      {transaction.symbol}
                    </td>
                    <td className="py-4 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          transaction.type === "BUY"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-bold text-slate-700">
                      {transaction.quantity}
                    </td>
                    <td className="py-4 text-xs font-bold text-slate-700">
                      ₹{transaction.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 text-xs font-extrabold text-slate-800">
                      ₹{transaction.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </Layout>
  );
}

export default Transactions;