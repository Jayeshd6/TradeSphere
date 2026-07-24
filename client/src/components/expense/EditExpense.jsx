import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Utilities",
  "Rent",
  "Investment",
  "Others"
];

const PAYMENT_METHODS = ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking"];

function EditExpense({ isOpen, onClose, expense, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    paymentMethod: "",
    notes: "",
    expenseDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || "",
        amount: expense.amount || "",
        category: expense.category || "",
        paymentMethod: expense.paymentMethod || "",
        notes: expense.notes || "",
        expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split("T")[0] : "",
      });
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/expenses/${expense.id}`, formData);
      toast.success("Expense updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-black text-slate-800">
            ✏️ Edit Expense
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                required
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                name="expenseDate"
                required
                value={formData.expenseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
              >
                <option value="">Payment Method</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-green-600/20 transition-all"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;
