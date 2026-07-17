import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/Layout";
import api from "../services/api";

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
      <div className="bg-white rounded-xl shadow-sm p-6">

        {loading ? (

          <p>Loading transactions...</p>

        ) : transactions.length === 0 ? (

          <p className="text-slate-500">
            No transactions found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-slate-200">

                  <th className="py-3 text-sm text-slate-500">
                    Date
                  </th>

                  <th className="py-3 text-sm text-slate-500">
                    Symbol
                  </th>

                  <th className="py-3 text-sm text-slate-500">
                    Type
                  </th>

                  <th className="py-3 text-sm text-slate-500">
                    Quantity
                  </th>

                  <th className="py-3 text-sm text-slate-500">
                    Price
                  </th>

                  <th className="py-3 text-sm text-slate-500">
                    Total
                  </th>

                </tr>
              </thead>


              <tbody>

                {transactions.map((transaction) => (

                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="py-4 text-sm text-slate-600">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleDateString("en-IN")}
                    </td>


                    <td className="py-4 font-semibold text-slate-800">
                      {transaction.symbol}
                    </td>


                    <td className="py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === "BUY"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type}
                      </span>

                    </td>


                    <td className="py-4 text-slate-600">
                      {transaction.quantity}
                    </td>


                    <td className="py-4 text-slate-600">
                      ₹{transaction.price}
                    </td>


                    <td className="py-4 font-semibold text-slate-800">
                      ₹{transaction.total}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </Layout>
  );
}

export default Transactions;