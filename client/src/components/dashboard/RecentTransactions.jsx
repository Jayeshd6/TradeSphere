function RecentTransactions({ transactions = [] }) {
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

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-semibold">
            No transactions found
          </div>
        ) : (
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
                    {new Date(transaction.createdAt).toLocaleDateString()}
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

                  <td className="py-4 font-semibold text-slate-800 uppercase">
                    {transaction.symbol}
                  </td>

                  <td className="py-4 text-slate-600 font-medium">
                    {transaction.quantity}
                  </td>

                  <td className="py-4 text-slate-600 font-medium">
                    ₹{transaction.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-4 font-black text-slate-800">
                    ₹{transaction.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-4">

                    <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 font-semibold border border-green-100">
                      Completed
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default RecentTransactions;

export default RecentTransactions;