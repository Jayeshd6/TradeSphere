import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Layout from "../components/layout/layout";
import api from "../services/api";

import ExpenseSummary from "../components/expense/ExpenseSummary";
import ExpensePieChart from "../components/expense/ExpensePieChart";
import ExpenseTrendChart from "../components/expense/ExpenseTrendChart";
import ExpenseFilter from "../components/expense/ExpenseFilter";
import CategoryBreakdown from "../components/expense/CategoryBreakdown";
import LargestExpenses from "../components/expense/LargestExpenses";
import SpendingCalendar from "../components/expense/SpendingCalendar";
import ExpenseCard from "../components/expense/ExpenseCard";
import AddExpense from "../components/expense/AddExpense";
import EditExpense from "../components/expense/EditExpense";
import SkeletonDashboard from "../components/loading/SkeletonDashboard";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

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
  const [error, setError] = useState("");

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
    const res = await api.get("/expenses", { params: filters });
    setExpenses(res.data.expenses || []);
  };

  const fetchAnalytics = async () => {
    const res = await api.get("/expenses/analytics");
    setAnalytics(res.data.analytics || {});
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchExpenses(), fetchAnalytics()]);
    } catch (err) {
      console.error("Load expenses data error:", err);
      setError(
        err.response?.data?.message ||
        "Failed to load expenses data"
      );
    } finally {
      setLoading(false);
    }
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

  const exportToCSV = () => {
    if (expenses.length === 0) {
      toast.error("No expenses to export");
      return;
    }
    const headers = ["Title", "Amount", "Category", "Payment Method", "Date", "Notes"];
    const rows = expenses.map((exp) => [
      exp.title,
      exp.amount,
      exp.category,
      exp.paymentMethod || "UPI",
      new Date(exp.expenseDate).toLocaleDateString("en-IN"),
      exp.notes || ""
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  if (loading) {
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
        <SkeletonDashboard />
      </Layout>
    );
  }

  if (error) {
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
        <ErrorMessage message={error} onRetry={loadData} />
      </Layout>
    );
  }

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
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center gap-2 text-xs"
        >
          📥 Export CSV
        </button>
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

      {/* Breakdown and Top Outflows side-by-side */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
          <CategoryBreakdown data={analytics.categoryBreakdown} total={analytics.totalExpenses} />
          <LargestExpenses data={analytics.largestExpenses} />
        </div>
      )}

      {/* Heatmap / Activity Calendar */}
      {analytics && (
        <SpendingCalendar trendData={analytics.expenseTrend} />
      )}

      {/* Inline Form Grid */}
      <div className="mb-8">
        <AddExpense onSuccess={loadData} />
      </div>

      {/* Filter Panel */}
      <ExpenseFilter
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleResetFilters}
      />

      {/* Expense Grid/List Table */}
      {analytics && analytics.expenseCount === 0 ? (
        <EmptyState
          icon="💸"
          title="No Expenses"
          description="Start tracking your spending to gain financial insights."
          buttonText="Add Expense"
          buttonLink="/expenses"
        />
      ) : (
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
      )}

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
