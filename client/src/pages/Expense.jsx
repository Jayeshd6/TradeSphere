import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

import Layout from "../components/layout/layout";
import api from "../services/api";

import ExpenseSummary from "../components/expense/ExpenseSummary";
import ExpenseChart from "../components/expense/ExpenseChart";
import ExpenseCard from "../components/expense/ExpenseCard";
import AddExpense from "../components/expense/AddExpense";

const CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Utilities",
  "Bills",
  "Others"
];

const CATEGORY_ICONS = {
  "Food": "🍔",
  "Transport": "🚕",
  "Rent": "🏠",
  "Shopping": "🛒",
  "Entertainment": "🎬",
  "Healthcare": "💊",
  "Education": "📚",
  "Utilities": "💡",
  "Bills": "📱",
  "Others": "📦"
};

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalExpense: 0,
    highestCategory: "N/A",
    averageDailyExpense: 0,
    monthlyGrowth: 0,
    categoryBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    paymentMethod: "UPI",
    notes: "",
    expenseDate: new Date().toISOString().split("T")[0]
  });

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      } else {
        if (month) params.month = month;
        if (year) params.year = year;
      }

      const res = await api.get("/expenses", { params });
      setExpenses(res.data.expenses || []);
    } catch (error) {
      console.error("Fetch expenses error:", error);
      toast.error("Failed to load expenses list");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/expenses/analytics");
      setAnalytics(res.data);
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
  }, [search, category, month, year, startDate, endDate]);

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setForm({
      title: "",
      amount: "",
      category: "Food",
      paymentMethod: "UPI",
      notes: "",
      expenseDate: new Date().toISOString().split("T")[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      paymentMethod: expense.paymentMethod || "UPI",
      notes: expense.notes || "",
      expenseDate: new Date(expense.expenseDate).toISOString().split("T")[0]
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || !form.expenseDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, form);
        toast.success("Expense updated successfully");
      } else {
        await api.post("/expenses", form);
        toast.success("Expense added successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Save expense error:", error);
      toast.error(error.response?.data?.message || "Failed to save expense");
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/expenses/${deletingId}`);
      toast.success("Expense deleted successfully");
      setDeletingId(null);
      loadData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setStartDate("");
    setEndDate("");
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
        <button
          onClick={handleOpenAddModal}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center gap-2 self-start md:self-auto text-sm"
        >
          <FaPlus /> Add Expense
        </button>
      </div>

      {/* Summary Analytics Cards */}
      <ExpenseSummary analytics={analytics} />

      {/* Recharts Analytics Graphs */}
      <ExpenseChart categoryBreakdown={analytics.categoryBreakdown} expenses={expenses} />

      {/* Filter and Search Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold mb-4 text-sm">
          <FaFilter /> Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat]} {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setStartDate("");
                setEndDate("");
              }}
              disabled={!!startDate}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {new Date(0, idx).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setStartDate("");
                setEndDate("");
              }}
              disabled={!!startDate}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
            />
          </div>

          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleResetFilters}
            className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

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
                    onDelete={handleDeleteClick}
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

      {/* Add / Edit Modal Popup */}
      <AddExpense
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        form={form}
        setForm={setForm}
        editingExpense={editingExpense}
      />

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-slate-800">Delete Expense?</h3>
            <p className="text-slate-500 text-xs mt-2">
              This action cannot be undone. Are you sure you want to delete this expense?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-red-600/20 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Expense;
