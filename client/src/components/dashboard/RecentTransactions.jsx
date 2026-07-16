const transactions = [
  {
    id: 1,
    type: "BUY",
    asset: "TCS",
    quantity: 10,
    price: "₹3,450",
    amount: "₹34,500",
    date: "15 Jul 2026",
    status: "Completed",
  },
  {
    id: 2,
    type: "SELL",
    asset: "Infosys",
    quantity: 5,
    price: "₹1,520",
    amount: "₹7,600",
    date: "14 Jul 2026",
    status: "Completed",
  },
  {
    id: 3,
    type: "BUY",
    asset: "Reliance",
    quantity: 8,
    price: "₹2,950",
    amount: "₹23,600",
    date: "13 Jul 2026",
    status: "Completed",
  },
];

function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Recent Transactions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your latest trading activity
          </p>
        </div>

        <button className="text-green-500 hover:underline text-sm">
          View All
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-left">

          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-200">

              <th className="py-3 text-sm text-slate-500">
                Date
              </th>

              <th className="py-3 text-sm text-slate-500">
                Type
              </th>

              <th className="py-3 text-sm text-slate-500">
                Asset
              </th>

              <th className="py-3 text-sm text-slate-500">
                Quantity
              </th>

              <th className="py-3 text-sm text-slate-500">
                Price
              </th>

              <th className="py-3 text-sm text-slate-500">
                Amount
              </th>

              <th className="py-3 text-sm text-slate-500">
                Status
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {transactions.map((transaction) => (

              <tr
                key={transaction.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >

                <td className="py-4 text-sm text-slate-600">
                  {transaction.date}
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

                <td className="py-4 font-semibold text-slate-800">
                  {transaction.asset}
                </td>

                <td className="py-4 text-slate-600">
                  {transaction.quantity}
                </td>

                <td className="py-4 text-slate-600">
                  {transaction.price}
                </td>

                <td className="py-4 font-semibold text-slate-800">
                  {transaction.amount}
                </td>

                <td className="py-4">

                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    {transaction.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default RecentTransactions;