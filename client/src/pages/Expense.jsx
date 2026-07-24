import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/layout";
import api from "../services/api";

import ExpenseSummary from "../components/expense/ExpenseSummary";
import ExpensePieChart from "../components/expense/ExpensePieChart";
import ExpenseTrendChart from "../components/expense/ExpenseTrendChart";
import ExpenseFilter from "../components/expense/ExpenseFilter";
import ExpenseCard from "../components/expense/ExpenseCard";
import AddExpense from "../components/expense/AddExpense";
import EditExpense from "../components/expense/EditExpense";

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    averageExpense: 0,
    highestCategory: "N/A",
    highestCategoryAmount: 0,
    categoryBreakdown: [],
    expenseTrend: []
  });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    paymentMethod: "",
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear())
  });

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses", { params: filters });
      setExpenses(res.data.expenses || []);
    } catch (error) {
      console.error("Fetch expenses error:", error);
      toast.error("Failed to load expenses list");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/expenses/analytics");
      setAnalytics(res.data.analytics || {});
    } catch (error) {
      console.error("Fetch analytics error:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchExpenses(), fetchAnalytics()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsEditOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "",
      paymentMethod: "",
      month: "",
      year: ""
    });
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            💸 Expense Tracker
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor household cash outflows, log expenses, and optimize budgets.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <AddExpense onSuccess={loadData} />
      </div>

      {/* Summary Analytics Cards */}
      <ExpenseSummary analytics={analytics} />

      {/* Charts Panel */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
          <ExpensePieChart data={analytics.categoryBreakdown} />
          <ExpenseTrendChart data={analytics.expenseTrend} />
        </div>
      )}

      {/* Filter Panel */}
      <ExpenseFilter
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleResetFilters}
      />

      {/* Expense Grid/List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Method</th>
                <th className="px-6 py-4 text-left">Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {expenses.length > 0 ? (
                expenses.map((exp) => (
                  <ExpenseCard
                    key={exp.id}
                    expense={exp}
                    onEdit={handleOpenEditModal}
                    onDelete={loadData}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400 font-medium">
                    No expense records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditExpense
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        expense={editingExpense}
        onSuccess={loadData}
      />
    </Layout>
  );
}

export default Expense;
